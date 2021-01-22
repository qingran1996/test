<template>
	<div class="pending" ref="maintainpending">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list class="van-clearfix" v-model="loading" :finished="finished" :immediate-check="false" :finished-text="finishedText"
			 :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<van-cell center v-for="(item,index) in list" :key="index" :value="item.dataResponse.statusName" is-link @click="gotodetail(item.taskResponse)">
					<template #title>
						<div class="custom-top">
							<div class="toptitle">{{item.dataResponse.jwNo}}</div>
							<!-- <van-tag color="#ffe1e1" text-color="#ad0000" v-show="item.value!=''"  mark>{{item.value}}</van-tag> -->
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
	import {
		Toast
	} from 'vant'

	export default {
		name: "pending",
		components: {},
		data() {
			return {
				showheight: document.body.clientHeight - 150 + 'px',
				jsonData: {},
				isaskorcheck: 0, // 0是我申请，1为我审核
				isgetwork: 0, // 0未结束 1结束
				askorcheckurl: '/w/jobWork/applyList',
				list: [],
				error: false, // 是否展示错误
				finishedText: "没有更多了",
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
				if (e.getwork === '0') {
					// console.log(e)
					that.isaskorcheck = e.index // 0是我申请，1为我审核
					that.isgetwork = e.getwork //0未结束 1结束
					if (e.index == 0) {
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
				// console.log(item)
				console.log(this.isaskorcheck,this.isgetwork)
				if (this.isaskorcheck == 0 && this.isgetwork == '0') { //我申请，未结束
					this.$router.push({
						path: '/worklookdetail',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if(this.isaskorcheck == 1 && this.isgetwork == '0' && item.taskName=='领导审批') { //我审核，待处理
					this.$router.push({
						path: '/workcheck',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if (this.isaskorcheck == 1 && this.isgetwork == '0' && item.taskName=='安全审核') {
					this.$router.push({
						path: '/safeMancheck',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if (this.isaskorcheck == 1 && this.isgetwork == '0' && item.taskName=='安全信息提交') {
					this.$router.push({
						path: '/safeMancheckAfter',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if (this.isaskorcheck == 1 && this.isgetwork == '0' && item.taskName=='现场确认') {
					this.$router.push({
						path: '/safeMancheckAfter',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if (this.isaskorcheck == 1 && this.isgetwork == '0' && item.taskName=='环境检测') {
					this.$router.push({
						path: '/safeMancheckAfter',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if (this.isaskorcheck == 1 && this.isgetwork == '0' && item.taskName=='监护人确认（作业前）') {
					this.$router.push({
						path: '/tutelagecheck',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if (this.isaskorcheck == 1 && this.isgetwork == '0' && item.taskName=='安巡员确认') {
					this.$router.push({
						path: '/safetyPatrolS',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				} else if (this.isaskorcheck == 1 && this.isgetwork == '0' && item.taskName=='监护人确认（作业后）') {
					this.$router.push({
						path: '/guarderEndcheck',
						query: {
							data: encodeURI(JSON.stringify(item))
						}
					})
				}
				// this.$store.commit('getwork', this.isgetwork)
				// this.$store.commit('getworkactive', this.isaskorcheck)
			},
			//获取数据
			getData() {
				//console.log(this.askorcheckurl)
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
							// let number = res.data.data.number
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
					console.log('工作票pending')
					if (this.refreshing) {
						this.list = [];
						this.refreshing = false;
					}
					this.jsonData.pageNo += 1
					this.getData()
				}, 1000);
			},
			onRefresh() {
				//Toast("刷新中...");
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				this.jsonData.pageNo = 0
				this.jsonData.pageSize = 10
				this.loading = true;
				// 清空列表数据
				this.finished = false;
				this.onLoad();
			},
			goApply() {
				// let addData = {
				// 	applyNo: Math.floor(Math.random() * 100 + 1),
				// 	OrderNo: '',
				// 	typeId: '',
				// 	applyTime: '',
				// 	applyDesc: '',
				// 	applyUserId: '',
				// 	applyUser: '',
				// 	checkUserId: '',
				// 	checkUser: '',
				// 	state: '',
				// 	sparePartAddLists: []
				// } //新增板块信息
				// sessionStorage.setItem('produce',JSON.stringify(addData))
				this.$router.push('/addwork')
			}
		}
	};
</script>
<style scoped>
	.pending {
		overflow-y: scroll;
		height: calc(100% - 160px);
	}

	.van-pull-refresh>>>.van-pull-refresh__track {
		overflow: unset;
	}

	.van-cell__title {
		text-align: left;
		display: inline-block;
	}

	.van-cell__title>>>.custom-title {
		white-space: pre-wrap;
		word-break: break-all;
	}

	.van-cell__title>>>.custom-top {
		width: 7rem;
		display: inline-flex;
	}

	.bottomshow {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 50px;
		border-top: 1px solid lightgrey;
		left: 0;
	}

	.showa {
		width: 50%;
		height: 100%;
		text-align: center;
		display: inline-block;
	}

	.showb {
		width: 50%;
		height: 100%;
		text-align: center;
		display: inline-block;
	}

	.pendingButton {
		position: fixed;
		bottom: 60px;
		right: 10px;
		/* width: 90%;
		margin: 10px 5%;
		height: 40px;
		left: 0; */
	}
</style>
