const listener = require('./ws-listener');
const orderService = require('./orders-service');
const authorization = require('./authorization');
const figlet = require('figlet');
require('dotenv').config();

async function init() {
  console.log(figlet.textSync('Ordering Stack', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }));
  console.log(`Ordering Stack POS Integrator v. 0.0.1`);
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
  await orderService.inserOrderIntoPOS(message, accessToken);
}

(async () => {
  try {
    await init();
  } catch (ex) {
    console.log(ex);
  }
})();