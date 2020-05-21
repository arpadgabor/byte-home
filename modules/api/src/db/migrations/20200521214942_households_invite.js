
exports.up = function (knex) {
  return knex.schema.alterTable('households', $ => {
    $.string('inviteCode').unique().nullable()
    $.timestamp('inviteExpiry').nullable()
  })
};

exports.down = function (knex) {
  return knex.schema.alterTable('households', $ => {
    $.dropColumns(['inviteCode', 'inviteExpiry'])
  })
};
