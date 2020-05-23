const knex = require('knex')

/**
 * @param {knex} knex
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('files', $ => {
      $.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      $.string('name').notNullable()
      $.string('hash').notNullable().unique()
      $.string('extension').nullable()
      $.string('mime').notNullable()
      $.string('url').notNullable()
      $.integer('width').nullable()
      $.integer('height').nullable()
      $.timestamps(false, true)
    })
    .alterTable('households', $ => {
      $.uuid('imageId').references('id').inTable('files').onDelete('cascade').index()
    })
    .alterTable('people', $ => {
      $.uuid('imageId').references('id').inTable('files').onDelete('cascade').index()
    })
};

/**
 * @param {knex} knex
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('households', $ => {
      $.dropColumn('image')
    })
    .alterTable('people', $ => {
      $.dropColumn('image')
    })
    .dropTableIfExists('files')
};
