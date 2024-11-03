import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { DatabaseError } from "@app/lib/errors";
import { ormify } from "@app/lib/knex";

export type TConsumerSecretDALFactory = ReturnType<typeof consumerSecretDALFactory>;

export const consumerSecretDALFactory = (db: TDbClient) => {
  const consumerSecretOrm = ormify(db, TableName.ConsumerSecrets);

  const countAllUserOrgConsumerSecrets = async ({ orgId, userId }: { orgId: string; userId: string }) => {
    try {
      interface CountResult {
        count: string;
      }

      const count = await db
        .replicaNode()(TableName.ConsumerSecrets)
        .where(`${TableName.ConsumerSecrets}.orgId`, orgId)
        .where(`${TableName.ConsumerSecrets}.userId`, userId)
        .count("*")
        .first();

      return parseInt((count as unknown as CountResult).count || "0", 10);
    } catch (error) {
      throw new DatabaseError({ error, name: "Count all user-org shared secrets" });
    }
  };

  return {
    ...consumerSecretOrm,
    countAllUserOrgConsumerSecrets
  };
};
