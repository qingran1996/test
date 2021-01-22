<template>
	<div class="dealwith" ref="dealwith">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list class="van-clearfix" v-model="loading" :finished="finished" :immediate-check="false" :finished-text="finishedText"
			 :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<van-cell center v-for="(item,index) in list" :key="index" value="" is-link @click="gotodetail(item)">
					<template #title>
						<div class="custom-top">
							<div class="toptitle">{{item.title}}</div>
							<van-tag color="#ffe1e1" text-color="#ad0000" v-show="item.value!=''" mark>{{item.value}}</van-tag>
						</div>
						<!-- <span class="custom-top">{{item.title}}
							<van-tag type="warning" mark>{{item.value}}</van-tag>
						</span> -->
					</template>
					<template #label>
						<div class="custom-title">{{item.name}}</div>
						<div class="custom-title">设备位置：{{item.count}}</div>
					</template>
					<template #default>
						<div class="rightshow" style="display: flex;text-align: left;float: left;width: 2rem;">
							<van-icon v-if="item.picstatus==1" name="checked" color="rgb(9,187,7)" size="22" />
							<van-icon v-else name="info" color="red" size="22" />
							<span class="custom-title" v-if="item.picstatus==1">已修复</span>
							<span class="custom-title" v-else-if="item.picstatus==0">未修复</span>
							<span class="custom-title" v-else>已驳回</span>
						</div>

						<!-- <span class="custom-title">{{item.title}}
							<van-tag type="warning">{{item.value}}</van-tag>
						</span> -->
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
				jsonData: {
					userId: localStorage.getItem('userId'),
					deploymentName: 'workNote',
					isFinish: 1,
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
			// this.$refs.dealwith.scrollTop = 0
		},
		created() {
			let that = this
			this.$bus.on('showMaintain', function(e) {
				//	console.log(e)
				// this.showtag = true
				if (e === '2') {
					that.list = []
					that.onRefresh()
				}
			})
			//初始化
			// this.$bus.on('showTag', function(e) {
			// 	console.log(e)
			// 	that.list = []
			// 	that.onRefresh()
			// })
		},
		methods: {
			gotodetail(item) {
				let json = {
					bussinessId: item.bussinessId,
					deploymentName: 'workNote'
				}
				this.getEMDetail(json).then(res => {
						if (res.data.code === 0) {
							let data = res.data.data
							//console.log(data)
							this.$router.push({
								path: '/dealwithDetail',
								query: {
									data: JSON.stringify(data)
								}
							})
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			//获取数据
			getData() {
				this.loading = true
				this.$axios.post('/w/equipmentMaintenanceBussiness/getWorkNoteList', this.jsonData).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let that = this
							let data = res.data.data.workNoteListResponses
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
								if (that.$refs.dealwith!=undefined) {
									that.$refs.dealwith.scrollTop = 0
								}
								// that.$refs.dealwith.scrollTop = 0
								for (let i = 0; i < data.length; i++) {
									dataList.push({
										title: data[i].equipmentName,
										count: data[i].equipmentLocation,
										bussinessId: data[i].bussinessId,
										name: data[i].workNoteNo,
										picstatus: data[i].confirmResultStatus,
										picname: data[i].workNoteStatusName,
										value: data[i].isMyApply == 1 ? '我发起的' : ''
									});
								}
								that.list = dataList
								if (dataList.length < that.jsonData.pageSize) {
									that.finished = true
									that.finishedText = '';
								}
							} else {
								for (let i = 0; i < data.length; i++) {
									dataList.push({
										title: data[i].equipmentName,
										count: data[i].equipmentLocation,
										bussinessId: data[i].bussinessId,
										name: data[i].workNoteNo,
										picstatus: data[i].confirmResultStatus,
										picname: data[i].workNoteStatusName,
										value: data[i].isMyApply == 1 ? '我发起的' : ''
									});
								}
								that.list = that.list.concat(dataList)
							}
							//判断是否最后一页
							if (that.jsonData.pageSize == res.data.data.pageNo) {
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
		height: calc(100% - 100px);
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
	.van-cell>>>.van-cell__right-icon {
		right: 0.32rem;
	}
	.pendingButton {
		position: fixed;
		bottom: 0;
		width: 90%;
		margin: 10px 5%;
		height: 40px;
		left: 0;
	}
</style>
