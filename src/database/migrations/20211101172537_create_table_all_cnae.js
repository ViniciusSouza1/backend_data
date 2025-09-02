
exports.up = async function(knex) {
    return knex.schema.createTable('all_cnae', function(table){
      table.increments('id').primary();
      table.string('cnae');
      table.string('description');
    })
  };
  
  exports.down = async function(knex) {
      return knex.schema.droptTable('all_cnae');
  };
  