<template>
	<div class="gusContinue">
		<van-form ref="addform" @submit="submit">
			<van-cell-group v-show="jwDetectMatterBoList.length!=0">
				<van-cell v-for="(item,index) in jwDetectMatterBoList" :key="index" value="内容">
					<template #title style="text-align: left;">
						<span class="custom-title">气体监测内容</span>
					</template>
					<template #default>
						<span v-for="(items,index) in item.detectMatters" :key="index" class="custom-title">
							{{items}}
							<span v-if="index==item.detectMatters.length-1"></span>
							<span v-else>,</span>
						</span>
					</template>
				</van-cell>
			</van-cell-group>
			<!-- <van-field v-model="addForm.gasType" name="gasType" label="气体监测内容" placeholder="气体监测内容" disabled></van-field> -->
			<van-field v-model="addForm.isThree" name="isThree" label="检测机构" placeholder="检测机构" disabled></van-field>
			<van-field v-model="addForm.checkman" name="checkman" label="检测人" placeholder="检测人" disabled></van-field>
			<van-field v-model="addForm.checkphone" center disabled label="联系电话"></van-field>
			<!-- <van-field class="fieldbottom" v-model="addForm.checkrate" name="checkrate" label="检测频率" placeholder="检测频率" disabled></van-field> -->
			<van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">持续监测记录</van-divider>
			<van-cell-group>
				<van-cell @click="gotonav(item)" v-for="(item,index) in oneDetectResult" :title="formatDate(item.createTime)" is-link>
					<template #default>
						<span v-if="item.detectResult==1" class="custom-title" style="color: #39A9ED;">合格</span>
						<span v-else class="custom-title" style="color: red;">不合格</span>
					</template>
				</van-cell>
			</van-cell-group>
			<div v-show="isContinue==1&&isSafeMan" class="addplus" @click="addcs">
				<van-icon name="add" size="20" color="rgb(2,167,240)" /> <span>添加监测记录</span>
			</div>
			<!-- <div class="buttomshow">
				<van-button round block type="danger" native-type="submit">
					结束作业
				</van-button>
				<van-button round block type="info" native-type="submit">
					完成监测
				</van-button>
				<van-button round block type="info" native-type="submit">
					继续监测
				</van-button>
			</div> -->
		</van-form>
	</div>
</template>

<script>
	export default {
		name: "gusContinue",
		data() {
			return {
				addForm: {
					gasType: '',
					isThree: '',
					checkman: '',
					checkphone: '',
					checkrate: ''
				},
				rule: [{
					required: true
				}], // 校验规则
				leader: null,
				jwDetectMatterBoList: [],
				isContinue: null,
				isSafeMan: false,
				oneDetectResult: [], //气体检测记录
			}
		},
		components: {

		},
		mounted() {
			let data = JSON.parse(decodeURI(this.$route.query.data))
			console.log(data)
			// console.log(JSON.parse(decodeURI(this.$route.query.id)))
			if (localStorage.getItem('userId')==JSON.parse(decodeURI(this.$route.query.id))) {
				console.log('是安全员')
				this.isSafeMan = true
			} else {
				console.log('不是安全员')
				this.isSafeMan = false
			}
			this.leader = data
			this.getdetail(data)
		},
		methods: {
			//前往单个检测详情
			gotonav (item) {
				console.log(item)
				this.$router.push({
					path: '/guscontinuedetail',
					query: {
						data: encodeURI(JSON.stringify(item))
					}
				})
			},
			//添加气体检测
			addcs () {
				this.$router.push({
					path: '/guscheck',
					query: {
						data: encodeURI(JSON.stringify(this.leader)),
						jwDetectMatterBoList: encodeURI(JSON.stringify(this.jwDetectMatterBoList)),
						isFirst: 0
					}
				})
			},
			getdetail(data) {
				let json = {
					bussinessId: data.bussinessId
				}
				// this.sparePartData = []
				this.$axios.post('/w/jobWork/getDetectInfo', json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							this.jwDetectMatterBoList = data
							this.isContinue = data[0].isContinue
							this.addForm.isThree = data[0].detectManager.doName
							this.addForm.checkman = data[0].detectManager.detectManagerName!=''?data[0].detectManager.detectManagerName:data[0].detectManager.doManagerName
							this.addForm.checkphone = data[0].detectManager.detectManagerTel!=''?data[0].detectManager.detectManagerTel:data[0].detectManager.doManagerTel
							this.addForm.checkrate = data[0].frequency
							this.oneDetectResult = data[0].oneDetectResult

						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})

			},
			submit(form) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					console.log(form)
				}, 300) // 大概时间300ms
			}
		}
	};
</script>
<style scoped>
	.gusContinue {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.van-cell>>>.van-field__label {
		color: #242424;
		width: auto;
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.van-cell__title {
		text-align: left;
	}

	.chooseleft>>>.van-field__control {
		text-align: center;
	}

	.fieldbottom {
		margin-bottom: 10px;
	}

	.bottomnone::after {
		border-bottom: 0;
	}

	.addplus {
		font-size: 14px;
		cursor: pointer;
		display: inline-flex;
		margin: 15px auto;
		color: rgb(2, 167, 240);
	}

	.addplus span {
		margin-left: 5px;
	}

	.buttomshow {
		display: flex;
		width: 90%;
		margin: 10% 5%;
	}

	.buttomshow button {
		margin: 0 5px;
	}
</style>
