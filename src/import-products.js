const posIntegratorCore = require('@orderingstack/pos-integrator-core');
const authorization = posIntegratorCore.authorization;
const productsService = posIntegratorCore.productService;
const figlet = require('figlet');

const posIntegrator = require('./pos-example');

require('dotenv').config();
 
async function init() {
  console.log(figlet.textSync('Ordering Stack', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }));
  console.log(`Ordering Stack POS Integrator v. 0.0.1   -  IMPORT PRODUCTS INTO ORDERING STACK`);
  let accessToken = await authorization.checkAndOptionallyAskForCredentials(process.env.USER_NAME, accessTokenProviderCallbackAsync);
  await importProducts(accessToken);  
}  

async function accessTokenProviderCallbackAsync() {
  const loginResp = await authorization.authorize(process.env.BASE_URL, process.env.TENANT, process.env.BASIC_AUTH, process.env.USER_NAME);
  if (loginResp.err) {
    console.error(loginResp.err);
    return;
  } else {
    const access_token = loginResp.authData.access_token;
    return access_token;
  }
} 

async function importProducts(token) {
  console.log('IMPORT PRODUCTS');
  const prodsToImport = await posIntegrator.getProductsToImportToOrderingStack();  
  console.log(posIntegrator.alterProductBeforeImport);
  const result = await productsService.importProductsToOrderingStack(prodsToImport, token, posIntegrator.alterProductBeforeImport);
  console.log(result);
}

(async () => {
  try {
    await init();
  } catch (ex) {
    console.log(ex);
  }
})();