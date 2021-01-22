<template>
	<div class="dealwith" ref="dealwith">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list class="van-clearfix" v-model="loading" :finished="finished" :immediate-check="false" :finished-text="finishedText"
			 :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<van-cell center v-for="(item,index) in list" :key="index" :value="item.dataResponse.statusName" is-link @click="gotodetail(item.taskResponse)">
					<template #title>
						<div class="custom-top">
							<div class="toptitle">{{item.dataResponse.jwNo}}</div>
							<!-- <van-tag color="#ffe1e1" text-color="#ad0000"  mark>{{item.dataResponse.statusName}}</van-tag> -->
						</div>
					</template>
					<template #label>
						<div class="custom-title">{{item.dataResponse.jwTypeName}}</div>
						<div class="custom-title">申请时间：{{formatDate(item.dataResponse.createTime)}}</div>
					</template>
				</van-cell>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	export default {
		name: "dealwith",
		components: {},
		data() {
			return {
				showheight: document.body.clientHeight - 150 + 'px',
				jsonData: {},
				isaskorcheck: 0, // 0是我申请，1为我审核
				isgetwork: 0, // 0未结束 1结束
				askorcheckurl: '',
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
		created() {
			let that = this
			//初始化
			this.$bus.on('workshowTag', function(e) {
				 // console.log(e)
				if (e.getwork === '1') {
					// console.log(e)
					that.isaskorcheck = e.index // 0是我申请，1为我审核
					that.isgetwork = e.getwork // 0未结束 1结束
					if (e.index==0) {
						that.askorcheckurl = '/w/jobWork/applyList'
					} else {
						that.askorcheckurl = '/w/jobWork/taskList'
					}
					that.jsonData = {
						assigent: localStorage.getItem('userId'),
						status: parseInt(e.getwork), //0未结束 1结束 其他数字是全部（必填）
						deploymentName: 'jobWork',
						pageNo: 0,
						pageSize: 10
					}
					that.list = []
					that.onRefresh()
				}
			})
		},
		methods: {
			gotodetail(item) {
				// console.log(this.isaskorcheck,this.isgetwork)
				if (this.isaskorcheck == 0 && this.isgetwork == '1') { //我申请，已结束
					this.$router.push({
						path: '/worklookdetail',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if (this.isaskorcheck == 1 && this.isgetwork == '1') { //我审核，已处理
					this.$router.push({
						path: '/worklookdetail',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				}
			},
			//获取数据
			getData() {
				this.loading = true
				this.$axios.post(this.askorcheckurl, this.jsonData).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
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
									// dataList.push({
									// 	title: data[i].device.deviceName,
									// 	name: data[i].maintainPlan.title
									// });
									dataList.push(data[i])
								}
								that.list = dataList
								if (dataList.length < that.jsonData.pageSize) {
									that.finished = true
									that.finishedText = '';
								}
							} else {
								for (let i = 0; i < data.length; i++) {
									dataList.push(data[i])
								}
								that.list = that.list.concat(dataList)
							}
							let number = res.data.data.number
							//判断是否最后一页
							if (that.jsonData.pageSize == res.data.data.number) {
								console.log('大西瓜')
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
			onLoad() {
				setTimeout(() => {
					console.log('工作票dealwith')
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
	.dealwith {
		overflow-y: scroll;
		height: calc(100% - 160px);
	}

	.van-cell__title {
		text-align: left;
		display: inline-block;
	}

	/* .van-cell__title>>>.custom-title {
		white-space: pre-wrap;
			word-break: break-all;
	} */
	
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
	.van-cell>>>.van-cell__value {
		overflow: unset;
	}
	/* .van-cell>>>.van-cell__right-icon {
		right: 0.32rem;
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
