<template>
	<div class="sparePart">
		<van-tabs v-model="getsparePart" @click="onClick">
			<van-tab title="待处理" name="1">
				<pending></pending>
			</van-tab>
			<van-tab title="已处理" name="2">
				<dealwith></dealwith>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
	import dealwith from './dealWith/index.vue'
	import pending from './pending/index.vue'
	export default {
		name: "sparePart",
		components: {
			dealwith,
			pending
		},
		data() {
			return {
				activeName: '1'
			};
		},
		computed: {
			getsparePart: {
				get: function () {
					return this.$store.state.sparePart
				},
				set: function () {
					
				}
			}
			// getsparePart () {
			// 	return this.$store.state.sparePart
			// }
		},
		mounted() {
			// console.log( this.getsparePart)
			this.$nextTick(()=>{
				// this.activeName = this.getsparePart
				this.$bus.emit("sparePartshowTag", this.getsparePart)
			})
		},
		created() {
			let that = this
			//其他页面跳转
			// this.$bus.on('maintainShow', function(e) {
			// 	console.log(e)
			// })
		},
		destroyed: function() {
			//console.log('销毁了showMaintain')
			this.$bus.off()
		},
		methods: {
			onClick(name, title) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					console.log(title)
					this.$store.commit('getsparePart',name)
					this.$bus.emit("sparePartshowTag", name)
				}, 300) // 大概时间300ms

			}
		}
	}
</script>

<style scoped>
	.sparePart {
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
</style>
