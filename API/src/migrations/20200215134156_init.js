exports.up = function (knex) {
  return knex.schema
  .createTableIfNotExists('users', $ => {
    $.increments('id').primary()
    $.string('email').notNullable().unique()
    $.string('password').notNullable()
    $.string('fullName').nullable().defaultTo(null)
    $.boolean('verified').defaultTo(false)
    $.timestamps(false, true)
  })

  .createTableIfNotExists('devices', $ => {
    $.increments('id').primary()
    $.string('codename').unique()
    $.string('name').nullable().defaultTo(null)
    $.integer('owner').unsigned().references('id').inTable('users').onDelete('cascade').index()
    $.timestamps(false, true)
  })

  .createTableIfNotExists('things', $ => {
    $.increments('id').primary()
    $.integer('device').unsigned().references('id').inTable('devices').onDelete('cascade').index()
    $.string('name').nullable().defaultTo(null)
    $.enum('status', ['on', 'off']).defaultTo('off')
    $.timestamps(false, true)
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('users')
  .dropTableIfExists('devices')
  .dropTableIfExists('things')
};
