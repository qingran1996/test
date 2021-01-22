<template>
	<div class="index" style="height: 100%;">
		<van-grid :column-num="3" :border="false">
			<van-grid-item v-for="(item,index) in data" :key="index" @click="gotoGrid(item.url)">
			    <van-image width="68" height="68" :src="item.img" />
				<div class="textshow">{{item.text}}</div>
			  </van-grid-item>
		</van-grid>
		<!-- <button @click="gotomaintain">测试跳转</button> -->
	</div>
</template>

<script>
	export default {
		name: "index",
		components: {

		},
		data() {
			return {
				active: 0,
				data: []
			}
		},
		mounted() {
			let data = JSON.parse(decodeURI(localStorage.getItem('routerlist')))['2']
			
			for(let i=0;i<data.length;i++) {
				this.data.push({
					img: require('../assets/homeimg/'+data[i].icon),
					text: data[i].name,
					url: data[i].url
				})
			}
			// console.log(this.data)
			this.$store.commit('getmaintain','1') //将维修标签置1
			this.$store.commit('getsparePart','1') //将备品备件标签置1
			this.$store.commit('getwork','0') //将作业票标签置0
			this.$store.commit('getworkactive', 0) //
			this.$store.commit('getkeepfit','1') //将保养标签置1
			this.$store.commit('getchange','1') //将设备变更标签置1
			
			// for(let i=0;i<item.length;i++) {
			// 	if (item[i].localName=='div'&&item[i].className=='abcd') {
			// 		item[i].style.display = 'block'
			// 	} else {
			// 		item[i].style.display = 'none'
			// 	}
			// }
		},
		methods: {
			getdata () {
				this.$router.push({
					path: "/device",
					query: {
						id: '89'
					}
				})
			},
			gotomaintain() {
				//sessionStorage.setItem('maintainTag', 1)
				this.$router.push(`/maintain`)
			},
			gotoGrid (url) {
				console.log(url)
				// if (url==='/maintain') {
				// 	this.$store.commit('getmaintain', '1')
				// }
				this.$router.push(
					{
						path: url
					}
				)
			},
		}
	};
</script>
<style scoped>
	.my-swipe .van-swipe-item {
		color: #fff;
		font-size: 20px;
		line-height: 150px;
		text-align: center;
		background-color: #39a9ed;
	}
	.textshow {
		margin: 10px 0;
	}
	/* .van-grid>>>.van-grid-item {
		flex-basis: 25% !important;
	} */
</style>
