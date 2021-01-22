import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import sparePartRouter from './modules/sparePart'
import maintainRouter from './modules/maintain'
import workRouter from './modules/work'
import keepfitRouter from './modules/keepfit'
import deviceChangeRouter from './modules/devicechange'
const routes = [{
		path: "/index",
		name: "方兴EAM管理系统",
		component: () => import('../components/index.vue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 2
		}
	},
	{
		path: '/',
		name: 'login',
		component: () => import('@/components/login'),
		meta: {
			needLogin: false,
			back: true,
			index: 2
		}
	},
	{
		path: '/camera',
		name: '二维码扫描',
		component: () => import('../views/device/camera/index.vue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 3
		}
	},
	{
		path: '/my',
		name: '我的',
		component: () => import('../views/my/index.vue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 3
		}
	},
	{
		path: '/cameraphoto',
		name: '拍照上传',
		component: () => import('@/components/camera'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/changePassword',
		name: '修改密码',
		component: () => import('../views/my/changePassword.vue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/ipchange',
		name: '修改IP',
		component: () => import('../views/my/ipchange.vue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/device',
		name: '设备名字',
		component: () => import('../views/device/index.vue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: false,
			index: 4
		}
	}
	// workRouter
];
// 各个板块路由插入
for (let i of sparePartRouter) {
	routes.push(i)
}
for (let i of maintainRouter) {
	routes.push(i)
}
for (let i of workRouter) {
	routes.push(i)
}
for (let i of keepfitRouter) {
	routes.push(i)
}
for (let i of deviceChangeRouter) {
	routes.push(i)
}
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
	mode: "hash",
	base: process.env.BASE_URL,
	routes
});

export default router;
