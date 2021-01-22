<template>
	<div class="work">
		<van-tabs v-model="getwork" @click="onClick">
			<van-tab :title="leftname" name="0">
				<pending></pending>
			</van-tab>
			<van-tab :title="rightname" name="1">
				<dealwith></dealwith>
			</van-tab>
		</van-tabs>
		<div class="bottomshow">
			<van-tabbar v-model="active" @change="onChange">
				<van-tabbar-item>
					<span>我申请的</span>
					<template #icon="props">
						<img :src="props.active ? askpic.yes : askpic.no" />
					</template>
				</van-tabbar-item>
				<van-tabbar-item>
					<span>我审核</span>
					<template #icon="props">
						<img :src="props.active ? checkpic.yes : checkpic.no" />
					</template>
				</van-tabbar-item>
			</van-tabbar>
		</div>
	</div>
</template>

<script>
	import dealwith from './dealWith/index.vue'
	import pending from './pending/index.vue'
	export default {
		name: "work",
		components: {
			dealwith,
			pending
		},
		data() {
			return {
				activeName: '1',
				active: 0,
				leftname: '未结束',
				rightname: '已结束',
				askpic: {
					yes: require('../../assets/small_icon/ask_yes.png'),
					no: require('../../assets/small_icon/ask_no.png')
				},
				checkpic: {
					yes: require('../../assets/small_icon/check_yes.png'),
					no: require('../../assets/small_icon/check_no.png')
				},
			};
		},
		computed: {
			getwork: {
				get: function() {
					return this.$store.state.work
				},
				set: function() {

				}
			},
			getworkactive: {
				get: function() {
					return this.$store.state.workactive
				},
				set: function() {
			
				}
			}
		},
		created() {
			// let that = this
			// this.$bus.on('worktagpp', function(e) {
			// 	that.getwork = e.getwork
			// 	that.active = e.actve
			// })
		},
		mounted() {
			this.$nextTick(() => {
				// console.log(this.getworkactive,this.getwork)
				this.active = this.getworkactive
				this.leftname = this.getworkactive===0?'未结束':'待处理'
				this.rightname = this.getworkactive===0?'已结束':'已处理'
				// console.log(this.$store.state.work,'开始执行')
				this.$bus.emit("workshowTag", {getwork: this.getwork, index: this.active})
			})
		},
		destroyed: function() {
			this.$bus.off()
		},
		methods: {
			onChange(index) {
				// console.log(index)
				this.leftname = index===0?'未结束':'待处理'
				this.rightname = index===0?'已结束':'已处理'
				this.$store.commit('getworkactive', index)
				this.$bus.emit("workshowTag", {getwork: this.getwork, index: this.active})
			},
			onClick(name, title) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					// console.log(title,name,this.$store.state.work)
					this.$store.commit('getwork', name)
					this.$bus.emit("workshowTag", {getwork: name, index: this.active})
				}, 300) // 大概时间300ms

			}
		}
	}
</script>

<style scoped>
	.work {
		height: 100%;
	}

	.van-tabs>>>.van-tabs__wrap {
		height: 50px !important;
	}

	.bottomshow {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 50px;
		border-top: 1px solid lightgrey;
		left: 0;
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
