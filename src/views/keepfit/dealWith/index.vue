<template>
	<div class="keepfitdealwith" ref="maintainpending">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list class="van-clearfix" v-model="loading" :finished="finished" :immediate-check="false" :finished-text="finishedText"
			 :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<van-cell center v-for="(item,index) in list" :key="index" value="" is-link @click="gotodetail(item)">
					<template #title>
						<div class="custom-top">
							<div class="toptitle">{{item.device.deviceName}}</div>
							<!-- <van-tag color="#ffe1e1" text-color="#ad0000" v-show="item.value!=''"  mark>{{item.value}}</van-tag> -->
						</div>
					</template>
					<template #label>
						<div class="custom-title">{{item.maintainPlan.title}}</div>
						<!-- <div class="custom-title">设备位置：{{item.count}}</div> -->
					</template>
					<template #default>
						<van-tag v-if="item.resultType==1" round type="success" size="medium">正常</van-tag>
						<van-tag v-else round type="danger" size="medium">异常</van-tag>
					</template>
				</van-cell>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	export default {
		name: "keepfitdealwith",
		components: {},
		data() {
			return {
				showheight: document.body.clientHeight - 150 + 'px',
				jsonData: {
					executor: localStorage.getItem('userName'),
					startTime: '',
					endTime: '',
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
		mounted() {
			
		},
		created() {
			let that = this
			this.$bus.on('showkeepfit', function(e) {
				if (e === '2') {
					that.list = []
					that.onRefresh()

				}
			})
		},
		methods: {
			gotodetail(item) {
				// console.log(item)
				this.$router.push({
					path: '/keepfitdealwithDetail',
					query: {
						data: encodeURI(JSON.stringify(item))
					}
				})
			},
			//获取数据
			getData() {
				this.loading = true
				this.$axios.post('/d/maintainHistory/queryByExecutor', this.jsonData).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data.content)
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
								if (that.$refs.maintainpending!=undefined) {
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
							if (that.jsonData.pageSize == number) {
								// console.log('大西瓜')
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
	.keepfitdealwith {
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
		width: 4.5rem;
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
