const parse = require('csv-parse');
const fs = require('fs');
const connection = require('../database/index');


class CityController {

    async importCity(req, res) {
        try {

            let csvrow = [];
            let i = 0;
            fs.createReadStream('src/files/1.MUNICCSV')
                //fs.createReadStream('src/files/teste.txt')
                .pipe(parse({ delimiter: ';' }))
                .on('data', function (csv) {

                    csvrow.push(csv);
                    i++;
                    //do something with csvrow
                    // csvData.push(csvrow);
                })
                .on('end', async function () {
                    for (let i = 0; i < csvrow.length; i++) {
                        try {
                            const id = (await connection('city').insert({
                                code: csvrow[i][0],
                                name: csvrow[i][1],
                            }).returning('id'))[0];

                        } catch (error) {
                            console.log(error)
                        }
                    }

                    //sendService.sendAWhatsAppMessage("6059e55ad593ca1646600281","ESTABELECIMENTO 10 FINALIZADO");
                    return res.json({ message: "OK!" })
                });


        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

    async index(req, res) {
        try {

        } catch (error) {
            return res.status(400).json({ error: 'Unable to get files: ' + error });
        }
    }

    async getCompanyComplete(req, res) {
        try {

        } catch (error) {
            return res.status(400).json({ error: 'Unable to get files: ' + error });
        }
    }

    async getEstablishmentForCNPJ(req, res) {
        try {

        

        } catch (error) {
            return res.status(400).json({ error: 'Unable to get files: ' + error });
        }
    }

    async testeFor(req, res) {
        try {


            return res.json(1);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to get files: ' + error });
        }
    }

}
module.exports = CityController;
