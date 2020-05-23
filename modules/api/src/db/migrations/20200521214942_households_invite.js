const knex = require('knex')

/**
 * @param {knex} knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable('households', $ => {
    $.string('inviteCode').unique().nullable()
    $.timestamp('inviteExpiry').nullable()
  })
};

/**
 * @param {knex} knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable('households', $ => {
    $.dropColumns(['inviteCode', 'inviteExpiry'])
  })
};
