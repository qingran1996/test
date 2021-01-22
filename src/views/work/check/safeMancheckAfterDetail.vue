<template>
	<div class="safeMancheckAfterDetail">
		<van-form ref="addform">
			<van-field class="fieldbottom" v-model="addForm.workLevel" name="workLevel" label="作业票级别" placeholder="请选择作业票级别"
			 disabled></van-field>
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
			<van-field v-model="addForm.isThree" name="isThree" label="检测机构" placeholder="" disabled></van-field>
			<van-field v-model="addForm.checkman" name="checkman" label="检测人" placeholder="" disabled></van-field>
			<van-field v-model="addForm.checkphone" center disabled label="联系电话"></van-field>
			<van-cell title="气体检测" center>
			  <template #default>
			    <van-tag color="#fff" text-color="lightskyblue" size="large">
					<span @click="gotogus" v-if="addForm.oneDetectResult.length==0">待检测</span>
					<span v-else-if="addForm.oneDetectResult[addForm.oneDetectResult.length-1].detectResult==1">合格</span>
					<span v-else>不合格</span>
				</van-tag>
			  </template>
			  <template #right-icon >
			      <van-icon v-show="addForm.oneDetectResult.length==0" name="arrow" class="search-icon" />
			    </template>
			</van-cell>
			<van-field name="isNeedCheck" placeholder="" v-model="addForm.isNeedCheck==1?'是':'否'" label="是否需要持续监测" disabled>
			 <!-- <template #input>
			    <van-radio-group style="margin: 0 auto;" v-model="addForm.isNeedCheck" direction="horizontal">
			          <van-radio name="1">是</van-radio>
			          <van-radio name="2">否</van-radio> 
			        </van-radio-group>
			  </template> -->
			</van-field>
			<van-field class="fieldbottom" v-model="addForm.checkrate" name="checkrate" label="检测频率(分钟)" placeholder="请输入检测频率" disabled></van-field>
			
			<van-field class="bottomnone" v-model="addForm.dangercontent" center disabled label="危险辨识内容"></van-field>
			<van-cell v-show="gascontentList.length!=0" value="内容">
				<van-row gutter="10">
					<van-col v-for="(item,index) in gascontentList" :key="index" style="text-align: center;margin-bottom: 10px;" span="24">
						<van-tag class="gassafeshow" style="padding: 5px 10px;text-align: left;width: 90%;" color="rgb(246,247,251)" text-color="rgba(0,0,0,0.8)"
						 size="large" type="primary">
							<span style="width: 90%;">{{item}}</span>
						</van-tag>
					</van-col>
				</van-row>
			</van-cell>
			<van-field v-model="addForm.dangerman" name="dangerman" label="危险辨识负责人" placeholder="危险辨识负责人" disabled></van-field>
			<!-- <van-field required v-model="addForm.dangerman" class="chooseleft" name="dangerman" label="危险辨识负责人" placeholder="请选择人员"
			 clickable readonly @click="showPicker4=true" :rules="rule" is-link></van-field> -->
			<van-field v-model="addForm.dangerphone" center disabled label="联系电话"></van-field>
			<van-cell style="margin-bottom: 10px;" title="危险辨识" center="">
			  <template #default>
			    <van-tag color="#fff" text-color="lightskyblue" size="large">
					<span @click="gotodanger" v-if="addForm.isSafe==null">待检测</span>
					<span v-else-if="addForm.isSafe==1">合格</span>
					<span v-else>不合格</span>
				</van-tag>
			  </template>
			  <template #right-icon >
			      <van-icon v-show="addForm.isSafe==null" name="arrow" class="search-icon" />
			    </template>
			</van-cell>
			<van-field v-show="addForm.isSafe!=null&&addForm.oneDetectResult.length!=0" style="margin-bottom: 10px;" required v-model="addForm.safelookman" class="fieldtype" name="homeworkLevel" label="选择安巡员" placeholder="请选择安巡员"
			 clickable readonly @click="showPicker1=true" :rules="rule" is-link></van-field>
			
		</van-form>
		<div class="submit" v-show="addForm.isSafe!=null&&addForm.oneDetectResult.length!=0">
			<!-- <van-button round block type="danger" @click="submit(0)">
				结束作业
			</van-button> -->
			<van-button style="margin-left: 20px;" @click="submit(1)" round block type="info">
				现场确认
			</van-button>
		</div>
		<signwrite :jobLevel="addForm.workLevelcode" :jobTypeCode="addForm.workTypecode"></signwrite>
		<!--下拉选择1234-->
		<van-popup v-model="showPicker1" position="bottom">
			<van-picker show-toolbar :columns="columns1.name" @confirm="onConfirm1" @cancel="showPicker1 = false" />
		</van-popup>
		<van-popup v-model="showPicker2" position="bottom">
			<van-picker show-toolbar :columns="columns2" @confirm="onConfirm2" @cancel="showPicker2 = false" />
		</van-popup>
		<van-popup v-model="showPicker3" position="bottom">
			<van-picker show-toolbar :columns="columns3" @confirm="onConfirm3" @cancel="showPicker3 = false" />
		</van-popup>
		<van-popup v-model="showPicker4" position="bottom">
			<van-picker show-toolbar :columns="columns4" @confirm="onConfirm4" @cancel="showPicker4 = false" />
		</van-popup>
	</div>
