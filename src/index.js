const posIntegratorCore = require('@orderingstack/pos-integrator-core');
const listener = posIntegratorCore.listener;
const orderService = posIntegratorCore.orderService;
const authorization = posIntegratorCore.authorization;
const figlet = require('figlet');
require('dotenv').config();

const posExampleImpl = require('./pos-example');

async function init() {
  console.log(figlet.textSync('Ordering Stack', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }));
  console.log(`Ordering Stack POS Integrator v. 0.0.1`);
  orderService.initOrderService(posExampleImpl.insertNewOrderToPOS);
  const accessToken = await authorization.checkAndOptionallyAskForCredentials(process.env.USER_NAME, accessTokenProviderCallbackAsync);
  listener.connectWebSockets(
    process.env.TENANT, process.env.VENUE,
    accessTokenProviderCallbackAsync, onConnect, onDisconnect, onMessage
  );
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

async function onConnect(accessToken) {
  await orderService.pullAndProcessOrders(process.env.VENUE, accessToken);
}

function onDisconnect() {
  console.log('- disconnected -');
}

async function onMessage(message, accessToken) {
  await orderService.processOrder(message, accessToken);
}

(async () => {
  try {
    await init();
  } catch (ex) {
    console.log(ex);
  }
})();