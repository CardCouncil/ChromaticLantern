import Home from './views/Home.vue';
import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'home', component: Home },
    {
      path: '/decks',
      name: 'decks',
      component: () => import('./views/Decks.vue')
    },
    {
      path: '/building/:id',
      name: 'building',
      component: () => import('./views/Building.vue')
    }
    /* { path: "/about", name: "about", 
    // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.  
    component: () => import("./views/About.vue") // webpackChunkName: "about" } */
  ]
});
