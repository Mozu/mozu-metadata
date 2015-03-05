module.exports = {
  domains: {
    'api.commerce': {
      actions: {
        'order.getShippingRates': {
          context: {
            get: {
              order: 'Mozu.Api.Commerce.Order',
              rates: 'Mozu.Api.Shipping.Rates'
            },
            exec: {
              updateOrder: ['Mozu.Api.Commerce.Order'],
              updateRate: ['Mozu.Api.Shipping.Rate']
            }
          }
        },
        'order.beforeSubmit': {
          context: {
            get: {
              order: 'Mozu.Api.Commerce.Order',
              customer: 'Mozu.Api.Customer.Account'
            },
            exec: {
              updateOrder: ['Mozu.Api.Commerce.Order'],
              updateCustomer: ['Mozu.Api.Customer.Account']
            }
          }
        },
        'order.afterSubmit': {
          context: {
            get: {
              order: 'Mozu.Api.Commerce.Order',
              customer: 'Mozu.Api.Customer.Account',
              auth: 'Mozu.Api.PaymentService.AuthOfSomeKind'
            },
            exec: {
              updateOrder: ['Mozu.Api.Commerce.Order'],
              updateCustomer: ['Mozu.Api.Customer.Account']
            }
          }
        }
      }
    },
    'api.catalog': {
      actions: {
        'search.beforeSearch': {
          context: {
            get: {
              query: 'string',
              customer: 'Mozu.Api.Customer'
            },
            exec: {
              changeQuery: ['string'],
              changeSearch: ['Mozu.Api.ProductRuntime.SearchOptions']
            }
          }
        },
        'search.afterSearch': {
          context: {
            get: {
              query: 'string',
              customer: 'Mozu.Api.Customer',
              results: 'Mozu.Api.ProductRuntime.SearchResult'
            },
            exec: {
              updateResults: ['Mozu.Api.ProductRuntime.SearchResult'],
              updateCustomer: ['Mozu.Api.Customer']
            }
          }
        },
        'product.configure': {
          context: {
            get: {
              product: 'Mozu.Api.ProductAdmin.Product',
              customer: 'Mozu.Api.Customer.Account',
              options: 'Mozu.Api.ProductRuntime.ProductConfiguration'
            },
            exec: {
              updateOptions: ['Mozu.Api.ProductRuntime.ProductConfiguration'],
              updateCustomer: ['Mozu.Api.Customer']
            }
          }
        }
      }
    },
    'api.content': {

    },
    'api.platform': {

    },
    'storefront.controllers': {

    },
    'storefront.hypr': {
      
    }
  }
};