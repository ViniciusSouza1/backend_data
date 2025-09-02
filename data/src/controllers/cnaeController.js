const parse = require('csv-parse');
const connection = require('../database/index');
const fs = require('fs');

class CnaeController {


    async index(req, res){
        try {
            
            const cnae = await connection('cnae')

            return res.json(cnae);

        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

    async store(req, res) {
        try {
            

        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }


    async getAllCnaeForId_establishment(req,res){
        try {
            
            const {id}=req.params;

            const cnae = await connection('cnae')
                .where('id_establishment', '=', id);

            return res.json(cnae);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to store files: ' + error });
        }
    }

}
module.exports = CnaeController;
