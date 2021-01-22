<template>
	<div class="addwork">
		<van-form ref="addform" @submit="submit" @failed="failed">
			<!-- <van-field  v-model="addForm.scode" name="1" label="设备单号" placeholder="填写设备单号" :rules="rules"></van-field> -->
			<van-field v-model="addForm.worknum" name="worknum" label="作业票编号" placeholder="请输入作业票编号" disabled></van-field>

			<!-- <van-field v-model="addForm.workordernum" class="fieldtype" name="workordernum" label="工单编号" placeholder="请选择工单编号"
			 clickable readonly @click="showPicker1=true" is-link></van-field> -->


			<van-field class="chooseleft" v-model="addForm.workordernum" name="name" label="工单编号" placeholder="请选择工单编号"
			 clickable readonly>
				<template #input>
					<div style="width: 100%;" slot="input">
						<!-- <input style="width: 100%;border: 0;" name="name"  type="text" placehold="请输入id进行查询" v-model="input_value" v-on:input="throttle"  ref="input" /> -->
						<van-field style="padding: 0;" class="fieldbottom" v-model="input_value" label="" placeholder="请输入工单号进行查询(提示:EM...)"
						 v-on:input="throttle" ref="input" />
						<ul class="showul" v-show="state">
							<li v-for="(item,index) in list" :key="index" @click="lishow(item)">
								<div>工单编号: {{item.workNoteNo}}</div>
							</li>
						</ul>
					</div>
				</template>

			</van-field>

			<van-field required v-model="addForm.workType" class="fieldtype" name="workType" label="作业类型" placeholder="请选择作业类型"
			 clickable readonly @click="showPicker2=true" :rules="rule" is-link></van-field>
			<van-field required v-model="addForm.workLevel" class="fieldtype" name="workLevel" label="作业票级别" placeholder="请选择作业票级别"
			 clickable readonly @click="showPicker3=true" :rules="rule" is-link></van-field>
			<van-field required v-model="addForm.workDept" name="workDept" label="作业地点\部门" placeholder="请输入作业地点\部门" :rules="rule"></van-field>
			<van-field required :rules="rule" class="contenttype fieldmargin" v-model="addForm.workContent" @input="inputworkContent"
			 name="workContent" label="作业内容" placeholder="请输入作业内容" type="textarea" autosize></van-field>

			<!-- <van-field v-model="addForm.gasType" required name="gasType" label="气体监测内容" placeholder="气体监测内容" disabled></van-field> -->

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
			<van-field class="fieldbottom" v-model="addForm.gasContent" center disabled="" label="危险辨识内容">
				<template #right-icon>
					<!-- <van-icon name="add" size="26" color="#1989fa" @click="addperson" /> -->
					<select-multiple direction="down" :select-data-opts="gascontentData" :disabled="selectDisabled" :checked-list="gascontentchecked"
					 :select-name="selectName1" @selectMutiple="selectMutiple" />
				</template>
			</van-field>
			<van-cell v-show="gascontentList.length!=0" value="内容">
				<van-row gutter="10">
					<van-col v-for="(item,index) in gascontentList" :key="index" style="text-align: center;margin-bottom: 10px;" span="24">
						<van-tag class="gassafeshow" style="padding: 5px 10px;text-align: left;width: 90%;" v-if="show" color="rgb(246,247,251)"
						 text-color="rgba(0,0,0,0.8)" closeable size="large" type="primary" @close="closegascontent(index)">
							<span style="width: 90%;">{{item.text}}</span>
						</van-tag>
					</van-col>
				</van-row>
			</van-cell>
			<van-field :class="gassafeList.length!=0?'fieldbottom':'fieldbottom fieldmargin'" v-model="addForm.gasSafeWay"
			 center disabled="" label="采取安全措施">
				<template #right-icon>
					<!-- <van-icon name="add" size="26" color="#1989fa" @click="addperson" /> -->
					<select-multiple direction="up" :select-data-opts="gassafeData" :disabled="selectDisabled" :checked-list="gassafewaychecked"
					 :select-name="selectName2" @selectMutiple="selectMutiple" />
				</template>
			</van-field>
			<van-cell class="fieldmargin" v-show="gassafeList.length!=0" value="内容">
				<van-row>
					<van-col v-for="(item,index) in gassafeList" :key="index" style="text-align: center;margin-bottom: 10px;" span="24">
						<van-tag class="gassafeshow" style="padding: 5px 10px;text-align: left;width: 90%;" v-if="show" color="rgb(246,247,251)"
						 text-color="rgba(0,0,0,0.8)" closeable size="large" type="primary" @close="closegassafe(index)">
							<span style="width: 90%;">{{item.text}}</span>
						</van-tag>
					</van-col>
				</van-row>
			</van-cell>

			<van-field required v-model="addForm.buildDept" class="fieldtype" name="buildDept" label="施工单位" placeholder="请选择施工单位"
			 clickable readonly @click="showPicker4=true" :rules="rule" is-link></van-field>
			<van-field required v-model="addForm.buildName" class="fieldtype" name="buildName" label="施工负责人" placeholder="请选择施工负责人"
			 clickable readonly @click="showPicker5=true" :rules="rule" is-link></van-field>
			<van-field class="fieldbottom" v-model="addForm.buildPerson" center disabled="" label="施工人员">
				<template #right-icon>
					<!-- <van-icon name="add" size="26" color="#1989fa" @click="addperson" /> -->
					<select-multiple direction="up" :select-data-opts="projectProject" :disabled="selectDisabled" :checked-list="checked"
					 :select-name="selectName3" @selectMutiple="selectMutiple" />
				</template>
			</van-field>
			<van-cell v-show="personBuildData.length!=0" value="内容">
				<van-row>
					<van-col v-for="(item,index) in personBuildData" :key="index" style="text-align: center;margin-bottom: 10px;" span="8">
						<van-tag style="padding: 5px 10px;" v-if="show" color="rgb(246,247,251)" text-color="rgba(0,0,0,0.8)" closeable
						 size="large" type="primary" @close="closeperson(index)">
							{{item.text}}
						</van-tag>
					</van-col>
				</van-row>
			</van-cell>
			<van-field required v-model="addForm.safeMan" class="fieldtype" name="safeMan" label="安全员" placeholder="请选择安全员"
			 clickable readonly @click="showPicker6=true" :rules="rule" is-link></van-field>
			<van-field required v-model="addForm.lookMan" class="fieldtype" name="lookMan" label="监护人" placeholder="请选择监护人"
			 clickable readonly @click="showPicker7=true" :rules="rule" is-link></van-field>
			<!-- <van-field required v-model="addForm.lookManType" name="lookManType" label="监护人工种类型" placeholder=""
			 clickable readonly :rules="rule" disabled=""></van-field> -->
			 
			 <van-field required :rules="rule" v-model="addForm.lookManType" 
			  name="lookManType" label="监护人工种类型" placeholder="" type="textarea" disabled autosize></van-field>
			 
			<van-field class="fieldmargin fieldtype" v-model="addForm.lookManBookNum" name="lookManBookNum" label="监护人证书" placeholder="请选择监护人证书"
			clickable readonly @click="showPicker8=true" is-link></van-field>
			<van-field required v-model="addForm.startTime" class="fieldtype" name="startTime" label="开始作业时间" placeholder="请选择开始作业时间"
			 clickable readonly @click="showStartTime=true" :rules="rule" is-link></van-field>
			<van-field required v-model="addForm.endTime" class="fieldtype" name="endTime" label="结束作业时间" placeholder="请选择结束作业时间"
			 clickable readonly @click="showEndTime=true" :rules="rule" is-link></van-field>
			<van-field class="fieldmargin" v-model="addForm.timeLength+'小时'" name="timeLength" label="作业时长" placeholder=""
			 disabled></van-field>
			<van-field class="fieldbottom" center required v-model="addForm.sign" name="sign" label="安全教育人员签名" placeholder=""
			 disabled>
				<template #right-icon>
					<van-icon v-show="safemanshow.writeType==0" @click="signcs" style="width: 200px;" class="addmore" name="add" color="#1989fa"
					 size="30" />
					<van-image v-show="safemanshow.writeType==1" width="40" height="40" fit="cover" :src="safemanshow.filepath" />
					<!-- <span v-show="safemanshow.writeType==1">已签名</span> -->
				</template>
			</van-field>
			<van-divider v-show="personBuildData.length!=0" :style="{ borderColor: '#000', padding: '0 16px' }">施工人员签名</van-divider>

			<van-field class="fieldbottom" center required v-model="addForm.sign" name="sign" label="施工负责人签名" placeholder=""
			 disabled>
				<template #right-icon>
					<van-icon v-show="workfzperson.writeType==0" @click="workfzsigncs" style="width: 200px;" class="addmore" name="add"
					 color="#1989fa" size="30" />
					<van-image v-show="workfzperson.writeType==1" width="40" height="40" fit="cover" :src="workfzperson.filepath" />
					<!-- <span v-show="safemanshow.writeType==1">已签名</span> -->
				</template>
			</van-field>

			<van-field v-for="(item,index) in personBuildData" :key="index" center v-model="item.fieldshow" name="item.fieldshow"
			 :label="item.text" placeholder="" disabled>
				<template #right-icon>
					<van-icon @click="signPerson(item)" v-show="item.writeType==0" style="width: 200px;" class="addmore" name="add"
					 color="#1989fa" size="30" />
					<van-image v-show="item.writeType==1" width="40" height="40" fit="cover" :src="item.filepath" />
					<!-- <span v-show="item.writeType==1">已签名</span> -->
				</template>
			</van-field>
			<!-- <van-field class="fieldbottom" v-model="addForm.sign"   center disabled="" label="危险辨识内容">
			 	<template #right-icon>
			 		<select-multiple direction="up" :select-data-opts="gascontentData" :disabled="selectDisabled" :checked-list="gascontentchecked"
			 		 :select-name="selectName1"  @selectMutiple="selectMutiple" />
			 	</template>
			 </van-field> -->
			<van-field required v-model="addForm.checkMan" class="fieldtype checkmanshow" name="checkMan" label="审批人"
			 placeholder="请选择审批人" clickable readonly @click="showPicker9=true" :rules="rule" is-link></van-field>
			<div style="margin: 30px;">
				<van-button round block type="info" native-type="submit">
					提交
				</van-button>
			</div>
		</van-form>
		<!--下拉选择1234-->
		<van-popup v-model="showPicker1" position="bottom">
			<van-picker show-toolbar :columns="columns1" @confirm="onConfirm1" @cancel="showPicker1 = false" />
		</van-popup>
		<van-popup v-model="showPicker2" position="bottom">
			<van-picker show-toolbar :columns="columns2.name" @confirm="onConfirm2" @cancel="showPicker2 = false" />
		</van-popup>
		<van-popup v-model="showPicker3" position="bottom">
			<van-picker show-toolbar :columns="columns3.name" @confirm="onConfirm3" @cancel="showPicker3 = false" />
		</van-popup>
		<van-popup v-model="showPicker4" position="bottom">
			<van-picker show-toolbar :columns="columns4.name" @confirm="onConfirm4" @cancel="showPicker4 = false" />
		</van-popup>
		<van-popup v-model="showPicker5" position="bottom">
			<van-picker show-toolbar :columns="columns5.name" @confirm="onConfirm5" @cancel="showPicker5 = false" />
		</van-popup>
		<van-popup v-model="showPicker6" position="bottom">
			<van-picker show-toolbar :columns="columns6.name" @confirm="onConfirm6" @cancel="showPicker6 = false" />
		</van-popup>
		<van-popup v-model="showPicker7" position="bottom">
			<van-picker show-toolbar :columns="columns7.name" @confirm="onConfirm7" @cancel="showPicker7 = false" />
		</van-popup>
		<van-popup v-model="showPicker8" position="bottom">
			<van-picker show-toolbar :columns="columns8.name" @confirm="onConfirm8" @cancel="showPicker8 = false" />
		</van-popup>
		<van-popup v-model="showPicker9" position="bottom">
			<van-picker show-toolbar :columns="columns9.name" @confirm="onConfirm9" @cancel="showPicker9 = false" />
		</van-popup>
		<van-action-sheet v-model="showStartTime" title="开始作业时间选择">
			<van-datetime-picker @cancel="showStartTime=false" @confirm="startTimeSure" v-model="currentDate" type="datehour"
			 title="选择年月日" :min-date="minDate" :max-date="maxDate" />
		</van-action-sheet>
		<van-action-sheet v-model="showEndTime" title="结束作业时间选择">
			<van-datetime-picker @cancel="showEndTime=false" @confirm="endTimeSure" v-model="currentDate1" type="datehour" title="选择年月日"
			 :min-date="minDate1" :max-date="maxDate1" />
		</van-action-sheet>
		<signwrite :jobLevel="addForm.workLevelcode" :jobTypeCode="addForm.workTypecode"></signwrite>
	</div>
