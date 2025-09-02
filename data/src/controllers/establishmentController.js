const parse = require('csv-parse');
const connection = require('../database/index');
const fs = require('fs');
const SendMessageServices = require('../services/sendMessage');
// const fetch = require('node-fetch-commonjs');

const sendService = new SendMessageServices();

class EstablishmentController {

    async importEstablishment(req, res) {
        try {

            let csvrow = [];
            let i = 0;
            fs.createReadStream('src/files/1.ESTABELE')
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
                            let cnpj;
                            let date_of_registration_status = null;
                            let date_of_begin_activity = null;

                            cnpj = csvrow[i][0] + csvrow[i][1] + csvrow[i][2];
                            const id_company = (await connection('company')
                                .where('cnpj_base', '=', csvrow[i][0]))[0].id;

                            if (csvrow[i][6].toString() !== '0') {
                                date_of_registration_status = new Date(csvrow[i][6][0] + csvrow[i][6][1] + csvrow[i][6][2] + csvrow[i][6][3], csvrow[i][6][4] + csvrow[i][6][5], csvrow[i][6][6] + csvrow[i][6][7])
                            }

                            if (csvrow[i][10].toString() !== '0') {
                                date_of_begin_activity = new Date(csvrow[i][10][0] + csvrow[i][10][1] + csvrow[i][10][2] + csvrow[i][10][3], csvrow[i][10][4] + csvrow[i][10][5], csvrow[i][10][6] + csvrow[i][10][7])
                            }

                            const id = (await connection('establishment').insert({
                                id_company: id_company,
                                cnpj: cnpj,
                                cnpj_base: csvrow[i][0],
                                cnpj_order: csvrow[i][1],
                                cnpj_dv: csvrow[i][2],
                                identifier_matriz: csvrow[i][3],
                                fantasy_name: csvrow[i][4],
                                registration_status: csvrow[i][5],
                                date_of_registration_status: date_of_registration_status,
                                reason_of_registration_status: csvrow[i][7],
                                name_of_foreign_city: csvrow[i][8],
                                country: csvrow[i][9],
                                date_of_begin_activity: date_of_begin_activity,
                                type_of_publlic_place: csvrow[i][13],
                                public_place: csvrow[i][14],
                                number: csvrow[i][15],
                                complement: csvrow[i][16],
                                district: csvrow[i][17],
                                CEP: csvrow[i][18],
                                UF: csvrow[i][19],
                                city: csvrow[i][20],
                                DDD_1: csvrow[i][21],
                                phone_1: csvrow[i][22],
                                DDD_2: csvrow[i][23],
                                phone_2: csvrow[i][24],
                                DDD_fax: csvrow[i][25],
                                fax: csvrow[i][26],
                                email: csvrow[i][27],
                                special_situation: csvrow[i][28],
                                date_of_special_situation: csvrow[i][29],
                            }).returning('id'))[0];

                            let cnae = [];

                            const cn = (await connection('cnae').insert({
                                cnae: csvrow[i][11],
                                type: 'primary',
                                id_establishment: id
                            }).returning('id'))[0];

                            if (csvrow[i][12].length > 0) {
                                cnae = csvrow[i][12].split(',');
                            }
                            if (cnae.length > 0) {
                                for (let i = 0; i < cnae.length; i++) {
                                    const cn = (await connection('cnae').insert({
                                        cnae: cnae[i],
                                        type: 'secondary',
                                        id_establishment: id
                                    }).returning('id'))[0];
                                }
                            }

                            console.log(id);

                        } catch (error) {
                            console.log(error)
                        }
                    }

