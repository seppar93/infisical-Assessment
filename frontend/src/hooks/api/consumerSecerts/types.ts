export type TCredentialType = "WEB_LOGIN" | "CREDIT_CARD" | "SECURE_NOTE";

export type TConsumerSecret = {
  id: string;
  userId: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  credential_type: TCredentialType;
  encrypted_secret: string;
  iv: string;
};

export type TCreatedConsumerSecret = {
  id: string;
};

export type TCreateConsumerSecretRequest = {
  name?: string;
  credential_type: TCredentialType;
  encrypted_secret: string;
  iv: string;
};

export enum ConsumerSecretAccessType {
  Organization = "organization"
}

export type TDeleteConsumerSecretsRequest = {
  consumerSecretId: string;
};
