<template>
	<div class="safecheck">
		<van-form ref="addform" @submit="submit" @failed="failed">
			<van-field style="margin-bottom: 10px;" required v-model="addForm.homeworkLevel" class="fieldtype" name="homeworkLevel"
			 label="作业票级别" placeholder="请选择作业票级别" clickable readonly @click="showPicker1=true" :rules="rule" is-link></van-field>
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
			<!-- <van-field v-model="addForm.qitiType" center disabled label="气体检测类型"></van-field> -->
			<van-field name="isThree" label="是否第三方检测">
				<template #input>
					<van-radio-group @change="changegroup" style="margin: 0 auto;" v-model="addForm.isThree" direction="horizontal">
						<van-radio name="1">是</van-radio>
						<van-radio name="0">否</van-radio>
					</van-radio-group>
				</template>
			</van-field>
			<!-- <van-field v-model="addForm.checkhouse" class="fieldtype" name="checkhouse" label="检测机构" placeholder="请选择检测机构"
			 clickable readonly @click="showPicker2=true" is-link></van-field> -->

			<!-- <van-field required v-model="addForm.checkman" class="fieldtype" name="checkman" label="检测人" placeholder="请选择检测人"
			 clickable readonly @click="showPicker3=true"  is-link></van-field> -->

			<van-field required :rules="rule" class="chooseleft" v-model="addForm.checkman" name="checkman" label="检测人"
			 placeholder="请选择检测人" clickable readonly>
				<template #input>
					<div style="width: 100%;" slot="input">
						<!-- <input style="width: 100%;border: 0;" name="name"  type="text" placehold="请输入id进行查询" v-model="input_value" v-on:input="throttle"  ref="input" /> -->
						<van-field style="padding: 0;" class="fieldbottom" v-model="input_value" label="" placeholder="请输入姓名或者电话"
						 v-on:input="throttle" ref="input" />
						<ul class="showul" v-show="state">
							<li v-for="(item,index) in list" :key="index" @click="lishow(item)">
								<div><span style="color: orange;">姓名: </span>{{item.name}}</div>
								<div><span style="color: #39A9ED;">电话: </span>{{item.phone}}</div>
								<div><span style="color: #008000;">部门: </span>{{item.longName}}</div>
							</li>
						</ul>
					</div>
				</template>
			</van-field>
			<van-field v-show="addForm.isThree=='1'" v-model="addForm.checkhouse" center disabled label="检测机构"></van-field>
			<van-field style="margin-bottom: 10px;" v-model="addForm.checkphone" center disabled label="联系电话"></van-field>
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
			<!-- <van-field required v-model="addForm.dangerman" class="fieldtype" name="dangerman" label="危险辨识负责人" placeholder="请选择人员"
			 clickable readonly @click="showPicker4=true" :rules="rule" is-link></van-field> -->

			<van-field required :rules="rule" class="chooseleft" v-model="addForm.dangerman" name="dangerman" label="危险辨识负责人"
			 placeholder="请输入危险辨识负责人" clickable readonly>
				<template #input>
					<div style="width: 100%;" slot="input">
						<!-- <input style="width: 100%;border: 0;" name="name"  type="text" placehold="请输入id进行查询" v-model="input_value" v-on:input="throttle"  ref="input" /> -->
						<van-field style="padding: 0;" class="fieldbottom" v-model="input_value1" label="" placeholder="请输入姓名或者电话"
						 v-on:input="throttle1" ref="input1" />
						<ul class="showul" v-show="state1">
							<li v-for="(item,index) in list1" :key="index" @click="lishow1(item)">
								<div><span style="color: orange;">姓名: </span>{{item.name}}</div>
								<div><span style="color: #39A9ED;">电话: </span>{{item.phone}}</div>
								<div><span style="color: #008000;">部门: </span>{{item.longName}}</div>
							</li>
						</ul>
					</div>
				</template>
			</van-field>

			<van-field style="margin-bottom: 80px;" v-model="addForm.dangerphone" center disabled label="联系电话"></van-field>
			<div class="submit">
				<van-button style="margin: 3% 5%;width: 90%;" round block type="info" native-type="submit">
					提交
				</van-button>
			</div>
		</van-form>
		<!--下拉选择1234-->
		<van-popup v-model="showPicker1" position="bottom">
			<van-picker show-toolbar :columns="columns1.name" @confirm="onConfirm1" @cancel="showPicker1 = false" />
		</van-popup>
		<van-popup v-model="showPicker2" position="bottom">
			<van-picker show-toolbar :columns="columns2.name" @confirm="onConfirm2" @cancel="showPicker2 = false" />
		</van-popup>
		<van-popup v-model="showPicker3" position="bottom">
			<van-picker show-toolbar :columns="columns3.name" @confirm="onConfirm3" @cancel="showPicker3= false" />
		</van-popup>
		<van-popup v-model="showPicker4" position="bottom">
			<van-picker show-toolbar :columns="columns4.name" @confirm="onConfirm4" @cancel="showPicker4 = false" />
		</van-popup>
	</div>
