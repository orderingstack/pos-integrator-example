const listener = require('./ws-listener');
const orderService = require('./orders-service');
const authorization = require('./authorization');
const figlet = require('figlet');
const inquirer = require('inquirer');
require('dotenv').config();

async function init() {
  console.log(figlet.textSync('Ordering Stack', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }));
  console.log(`Ordering Stack POS Integrator v. 0.0.1`);
  let authOK = false;
  do {
    authOK = await checkAndOptionallyAskForCredentials();
  } while (authOK);
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

async function checkAndOptionallyAskForCredentials() {
  const userName = process.env.USER_NAME;
  console.log(`Authorization with user: ${userName}...`);
  const accessToken = await accessTokenProviderCallbackAsync();  
  if (!accessToken) {
    console.log('Authorization failed.');
    const r = await inquirer.prompt([
        {
          type: 'password',
          name: 'secret',
          message: `Enter password for [${userName}]:`,
        },
      ]);
    authorization.savePasswordForUser(userName, r.secret);
  } else {
    console.log('Auth OK');
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