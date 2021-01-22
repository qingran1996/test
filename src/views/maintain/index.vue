<template>
	<div class="maintain">
		<van-tabs v-model="getmaintainTag" @click="onClick">
			<van-tab title="待处理" name="1">
				<pending></pending>
			</van-tab>
			<van-tab title="已处理" name="2">
				<dealwith></dealwith>
			</van-tab>
		</van-tabs>
		<!-- <van-overlay :show="show" @click="show = false">
		  <div class="wrapper" @click.stop>
		    <van-loading type="spinner" color="#1989fa" />
		  </div>
		</van-overlay> -->
	</div>
</template>

<script>
	import dealwith from './dealWith/index.vue'
	import pending from './pending/index.vue'
	export default {
		name: "maintain",
		components: {
			dealwith,
			pending
		},
		data() {
			return {
				activeName: '1',
				show: false
			};
		},
		computed: {
			getmaintainTag: {
				get: function () {
					return this.$store.state.maintain
				},
				set: function () {
					
				}
			}
		},
		mounted() {
			this.$nextTick(()=>{
				this.$bus.emit("showMaintain", this.getmaintainTag)
			})
		},
		created() {
			// let that = this
			// //其他页面跳转
			// this.$bus.on('maintainShow', function(e) {
			// 	console.log(e)
			// })
		},
		destroyed: function() {
			// console.log('销毁了showMaintain')
			this.$bus.off()
		},
		methods: {
			onClick(name, title) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					//console.log(title)
					this.$store.commit('getmaintain',name)
					this.$bus.emit("showMaintain", name)
				}, 300) // 大概时间300ms
			}
		}
	}
</script>

<style scoped>
	.maintain {
		height: 100%;
	}

	.van-tabs>>>.van-tabs__wrap {
		height: 50px !important;
	}

	.van-tabs {
		height: 100%;
	}

	.van-tabs>>>.van-tabs__content {
		height: 100%;
	}

	.van-tabs>>>.van-tab__pane {
		height: 100%;
	}
	.wrapper {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    height: 100%;
	  }
	
	  .block {
	    width: 120px;
	    height: 120px;
	    background-color: #fff;
	  }
</style>
