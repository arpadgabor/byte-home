const knex = require('knex')

/**
 * @param {knex} knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable('files', $ => {
    $.integer('size').notNullable()
  })
};

/**
 * @param {knex} knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable('files', $ => {
    $.dropColumn('size')
  })
};
