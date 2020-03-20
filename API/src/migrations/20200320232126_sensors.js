exports.up = function (knex) {
  return knex.schema
  .createTableIfNotExists('sensors', $ => {
    $.increments('id').primary()
    $.string('mac').notNullable()
    $.string('name').notNullable()
    $.float('data').notNullable()
    $.string('unit').defaultTo(false)
    $.timestamps(false, true)
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('sensors')
};
