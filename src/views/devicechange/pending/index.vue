<template>
	<div class="maintainpending" ref="maintainpending">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<van-cell v-for="(item,index) in list" :key="index" :title="item.title" size="70px" :label="`设备位置:${item.count}`"
				 :value="item.value" center is-link @click="gotodetail(item)">
				</van-cell>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	export default {
		name: "maintainpending",
		components: {},
		data() {
			return {
				showheight: document.body.clientHeight - 50 + 'px',
				jsonData: {
					userId: localStorage.getItem('userId'),
					deploymentName: 'workNote',
					isFinish: 0,
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
			this.$bus.on('showdevicechange', function(e) {
				if (e === '1') {
					that.list = []
					that.onRefresh()

				}
			})
		},
		methods: {
			gotodetail(item) {},
			//获取数据
			getData() {},
			onLoad() {
				setTimeout(() => {
					if (this.refreshing) {
						this.list = [];
						this.refreshing = false;
					}
				
					for (let i = 0; i < 10; i++) {
						this.list.push({
							title: '传感器hfahfk777777',
							count: i + '个',
							name: 'passed',
							value: '进度表示2'
						});
					}
					this.loading = false;
				
					if (this.list.length >= 40) {
						this.finished = true;
					}
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
	.maintainpending {
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
