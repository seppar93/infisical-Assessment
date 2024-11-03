import { TGenericPermission } from "@app/lib/types";

import { ActorAuthMethod, ActorType } from "../auth/auth-type";

export type TCredentialType = "WEB_LOGIN" | "CREDIT_CARD" | "SECURE_NOTE";

export type TCreateConsumerSecretDTO = {
  credential_type: TCredentialType;
  encrypted_secret: string;
  iv: string;
  name: string;
} & TConsumerSecretPermission;

export type TConsumerSecretPermission = {
  actor: ActorType;
  actorId: string;
  actorAuthMethod: ActorAuthMethod;
  actorOrgId: string;
  orgId: string;
};

export type TGetConsumerSecretsDTO = {
  offset: number;
  limit: number;
} & TGenericPermission;

export type TDeleteConsumerSecretDTO = {
  secretId: string;
} & TConsumerSecretPermission;
