import Home from "./views/Home.vue";
import Router from "vue-router";
import Vue from "vue";
import store from './store'

Vue.use(Router);

// Globally catch routing push error
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default new Router({
  routes: [
    { path: "/", name: "home", component: Home },
    {
      path: "/decks",
      name: "decks",
      component: () => import("./views/Decks.vue")
    },
    {
      path: "/building/:id",
      name: "building",
      component: () => import("./views/Building.vue"),
      // eslint-disable-next-line
      beforeEnter: (to, from, next) => {
        let deck = store.state.building.decks.find(_ => _.id == to.params.id);
        if(deck) {
          next();
        } else { 
          next("/decks");
        }
      }
    },
    {
      path: "/import",
      name: "import",
      component: () => import("./views/Import.vue")
    },
    {
      path: "/search",
      name: "search",
      component: () => import("./views/Search.vue")
    }
    /* { path: "/about", name: "about", 
    // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.  
    component: () => import("./views/About.vue") // webpackChunkName: "about" } */
  ]
});
