import { TGenericPermission } from "@app/lib/types";

export type TWebLoginMetadata = {
  username: string;
  password: string;
};

export type TCreditCardMetadata = {
  cardholder_name: string;
  card_number: string;
  expiry_date: string;
  card_last_four?: string;
};

export type TSecureNoteMetadata = {
  title: string;
  content: string;
};

export type TGetConsumerSecretsDTO = {
  offset: number;
  limit: number;
} & TGenericPermission;

export type TConsumerSecretPermission = {
  actorId: string;
  orgId: string;
};

export type TCreateConsumerSecretDTO = {
  actorId: string;
  orgId: string;
  name: string;
  credentialType: "WEB_LOGIN" | "CREDIT_CARD" | "SECURE_NOTE";
  encryptedSecret: string;
  iv: string;
  tag: string;
  metadata: TWebLoginMetadata | TCreditCardMetadata | TSecureNoteMetadata;
};

export type TUpdateConsumerSecretDTO = TConsumerSecretPermission & {
  secretId: string;
  name?: string;
  encryptedSecret?: string;
  iv?: string;
  tag?: string;
  metadata?: Partial<TWebLoginMetadata & TCreditCardMetadata & TSecureNoteMetadata>;
};

export type TDeleteConsumerSecretDTO = {
  secretId: string;
} & TConsumerSecretPermission;
