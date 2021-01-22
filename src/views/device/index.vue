<template>
	<div class="device">
		<van-grid :column-num="3" :border="false">
			<van-grid-item v-for="(item,index) in data" :key="index" @click="gotoGrid(item)">
				<van-image :src="item.img" />
				<div class="textshow">{{item.text}}</div>
			</van-grid-item>
		</van-grid>
		<van-cell-group>
			<van-cell value="设备信息" class="infofirst" />
			<div v-show="deviceInfo.length==0" class="showtext">{{showtext}}</div>
			<van-cell :title="item.title" :value="item.text" v-for="(item,index) in deviceInfo" :key="index" />
		</van-cell-group>
		<van-cell-group>
			<van-cell value="履历信息" class="infofirst" />
			<van-steps direction="vertical" :active="0">
				<van-step>
					<h3>保养</h3>
					<p>2016-07-12 12:40</p>
				</van-step>
				<van-step>
					<h3>投入使用</h3>
					<p>2016-07-11 10:00</p>
				</van-step>
				<van-step>
					<h3>初检</h3>
					<p>2016-07-10 09:30</p>
				</van-step>
				<van-step>
					<h3>验收</h3>
					<p>2016-07-08 09:30</p>
				</van-step>
			</van-steps>
		</van-cell-group>
	</div>
</template>

<script>
	export default {
		name: "device",
		data() {
			return {
				showheight: document.body.clientHeight - 60 + 'px',
				current: 0,
				showtext: '',
				data: [{
					img: require('../../assets/homeimg/1.png'),
					text: '发起维修',
					url: '/maintainAdd'
				}],
				deviceId: null,
				jsonData: {
					id: 3
				},
				deviceInfo: []
			};
		},
		mounted() {
			// console.log(this.$route.query.data)
			this.getData(this.$route.query.id) //获取详情接口
			// this.getshow(this.$route.query.id)
			// this.getData(3)
		},
		methods: {
			getshow (id) {
				let ids = {
					id: id
				}
				this.$axios.post('/w/equipmentMaintenanceBussiness/isApplyEM', ids).then(res => {
					if (res.data.code === 0) {
						let num = res.data.data
						if (num == 3 || num == 5) {
							this.$toast('该设备无法发起维修流程')
						} else {
							console.log(num)
							this.getData(id)
						}
					} else {
						this.$toast(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			gotoGrid(data) {
				if (data.text==='发起维修') {
					let ids = {
						id: this.$route.query.id
					}
					this.$axios.post('/w/equipmentMaintenanceBussiness/isApplyEM', ids).then(res => {
						//alert(res.data.data)
						if (res.data.code === 0) {
							let num = res.data.data
							if (num == 3 || num == 5) {
								this.$toast('该设备无法发起维修流程')
							} else {
								this.$router.push({
									path: data.url,
									query: {
										id: this.deviceId,
										kks: this.deviceInfo[1].text,
										area: this.deviceInfo[4].text
									}
								})
							}
						} else {
							this.$toast(res.data.message)
						}
					}).catch(err => {
						console.log(err)
					})
				}
				
			},
			getData(id) {
				let json = {
					id: id
				}
				this.$axios.post('/d/device/getDetailById', json).then(res => {
					if (res.data.code === 0) {
						console.log(res.data.data.device)
						let data = res.data.data.device
						this.$toast(res.data.message);
						this.$store.commit('gettitle', data.deviceName)
						this.deviceId = data.id
						this.deviceInfo = [{
								title: '设备名称',
								text: data.deviceName
							},
							{
								title: '设备位号',
								text: data.deviceKks
							},
							{
								title: '资产编号',
								text: data.assetCode
							},
							{
								title: '规格型号',
								text: data.specificationModel
							},
							{
								title: '安装位置',
								text: data.installAreaName
							},
							{
								title: '设备类型',
								text: data.deviceTypeName
							},
							{
								title: '是否特种设备',
								text: data.isSpecial==1?'是':'否'
							},
						]
					} else {
						this.$toast(res.data.message);
						this.showtext = res.data.message
						this.$store.commit('gettitle', '')
					}
				})
			}
		}
	}
</script>

<style scoped>
	.van-step--vertical {
		overflow: unset;
	}
	.showtext {
		font-size: 16px;
	}
	.textshow {
		margin: 10px 0 0 0;
	}

	.device {
		background-color: rgb(240, 247, 255);
		padding: 10px;
		height: calc(100% - 70px);
		overflow-y: scroll;
	}

	.van-grid>>>.van-grid-item__content--center {
		background-color: rgb(240, 247, 255);
	}

	.infofirst span {
		color: black !important;
		font-weight: bold;
	}

	.infofirst::after {
		border-bottom: 0;
	}

	.van-cell__title {
		text-align: left;
	}

	.van-cell-group {
		margin-bottom: 10px;
	}

	.van-step {
		font-size: 12px;
	}

	.van-step>>>.van-step__circle-container {
		left: 40px;
		font-size: 14px;
	}

	.van-step>>>.van-step__line {
		left: 40px;
	}
</style>
