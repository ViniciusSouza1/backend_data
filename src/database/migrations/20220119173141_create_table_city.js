
exports.up = async function(knex) {
    return knex.schema.createTable('city', function(table){
      table.increments('id').primary();
      table.string('code').unique();
      table.string('name');
    })
  };
  
  exports.down = async function(knex) {
      return knex.schema.droptTable('city');
  };
  