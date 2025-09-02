
exports.up = async function(knex) {
  return knex.schema.createTable('cnae', function(table){
    table.increments('id').primary();
    table.string('type');
    table.string('cnae');
    table.integer('id_establishment').references('establishment.id');
  })
};

exports.down = async function(knex) {
    return knex.schema.droptTable('cnae');
};
