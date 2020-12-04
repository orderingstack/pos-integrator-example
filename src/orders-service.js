const posIntegration = require( './pos/pos-integration-impl.js')
const  schedule = require('node-schedule');
const axios = require('axios');

const orderMap = [];

/* run every hour */
schedule.scheduleJob('0 * * * *', function(){  
  purgeOrderMapFromOldOrders();
});

function purgeOrderMapFromOldOrders() {
  console.log('purge order map');
}

function addToOrderMap(order) {
  if (!orderMap[order.id]) { //new order 
    orderMap[order.id] = order;
    return true;    
  } else { //we have that order
    return false;
  }
}

function orderIdExists(id) {
  return (orderMap[id]!=null);
}

async function pullAndProcessOrders(venue, token) {
  const orders = await pullOrders(venue, token);
  for (const order of orders) {
    if (/*!order.getExta('is-pos-sync')*/ !orderIdExists(order.id)) {
      await posIntegration.insertNewOrderToPOS(order)
    }
  };
}


async function inserOrderIntoPOS(message) {
  const order = message;
  try {
    if (!orderIdExists(order.id)) {
      addToOrderMap(order);
      const result = await posIntegration.insertNewOrderToPOS(order);
    }
    //osOrderTools.setExtra('is-pos-sync', true);
  } catch (ex) {
    console.error(ex);
  }  
  //error handling
}

module.exports = {
  pullAndProcessOrders, inserOrderIntoPOS
}

/**
Pulls open orders for venue. Uses provided access token to authenticate to rest api.   
* @param {*} venue - we pull orders for this venue  
* @param {*} token - access token   
 */
async function pullOrders(venue, token) {
  console.log('Pulling orders...');
  let response = null;
  try {
      response = await axios({
          method: 'get',
          url: `${process.env.BASE_URL}/ordering-api/api/orders/venue/${venue}`,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });
      const orders = [];
      for (const o of response.data) {
        if (o.completed) {
          orders.push(o);
        }
      }
      return orders;
  } catch (error) {
    console.error(error);
    return [];
  }
}

