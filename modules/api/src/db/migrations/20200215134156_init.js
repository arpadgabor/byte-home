const knex = require('knex')

/**
 * @param {knex} knex
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', $ => {
      $.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      $.string('email').notNullable().unique()
      $.string('password').notNullable()
      $.boolean('verified').defaultTo(false)
      $.string('verificationToken').nullable()
      $.string('resetToken').nullable()
      $.timestamps(false, true)
    })

    .createTable('people', $ => {
      $.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      $.string('firstName').nullable()
      $.string('lastName').nullable()
      $.timestamp('birthDate').nullable()
      $.uuid('user').references('id').inTable('users').onDelete('cascade').index()
    })

    .createTable('roles', $ => {
      $.increments('id').primary()
      $.string('name').notNullable().unique()
      $.timestamps(false, true)
    })

    .createTable('user_roles', $ => {
      $.increments('id').primary()
      $.uuid('user').references('id').inTable('users').onDelete('cascade').index()
      $.integer('role').unsigned().references('id').inTable('roles').onDelete('cascade').index()
      $.timestamps(false, true)
    })

    .createTable('households', $ => {
      $.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      $.string('name').nullable()
      $.json('address').nullable()
      $.timestamps(false, true);
    })

    .createTable('user_households', $ => {
      $.increments('id').primary()
      $.uuid('user').references('id').inTable('users').onDelete('cascade').index()
      $.uuid('household').references('id').inTable('households').onDelete('cascade').index()
      $.timestamps(false, true)
    })

    .createTable('devices', $ => {
      $.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      $.string('mac').unique()
      $.string('name').nullable()
      $.decimal('latitude').nullable()
      $.decimal('longitude').nullable()
      $.uuid('household').references('id').inTable('households').onDelete('cascade').index()
      $.timestamps(false, true)
    })

    .createTable('sensors', $ => {
      $.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      $.string('name').nullable()
      $.string('type').nullable()
      $.string('unit').nullable()
      $.uuid('device').references('id').inTable('devices').onDelete('cascade').index()
      $.timestamps(false, true)
    })

    .createTable('readings', $ => {
      $.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'))
      $.float('value').notNullable()
      $.timestamp('time').defaultTo(knex.fn.now()).unique()
      $.uuid('sensor').references('id').inTable('sensors').onDelete('cascade')
      $.primary(['id', 'time'])
    })

    .raw(`SELECT create_hypertable('readings', 'time', create_default_indexes=>FALSE)`)
    .raw(`CREATE INDEX ON readings (sensor, time DESC)`)
    .raw(`CREATE INDEX ON readings (time DESC, sensor)`)
    .raw(`CREATE INDEX ON readings (value, time DESC)`)
    .raw(`CREATE INDEX ON readings (time DESC, value)`)
};

/**
 * @param {knex} knex
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('user_households')
    .dropTableIfExists('user_roles')
    .dropTableIfExists('roles')
    .dropTableIfExists('people')
    .dropTableIfExists('readings')
    .dropTableIfExists('sensors')
    .dropTableIfExists('devices')
    .dropTableIfExists('households')
    .dropTableIfExists('users')
};
