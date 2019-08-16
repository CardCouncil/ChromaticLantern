import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/sets",
      name: "sets",
      component: () => import("./views/Sets.vue")
    },
    {
      path: "/search",
      name: "search",
      component: () => import("./views/Search.vue")
    },
    {
      path: "/list",
      name: "list",
      component: () => import("./views/List.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/About.vue") /* webpackChunkName: "about" */
    }
  ]
});
