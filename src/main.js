import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Meta from 'vue-meta'

Vue.use(Meta, {
  keyName: "metaInfo",
  attribute: "data-vue-meta", 
  tagIDKeyName: "vmid",
  refreshOnceOnNavigation: true
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  
  render: h => h(App)
}).$mount("#app");
