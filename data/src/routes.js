const { Router } = require('express');
const CompaniesController = require('./controllers/companiesController');
const AllCnaeController = require('./controllers/allCnaeController');
const EstablishmentController = require('./controllers/establishmentController');
const CnaeController = require('./controllers/cnaeController');
const CityController = require('./controllers/cityController');
const CsvController = require('./controllers/csvController');

const routes = Router();

const cmsController = new CompaniesController();
const aCnController = new AllCnaeController();
const etmController = new EstablishmentController();
const cnaController = new CnaeController();
const ctyController = new CityController();
const csvController = new CsvController();


routes.post('/companies', cmsController.importCompanies)
routes.get('/companies/:search', cmsController.getCompanyByname);
routes.get('/companies', cmsController.index);

routes.post('/all_cnae', aCnController.importAllCnae);
routes.put('/update/all_cnae', aCnController.updateAllCnae);
routes.post('/update/cnae/byone', aCnController.changeAllCnae);
routes.get('/all_cnae/:cnae', aCnController.getCnaeInAll);
routes.get('/cnae', cnaController.index);
routes.get('/cnae/:id', cnaController.getAllCnaeForId_establishment);


routes.post('/establishment', etmController.importEstablishment);
routes.get('/establishment', etmController.index);
routes.get('/establishment/:cnpj', etmController.getEstablishmentForCNPJ);

routes.put('/update/ceps/vicep', etmController.actualizeCep);
routes.put('/update/ceps/inside/:uf', etmController.actualizeCep);


routes.get('/companies/complete/:cnpj/:social_reason', etmController.getCompanyComplete);

routes.post('/city', ctyController.importCity);

routes.post('/csv', csvController.changeCsvToTxt);

module.exports = routes;
 