</template>

<script>
	import signwrite from '../../../components/sign.vue'
	export default {
		name: "safeMancheckAfterDetail",
		data () {
			return {
				addForm: {
					workLevel: '',
					workLevelcode: '', //作业票级别code
					workTypecode: '', //作业类型code
					gasType: '',
					isThree: '',
					checkhouse: '',
					isNeedCheck: '',
					checkrate: '',
					checkman: '',
					checkphone: '',
					dangercontent: '',
					dangerman: '',
					dangerphone: '',
					isSafe: 1,
					oneDetectResult: [],
					safelookman: '',
					safelookmanId: ''
				},
				rule: [{
					required: true
				}], // 校验规则
				jwDetectMatterBoList: [],
				gascontentList:[],
				showPicker1: false,
				columns1: {
					name: [],
					all: []
				},
				showPicker2: false,
				columns2: ['苏州气体', '南京气体'],
				showPicker3: false,
				columns3: ['芳芳', '大西瓜'],
				showPicker4: false,
				columns4: ['黄阳', '大西瓜皮'],
				leader: null,
				isConfirm: 1,
				leadercheck: {
					index: 0,
					text: '安全员',
					goway: 1,
					value: '',
					writeType: 0, // 0是还未签名
					address: '', //地址
					jd: '', //精度
					wd: '', //纬度
					fileId: '', //文件id
					fileName: '', //文件名
					filepath: '', //文件路径
					design: 0, //验证身份
					fieldshow: '' //工具人字段
				}
			}
		},
		components: {
			signwrite
		},
		created() {
			
		},
		destroyed() {
			this.$bus.off()
		},
		mounted() {
			let data = JSON.parse(decodeURI(this.$route.query.data))
			this.leader = data
			this.getsafelookman()
			// console.log(data)
			this.getdetail(data)
			
			this.$bus.on('signshow', e => { //走流程的过程：领导
				// console.log(e)
				let json = {
					processInstanceId: this.leader.processInstanceId,
					taskId: this.leader.taskId,
					bussinessId: this.leader.bussinessId,
					isSafe: this.addForm.isSafe,
					oneDetectResultBos: [{
						detectTypeCode: '001',
						detectTypeCodeName: '气体检测',
						isContinue: this.addForm.isNeedCheck=='1'?1:0,
						detectResult: this.addForm.oneDetectResult[this.addForm.oneDetectResult.length-1].detectResult==1?1:0,
						frequency: this.addForm.checkrate
					}],
					isConfirm: this.isConfirm,
					safetyPatrolId: this.addForm.safelookmanId,
					safetyPatrolName: this.addForm.safelookman,
					saferLiveConfirmSid: e.fileId
				}
				console.log(json)
				this.$axios.post('/w/jobWork/liveConfirm', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							this.$router.push("/work")
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			})
		},
		methods: {
			//跳转危险辨识
			gotodanger() {
				this.$router.push({
					path: '/dangerTagged',
					query: {
						data: encodeURI(JSON.stringify(this.leader)),
						jwDetectMatterBoList: encodeURI(JSON.stringify(this.jwDetectMatterBoList))
					}
				})
			},
			//跳转气体
			gotogus () {
				this.$router.push({
					path: '/guscheck',
					query: {
						data: encodeURI(JSON.stringify(this.leader)),
						jwDetectMatterBoList: encodeURI(JSON.stringify(this.jwDetectMatterBoList)),
						isFirst: 1
					}
				})
			},
			getsafelookman () {
				let json = {
					phase: 5
				}
				// this.sparePartData = []
				this.columns1 = {
					name: [],
					all: []
				}
				this.$axios.post('/w/jobWork/getNextAssigent', json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							for (let i=0;i<data.length;i++) {
								this.columns1.name.push(data[i].userName)
								this.columns1.all.push(data[i])
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			submit (num) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					console.log(num)
					if (this.addForm.safelookman=='') {
						this.$toast('请选择安巡员')
					} else {
						this.isConfirm = num
					this.$bus.emit('signwrite', this.leadercheck)
					}
					
				}, 300) // 大概时间300ms
			},
			getdetail(data) {
				let json = {
					bussinessId: data.bussinessId
				}
				// this.sparePartData = []
				this.$axios.post('/w/jobWork/getAllDetectResult',json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							this.addForm.workLevel = data.jobLevelName
							this.addForm.workLevelcode = data.jobLevel
							this.addForm.workTypecode = data.jobTypeCode
							this.jwDetectMatterBoList = data.detectResultBoList
							this.addForm.isThree = data.detectResultBoList[0].detectManager.doName
							this.addForm.checkman = data.detectResultBoList[0].detectManager.doManagerName!=''?data.detectResultBoList[0].detectManager.doManagerName:data.detectResultBoList[0].detectManager.detectManagerName
							this.addForm.checkphone = data.detectResultBoList[0].detectManager.doManagerTel!=''?data.detectResultBoList[0].detectManager.doManagerTel:data.detectResultBoList[0].detectManager.detectManagerTel
							this.addForm.checkrate = data.detectResultBoList[0].oneDetectResult.length!=0?data.detectResultBoList[0].oneDetectResult[0].frequency:''
							this.addForm.isNeedCheck = data.detectResultBoList[0].oneDetectResult.length!=0?data.detectResultBoList[0].oneDetectResult[0].isContinue:''
							this.gascontentList = data.jwDangerIdentityNames
							this.addForm.dangerman = data.protectManagerName
							this.addForm.dangerphone = data.protectManagerTel
							this.addForm.isSafe = data.isSafe
							this.addForm.oneDetectResult = data.detectResultBoList[0].oneDetectResult
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			
			},
			onConfirm1 (event) {
				console.log(event)
				this.addForm.safelookman = event
				this.showPicker1 = false
				for (let i = 0; i < this.columns1.all.length; i++) {
					if (event == this.columns1.all[i].userName) {
						// console.log(this.columns3.all[i].code)
						this.addForm.safelookmanId = this.columns1.all[i].userId
						
					}
				}
			},
			onConfirm2 (event) {
				//console.log(event)
				this.addForm.checkhouse = event
				this.showPicker2 = false
			},
			onConfirm3 (event) {
				//console.log(event)
				this.addForm.checkman = event
				this.showPicker3 = false
			},
			onConfirm4 (event) {
				// console.log(event)
				this.addForm.dangerman = event
				this.showPicker4 = false
			}
		}
	};
</script>
<style scoped>
	.safeMancheckAfterDetail {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}
	.submit {
		display: flex;
		width: 80%;
		margin: 2% 10%;
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
	.fieldtype>>>.van-field__control {
		text-align: center;
	}
	.fieldbottom {
		margin-bottom: 10px;
	}
	.bottomnone::after {
		border-bottom: 0;
	}
</style>
