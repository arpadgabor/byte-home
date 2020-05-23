const knex = require('knex')

/**
 * @param {knex} knex
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('token_whitelist', $ => {
      $.increments('id')
      $.string('token').notNullable()
      $.json('userAgent').nullable()
      $.uuid('user').references('id').inTable('users').onDelete('cascade').index()
    })
};

/**
 * @param {knex} knex
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('token_whitelist')
};
