export const environment = {
  production: true,
  systemName: 'Dashboard AMarket',
  configuration: {
    applicationId: 3,
    noCia: '01',
    keySource: 'SHOPIFY',
    deliveryKey: 'Beetrack',
    cashboxId: '1',
    pointOfSaleId: '1',
    facturacionElectronica: 2,
    factucenEndPoint: {
      urlBase: 'https://apicloud.farmacorp.com/apifactucen',
      credentials: {
        type: 'Basic',
        user: '080e7f57ad15ba47189ad9141463f9e8ea92299b', // pro
        password: 'ea2de426183559a62f6bfea0a4e29216626faced' // pro
      }
    },
    orderManagentEndPoint: {
      //urlBase: 'http://localhost/ordermanagment',
      urlBase: 'https://develop.farmacorp.com/ordermanagement',
      credentials: {
        type: 'Basic',
        user: 'Farmacorp', // pre
        password: '12345' // pre
      }
    },
    tookanApiEndPoint: {
      urlBase: 'https://apicloud.farmacorp.com/apitookan',
      credentials: {
        type: 'Basic',
        user: 'dca59d2792dead56a48d1bdbb4d959c66bc4fc15', // pro
        password: '33373541c633061a0b28b1bdb9dffbcac3b4aacc' // pro
      }
    },
    mainEndPoint: {
      urlBase: 'https://apicloud.farmacorp.com/apishopifyamarket',  // prod
      credentials: {
        type: 'Basic',
        user: '79716b858c8c1a4fc9acdd3af6acdeb3c7cfc979',     // prod
        password: 'be70df962967ae1c995f91f5758845c5b348c660'  // prod
      }
    },
    billingsqlEndPoint:
    {
      urlBase: "https://apicloud.farmacorp.com/apibilling",
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
      urlBase: "https://apicloud.farmacorp.com/apishopifyamarketjob",
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