</template>

<script>
	export default {
		name: "safecheck",
		components: {},
		data() {
			return {
				state: false,
				statu: true,
				input_value: '',
				dataList: [],
				list: [],
				//
				state1: false,
				statu1: true,
				input_value1: '',
				dataList1: [],
				list1: [],
				addForm: {
					homeworkLevel: '',
					workLevelcode: '',
					qitiType: '',
					isThree: '0',
					checkhouse: '',
					checkman: '',
					checkmanId: '',
					checkphone: '',
					dangercontent: '',
					dangerman: '',
					dangermanid: '',
					dangerphone: ''
				},
				jwDetectMatterBoList: [],
				gascontentList: [],
				showPicker1: false,
				columns1: {
					name: [],
					all: []
				},
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
				rule: [{
					required: true
				}], // 校验规则
				leader: null,
				doId: '',
				doName: '',
				doManagerId: '',
				doManagerName: '',
				doManagerTel: ''
			};
		},
		mounted() {
			this.getAllJobWorkLevel()

			let data = JSON.parse(decodeURI(this.$route.query.data))
			// console.log(data)
			this.leader = data
			this.getdetail(data)
			// this.getuser() //获取危险辨识人员
			// this.getEMWorkOrderNoByWorkNoteNoLike()
		},
		methods: {
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
					if (msg.name.indexOf(this.input_value) != -1 || msg.phone.indexOf(this.input_value) != -1) {
						//然后把当前json添加到list数组中
						this.list.push(msg);
					}
				})
			},
			throttle() {
				//保持this的指向始终指向vue实例
				var that = this;
				// console.log(this.input_value)
				if (!that.statu) {
					return;
				}
				this.getEMWorkOrderNoByWorkNoteNoLike()
				that.statu = false;
				this.dataList = []
				setTimeout(function() {
					that.search();
					that.statu = true;
				}, 500)
			},
			/*名称输入选择*/
			search1() {
				//这个变量主要是用来测试节流后和不节流的区别
				var i = 0;
				//console.log(i++);
				//定义的新数组存放筛选之后的数据
				this.list1 = [];
				//拿到当前input输入框输入的值
				this.input_value1 = this.$refs.input1.value;
				this.state1 = true;
				//循环模拟数据的数组
				this.dataList1.map((msg) => {
					//拿当前json的id、name、time去分别跟输入的值进行比较
					//indexOf 如果在检索的字符串中没有出现要找的值是会返回-1的，所以我们这里不等于-1就是假设输入框的值在当前json里面找到的情况
					if (msg.name.indexOf(this.input_value1) != -1 || msg.phone.indexOf(this.input_value1) != -1) {
						//然后把当前json添加到list数组中
						this.list1.push(msg);
					}
				})
			},
			throttle1() {
				//保持this的指向始终指向vue实例
				var that = this;
				// console.log(this.input_value)
				if (!that.statu1) {
					return;
				}
				this.getEMWorkOrderNoByWorkNoteNoLike1()
				that.statu1 = false;
				this.dataList1 = []
				setTimeout(function() {
					that.search1();
					that.statu1 = true;
				}, 500)
			},
			getEMWorkOrderNoByWorkNoteNoLike() {
				let json = {
					keyWord: this.input_value,
					isThree: this.addForm.isThree,
					pageNo: 1,
					pageSize: 10
				}
				this.dataList = []
				// this.dataList1 = []
				this.columns4 = {
					name: [],
					all: []
				}
				this.$axios.post('/p/person/queryByKeyWord', json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data.content)
							let data = res.data.data.content
							this.dataList = data
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			getEMWorkOrderNoByWorkNoteNoLike1() {
				let json = {
					keyWord: this.input_value1,
					isThree: 0,
					pageNo: 1,
					pageSize: 10
				}
				// this.dataList = []
				this.dataList1 = []
				this.columns4 = {
					name: [],
					all: []
				}
				this.$axios.post('/p/person/queryByKeyWord', json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data.content)
							let data = res.data.data.content
							// this.dataList = data
							this.dataList1 = data
							// for (let i = 0; i < data.length; i++) {
							// 	this.columns4.all.push(data[i])
							// 	this.columns4.name.push(data[i].name)
							// }
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
				this.input_value = item.name
				if (this.addForm.isThree == '0') {
					this.addForm.checkman = item.name
					this.addForm.checkmanId = item.id
					this.addForm.checkphone = item.phone
					this.addForm.checkhouse = item.orgName
				} else {
					this.doId = item.unitId,
						this.doName = item.unitName,
						this.doManagerId = item.id,
						this.doManagerName = item.name,
						this.doManagerTel = item.phone
						
						this.addForm.checkman = item.name
						this.addForm.checkphone = item.phone
						this.addForm.checkhouse = item.unitName
				}

				// this.addForm.workordernum = item.workNoteNo
				// this.addjson.noteNo = item.workNoteNo
				// this.getNoteIdAndNoteType(item.workNoteNo) //点击获取工单编号获取工单id和类型
				this.state = false
			},
			lishow1(item) {
				console.log(item)
				this.input_value1 = item.name
				this.addForm.dangerman = item.name
				this.addForm.dangermanid = item.id
				this.addForm.dangerphone = item.phone
				// this.addForm.workordernum = item.workNoteNo
				// this.addjson.noteNo = item.workNoteNo
				// this.getNoteIdAndNoteType(item.workNoteNo) //点击获取工单编号获取工单id和类型
				this.state1 = false
			},
			changegroup(event) {
				console.log(event)
				this.columns2 = {
					name: [],
					all: []
				}
				this.columns3 = {
					name: [],
					all: []
				}
				this.input_value = ''
				this.addForm.checkman = ''
				this.addForm.checkmanId = ''
				this.addForm.checkphone = ''
				this.addForm.checkhouse = ''
				this.doId = '',
					this.doName = '',
					this.doManagerId = '',
					this.doManagerName = '',
					this.doManagerTel = ''
			},
			getuser() {
				let json = {
					roleName: '危险辨识人员'
				}
				this.columns4 = {
					name: [],
					all: []
				}
				this.getworkByRole(json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							// this.dataList = data
							for (let i = 0; i < data.length; i++) {
								this.columns4.all.push(data[i])
								this.columns4.name.push(data[i].name)
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
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
							this.jwDetectMatterBoList = data.dataResponse.jwDetectMatterBoList
							this.gascontentList = data.dataResponse.jwDangerIdentityList
							this.addForm.homeworkLevel = data.dataResponse.jobLevelName
							this.addForm.workLevelcode = data.dataResponse.jobLevel
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
				this.columns1 = {
					name: [],
					all: []
				}
				this.$axios.post('/w/jobWork/getAllJobWorkLevel', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							let data = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.columns1.name.push(data[i].name)
								this.columns1.all.push(data[i])
							}
							// this.addForm.homeworkLevel = data[0].name //作业类型默认选择第一个
							// this.addForm.workLevelcode = data[0].code
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			failed(form) {
				// console.log(form)
				this.$toast('请完善内容')
			},
			//点击验证
			submit(form) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					// console.log(form)
					let json = {
						processInstanceId: this.leader.processInstanceId,
						taskId: this.leader.taskId,
						bussinessId: this.leader.bussinessId,
						finalJobLevel: this.addForm.workLevelcode,
						jwDetectManagerBoList: [{
							detectTypeCode: '001', //气体检测为001
							doId: this.doId,
							doName: this.doName,
							doManagerId: this.doManagerId,
							doManagerName: this.doManagerName,
							doManagerTel: this.doManagerTel,
							detectManagerId: this.addForm.checkmanId,
							detectManagerName: this.addForm.isThree=='0'?this.addForm.checkman:'',
							detectManagerTel: this.addForm.isThree=='0'?this.addForm.checkphone:''
						}],
						protectManagerId: this.addForm.dangermanid,
						protectManagerName: this.addForm.dangerman,
						protectManagerTel: this.addForm.dangerphone
					}
					console.log(json)
					this.$axios.post('/w/jobWork/securityInfoSubmit', json).then(res => {
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
			// 作业票级别 选择
			onConfirm1(value) {
				this.addForm.homeworkLevel = value;
				this.showPicker1 = false;
				for (let i = 0; i < this.columns1.all.length; i++) {
					if (value == this.columns1.all[i].name) {
						// console.log(this.columns1.all[i].code)
						this.addForm.workLevelcode = this.columns1.all[i].code
					}
				}
			},
			// 检测机构 选择
			onConfirm2(value) {
				this.addForm.checkhouse = value;
				this.showPicker2 = false;
			},
			// 检测人 选择
			onConfirm3(value) {
				this.addForm.checkman = value;
				this.showPicker3 = false;
			},
			// 检测机构 选择
			onConfirm4(value) {
				this.addForm.dangerman = value;
				this.showPicker4 = false;
				for (let i = 0; i < this.columns4.all.length; i++) {
					if (value == this.columns4.all[i].name) {
						// console.log(this.columns4.all[i].id)
						this.addForm.dangermanid = this.columns4.all[i].id
						this.addForm.dangerphone = this.columns4.all[i].phone
					}
				}
			},
		}
	}
</script>

<style scoped>
	.safecheck {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.van-cell>>>.van-field__label {
		color: #242424;
		width: auto;
	}

	.van-cell__title {
		text-align: left;
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.fieldbottom>>>.van-field__control {
		text-align: center;
	}

	/* 选择器居中 */
	.fieldtype>>>.van-field__control {
		text-align: center;
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
</style>
