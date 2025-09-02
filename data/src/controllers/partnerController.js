const parse = require('csv-parse');
const connection = require('../database/index');
const fs = require('fs');

class PartnerController {

    async importEstablishment(req, res) {
        try {

            let csvrow = [];
            let i = 0;
            fs.createReadStream('src/files/1.SOCIOCSV')
                //fs.createReadStream('src/files/teste.txt')
                .pipe(parse({ delimiter: ';' }))
                .on('data', function (csv) {

                    csvrow.push(csv);
                    i++;
                    //do something with csvrow
                    // csvData.push(csvrow);
                })
                .on('end', async function () {
                    for (let i = 1; i < csvrow.length; i++) {
                        try {
                                                       
                            const id_company = (await connection('company')
                                .where('cnpj_base', '=', csvrow[i][0]))[0].id;
                            
                            const date_of = csvrow[i][6].toString();
                            
                            const date_of_partnership = date_of[6]+date_of[7]+'-'+date_of[4]+ date_of[5]+'-'+ date_of[0]+date_of[1]+date_of[2]+date_of[3];
                            const id = (await connection('partner').insert({
                                id_company: id_company,
                                cnpj_base: csvrow[i][0],
                                partner_identifier: csvrow[i][1],
                                partner_name: csvrow[i][2],
                                cpf_cnpj_partner: csvrow[i][3],
                                partner_qualification: csvrow[i][4],
                                member_identifier: csvrow[i][5],
                                date_of_partnership: date_of_partnership,
                                country: csvrow[i][7],
                                legal_agent: csvrow[i][8],
                                name_of_agent: csvrow[i][9],
                                qualification_of_legal_agent: csvrow[i][10],
                                age_range: csvrow[i][11]
                            }).returning('id'))[0];


                        } catch (error) {
                            console.log(error)
                        }
                    }
                    
                    return res.json({ message: "OK!" })
                });


        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

    async index(req, res) {
        try {

            const establishment = await connection('establishment')
                    .select('establishment.*',
                        this.select('cnae.description')
                            .from('cnae')
                            .where('id_establishment','=', 'establishment.id')
                    )

            return res.json(establishment);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

}
module.exports = PartnerController;
