/** When your routing table is too long, you can split it into small modules**/



const keepfitRouter = [
	{
		path: '/keepfit',
		name: '保养列表',
		component: () => import('../../views/keepfit/index'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: false,
			index: 3
		}
	},
	{
		path: '/detailadd',
		name: '保养详情',
		component: () => import('../../views/keepfit/pending/detailadd'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/keepfitdealwithDetail',
		name: '保养详情',
		component: () => import('../../views/keepfit/dealWith/dealwithDetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	}
]
  


export default keepfitRouter
