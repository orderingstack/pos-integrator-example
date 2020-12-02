/* POS specific logic for handling:
   - new orders for inserting into POS 
   - upload product/menu items definitions to Ordering Stack (invoked by scheduler)
*/

//import osProductTools from 'ordering-stack-product-tools';
//import osOrderTools from 'ordering-stack-order-tools';

// osProductTools.getProduct(id) - zwraca produkt lub nulla
// osProductTools.saveProduct(prod) - upsert produktu

// osOrderTools.setNewStatus(orderId, newStatus);

async function insertNewOrderToPOS (order, accessToken) {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
    console.log('---- NEW ORDER:  ' + order.id);
}


async function uploadMenuItemsToOrderingStack() {
}


module.exports = {
    insertNewOrderToPOS, uploadMenuItemsToOrderingStack
}