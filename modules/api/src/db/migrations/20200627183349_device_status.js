const knex = require('knex')

/**
 * @param {knex} knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable('devices', $ => {
    $.boolean('isOnline').defaultTo(false)
    $.timestamp('lastUpdate').nullable()
  })
};

/**
 * @param {knex} knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable('devices', $ => {
    $.dropColumns(['isOnline', 'lastUpdate'])
  })
};
