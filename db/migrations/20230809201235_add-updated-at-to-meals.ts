import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.timestamp('updated_at').after('created_at').index().defaultTo(null)
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropIndex(['updated_at'])
    table.dropColumn('updated_at')
  })
}