                    sendService.sendAWhatsAppMessage("6059e55ad593ca1646600281", "ESTABELECIMENTO 10 FINALIZADO");
                    return res.json({ message: "OK!" })
                });


        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

    async index(req, res) {
        try {

            const establishment = await connection('establishment')
               

            return res.json(establishment);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to get files: ' + error });
        }
    }

    async getCompanyComplete(req, res) {
        try {

            const { cnpj, social_reason } = req.params;

            let establishment;
            if (cnpj !== 'null') {
                establishment = await connection('company')
                    .where(connection.raw('establishment.cnpj_base::text'), 'like', `%${cnpj}%`)
                    .join('establishment', 'establishment.id_company', 'company.id')
                    .select('company.social_reason', 'company.legal_nature', 'company.responsable_qualification', 'company.social_capital', 'company.company_size', 'company.entity_responsable', 'establishment.*')
                console.log('1')

            } else if (social_reason !== 'null') {
                establishment = await connection('company')
                    .where('company.social_reason', 'like', `%${social_reason}%`)
                    .join('establishment', 'establishment.id_company', 'company.id')
                    .select('company.social_reason', 'company.legal_nature', 'company.responsable_qualification', 'company.social_capital', 'company.company_size', 'company.entity_responsable', 'establishment.*')
                console.log('1, ', establishment.length)
            }
            if (establishment.length > 0) {
                for (let i = 0; i < establishment.length; i++) {
                    const id = establishment[i].id;
                    console.log(id, "ID")
                    if (id !== undefined) {
                        establishment[i].cnae = await connection('cnae')
                            .where('id_establishment', '=', id);
                        console.log('2')
                    }
                }
            }

            return res.json(establishment);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to get files: ' + error });
        }
    }

    async getEstablishmentForCNPJ(req, res) {
        try {

            const { cnpj } = req.params;

            let establishment;

            if (cnpj !== null) {
                establishment = await connection('establishment')
                    .where(connection.raw('cnpj::text'), 'like', `%${cnpj}%`)
                    .join('company', 'company.id', 'establishment.id_company')
                    .select('company.social_reason', 'company.legal_nature', 'company.responsable_qualification', 'company.social_capital', 'company.company_size', 'company.entity_responsable', 'establishment.*')
            }

            return res.json(establishment);

        } catch (error) {
            return res.status(400).json({ error: 'Unable to get files: ' + error });
        }
    }
    /*
        async actualizeCep(req, res) {
            try {
    
                const cep_of_goiania = await connection('establishment')
                    .where('uf', '=', 'GO')
                    .where('city', '=', '9373')
                    .distinct('cep')
    
    
                for (let i = 0; i < cep_of_goiania.length; i++) {
                    const info = await fetch('https://viacep.com.br/ws/' + cep_of_goiania[i].cep + '/json/').then((res) => (res.json()));
                    console.log(info);
    
                    console.log(info.cep, i, cep_of_goiania[i].cep, "ceps");
                    if (!info.erro) {
                        const public_place = (info.logradouro).toUpperCase()
                        const complement = (info.complemento).toUpperCase()
                        const district = (info.bairro).toUpperCase()
    
                        const update = await connection('establishment')
                            .where('cep', '=', cep_of_goiania[i].cep)
                            .update({
                                public_place,
                                complement,
                                district,
                                ibge: info.ibge,
                            })
    
                        console.log(update, 'update')
                    }
                }
    
                return res.status(200).json(cep_of_goiania);
    
            } catch (error) {
                return res.status(400).json({ error: 'Unable to get files: ' + error });
            }
        }
    */
    async actualizeCep(req, res) {
        try {

            const { uf } = req.params;

            const ceps = await connection('establishment')
                .where('uf', '=', uf)
                .distinct('cep')

            for (let i = 0; i < ceps.length; i++) {

                const public_place = await connection('establishment')
                    .where('cep', '=', ceps[i].cep)
                    .distinct('public_place')
                    .count('public_place')
                    .groupBy('establishment.public_place')

                const district = await connection('establishment')
                    .where('cep', '=', ceps[i].cep)
                    .distinct('district')
                    .count('district')
                    .groupBy('establishment.district')

                const type_of_public_place = await connection('establishment')
                    .where('cep', '=', ceps[i].cep)
                    .distinct('type_of_public_place')
                    .count('type_of_public_place')
                    .groupBy('establishment.type_of_public_place')

                let max_public_place = ({ public_place: "", count: 0 });
                let max_district = { district: "", count: 0 };
                let max_type_of_public_place = { type_of_public_place: "", count: 0 };

                for (let j = 0; j < public_place.length; j++) {
                    if (parseInt(public_place[j].count) > max_public_place.count) {
                        max_public_place = public_place[j];
                    }
                }

                for (let j = 0; j < district.length; j++) {
                    if (parseInt(district[j].count) > max_district.count) {
                        max_district = district[j];
                    }
                }

                for (let j = 0; j < type_of_public_place.length; j++) {
                    if (parseInt(type_of_public_place[j].count) > max_type_of_public_place.count) {
                        max_type_of_public_place = type_of_public_place[j];
                    }
                }
                console.log(max_type_of_public_place, "max_public_place")

                const update = await connection('establishment')
                    .where('cep', '=', ceps[i].cep)
                    .update({
                        public_place: max_public_place.public_place,
                        district: max_district.district,
                        type_of_public_place: max_type_of_public_place.type_of_public_place
                    })

                console.log(update);
            }

            return res.status(200).json({ message: 'ok' });

        } catch (error) {
            return res.status(400).json({ error: 'Unable to get files: ' + error });

        }
    }
}

module.exports = EstablishmentController;
