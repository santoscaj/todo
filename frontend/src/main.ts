import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import store from './store';
// import ViewUI from 'view-design';
import { Tooltip,Menu, Submenu, Message, MenuItem, Button , Avatar, Table, Input, Form,FormItem, Card, Dropdown,  DropdownMenu ,DropdownItem ,Icon} from 'view-design';
import 'view-design/dist/styles/iview.css';
import axios from 'axios'

Vue.component('Menu', Menu);
Vue.component('Form', Form);
Vue.component('Icon', Icon);
Vue.component('Card', Card);
Vue.component('Table', Table);
Vue.component('Input', Input);
Vue.component('Button', Button);
Vue.component('Avatar', Avatar);
Vue.component('Message', Message);
Vue.component('Submenu', Submenu);
Vue.component('Tooltip', Tooltip);
Vue.component('MenuItem', MenuItem);
Vue.component('FormItem', FormItem);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);

Vue.config.productionTip = false;


// Vue.use(ViewUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
