<template>
	<div class="keepfit">
		<van-tabs v-model="getchange" @click="onClick">
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
		name: "keepfit",
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
			getchange: {
				get: function () {
					return this.$store.state.change
				},
				set: function () {
					
				}
			}
		},
		mounted() {
			this.$nextTick(()=>{
				this.$bus.emit("showdevicechange", this.getchange)
			})
		},
		created() {
			
		},
		destroyed: function() {
			this.$bus.off()
		},
		methods: {
			onClick(name, title) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					//console.log(title)
					this.$store.commit('getchange',name)
					this.$bus.emit("showdevicechange", name)
				}, 300) // 大概时间300ms
			}
		}
	}
</script>

<style scoped>
	.keepfit {
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
