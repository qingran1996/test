const sparePartRouter = [
	{
		path: '/sparePart',
		name: '备品备件领用',
		component: () => import('../../views/sparePart/index.vue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: false,
			index: 3
		}
	},
	{
		path: '/applySparePart',
		name: '备品备件申请',
		component: () => import('../../views/sparePart/apply/applySparePart'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/addSparePart',
		name: ' 备品备件申请   ',
		component: () => import('../../views/sparePart/apply/addSparePart'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 5
		}
	},
	{
		path: '/navSparePart',
		name: ' 备品备件申请详情',
		component: () => import('../../views/sparePart/apply/navSparePart'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 5
		}
	},
	{
		path: '/sparePartcheck',
		name: '备品备件申请详情',
		component: () => import('../../views/sparePart/check/check'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/sparePartdetail',
		name: '备品备件申请详情',
		component: () => import('../../views/sparePart/detail/detail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/sparePartdealwithdetail',
		name: '备品备件申请详情',
		component: () => import('../../views/sparePart/dealWith/dealwithDetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/sparePartdealwithDetail',
		name: '备品备件已处理详情 ',
		component: () => import('../../views/sparePart/dealWith/dealwithDetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	}
]


export default sparePartRouter