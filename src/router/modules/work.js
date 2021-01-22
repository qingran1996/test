/** When your routing table is too long, you can split it into small modules**/



const workRouter = [
	{
		path: '/work',
		name: '作业票',
		component: () => import('../../views/work/index'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: false,
			index: 3
		}
	},
	{
		path: '/addwork',
		name: '作业票申请',
		component: () => import('../../views/work/addwork/index'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/worklookdetail',
		name: '作业票详情',
		component: () => import('../../views/work/detail/lookdetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/workcheck',
		name: '作业票申请',
		component: () => import('../../views/work/check/check'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/safeMancheck',
		name: '作业票申请',
		component: () => import('../../views/work/check/safeMancheck'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/safecheck',
		name: '安全审核',
		component: () => import('../../views/work/check/safecheck'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 5
		}
	},
	{
		path: '/safeMancheckAfter',
		name: '安全审核',
		component: () => import('../../views/work/check/safeMancheckAfter'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/safeMancheckAfterDetail',
		name: '安全检测',
		component: () => import('../../views/work/check/safeMancheckAfterDetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/guscheck',
		name: '气体检测',
		component: () => import('../../views/work/check/guscheck'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 5
		}
	},
	{
		path: '/dangerTagged',
		name: '危险辨识',
		component: () => import('../../views/work/check/dangerTagged'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 5
		}
	},
	{
		path: '/gusContinue',
		name: '气体持续监测',
		component: () => import('../../views/work/check/gusContinue'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/tutelagecheck',
		name: '作业票详情', //监护人
		component: () => import('../../views/work/check/tutelagecheck'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/safetyPatrolS',
		name: '作业票详情', //监护人
		component: () => import('../../views/work/check/safetyPatrolS'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/guarderEndcheck',
		name: '作业票详情', //监护人
		component: () => import('../../views/work/check/guarderEndcheck'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/enddetail',
		name: '作业票详情', //监护人
		component: () => import('../../views/work/detail/enddetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 4
		}
	},
	{
		path: '/guscontinuedetail',
		name: '气体检测详情', //监护人
		component: () => import('../../views/work/detail/guscontinuedetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 5
		}
	},
	{
		path: '/dangerdetail',
		name: '危险辨识详情', //监护人
		component: () => import('../../views/work/detail/dangerdetail'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: true,
			index: 5
		}
	}
]
  


export default workRouter
