/* POS specific logic for handling:
   - new orders for inserting into POS 
   - upload product/menu items definitions to Ordering Stack (invoked by scheduler)
*/


async function insertNewOrderToPOS(order) {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
    console.log('---- NEW ORDER:  ' + order.id);
}

async function getProductsToImportToOrderingStack() {
    const prodsToImport = [
        { id: 'test-prod-01', name: 'Test product 01', price: 3 },
        { id: 'test-prod-02', name: 'Test product 02', price: 5 }
    ];
    return prodsToImport;
}


function alterProductBeforeImport(prod, prodToImport) {
    const fields = ['name', 'description', 'name-en', 'description-en'];
    for (const f of fields) {
      if (!prod.details) {
        prod.details = { literals: {} };
      }
      if (prodToImport[f]) {
        if (!prod.details.literals) {
          prod.details.literals = {};
        }
        prod.details.literals[f] = prodToImport[f];
      }
    }
    if (prodToImport.imageUrl) {
      if (!prod.details.media) {
        prod.details.media = []; 
      }
      prod.details.media[0] = {
        url: prodToImport.imageUrl,
        name: 'MAIN_IMG'
      }
    }
    prod.price = prodToImport.price;
    if (!prod._) {
      prod._ = {};
    }
    const fields_ = ['category', 'ordincat'];
    for (const f of fields_) {
      if (prodToImport[f]) prod._[f] = prodToImport[f];
    }  
    return prod;
  }



module.exports = {
    insertNewOrderToPOS, getProductsToImportToOrderingStack, alterProductBeforeImport
}