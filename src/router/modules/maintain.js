const maintainRouter = [
	{
		path: '/maintain',
		name: '设备维修管理',
		component: () => import('../../views/maintain/index.vue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: false,
			index: 3
		}
	},
	{
		path: '/maintainAdd',
		name: '新增维修',
		component: () => import('../../views/maintain/addMaintain/index'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/lookDetail',
		name: '维修详情',
		component: () => import('../../views/maintain/details/lookDetails'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/lookDetailTwo',
		name: ' 维修详情',
		component: () => import('../../views/maintain/details/lookDetailTwo'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/lookDetailThree',
		name: '维修详情 ',
		component: () => import('../../views/maintain/details/lookDetailThree'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/check',
		name: '维修详情  ',
		component: () => import('../../views/maintain/check/check'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/checkTwo',
		name: '维修详情   ',
		component: () => import('../../views/maintain/check/checkTwo'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/checkTwoWX',
		name: '维修工单',
		component: () => import('../../views/maintain/check/checkTwoWX'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 5
		}
	},
	{
		path: '/checkThree',
		name: '维修详情    ',
		component: () => import('../../views/maintain/check/checkThree'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/dealwithDetail',
		name: '维修详情    ',
		component: () => import('../../views/maintain/dealWith/dealwithDetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	}
]


export default maintainRouter