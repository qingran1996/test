<template>
	<div class="safeMancheck">
		<van-form ref="addform">
			<!-- <van-field  v-model="addForm.scode" name="1" label="设备单号" placeholder="填写设备单号" :rules="rules"></van-field> -->
			<van-field v-model="addForm.worknum" name="worknum" label="作业票编号" placeholder="请输入作业票编号" disabled></van-field>
			<van-field v-model="addForm.workordernum" name="workordernum" label="工单编号" placeholder="请选择工单编号" disabled></van-field>
			<van-field v-model="addForm.workType" class="fieldtype" name="workType" label="作业类型" placeholder="请选择作业类型" disabled></van-field>
			<van-field v-model="addForm.workLevel" class="fieldtype" name="workLevel" label="作业票级别" placeholder="请选择作业票级别"
			 disabled></van-field>
			<van-field v-model="addForm.workDept" name="workDept" label="作业地点\部门" placeholder="请输入作业地点\部门" disabled></van-field>
			<van-field class="contenttype" v-model="addForm.workContent" name="workContent" label="作业内容" placeholder="请输入作业内容"
			 type="textarea" autosize disabled></van-field>
			<van-field v-model="addForm.applyerdept" name="applyerdept" label="申请部门" placeholder="" disabled></van-field>
			<van-field v-model="addForm.applyer" name="applyer" label="申请人" placeholder="" disabled></van-field>
			<van-field v-model="addForm.applytime" class="fieldmargin" name="applytime" label="申请时间" placeholder="" disabled></van-field>
			<van-cell-group v-show="jwDetectMatterBoList.length!=0">
				<van-cell v-for="(item,index) in jwDetectMatterBoList" :key="index" value="内容">
					<template #title style="text-align: left;">
						<span class="custom-title">{{item.detectTypeCodeName}}</span>
					</template>
					<template #default>
						<span v-for="(items,index) in item.detectMatterBos" :key="index" class="custom-title">
							{{items.detectMatter}}
							<span v-if="index==item.detectMatterBos.length-1"></span>
							<span v-else>,</span>
						</span>
					</template>
				</van-cell>
			</van-cell-group>

			<!-- <van-field v-model="addForm.gasType" name="gasType" label="气体监测内容" placeholder="气体监测内容" disabled></van-field> -->
			<van-field class="fieldbottom" v-model="addForm.gasContent" center disabled label="危险辨识内容"></van-field>
			<van-cell v-show="gascontentList.length!=0" value="内容">
				<van-row gutter="10">
					<van-col v-for="(item,index) in gascontentList" :key="index" style="text-align: center;margin-bottom: 10px;" span="24">
						<van-tag class="gassafeshow" style="padding: 5px 10px;text-align: left;width: 90%;" color="rgb(246,247,251)"
						 text-color="rgba(0,0,0,0.8)" size="large" type="primary">
							<span style="width: 90%;">{{item.diContent}}</span>
						</van-tag>
					</van-col>
				</van-row>
			</van-cell>
			<van-field class="fieldbottom" v-model="addForm.gasSafeWay" center disabled label="采取安全措施"></van-field>
			<van-cell class="fieldmargin" v-show="gassafeList.length!=0" value="内容">
				<van-row gutter="10">
					<van-col v-for="(item,index) in gassafeList" :key="index" style="text-align: center;margin-bottom: 10px;" span="24">
						<van-tag class="gassafeshow" style="padding: 5px 10px;text-align: left;width: 90%;" color="rgb(246,247,251)"
						 text-color="rgba(0,0,0,0.8)" size="large" type="primary">
							<span style="width: 90%;">{{item.protectContent}}</span>
						</van-tag>
					</van-col>
				</van-row>
			</van-cell>

			<van-field v-model="addForm.buildDept" center disabled label="施工单位"></van-field>
			<van-field v-model="addForm.buildName" center disabled label="施工负责人"></van-field>
			<van-field class="fieldbottom" v-model="addForm.buildPerson" center disabled label="施工人员"></van-field>
			<van-cell v-show="personBuildData.length!=0" value="内容">
				<van-row gutter="10">
					<van-col v-for="(item,index) in personBuildData" :key="index" style="text-align: left;margin-bottom: 10px;" span="8">
						<van-tag style="padding: 5px 10px;" color="rgb(246,247,251)" text-color="rgba(0,0,0,0.8)" size="large" type="primary">
							{{item.userName}}
						</van-tag>
					</van-col>
				</van-row>
			</van-cell>
			<van-field v-model="addForm.safeMan" center disabled label="安全员"></van-field>
			<van-field v-model="addForm.lookMan" center disabled label="监护人"></van-field>
			<van-field v-model="addForm.lookManType" center disabled label="监护人工种类型"></van-field>
			<van-field class="fieldmargin" v-model="addForm.lookManBookNum" center disabled label="监护人证书编号"></van-field>

			<van-field v-model="addForm.startTime" center disabled label="开始作业时间"></van-field>
			<van-field v-model="addForm.endTime" center disabled label="结束作业时间"></van-field>
			<van-field class="fieldmargin" v-model="addForm.timeLength" center disabled label="作业时长"></van-field>

			<van-cell center :value="addForm.a" name="sign"
			 placeholder="" disabled>
				<template #title>
					<div class="nameshow">安全教育人员签名<span style="color: #008000;"></span></div>
					<div class="van-cell__label"><span style="color: orange;">签名地点：</span>{{addForm.signaddress}}</div>
					<div class="van-cell__label"><span style="color: #39A9ED;">签名时间：</span>{{addForm.signtime}}</div>
				</template>
				<template #right-icon>
					<!-- <span>{{getpicurl}}+{{addForm.sign}}</span> -->
					<van-image width="40" height="40" fit="cover" :src="addForm.sign" />
				</template>
			</van-cell>
			<van-divider v-show="personBuildData.length!=0" :style="{ borderColor: '#000', padding: '0 16px' }">施工人员签名</van-divider>
			<van-cell center :value="addForm.a" name="worksign"
			 placeholder="" disabled>
			 <template #title>
			 	<div class="nameshow">施工负责人签名<span style="color: #008000;"></span></div>
			 	<div class="van-cell__label"><span style="color: orange;">签名地点：</span>{{addForm.worksignaddress}}</div>
			 	<div class="van-cell__label"><span style="color: #39A9ED;">签名时间：</span>{{addForm.worksigntime}}</div>
			 </template>
				<template #right-icon>
					<van-image width="40" height="40" fit="cover" :src="addForm.worksign" />
				</template>
			</van-cell>
			<van-cell v-for="(item,index) in personBuildData" :key="index" center 
			 name="item.userId"  placeholder="" disabled>
			 <template #title>
			 	<div class="nameshow">{{item.userName}}<span style="color: #008000;"></span></div>
			 	<div class="van-cell__label"><span style="color: orange;">签名地点：</span>{{item.address}}</div>
			 	<div class="van-cell__label"><span style="color: #39A9ED;">签名时间：</span>{{formatDate(item.time)}}</div>
			 </template>
				<template #right-icon>
					<van-image width="40" height="40" fit="cover" :src="item.url" />
					<!-- <span v-show="item.writeType==1">已签名</span> -->
				</template>
			</van-cell>

			<van-field style="margin-top: 10px;" v-model="addForm.checkMan" center disabled label="审核领导"></van-field>
			<van-field v-model="addForm.checktime" center disabled label="审核时间"></van-field>
			<van-field v-model="addForm.remarks" center disabled label="审核意见"></van-field>

			<van-cell center :value="addForm.b" name="worksign"
			 placeholder="" disabled>
			 <template #title>
			 	<div class="nameshow">签名确认<span style="color: #008000;"></span></div>
			 	<div class="van-cell__label"><span style="color: orange;">签名地点：</span>{{addForm.checksignaddress}}</div>
			 	<div class="van-cell__label"><span style="color: #39A9ED;">签名时间：</span>{{addForm.checksigntime}}</div>
			 </template>
				<template #right-icon>
					<van-image width="40" height="40" fit="cover" :src="addForm.checksign" />
				</template>
			</van-cell>

			<!-- <van-field class="fieldbottom" center v-model="addForm.checksign" name="checksign" label="签名确认" placeholder=""
			 disabled>
				<template #right-icon>
					<van-image  width="40" height="40" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
				</template>
			</van-field> -->


			<!-- <van-field style="margin: 10px 0;" v-model="addForm.safemanremarks" center disabled label="安全员审核意见"></van-field> -->
			<van-field style="margin: 10px 0;" v-model="addForm.safemanremarks" name="losscontent" label="安全员审核意见" placeholder="请输入安全员审核意见"
			 type="textarea" autosize></van-field>

		</van-form>
		<div class="submit">
			<van-button round block type="danger" @click="submit(0)">
				驳回
			</van-button>
			<van-button style="margin-left: 20px;" @click="submit(1)" round block type="info">
				安全审核
			</van-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: "safeMancheck",
		data() {
			return {
				addForm: {
					worknum: '666666666',
					workordernum: '',
					workType: '动火作业',
					workLevel: '特级',
					workDept: '',
					workContent: '',
					applyer: '',
					applytime: '',
					applyerdept: '',
					// ---气体类
					gasType: '',
					gasContent: '',
					gasSafeWay: '',
					buildDept: '大西瓜工程',
					buildName: '黄阳大西瓜',
					buildPerson: '',
					safeMan: '黄阳',
					lookMan: '常敬张',
					lookManType: '焊接与热切割',
					lookManBookNum: '',
					startTime: '',
					endTime: '',
					timeLength: '',
					examineMan: '',
					sign: '', //测试签名
					signtime: '',
					signaddress: '',
					signshow: '',
					worksign: '',
					worksigntime: '',
					worksignaddress: '',
					remarks: '',
					checkMan: '顾倩霞',
					checktime: '',
					checksign: '',
					checksigntime: '',
					checksignaddress: '',
					safemanremarks: ''
				},
				rule: [{
					required: true
				}], // 校验规则
				leader: null,
				gascontentList: [],
				gassafeList: [],
				personBuildData: [],
				jwDetectMatterBoList: [],
				isagree: 1
			}
		},
		components: {

		},
		mounted() {
			let data = JSON.parse(decodeURI(this.$route.query.data))
			// console.log(data)
			this.leader = data
			this.getdetail(data)
		},
		methods: {
			getdetail(data) {
				let json = {
					processInstanceId: data.processInstanceId,
					taskId: data.taskId,
					bussinessId: data.bussinessId
				}
				// this.sparePartData = []
				this.gettaskDetail(json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							this.addForm.worknum = data.dataResponse.jobWorkNo
							this.addForm.workordernum = data.dataResponse.noteNo
							this.addForm.workType = data.dataResponse.jobTypeCodeName
							this.addForm.workLevel = data.dataResponse.jobLevelName
							this.addForm.workDept = data.dataResponse.jobWorkLocation
							this.addForm.workContent = data.dataResponse.jobWorkContent
							this.addForm.applyerdept = data.dataResponse.applyDepName
							this.addForm.applyer = data.dataResponse.applyerName
							this.addForm.applytime = this.formatDate(data.dataResponse.createTime)
							
							this.jwDetectMatterBoList = data.dataResponse.jwDetectMatterBoList
							this.gascontentList = data.dataResponse.jwDangerIdentityList
							this.gassafeList = data.dataResponse.jwProtectMeasuresList
							this.addForm.buildDept = data.dataResponse.constructedUnits
							this.addForm.buildName = data.dataResponse.constructedManagerName
							for (let i = 0; i < data.dataResponse.jwConstructorList.length; i++) {
								this.personBuildData.push({
									id: data.dataResponse.jwConstructorList[i].userId,
									userName: data.dataResponse.jwConstructorList[i].userName,
									url: this.$store.state.picUrl + data.dataResponse.jwConstructorList[i].sidPath,
									address: data.dataResponse.jwConstructorList[i].address,
									time: data.dataResponse.jwConstructorList[i].createTime,
								})
							}
							
							this.addForm.safeMan = data.dataResponse.safetyOfficerName
							this.addForm.lookMan =  data.dataResponse.guarderName
							this.addForm.lookManType = data.dataResponse.guarderWorkType
							this.addForm.lookManBookNum = data.dataResponse.guarderCerNo
							
							this.addForm.startTime = this.formatDate(data.dataResponse.planStartTime)
							this.addForm.endTime = this.formatDate(data.dataResponse.planEndTime)
							this.addForm.timeLength = data.dataResponse.planTimeLength
							
							this.addForm.tutelageman = data.dataResponse.guarderName
							this.addForm.checkMan = data.dataResponse.approverName
							this.addForm.checktime = this.formatDate(data.dataResponse.cmSid.createTime)
							this.addForm.remarks = data.dataResponse.approverComment
							
							this.addForm.sign = this.$store.state.picUrl + data.dataResponse.saferEducateSid.sidPath
							this.addForm.signtime = this.formatDate(data.dataResponse.saferEducateSid.createTime)
							this.addForm.signaddress = data.dataResponse.saferEducateSid.address
							
							this.addForm.worksign = this.$store.state.picUrl + data.dataResponse.cmSid.sidPath
							this.addForm.worksigntime = this.formatDate(data.dataResponse.cmSid.createTime)
							this.addForm.worksignaddress = data.dataResponse.cmSid.address
							
							this.addForm.checksign = this.$store.state.picUrl + data.dataResponse.approveSid.sidPath
							this.addForm.checksigntime = this.formatDate(data.dataResponse.approveSid.createTime)
							this.addForm.checksignaddress = data.dataResponse.approveSid.address
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})

			},
			submit(num) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					let json = {
						processInstanceId: this.leader.processInstanceId,
						taskId: this.leader.taskId,
						bussinessId: this.leader.bussinessId,
						opinion: this.addForm.safemanremarks,
						auditeStatus: num
					}
					console.log(json)
					this.$axios.post('/w/jobWork/securityAudit', json).then(res => {
							if (res.data.code === 0) {
								// console.log(res.data.data)
								this.$router.push("/work")
								// this.$router.push("/safecheck")
							} else {
								this.$toast(res.data.message)
							}
						})
						.catch(res => {
							this.$toast('服务异常')
						})
				}, 300) // 大概时间300ms

			},
		}
	};
</script>
<style scoped>
	.safeMancheck {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.van-cell>>>.van-field__label {
		color: #242424;
		width: auto;
	}

	.submit {
		display: flex;
		width: 80%;
		margin: 2% 10%;
	}

	.van-cell__title {
		text-align: left;
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.gassafeshow>>>.van-tag__close {
		position: absolute;
		right: 5px;
	}

	.fieldmargin {
		margin-bottom: 10px;
	}

	.checkmanshow {
		margin-top: 10px;
	}

	.fieldbottom::after {
		border-bottom: 0;
	}
</style>
