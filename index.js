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
        },
        'cart.beforeAddItem': {
            context: {
                get: {
                    cart: 'Mozu.Api.Commerce.Cart',
                    customer: 'Mozu.Api.Customer.Account',
                    auth: 'Mozu.Api.PaymentService.AuthOfSomeKind'
                },
                exec: {
                    updateCart: ['Mozu.Api.Commerce.Cart'],
                    updateCustomer: ['Mozu.Api.Customer.Account']
                }
            }
        },
        'cart.afterAddItem': {
            context: {
                get: {
                    cart: 'Mozu.Api.Commerce.Cart',
                    customer: 'Mozu.Api.Customer.Account',
                    auth: 'Mozu.Api.PaymentService.AuthOfSomeKind'
                },
                exec: {
                    updateCart: ['Mozu.Api.Commerce.Cart'],
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
  },
  environments: {
    "Production/Sandbox": {
      homeDomain: 'home.mozu.com'
    },
    "QA": {
      homeDomain: 'home.mozu-qa.com'
    },
    "SI": {
      homeDomain: 'home.mozu-si.com'
    },
    "CI": {
      homeDomain: 'home.mozu-ci.com'
    }
  },
  themes: {
    "core6": {
      repo: "mozu/core-theme",
      version: "6"
    },
    "core5": {
      repo: "mozu/core-theme",
      version: "5"
    }
  }
};