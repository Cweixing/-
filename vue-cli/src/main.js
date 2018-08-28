import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import { routes } from './routes';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

Vue.use(VueRouter);

const router =new VueRouter({
  routes:routes,
  mode:'history'
});

import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