</template>

<script>
	import {
		ImagePreview
	} from 'vant';
	import signwrite from '../../../components/sign.vue'
	import selectMultiple from './SelectMultiple.vue'
	export default {
		name: "addwork",
		data() {
			return {
				timer: '',
				selectName1: '危险辨识内容选择',
				selectName2: '安全措施选择',
				selectName3: '人员选择',
				state: false,
				statu: true,
				input_value: '', //搜搜工单编号
				dataList: [],
				list: [],
				gascontentchecked: [],
				gassafewaychecked: [],
				checked: [],
				selectDisabled: false,
				minDate: new Date(2000, 0, 1),
				maxDate: new Date(2025, 10, 1),
				minDate1: new Date(2000, 0, 1),
				maxDate1: new Date(2025, 10, 1),
				currentDate: new Date(),
				currentDate1: new Date(),
				showStartTime: false,
				showEndTime: false,
				lastStartTime: 0, //最后上传的开始时间戳
				lastEndTime: 0, //最后上传的结束时间戳
				addForm: {
					worknum: '',
					workordernum: '',
					workType: '', //作业类型
					workTypecode: '', //作业类型code
					workLevel: '', //作业票级别名称
					workLevelcode: '', //作业票级别code
					workDept: '',
					workContent: '',
					// ---气体类
					gasType: '',
					gasContent: '',
					gasSafeWay: '',
					buildDept: '',
					buildName: '',
					buildPerson: '',
					safeMan: '',
					lookMan: '',
					lookManType: '',
					lookManBookNum: '',
					startTime: '',
					endTime: '',
					timeLength: '',
					examineMan: '',
					sign: '', //测试签名
					checkMan: ''
				},
				//危险辨识
				gascontentData: [],
				//安全措施获取
				gassafeData: [],
				//人员获取
				projectProject: [],
				gascontentList: [], //危害辨识内容列表
				gassafeList: [], //安全措施列表
				personBuildData: [], //施工人员列表
				safemanshow: { //安全教育人员签名信息
					index: 0,
					text: '安全教育人员',
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
				},
				//施工负责人签名
				workfzperson: {
					index: 0,
					text: '施工负责人',
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
				},
				show: true, //人员显示
				showPicker1: false,
				columns1: ['编号1', '编号2'],
				showPicker2: false,
				columns2: {
					name: [],
					all: []
				},
				showPicker3: false,
				columns3: {
					name: [],
					all: []
				},
				showPicker4: false,
				columns4: {
					name: [],
					all: []
				},
				showPicker5: false,
				columns5: {
					name: [],
					all: []
				},
				showPicker6: false,
				columns6: {
					name: [],
					all: []
				},
				showPicker7: false,
				columns7: {
					name: [],
					all: []
				},
				showPicker8: false,
				columns8: {
					name: [],
					all: []
				},
				showPicker9: false,
				columns9: {
					name: [],
					all: []
				},
				rule: [{
					required: true
				}], // 校验规则
				isaddshow: false, //是否可以发起申请
				jwDetectMatterBoList: [], //检测物质
				addjson: {
					jobWorkNo: '',
					noteNo: '',
					noteId: null,
					noteType: '',
					jobTypeCode: '',
					jobLevel: '',
					jobTypeCodeName: '',
					jobLevelName: '',
					jobWorkLocation: '',
					jobWorkContent: '',
					constructedUnits: '施工单位',
					constructedManagerId: 285,
					constructedManagerName: '系统管理员',
					safetyOfficerId: null,
					safetyOfficerName: '',
					guarderId: null,
					guarderName: '',
					guarderWorkType: '焊接与热切割',
					guarderCerNo: 'xxx123456',
					planStartTime: '',
					planEndTime: '',
					planTimeLength: '',
					applyerId: localStorage.getItem('userId'),
					applyerName: localStorage.getItem('userName'),
					applyDepName: '',
					safeContentId: '',
					saferEducateSid: '',
					cmSid: '',
					approverId: null,
					approverName: '',
					constructorList: [],
					jwDetectMatterBoList: [],
					jwDangerIdentityBoList: [],
					jwProtectMeasuresBoList: []
				}
			};
		},
		components: {
			signwrite,
			selectMultiple
		},
		beforeDestroy() {
			this.$bus.off('signwrite')
		},
		// destroyed() {
		// 	this.$bus.off('signwrite')
		// 	this.$bus.off('signshow')
		// },
		created() {
			// console.log(123)
			this.timer = new Date().getTime()
			// this.$bus.on('signshow', e => {
			// 	console.log(e)
			// })
		},
		mounted() {
			this.addjson.applyDepName = JSON.parse(decodeURI(localStorage.getItem('person'))).organization.longName
			this.getJobWorkNo() //获取作业票编号
			this.getAllJobWorkType() //获取所有作业类型
			this.getAllJobWorkLevel() //获取作业票级别
			this.getsafeman() //获取安全员
			this.getguarder() //获取监护人
			this.getNextAssigent() //获取下个审核人
			this.getEMWorkOrderNoByWorkNoteNoLike() //获取工单编号
			this.queryForApp() //获取施工单位
			// this.getqueryForAppUser(2)
		},
		methods: {
			queryForApp () {
				let json = {
					name: '',
					pageNo: 1,
					pageSize: 9999
				}
				this.columns4 = {
					name: [],
					all: []
				}
				this.getqueryForApp(json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data.content
							for (let i = 0; i < data.length; i++) {
								this.columns4.all.push(data[i])
								this.columns4.name.push(data[i].name)
								
							}
							// this.addjson.constructedUnits = this.columns4.name[0]
							// this.addForm.buildDept = this.columns4.name[0] //默认施工单位为第一个
							// this.getqueryForAppUser(this.columns4.all[0].id)
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getByPersonCode (name) {
				let json = {
					code: name
				}
				this.columns8 = {
					name: [],
					all: []
				}
				// this.projectProject = []
				this.$axios.post('/p/personCert/getByPersonCode2', json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							this.addForm.lookManType = data.workTypeName
							for (let i=0;i<data.personCerts.length;i++) {
								this.columns8.all.push(data.personCerts[i])
								this.columns8.name.push(data.personCerts[i].cerName)
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getqueryForAppUser (id) {
				let json = {
					unitId: id
				}
				this.columns5 = {
					name: [],
					all: []
				}
				this.projectProject = []
				this.getByUnitId(json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.columns5.all.push(data[i])
								this.columns5.name.push(data[i].name)
								this.projectProject.push({
									text: data[i].name,
									value: data[i].id,
									constructorCerNo: data[i].personCerts
								})
							}
							// this.addjson.constructedManagerId = this.columns5.all[0].id
							// this.addjson.constructedManagerName = this.columns5.all[0].name
							// this.addForm.buildName = this.columns5.all[0].name
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getEMWorkOrderNoByWorkNoteNoLike() {
				let json = {
					workNoteNo: this.input_value,
					pageNo: 1,
					pageSize: 9999
				}
				this.dataList = []
				this.$axios.post('/w/equipmentMaintenanceBussiness/getEMWorkOrderNoByWorkNoteNoLike', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							let data = res.data.data
							this.dataList = data
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			lishow(item) {
				console.log(item)
				this.input_value = item.workNoteNo
				this.addForm.workordernum = item.workNoteNo
				this.addjson.noteNo = item.workNoteNo
				this.getNoteIdAndNoteType(item.workNoteNo) //点击获取工单编号获取工单id和类型
				this.state = false
			},
			getNoteIdAndNoteType(data) {
				let json = {
					noteNo: data,
				}
				this.$axios.post('/w/jobWork/getNoteIdAndNoteType', json).then(res => {
						if (res.data.code === 0) {
							//console.log(res.data.data)
							let data = res.data.data
							this.addjson.noteId = data.noteId
							this.addjson.noteType = data.noteType
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			/*名称输入选择*/
			search() {
				//这个变量主要是用来测试节流后和不节流的区别
				var i = 0;
				//console.log(i++);
				//定义的新数组存放筛选之后的数据
				this.list = [];
				//拿到当前input输入框输入的值
				this.input_value = this.$refs.input.value;
				this.state = true;
				//循环模拟数据的数组
				this.dataList.map((msg) => {
					//拿当前json的id、name、time去分别跟输入的值进行比较
					//indexOf 如果在检索的字符串中没有出现要找的值是会返回-1的，所以我们这里不等于-1就是假设输入框的值在当前json里面找到的情况
					if (msg.workNoteNo.indexOf(this.input_value) != -1) {
						//然后把当前json添加到list数组中
						this.list.push(msg);
					}
				})
			},
			throttle() {
				//保持this的指向始终指向vue实例
				var that = this;

				if (!that.statu) {
					return;
				}
				that.statu = false;
				setTimeout(function() {
					that.search();
					that.statu = true;
				}, 500)
			},
			getNextAssigent() {
				let json = {
					phase: 2,
					deploymentName: 'jobWork'
				}
				this.columns9 = {
					name: [],
					all: []
				}
				this.getworkNextAssigent(json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							let data = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.columns9.name.push(data[i].userName)
								this.columns9.all.push(data[i])
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getguarder() {
				let json = {
					phase: 4
				}
				this.columns7 = {
					name: [],
					all: []
				}
				this.$axios.post('/w/jobWork/getNextAssigent', json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.columns7.name.push(data[i].userName)
								this.columns7.all.push(data[i])
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getsafeman() {
				let json = {
					phase: 3
				}
				this.columns6 = {
					name: [],
					all: []
				}
				this.$axios.post('/w/jobWork/getNextAssigent', json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.columns6.name.push(data[i].userName)
								this.columns6.all.push(data[i])
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getAllJobWorkLevel() {
				let json = {}
				this.columns3 = {
					name: [],
					all: []
				}
				this.$axios.post('/w/jobWork/getAllJobWorkLevel', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							let data = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.columns3.name.push(data[i].name)
								this.columns3.all.push(data[i])
							}
							this.addForm.workLevel = data[0].name //作业类型默认选择第一个
							this.addForm.workLevelcode = data[0].code
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getAllJobWorkType() {
				let json = {}
				this.columns2 = {
					name: [],
					all: []
				}
				this.$axios.post('/w/jobWork/getAllJobWorkType', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							let data = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.columns2.name.push(data[i].name)
								this.columns2.all.push(data[i])
							}
							this.addForm.workType = data[0].name //作业类型默认选择第一个
							this.addForm.workTypecode = data[0].code
							this.getTpls() //获取所有模板信息
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getTpls() {
				let json = {
					jobTypeCode: this.addForm.workTypecode,
					jobLevel: this.addForm.workLevelcode
				}
				this.gascontentData = []
				this.gascontentchecked = []
				this.gascontentList = [] //危险辨识默认置空

				this.gassafeData = []
				this.gassafewaychecked = []
				this.gassafeList = [] //安全措施默认置空
				this.$axios.post('/w/jobWork/getTpls', json).then(res => {
						if (res.data.data != null && JSON.stringify(res.data.data) != "{}") {
							console.log('所有模板=>', res.data.data)
							let data = res.data.data
							this.jwDetectMatterBoList = data.jwDetectMatterBoList != undefined ? data.jwDetectMatterBoList : []
							if (data.dangerIdentityTplList != undefined) {
								for (let i = 0; i < data.dangerIdentityTplList.length; i++) {
									this.gascontentData.push({
										text: data.dangerIdentityTplList[i].diContent,
										value: data.dangerIdentityTplList[i].diCode
									})
								}
							}
							if (data.protectionMeasuresTplList != undefined) {
								for (let i = 0; i < data.protectionMeasuresTplList.length; i++) {
									this.gassafeData.push({
										text: data.protectionMeasuresTplList[i].protectContent,
										value: data.protectionMeasuresTplList[i].protectCode
									})
								}
							}

							if (data.securityToldTpl != undefined) {
								this.addjson.safeContentId = data.securityToldTpl.id
							}


						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getJobWorkNo() {
				let json = {}
				this.$axios.post('/w/jobWork/getJobWorkNo', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							this.addForm.worknum = res.data.data
							this.addjson.jobWorkNo = res.data.data
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			failed(form) {
				this.$toast('请完善填写内容')
			},
			//点击验证
			submit(form) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					// console.log(form)
					console.log('危险辨识', this.gascontentList)
					console.log('安全措施', this.gassafeList)
					console.log('施工人员', this.personBuildData)
					console.log('安全教育人员', this.safemanshow)
					console.log('施工负责人', this.workfzperson)
					this.addjson.jobTypeCode = this.addForm.workTypecode
					this.addjson.jobLevel = this.addForm.workLevelcode
					this.addjson.jobTypeCodeName = this.addForm.workType
					this.addjson.jobLevelName = this.addForm.workLevel
					this.addjson.jobWorkLocation = this.addForm.workDept
					this.addjson.jobWorkContent = this.addForm.workContent
					this.addjson.jwDetectMatterBoList = this.jwDetectMatterBoList
					//判断危险辨识是否填写保存
					if (this.gascontentList.length != 0) {
						for (let i = 0; i < this.gascontentList.length; i++) {
							this.addjson.jwDangerIdentityBoList.push({
								diCode: this.gascontentList[i].value,
								diCodeName: this.gascontentList[i].text
							})
						}
						this.isaddshow = true
					} else {
						this.$toast('请将危险辨识内容选填完善')
						this.isaddshow = false
					}

					//判断安全措施是否填写保存
					if (this.gassafeList.length != 0) {
						for (let i = 0; i < this.gassafeList.length; i++) {
							this.addjson.jwProtectMeasuresBoList.push({
								protectCode: this.gassafeList[i].value,
								protectCodeName: this.gassafeList[i].text
							})
						}
						this.isaddshow = true
					} else {
						this.$toast('请将安全措施内容选填完善')
						this.isaddshow = false
					}

					if (this.safemanshow.fileId == '') {
						this.$toast('请安全教育人员签名')
						this.isaddshow = false
					} else {
						this.addjson.saferEducateSid = this.safemanshow.fileId
						this.isaddshow = true
					}

					if (this.workfzperson.fileId == '') {
						this.$toast('请施工负责人签名')
						this.isaddshow = false
					} else {
						this.addjson.cmSid = this.workfzperson.fileId
						this.isaddshow = true
					}

					if (this.personBuildData.length == 0) {
						this.$toast('请将施工人员内容选填完善')
						this.isaddshow = false
					} else {
						this.isaddshow = true
					}

					//判断施工人员是否填写保存
					let item = this.personBuildData.findIndex(item => {
						return item.fileId == '';
					});
					// console.log(item)
					if (item == -1) {
						for (let i = 0; i < this.personBuildData.length; i++) {
							let constructorCerNo = ''
							if (this.personBuildData[i].constructorCerNo.length!=0) {
								for (let k = 0; k < this.personBuildData[i].constructorCerNo.length; k++) {
									if (k<this.personBuildData[i].constructorCerNo.length-1) {
										constructorCerNo += this.personBuildData[i].constructorCerNo[k].cerName
										constructorCerNo += ','
									} else {
										constructorCerNo += this.personBuildData[i].constructorCerNo[k].cerName
									}
								}
							}
							this.addjson.constructorList.push({
								constructorId: this.personBuildData[i].value,
								constructorName: this.personBuildData[i].text,
								constructorCerNo: constructorCerNo,
								constructorSid: this.personBuildData[i].fileId
							})
						}
						this.isaddshow = true
					} else {
						this.$toast('请将施工人员内容选填完善')
						this.isaddshow = false
					}
					//判断是否可以发起申请
					if (this.isaddshow) {
						this.addworkshow()
					}
					console.log(this.addjson)

				}, 300) // 大概时间300ms
			},
			addworkshow() {
				this.$axios.post('/w/jobWork/init', this.addjson).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							this.$router.push("/work")
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			//预览安全教育人员签名
			showSafeMan(path) {
				ImagePreview([path]);
			},
			//安全教育人员签名
			signcs() {
				this.$bus.emit('signwrite', this.safemanshow)
			},
			//施工负责人签名
			workfzsigncs() {
				this.$bus.emit('signwrite', this.workfzperson)
			},
			//施工人员签名
			signPerson(item) {
				// console.log(item)
				this.$bus.emit('signwrite', this.personBuildData[item.index])
			},
			//开始时间选中
			startTimeSure(value) {
				//console.log(value)
				//console.log(value.getTime())
				this.currentDate1 = this.currentDate
				this.minDate1 = new Date(value)
				this.lastStartTime = value.getTime()
				if (this.lastStartTime > this.lastEndTime) {
					this.addForm.endTime = ''
				}
				if (this.addForm.endTime != '') {
					//console.log(this.DateDifference(this.lastStartTime,this.lastEndTime))
					this.addForm.timeLength = this.DateDifference(this.lastStartTime, this.lastEndTime)
				}
				console.log(this.lastStartTime)
				this.addjson.planStartTime = this.lastStartTime
				this.addjson.planTimeLength = this.addForm.timeLength
				this.addForm.startTime = this.formatDate(value.getTime())
				this.showStartTime = false
			},
			//结束时间选中
			endTimeSure(value) {
				this.lastEndTime = value.getTime()
				this.addForm.endTime = this.formatDate(value.getTime())
				if (this.addForm.startTime != '') {
					//console.log(this.DateDifference(this.lastStartTime,this.lastEndTime))
					this.addForm.timeLength = this.DateDifference(this.lastStartTime, this.lastEndTime)
				}
				this.addjson.planEndTime = this.lastEndTime
				this.addjson.planTimeLength = this.addForm.timeLength
				console.log(this.lastEndTime)
				this.showEndTime = false
			},
			//返回施工人员
			selectMutiple(event) {
				// console.log(event)
				if (event.type == '人员选择') {
					this.checked = event.checked
					this.personBuildData = []
					for (let i = 0; i < event.all.length; i++) {
						this.personBuildData.push({
							index: i, // 数组编号
							text: event.all[i].text,
							value: event.all[i].value,
							constructorCerNo: event.all[i].constructorCerNo,
							writeType: 0, // 0是还未签名
							address: '', //地址
							jd: '', //精度
							wd: '', //纬度
							fileId: '', //文件id
							fileName: '', //文件名
							filepath: '', //文件路径
							design: 1, //验证身份
							fieldshow: '' //工具人字段
						})
					}
				} else if (event.type == '危险辨识内容选择') {
					this.gascontentchecked = event.checked
					this.gascontentList = event.all
				} else {
					this.gassafewaychecked = event.checked
					this.gassafeList = event.all
				}

				// this.selectName = event.name
			},
			//删除危害辨识内容模块
			closegascontent(index) {
				for (let i = 0; i < this.gascontentchecked.length; i++) {
					if (this.gascontentList[index].value == this.gascontentchecked[i]) {
						this.gascontentchecked.splice(i, 1)
					}
				}
				this.gascontentList.splice(index, 1)
			},
			//删除安全措施模块
			closegassafe(index) {
				console.log(index)
				for (let i = 0; i < this.gassafewaychecked.length; i++) {
					if (this.gassafeList[index].value == this.gassafewaychecked[i]) {
						this.gassafewaychecked.splice(i, 1)
					}
				}
				this.gassafeList.splice(index, 1)
			},
			//删除施工人员模块
			closeperson(index) {
				//console.log(index)
				for (let i = 0; i < this.checked.length; i++) {
					if (this.personBuildData[index].value == this.checked[i]) {
						this.checked.splice(i, 1)
					}
				}
				this.personBuildData.splice(index, 1)
			},
			// 工单编号 选择
			onConfirm1(value) {
				this.addForm.workordernum = value;

				this.showPicker1 = false;
			},
			// 作业类型 选择
			onConfirm2(value) {
				this.gascontentData = []
				this.gascontentchecked = []
				this.gascontentList = [] //默认置空

				this.addForm.workType = value;
				this.showPicker2 = false;
				for (let i = 0; i < this.columns2.all.length; i++) {
					if (value == this.columns2.all[i].name) {
						// console.log(this.columns2.all[i].code)
						this.addForm.workTypecode = this.columns2.all[i].code
						this.getTpls() //获取所有模板信息
					}
				}
			},
			// 作业票级别 选择
			onConfirm3(value) {
				this.gascontentData = []
				this.gascontentchecked = []
				this.gascontentList = [] //默认置空

				this.addForm.workLevel = value;
				this.showPicker3 = false;
				for (let i = 0; i < this.columns3.all.length; i++) {
					if (value == this.columns3.all[i].name) {
						// console.log(this.columns3.all[i].code)
						this.addForm.workLevelcode = this.columns3.all[i].code
						this.getTpls() //获取所有模板信息
					}
				}
			},
			// 施工单位 选择
			onConfirm4(value) {
				this.addjson.constructedUnits = value
				this.addForm.buildDept = value;
				
				//将施工负责人信息重置
				this.addForm.buildName = ''
				this.addjson.constructedManagerName = ''
				this.personBuildData = []
				
				this.showPicker4 = false;
				for (let i = 0; i < this.columns4.all.length; i++) {
					if (value == this.columns4.all[i].name) {
						//console.log(this.columns6.all[i].id)
						this.addjson.safetyOfficerId = this.columns4.all[i].id
						this.getqueryForAppUser(this.columns4.all[i].id)
					}
				}
			},
			// 施工负责人 选择
			onConfirm5(value) {
				this.addForm.buildName = value;
				this.addjson.constructedManagerName = value
				this.showPicker5 = false;
				for (let i = 0; i < this.columns5.all.length; i++) {
					if (value == this.columns5.all[i].name) {
						//console.log(this.columns6.all[i].id)
						this.addjson.constructedManagerId = this.columns5.all[i].id
					}
				}
			},
			// 安全员 选择
			onConfirm6(value) {
				this.addForm.safeMan = value;
				this.addjson.safetyOfficerName = value
				this.showPicker6 = false;
				for (let i = 0; i < this.columns6.all.length; i++) {
					if (value == this.columns6.all[i].userName) {
						console.log(this.columns6.all[i].userId)
						this.addjson.safetyOfficerId = this.columns6.all[i].userId
					}
				}
			},
			// 监护员 选择
			onConfirm7(value) {
				this.addForm.lookMan = value;
				this.addjson.guarderName = value
				this.addForm.lookManType = ''
				this.showPicker7 = false;
				for (let i = 0; i < this.columns7.all.length; i++) {
					if (value == this.columns7.all[i].userName) {
						//console.log(this.columns7.all[i].id)
						this.addjson.guarderId = this.columns7.all[i].userId
						this.getByPersonCode(this.columns7.all[i].code) //获取监护人证书和个人信息
					}
				}
			},
			// 监护人工种类型 选择
			onConfirm8(value) {
				this.addForm.lookManBookNum = value;
				this.showPicker8 = false;
				for (let i = 0; i < this.columns8.all.length; i++) {
					if (value == this.columns8.all[i].cerName) {
						console.log(this.columns8.all[i].cerNo)
						this.addjson.guarderCerNo = this.columns8.all[i].cerNo
					}
				}
			},
			// 审批人 选择
			onConfirm9(value) {
				this.addForm.checkMan = value;
				this.addjson.approverName = value
				this.showPicker9 = false;
				console.log(value)
				for (let i = 0; i < this.columns9.all.length; i++) {
					if (value == this.columns9.all[i].userName) {
						console.log(this.columns9.all[i].userId)
						this.addjson.approverId = this.columns9.all[i].userId
					}
				}
			},
			inputworkContent(event) {
				this.addForm.workContent = event
			},
		}
	};
</script>
<style scoped>
	.addwork {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.van-image {
		display: block;
	}

	.van-image>>>.van-image__img {
		/* display: block; */
		background-color: white !important;
	}

	.van-cell>>>.van-field__label {
		color: #242424;
		width: auto;
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.fieldbottom::after {
		border-bottom: 0;
	}

	.showtext {
		/* width: 70px; */
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	/* 选择器居中 */
	.fieldtype>>>.van-field__control {
		text-align: center;
	}

	/* 内容或者多行内容居左 */
	.contenttype>>>.van-field__control {
		text-align: left;
	}

	.chooseleft>>>.van-field__control {
		text-align: left;
	}

	.van-tag__close {
		margin-left: 20px;
	}

	.gassafeshow>>>.van-tag__close {
		position: absolute;
		right: 5px;
	}

	.fieldmargin {
		margin-bottom: 10px;
	}

	.van-cell__title {
		text-align: left;
	}

	.showul {
		text-align: left;
		overflow-y: scroll;
		max-height: 200px;
	}

	.showul li {
		color: #c8c9cc;

		margin: 15px 0;
	}

	.checkmanshow {
		margin-top: 10px;
	}
</style>
