export const environment = {
  production: true,
  systemName: 'Dashboard Sucursal',
  configuration: {
    applicationId: 3,
    noCia: '01',
    keySource: 'SHOPIFY',
    deliveryKey: 'Beetrack',
    cashboxId: '1',
    pointOfSaleId: '1',
    facturacionElectronica: 2,
    factucenEndPoint: {
      urlBase: 'https://develop.farmacorp.com/apifactucen_sfe',
      //urlBase: 'http://localhost/apifactucen',
      credentials: {
        type: 'Basic',
        user: 'bf3bd13f71bfd3080f7b254112a9b68164f9877c', // pre
        password: '2bd6fcd5874d5d4d6b1b6cb2e97b5ddca978ec57' // pre
      }
    },
    orderManagentEndPoint: {
      urlBase: 'https://develop.farmacorp.com/ordermanagement',
      //urlBase: 'http://localhost/ordermanagment',
      credentials: {
        type: 'Basic',
        user: 'Farmacorp', // pre
        password: '12345' // pre
      }
    },
    tookanApiEndPoint: {
      urlBase: 'https://develop.farmacorp.com/apitookan',
      credentials: {
        type: 'Basic',
        user: 'e5ed9880234c6de644ee9d92b4ad191f11fb8fe8', // pre
        password: 'e5ed9880234c6de644ee9d92b4ad191f11fb8fe8' // pre
      }
    },
    mainEndPoint: {
      urlBase: 'https://develop.farmacorp.com/shopifyexternalapi',  // prod
      credentials: {
        type: 'Basic',
        user: 'bf3bd13f71bfd3080f7b254112a9b68164f9877c', // pre
        password: '2bd6fcd5874d5d4d6b1b6cb2e97b5ddca978ec57' // pre
      }
    },
    billingsqlEndPoint:
    {
      urlBase: "https://develop.farmacorp.com/apibilling",
      credentials: {
        type: "Basic",
        user: "eb0f5711a3f05c18e3c3eaf3523210fa5450f53b",
        password: "2adf96921fbe7848d9dfcaadcd2f2218d6abd342"
      }
    },
    apieshopwmsEndPoint:
    {
      urlBase: "https://develop.farmacorp.com/apieshopwms",
      credentials: {
        type: "Basic",
        user: "c57f213910d110abad6a3ce7c6491c42b988d660",
        password: "c57f213910d110abad6a3ce7c6491c42b988d660"
      }
    },
    mainJobEndPoint:
    {
      urlBase: "https://develop.farmacorp.com/apishopifyjob",
      credentials: {
        type: "Basic",
        user: "c57f213910d110abad6a3ce7c6491c42b988d660",
        password: "c57f213910d110abad6a3ce7c6491c42b988d660"
      }
    },
    marketplacesEndPoint:
    {
      urlBase: "https://apicloud.farmacorp.com/apimarketplaces",
      credentials: {
        type: "Basic",
        user: "Farmacorp",
        password: "80f474cf1556fdb7f389f33d7af03e4a"
      }
    }
  }
};
