const home = () =>import ( '../components/app.vue')

export default [
    {
        path: '/',
        component: home,
        name: 'home',
    },
]