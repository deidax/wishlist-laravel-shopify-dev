import dashboard from '../views/dashboard'
import products from '../views/products'
import customers from '../views/customers'
import settings from '../views/settings'

const routes = [
    {
            path: '/',
            name: 'dashboard',
            component: dashboard
        },
        {
            path: '/products',
            name: 'products',
            component: products,
        },
        {
            path: '/customers',
            name: 'customers',
            component: customers,
        },
        {
            path: '/settings',
            name: 'settings',
            component: settings,
        },
]




export default routes;
