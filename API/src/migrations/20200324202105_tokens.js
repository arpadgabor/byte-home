
exports.up = function(knex) {
  return knex.schema
  .createTable('token_whitelist', $ => {
    $.increments('id')
    $.string('hashedToken')
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTable('token_whitelist')
};
