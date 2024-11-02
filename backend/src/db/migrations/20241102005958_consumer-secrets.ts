import { Knex } from "knex";

import { TableName } from "../schemas";
import { createOnUpdateTrigger } from "../utils";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable(TableName.ConsumerSecrets))) {
    await knex.schema.createTable(TableName.ConsumerSecrets, (table) => {
      table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
      table.string("name").notNullable();
      table.string("credential_type").notNullable();
      table.text("encrypted_secret").nullable();
      table.text("iv").notNullable();
      table.text("tag").notNullable();
      table.jsonb("metadata").notNullable();
      table.uuid("userId").notNullable();
      table.uuid("orgId").notNullable();
      table.foreign("userId").references("id").inTable(TableName.Users).onDelete("CASCADE");
      table.foreign("orgId").references("id").inTable(TableName.Organization).onDelete("CASCADE");
      table.timestamps(true, true, true);
    });

    await createOnUpdateTrigger(knex, TableName.ConsumerSecrets);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TableName.ConsumerSecrets);
}
