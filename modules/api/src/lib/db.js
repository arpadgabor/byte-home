const Knex = require('knex')
const { Model } = require('objection')
const KnexCfg = require('../../knexfile')

const knex = Knex(KnexCfg)
Model.knex(knex)
