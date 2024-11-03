import { Knex } from "knex";

import { TableName } from "../schemas";

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(TableName.ConsumerSecrets)) {
    const doesEncryptedSecretExist = await knex.schema.hasColumn(TableName.ConsumerSecrets, "encrypted_secret");
    const doesTagExist = await knex.schema.hasColumn(TableName.ConsumerSecrets, "tag");
    const doesMetadataExist = await knex.schema.hasColumn(TableName.ConsumerSecrets, "metadata");

    await knex.schema.alterTable(TableName.ConsumerSecrets, (table) => {
      if (doesEncryptedSecretExist) {
        table.binary("encrypted_secret").alter().nullable();
      }

      if (doesTagExist) {
        table.dropColumn("tag");
      }

      if (doesMetadataExist) {
        table.dropColumn("metadata");
      }
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const doesEncryptedSecretExist = await knex.schema.hasColumn(TableName.ConsumerSecrets, "encrypted_secret");
  const doesTagExist = await knex.schema.hasColumn(TableName.ConsumerSecrets, "tag");
  const doesMetadataExist = await knex.schema.hasColumn(TableName.ConsumerSecrets, "metadata");

  await knex.schema.alterTable(TableName.ConsumerSecrets, (table) => {
    if (doesEncryptedSecretExist) {
      table.text("encrypted_secret").alter().nullable();
    }

    if (doesTagExist) {
      table.text("tag").nullable();
    }

    if (doesMetadataExist) {
      table.jsonb("metadata").notNullable();
    }
  });
}
