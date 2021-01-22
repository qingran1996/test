<template>
	<div id="app">
		<headershow v-if="isshow"></headershow>
		<transition :name="transitionName">
			<keep-alive>
				<router-view v-if="!$route.meta.keepAlive"></router-view>
			</keep-alive>
		</transition>

		<transition :name="transitionName">
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</transition>

		<van-tabbar v-show="isbottomshow" route>
			<van-tabbar-item replace to="/index" icon="wap-home-o">
				首页
			</van-tabbar-item>
			<van-tabbar-item replace to="/my" icon="friends-o">
				我的
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import headershow from './components/Header.vue'
	export default {
		name: 'App',
		components: {
			headershow
		},
		data() {
			return {
				isshow: true, //顶部展示
				isbottomshow: false,
				transitionName: ''
			}
		},
		watch: {
			$route(to, from) {
				//console.log(to.meta.index, from.meta.index)
				if (to.meta.index > from.meta.index) {
					//设置动画名称
					this.transitionName = 'van-fade';
				} else {
					this.transitionName = 'van-fade';
				}
				this.$store.commit('gettitle', to.name)
				this.$store.commit('geturl', to.path)
				if (to.name === 'login') {
					this.isshow = false
					//this.transitionName = 'slide-left';
				} else {
					this.isshow = true
					//this.transitionName = 'slide-right';
				}
				if (to.name === '二维码扫描') {
					//console.log('进入二维码扫描')
					this.$bus.emit('cameraShow', true)
					this.transitionName = '';
				} else {
					//console.log('离开二维码扫描')
					this.$bus.emit('cameraShow', false)
				}
				if (to.name === '我的' || to.name === '方兴EAM管理系统') {
					this.isbottomshow = true
					//	this.transitionName = 'slide-left';
				} else {
					this.isbottomshow = false
					//this.transitionName = 'slide-right';
				}
			}
		}
	}
</script>
<style lang="scss">
	/*一些全局样式*/
	.van-pull-refresh {
		overflow: unset !important;
	}

	// .van-cell {
	// 	font-size: 14px !important;
	// }
	// .van-field>>>.van-field__control {
	// 	font-size: 14px !important;
	// }
	// .van-pull-refresh__track {
	// 	height: 100%;
	// }

	/*一些全局样式*/
	body,
	html {
		width: 100%;
		height: 100%;
		margin: 0px;
	}

	* {
		padding: 0;
		margin: 0;
		// overflow: hidden;
	}

	#app {
		width: 100%;
		height: 100%;
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		overflow: hidden;
	}

	#nav {
		padding: 30px;

		a {
			font-weight: bold;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}

	#app>>>.van-tabbar {
		height: 50px !important;
	}

	.slide-right-enter-active,
	.slide-right-leave-active,
	.slide-left-enter-active,
	.slide-left-leave-active {
		will-change: transform;
		transition: all .3s;
		position: absolute;
		width: 100%;
		left: 0;
	}

	
</style>
