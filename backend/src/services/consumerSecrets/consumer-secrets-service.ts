import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { ForbiddenRequestError } from "@app/lib/errors";

import { TKmsServiceFactory } from "../kms/kms-service";
import { TOrgDALFactory } from "../org/org-dal";
import { TCreateConsumerSecretDTO, TGetConsumerSecretsDTO } from "./consumer-secerts-types";
import { TConsumerSecretDALFactory } from "./consumer-secrets-dal";

type TConsumerSecretServiceFactoryDep = {
  permissionService: Pick<TPermissionServiceFactory, "getOrgPermission">;
  consumerSecretDAL: TConsumerSecretDALFactory;
  orgDAL: TOrgDALFactory;
  kmsService: TKmsServiceFactory;
};

export type TConsumerSecretServiceFactory = ReturnType<typeof consumerSecretServiceFactory>;

export const consumerSecretServiceFactory = ({
  permissionService,
  consumerSecretDAL,
  kmsService
}: TConsumerSecretServiceFactoryDep) => {
  const createConsumerSecret = async ({
    actor,
    actorId,
    orgId,
    actorAuthMethod,
    actorOrgId,
    name,
    credential_type,
    secretValue,
    metadata
  }: TCreateConsumerSecretDTO) => {
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);

    if (!permission) throw new ForbiddenRequestError({ name: "User is not part of the specified organization" });

    const encryptWithRoot = kmsService.encryptWithRootKey();

    const encryptedSecret = encryptWithRoot(Buffer.from(secretValue));

    const newConsumerSecret = await consumerSecretDAL.create({
      encrypted_secret: encryptedSecret,
      iv: null,
      tag: null,
      name,
      userId: actorId,
      orgId,
      credential_type,
      metadata: JSON.stringify(metadata)
    });

    return { id: newConsumerSecret.id };
  };

  const getConsumerSecrets = async ({
    actor,
    actorId,
    actorAuthMethod,
    actorOrgId,
    offset,
    limit
  }: TGetConsumerSecretsDTO) => {
    if (!actorOrgId) throw new ForbiddenRequestError();

    const { permission } = await permissionService.getOrgPermission(
      actor,
      actorId,
      actorOrgId,
      actorAuthMethod,
      actorOrgId
    );

    if (!permission) throw new ForbiddenRequestError({ name: "User is not part of the specified organization" });
    const secrets = await consumerSecretDAL.find(
      {
        userId: actorId,
        orgId: actorOrgId
      },
      { offset, limit, sort: [["createdAt", "desc"]] }
    );

    const count = await consumerSecretDAL.countAllUserOrgConsumerSecrets({
      orgId: actorOrgId,
      userId: actorId
    });

    return {
      secrets,
      totalCount: count
    };
  };

  return {
    createConsumerSecret,
    getConsumerSecrets
  };
};
