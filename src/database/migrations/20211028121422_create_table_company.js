
exports.up = async function(knex) {
    return knex.schema.createTable('company', function(table){
      table.increments('id').primary();
      table.string('cnpj_base').unique();
      table.string('social_reason');
      table.string('legal_nature');
      table.decimal('responsable_qualification', 10, 2);
      table.decimal('social_capital', 50, 2);
      table.string('company_size');
      table.string('entity_responsable');
    })
  };
  
  exports.down = async function(knex) {
      return knex.schema.droptTable('company');
  };
  