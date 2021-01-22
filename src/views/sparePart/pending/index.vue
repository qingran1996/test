<template>
	<div class="sparePartpending" ref="maintainpending">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list class="van-clearfix" v-model="loading" :finished="finished" :immediate-check="false" :finished-text="finishedText"
			 :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<van-cell center v-for="(item,index) in list" :key="index" value="" is-link @click="gotodetail(item)">
					<template #title>
						<div class="custom-top">
							<div class="toptitle">{{item.applyBarCode}}</div>
							<van-tag color="#ffe1e1" text-color="#ad0000" v-show="item.applyUserId==jsonData.userId" mark>我发起的</van-tag>
						</div>
					</template>
					<template #label>
						<div class="custom-title">{{item.sparePartName}}</div>
					</template>
				</van-cell>
			</van-list>
		</van-pull-refresh>
		<van-button type="info" class="pendingButton" round @click="goApply">申请备品备件</van-button>
	</div>
</template>

<script>
	export default {
		name: "sparePartpending",
		components: {},
		data() {
			return {
				showheight: document.body.clientHeight - 150 + 'px',
				jsonData: {
					userId: localStorage.getItem('userId'),
					checkResult: 0,
					pageNo: 1,
					pageSize: 10
				},
				error: false, // 是否展示错误
				finishedText: "没有更多了",
				showtag: false,
				list: [],
				loading: false,
				finished: false,
				refreshing: false,
				isLoading: false,
				text: '123....'
			}
		},
		activated() {
			// this.getData()
		},
		mounted() {
			// this.getData()
			// this.list = []
			// this.onRefresh()
			// this.$refs.maintainpending.scrollTop = 0
		},
		created() {
			let that = this
			// this.$bus.on('showsparePartMaintain', function(e) {
			// 	if (e === '1') {
			// 		that.list = []
			// 		that.onRefresh()

			// 	}
			// })
			//初始化
			this.$bus.on('sparePartshowTag', function(e) {
				// console.log(e)
				if (e === '1') {
					that.list = []
					that.onRefresh()
				
				}
			})
		},
		methods: {
			gotodetail(item) {
				console.log(item)
				//别人发给自己审核
				if (this.jsonData.userId == item.checkUserId) {
					this.$router.push({
						path: '/sparePartcheck',
						query: {
							data: item.id
						}
					})
				} else if(this.jsonData.userId == item.checkUserId && this.jsonData.userId != item.applyUserId) {
					this.$router.push({
						path: '/sparePartcheck',
						query: {
							data: item.id
						}
					})
				} else {
					this.$router.push({
						path: '/sparePartdetail',
						query: {
							data: item.id
						}
					})
				}
			},
			//获取数据
			getData() {
				this.loading = true
				this.$axios.post('/d/sparePartApply/queryByUserId', this.jsonData).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data.content)
							let that = this
							let data = res.data.data.content
							let pages = that.jsonData.pageNo
							//console.log(pages)
							if (data.length === 0) {
								that.finished = true
								that.finishedText = "没有更多了"
								return
							}
							that.loading = false
							let dataList = [] //每次请求的列表
							if (that.jsonData.pageNo === 1) {
								// console.log('来到了第一页',that.$refs.maintainpending)
								if (that.$refs.maintainpending != undefined) {
									that.$refs.maintainpending.scrollTop = 0
								}
								for (let i = 0; i < data.length; i++) {
									dataList.push(data[i]);
								}
								that.list = dataList
								if (dataList.length < that.jsonData.pageSize) {
									that.finished = true
									that.finishedText = '';
								}
							} else {
								for (let i = 0; i < data.length; i++) {
									dataList.push(data[i]);
								}
								that.list = that.list.concat(dataList)
							}
							//判断是否最后一页
							if (that.jsonData.pageSize == res.data.data.number) {
								that.finished = true
								that.finishedText = '没有更多了';
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.error = true
						this.$toast('服务异常')
					})
					.finally(() => {
						this.loading = false
					})
			},
			goApply() {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					let addData = {
						applyNo: Math.floor(Math.random() * 100 + 1),
						OrderNo: '',
						typeId: '',
						applyTime: '',
						applyTypeId: 1,
						applyDesc: '',
						applyUserId: '',
						applyUser: '',
						checkUserId: '',
						checkUser: '',
						state: '',
						sparePartAddLists: []
					} //新增板块信息
					sessionStorage.setItem('produce', JSON.stringify(addData))
					this.$router.push('/applySparePart')
				}, 300) // 大概时间300ms
				
			},
			onLoad() {
				setTimeout(() => {
					if (this.refreshing) {
						this.list = [];
						this.refreshing = false;
					}
					this.jsonData.pageNo += 1
					this.getData()
				}, 1000);

			},
			onRefresh() {
				// this.$toast({
				// 	message: '加载中...',
				// 	forbidClick: true
				// });
				this.jsonData.pageNo = 0
				this.jsonData.pageSize = 10
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				this.loading = true;
				// 清空列表数据
				this.finished = false;
				this.onLoad();
			}
		}
	};
</script>
<style scoped>
	.sparePartpending {
		overflow-y: scroll;
		height: calc(100% - 100px);
	}

	.van-cell__title {
		text-align: left;
		display: inline-block;
	}

	.van-cell__title>>>.custom-title {
		width: 200px;

	}

	.van-cell__title>>>.custom-top {
		width: 7rem;
		display: inline-flex;
	}

	.toptitle {
		color: #000000;
		width: 4rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.van-pull-refresh>>>.van-pull-refresh__track {
		overflow: unset;
	}

	/* .van-cell-group {
  margin-bottom: 10px;
} */
	/* .van-cell--center {
		width: 700px !important;
	}
	.van-cell>>>.van-cell__right-icon {
		position: fixed;
		right: 30px;
	} */
	.pendingButton {
		position: fixed;
		bottom: 0;
		width: 90%;
		margin: 10px 5%;
		height: 40px;
		left: 0;
	}
</style>
