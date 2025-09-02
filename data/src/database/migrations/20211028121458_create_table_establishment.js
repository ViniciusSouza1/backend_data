
exports.up = async function(knex) {
  return knex.schema.createTable('establishment', function(table){
    table.increments('id').primary();
    table.integer('id_company').references('company.id');
    table.string('cnpj');
    table.string('cnpj_base');
    table.string('cnpj_order');
    table.string('cnpj_dv');
    table.string('identifier_matriz');
    table.string('fantasy_name');
    table.string('registration_status');
    table.timestamp('date_of_registration_status');
    table.string('reason_of_registration_status');
    table.string('name_of_foreign_city');
    table.string('country');
    table.timestamp('date_of_begin_activity');
    table.string('type_of_publlic_place');
    table.string('public_place');
    table.string('number');
    table.string('complement');
    table.string('district');
    table.string('CEP');
    table.string('UF');
    table.string('city');
    table.string('DDD_1');
    table.string('phone_1');
    table.string('DDD_2');
    table.string('phone_2');
    table.string('DDD_fax');
    table.string('fax');
    table.string('email');
    table.string('special_situation');
    table.string('date_of_special_situation');
  })
};

exports.down = async function(knex) {
    return knex.schema.droptTable('establishment');
};
