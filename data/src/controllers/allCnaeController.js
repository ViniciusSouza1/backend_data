const parse = require('csv-parse');
const connection = require('../database/index');
const fs = require('fs');

class AllCnaeController {

    async importAllCnae(req, res) {
        try {

            let csvrow = [];
            let i = 0;
            fs.createReadStream('src/files/1.CNAECSV')
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
                            const id = (await connection('all_cnae').insert({
                                cnae: csvrow[i][0],
                                description: csvrow[i][1]
                            }).returning('id'))[0];

                            console.log(id);
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

    async updateAllCnae(req, res) {
        try {

            let csvrow = [];
            let i = 0;
            fs.createReadStream('src/files/12.CNAECSV', { encoding: 'binary' })
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

                    for (let i = 0; i < csvrow.length; i++) {
                        console.log(csvrow[i][0])
                        console.log(csvrow[i][1])
                        try {
                            const id = await connection('all_cnae').update({
                                description: csvrow[i][1]
                            }).where('cnae', '=', csvrow[i][0]);

                            console.log(id);
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

    async changeAllCnae(req, res) {
        try {
            const all_cnae = await connection('all_cnae')

            for (let i = 0; i < all_cnae.length; i++) {
                
                const update = await connection('cnae')
                    .where('cnae', '=', all_cnae[i].cnae)
                    .update({ description: all_cnae[i].description })

                console.log(update, i, all_cnae.length, "UPDATE")
            }

            return res.json(200).json({ message: "Ok!" });
        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

    async getCnaeInAll(req, res) {
        try {

            const { cnae } = req.params;

            const cnaes = await connection('all_cnae')
                .where('cnae', '=', cnae);

            return res.json(cnaes);

        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

}
module.exports = AllCnaeController;
