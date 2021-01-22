/** When your routing table is too long, you can split it into small modules**/



const deviceChangeRouter = [
	{
		path: '/devicechange',
		name: '设备变更列表',
		component: () => import('../../views/devicechange/index'),
		meta: {
			needLogin: true,
			keepAlive: true,
			back: false,
			index: 3
		}
	}
]
  


export default deviceChangeRouter
