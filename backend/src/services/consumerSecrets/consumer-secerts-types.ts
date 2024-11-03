import { TGenericPermission } from "@app/lib/types";

import { ActorAuthMethod, ActorType } from "../auth/auth-type";

export type TCredentialType = "WEB_LOGIN" | "CREDIT_CARD" | "SECURE_NOTE";

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
  actor: ActorType;
  actorId: string;
  actorAuthMethod: ActorAuthMethod;
  actorOrgId: string;
  orgId: string;
};

export type TCreatePublicConsumerSecretDTO = {
  actor: ActorType;
  actorId: string;
  orgId: string;
  name: string;
  credential_type: TCredentialType;
  secretValue: string;
  iv: string;
  tag: string;
  metadata: TWebLoginMetadata | TCreditCardMetadata | TSecureNoteMetadata;
};

export type TCreateConsumerSecretDTO = TConsumerSecretPermission & TCreatePublicConsumerSecretDTO;

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
