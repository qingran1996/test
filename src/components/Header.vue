<template>
	<div class="headershow">
		<van-nav-bar @click-left="onClickLeft" @click-right="onClickRight">
			<van-icon size="26" v-if="showtitle!='方兴EAM管理系统'&&showtitle!='我的'&&showtitle!='二维码扫描'" name="arrow-left" slot="left" />
			<slot slot="title" name="">{{showtitle}}</slot>
			<van-icon v-if="showurl=='/index'" name="scan" slot="right" size="28" />
			<van-icon v-else-if="showurl=='/work'" name="plus" slot="right" size="28" />
		</van-nav-bar>
	</div>
</template>

<script>
	export default {
		name: "headershow",
		components: {

		},
		data() {
			return {

			}
		},
		computed: {
			showtitle() {
				return this.$store.state.title
			},
			showurl() {
				return this.$store.state.url
			}
		},
		mounted() {
			//console.log(this.$store.state)
		},
		methods: {
			onClickLeft() {
				
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					if (!this.$route.meta.back) {
						this.$router.push('/index')
					} else {
						this.$router.go(-1)
					}
				}, 300) // 大概时间300ms
				
				
			},
			onClickRight() {
				// console.log(this.showurl)
				if (this.showurl === '/index') {
					this.$router.push(`/camera`)
				} else {
					this.$router.push('/addwork')
				}
				//测试跳转
				// this.$router.push({
				// 	path: "/device",
				// 	query: {
				// 		id: 98
				// 	}
				// })
				
				
			},
		}
	};
</script>
<style scoped>
	.van-nav-bar {
		background-color: white;
	}

	.van-nav-bar>>>.van-nav-bar__title {
		color: #000000;
		font-weight: 550;
	}

	.van-nav-bar .van-icon {
		color: #000000 !important;
		z-index: 9999;
	}

	.headershow>>>.van-nav-bar {
		height: 50px;
		z-index: 9999;
		font-weight: bold;
	}
</style>
