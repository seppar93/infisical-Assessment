import crypto from "crypto";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import Aes256Gcm from "@app/components/utilities/cryptography/aes-256-gcm";
import { Button, FormControl, Input, Select, SelectItem, TextArea } from "@app/components/v2";
import { useOrganization, useUser } from "@app/context";
import { useCreateConsumerSecret } from "@app/hooks/api/consumerSecerts";

const schema = z.object({
  name: z.string().optional(),
  credentialType: z.enum(["WEB_LOGIN", "CREDIT_CARD", "SECURE_NOTE"]),
  metadata: z.union([
    z.object({ username: z.string().min(1), password: z.string().min(1) }),
    z.object({
      cardholder_name: z.string().min(1),
      card_number: z.string().min(1),
      expiry_date: z.string().min(1),
      card_last_four: z.string().optional()
    }),
    z.object({ title: z.string().min(1), content: z.string().min(1) })
  ])
});

export type FormData = z.infer<typeof schema>;

type Props = {
  credentialType?: "WEB_LOGIN" | "CREDIT_CARD" | "SECURE_NOTE";
};

export const ConsumerSecretForm = ({ credentialType = "WEB_LOGIN" }: Props) => {
  const { currentOrg } = useOrganization();
  const { user } = useUser();

  const [selectedType, setSelectedType] = useState<FormData["credentialType"]>(credentialType);
  const createConsumerSecret = useCreateConsumerSecret();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { credentialType }
  });


  console.log("credentialType =>", credentialType);
  
  const encryptData = (text: string, secretKey: Buffer) => {
    const { ciphertext, iv, tag } = Aes256Gcm.encrypt({
      text,
      secret: secretKey
    });
    return { ciphertext, iv, tag };
  };

  const onFormSubmit = async (data: FormData) => {
    try {
      const encryptionKey = crypto.randomBytes(32);
      const { metadata, name } = data;

      let encryptedMetadata: any = {};
      let iv: string | undefined;

      // Encrypting metadata fields based on selected credential type
      if (selectedType === "WEB_LOGIN" && "username" in metadata) {
        const usernameEncrypted = encryptData(metadata.username, encryptionKey);
        const passwordEncrypted = encryptData(metadata.password, encryptionKey);
        encryptedMetadata = {
          username: usernameEncrypted.ciphertext,
          password: passwordEncrypted.ciphertext
        };
        iv = usernameEncrypted.iv;
      } else if (selectedType === "CREDIT_CARD" && "cardholder_name" in metadata) {
        const cardholderNameEncrypted = encryptData(metadata.cardholder_name, encryptionKey);
        const cardNumberEncrypted = encryptData(metadata.card_number, encryptionKey);
        const expiryDateEncrypted = encryptData(metadata.expiry_date, encryptionKey);
        const cardLastFourEncrypted = encryptData(metadata.card_last_four || "", encryptionKey);

        encryptedMetadata = {
          cardholder_name: cardholderNameEncrypted.ciphertext,
          card_number: cardNumberEncrypted.ciphertext,
          expiry_date: expiryDateEncrypted.ciphertext,
          card_last_four: cardLastFourEncrypted.ciphertext
        };
        iv = cardholderNameEncrypted.iv;
      } else if (selectedType === "SECURE_NOTE" && "title" in metadata) {
        const titleEncrypted = encryptData(metadata.title, encryptionKey);
        const contentEncrypted = encryptData(metadata.content, encryptionKey);
        encryptedMetadata = {
          title: titleEncrypted.ciphertext,
          content: contentEncrypted.ciphertext
        };
        iv = titleEncrypted.iv;
      } else {
        throw new Error(`Unsupported credential type: ${selectedType}`);
      }

      // Constructing payload with encrypted fields
      const payload = {
        name,
        credential_type: selectedType,
        encrypted_secret: JSON.stringify(encryptedMetadata),
        iv, // Set the extracted iv
        userId: user.id,
        orgId: currentOrg?.id
      };

      console.log("payload =>", payload);

      await createConsumerSecret.mutateAsync(payload);
      createNotification({ text: "Consumer secret created successfully.", type: "success" });
      reset();
    } catch (error) {
      console.error(error);
      createNotification({ text: "Failed to create consumer secret.", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <FormControl label="Name" isError={Boolean(error)} errorText={error?.message}>
            <Input {...field} placeholder="Enter a name for the secret (Optional)" />
          </FormControl>
        )}
      />
      <FormControl label="Credential Type">
        <Select
          value={selectedType}
          onValueChange={(value) => {
            
            console.log("value =>", value);
            
            setSelectedType(value as FormData["credentialType"]);
          }}
          className="w-full"
        >
          <SelectItem value="WEB_LOGIN">Web Login</SelectItem>
          <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
          <SelectItem value="SECURE_NOTE">Secure Note</SelectItem>
        </Select>
      </FormControl>

      {/* Conditional renderings for different metadata inputs */}
      {selectedType === "WEB_LOGIN" && (
        <>
          <Controller
            control={control}
            name="metadata.username"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Username" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="Username" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="metadata.password"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Password" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="Password" type="password" />
              </FormControl>
            )}
          />
        </>
      )}

      {selectedType === "CREDIT_CARD" && (
        <>
          <Controller
            control={control}
            name="metadata.cardholder_name"
            render={({ field, fieldState: { error } }) => (
              <FormControl
                label="Cardholder Name"
                isError={Boolean(error)}
                errorText={error?.message}
              >
                <Input {...field} placeholder="Cardholder Name" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="metadata.card_number"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Card Number" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="Card Number" type="text" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="metadata.expiry_date"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Expiry Date" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="MM/YY" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="metadata.card_last_four"
            render={({ field, fieldState: { error } }) => (
              <FormControl
                label="Last Four Digits (Optional)"
                isError={Boolean(error)}
                errorText={error?.message}
              >
                <Input {...field} placeholder="1234" type="text" />
              </FormControl>
            )}
          />
        </>
      )}

      {selectedType === "SECURE_NOTE" && (
        <>
          <Controller
            control={control}
            name="metadata.title"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Title" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="Title" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="metadata.content"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Content" isError={Boolean(error)} errorText={error?.message}>
                <TextArea
                  {...field}
                  placeholder="Enter secure note content..."
                  className="h-32 w-full rounded-md border border-mineshaft-600 bg-mineshaft-900 py-1.5 px-2 text-bunker-300"
                />
              </FormControl>
            )}
          />
        </>
      )}

      <Button
        className="mt-4"
        size="sm"
        type="submit"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        Save Consumer Secret
      </Button>
    </form>
  );
};
