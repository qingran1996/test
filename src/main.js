import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import axios from './static/http.js'
import store from "./store";
import Vant from 'vant';
import 'vant/lib/index.css';
import config from './static/config.js'
import 'lib-flexible/flexible.js'
import Mui from 'vue-awesome-mui'
import VueBus from 'vue-bus';
import axiosUser from './utils/axiosUser.js'
import SignCanvas from 'sign-canvas';
import VueParticles from 'vue-particles'  
Vue.use(VueParticles) 

Vue.use(SignCanvas);
Vue.use(Mui)
Vue.use(VueBus)
Vue.use(axiosUser)
//主题定制等场景需要加载SCSS,而不是构建后的CSS
//import '@nutui/nutui/dist/packages/button/button.scss'; 

 // import './config/rem.js'
Vue.prototype.$axios = axios
Vue.use(Vant);
Vue.config.productionTip = false;
Vue.use(config)
//路由守卫
router.beforeEach((to, from, next) => {
	//路由中设置的needLogin字段就在to当中 
	//console.log(localStorage.eleToken)
	if (localStorage.eleToken!==undefined) {
		// console.log(window.sessionStorage);
		// console.log(to.path) //每次跳转的路径
		if (to.path === '/') {
			//登录状态下 访问login.vue页面 会跳到index.vue
			next({
				path: '/index'
			});
		} else {
			next();
		}
	} else {
		// 如果没有session ,访问任何页面。都会进入到 登录页
		if (to.path === '/') { // 如果是登录页面的话，直接next() -->解决注销后的循环执行bug
			next();
		} else { // 否则 跳转到登录页面
			next({
				path: '/'
			});
		}
	}
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
