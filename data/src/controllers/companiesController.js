const parse = require('csv-parse');
const connection = require('../database/index');
const fs = require('fs');

class CompaniesController {
    
    async index(req, res) {
        try {

            const enterprise = await connection('company')

            return res.json(enterprise);

        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

    async importCompanies(req, res) {
        try {
            let csvrow = [];

            let i = 0;
            fs.createReadStream('src/files/10.EMPRECSV')
                //fs.createReadStream('src/files/teste.txt')
                .pipe(parse({ delimiter: ';' }))
                .on('data', function (csv) {

                    csvrow.push(csv);
                    i++;
                    //do something with csvrow
                    // csvData.push(csvrow);
                    console.log(i);
                })
                .on('end', async function () {
                    console.log(csvrow[0][0])
                    for (let i = 0; i < csvrow.length; i++) {
                        try {

                            const search = await connection('company')
                                .where('cnpj_base', '=', csvrow[i][0]);

                            if(search.length > 0){

                            } else {
                                const id = (await connection('company').insert({
                                    cnpj_base: csvrow[i][0],
                                    social_reason: csvrow[i][1],
                                    legal_nature: csvrow[i][2],
                                    responsable_qualification: parseInt(csvrow[i][3]),
                                    social_capital: parseFloat(csvrow[i][4]),
                                    company_size: csvrow[i][5],
                                    entity_responsable: csvrow[i][6]
                                }).returning('id'))[0];
    
                                console.log(id);
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    return res.json({ message: "OK!" })
                });

                
                
            /*
            const saved = (await knex('company').insert({
            }).returning('id'))[0];
            */


        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

    async getCompanyByname(req, res) {
        try {

            const { search } = req.params;

            const enterprise = await connection('company')
                .where('social_reason', 'like', `%${search}%`)
            console.log(enterprise, "UE")
            return res.json(enterprise);

        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

    async catchFirst(req, res){
        try {

            let csvrow = [];
            let csvrow2 = [];
            let csvrow3 = [];

            let i = 0;
            fs.createReadStream('src/files/1.EMPRECSV')
                //fs.createReadStream('src/files/teste.txt')
                .pipe(parse({ delimiter: ';' }))
                .on('data', function (csv) {

                    csvrow.push(csv);
                    i++;
                    //do something with csvrow
                    // csvData.push(csvrow);
                    console.log(i);
                })
                .on('end', async function () {
                    console.log(csvrow[0][0])
                    for (let i = 0; i < csvrow.length; i++) {
                        try {

                            const search = await connection('company')
                                .where('cnpj_base', '=', csvrow[i][0]);

                            if(search.length > 0){

                            } else {
                                const id = (await connection('company').insert({
                                    cnpj_base: csvrow[i][0],
                                    social_reason: csvrow[i][1],
                                    legal_nature: csvrow[i][2],
                                    responsable_qualification: parseInt(csvrow[i][3]),
                                    social_capital: parseFloat(csvrow[i][4]),
                                    company_size: csvrow[i][5],
                                    entity_responsable: csvrow[i][6]
                                }).returning('id'))[0];
    
                                console.log(id);
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    //return res.json({ message: "OK!" })

                });

                fs.createReadStream('src/files/9.EMPRECSV')
                //fs.createReadStream('src/files/teste.txt')
                .pipe(parse({ delimiter: ';' }))
                .on('data', function (csv) {

                    csvrow2.push(csv);
                    i++;
                    //do something with csvrow
                    // csvData.push(csvrow);
                    console.log(i);
                })
                .on('end', async function () {
                    for (let i = 1; i < csvrow2.length; i++) {
                        try {

                            const search = await connection('company')
                            .where('cnpj_base', '=', csvrow2[i][0]);

                        if(search.length > 0){

                        } else {

                            const id = (await connection('company').insert({
                                cnpj_base: csvrow2[i][0],
                                social_reason: csvrow2[i][1],
                                legal_nature: csvrow2[i][2],
                                responsable_qualification: parseInt(csvrow2[i][3]),
                                social_capital: parseFloat(csvrow2[i][4]),
                                company_size: csvrow2[i][5],
                                entity_responsable: csvrow2[i][6]
                            }).returning('id'))[0];

                            console.log(id);
                        }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    return res.json({ message: "OK!" })

                });
                
                
            /*
            const saved = (await knex('company').insert({
            }).returning('id'))[0];
            */

            
        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }


}

module.exports = CompaniesController;
