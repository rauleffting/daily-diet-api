import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('is_diet_meal').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
