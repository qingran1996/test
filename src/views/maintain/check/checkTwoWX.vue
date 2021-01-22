<template>
	<div class="checkTwoWX">
		<van-form ref="detailform" @submit="submit">
			<van-field v-model="detailForm.wcode" name="wcode" label="设备位号" placeholder="设备位号" disabled></van-field>
			<van-field required v-model="detailForm.wxcontent" class="problem" name="problemContent" label="维修内容" placeholder="写下问题描述"
			 :rules="rules" type="textarea" autosize></van-field>
			<van-field v-model="detailForm.wxpic" name="wxpic" label="问题图片">
				<template #button>
					<van-uploader multiple v-model="picMsg" :before-delete="deletefile" :after-read="afterRead" />
				</template>
			</van-field>
			<van-field class="isHaveLoss" v-model="detailForm.isHaveLoss" name="isHaveLoss" label="是否有遗留问题" placeholder="是否有遗留问题">
				<template #input>
					<van-checkbox v-model="checkbox" shape="square" />
				</template>
			</van-field>
			<van-field required v-if="checkbox" :rules="rules" class="problem" v-model="detailForm.losscontent" name="losscontent" label="遗留问题内容"
			 placeholder="遗留问题内容" type="textarea" autosize></van-field>
			<van-field required is-link readonly clickable label="故障类型" :rules="rules" :value="detailForm.badType" placeholder="选择故障类型"
			 @click="showPicker = true" />
			<van-popup v-model="showPicker" round position="bottom">
				<van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
			</van-popup>
			<van-field required v-model="detailForm.badFX" name="badFX" class="problem" label="故障分析" placeholder="写下故障分析" :rules="rules"
			 type="textarea" autosize></van-field>
			<van-field required is-link class="isHaveLoss" readonly clickable label="维修状态" :rules="rules" :value="detailForm.wxstatus"
			 placeholder="请选择维修状态" @click="statusshow = true" />
			<van-popup v-model="statusshow" round position="bottom">
				<van-picker show-toolbar :columns="statusData" @cancel="statusshow = false" @confirm="statusConfirm" />
			</van-popup>
			<van-field :required="true"  is-link class="isHaveLoss" readonly clickable label="维修结果确认人" :rules="rules"
			 :value="detailForm.wxRequestUser" placeholder="请选择确认人" @click="personshow = true" />
			<van-popup v-model="personshow" round position="bottom">
				<van-picker show-toolbar :columns="personNameData" @cancel="personshow = false" @confirm="personConfirm" />
			</van-popup>
			<div style="margin: 30px;display: flex;">
				<van-button round block type="info" native-type="submit" style="margin-right: 15px;">
					提交
				</van-button>
				<!-- <van-button round block type="info" @click="sure(0)" native-type="submit" style="background-color: rgb(121,121,121);border: 0;">
					未修复
				</van-button> -->
			</div>
		</van-form>
	</div>
</template>

<script>
	export default {
		name: "checkTwoWX",
		data() {
			return {
				checkbox: true,
				showPicker: false,
				personshow: false, //维修结果确认人
				statusshow: false, //维修状态
				personNameData: [],
				statusData: ['已修复', '未修复'],
				personData: [],
				columns: [],
				badTypeData: [],
				detailForm: {
					wcode: '',
					wxcontent: '',
					wxpic: '',
					isHaveLoss: '',
					losscontent: '',
					badType: '',
					badFX: '',
					wxstatus: '已修复',
					wxRequestUser: ''
				},
				faultType: '', //故障类型code
				problemConfirmorId: '',
				shownum: 1,
				picMsg: [],
				showpic: [],
				fromlastData: [],
				// 问题图片
				badPic: [{
					url: 'https://img.yzcdn.cn/vant/leaf.jpg'
				}, {
					url: 'https://img.yzcdn.cn/vant/leaf.jpg'
				}, {
					url: 'https://img.yzcdn.cn/vant/leaf.jpg'
				}, {
					url: 'https://img.yzcdn.cn/vant/leaf.jpg'
				}],
				rules: [{
					required: true
				}] //验证规则
			};
		},
		mounted() {
			let data = JSON.parse(this.$route.query.data)
			console.log(data)
			this.detailForm.wcode = data.equipmentNo
			this.fromlastData = data
			this.getFaultType() //获取故障类型
			this.getNextUser() //结果确认人
		},
		methods: {
			sure(num) {
				this.shownum = num
			},
			submit(form) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					let picdata = []
					for (var i = 0; i < this.showpic.length; i++) {
						picdata.push({
							pictureType: 2,
							attachId: this.showpic[i].id
						})
					}
					let json = {
						processInstanceId: this.fromlastData.processInsatnceId,
						message: '',
						auditStatus: this.shownum,
						nextAssigent: this.problemConfirmorId,
						forNameCode: 1,
						stage: 3,
						data: {
							id: this.fromlastData.id,
							processorId: localStorage.getItem('userId'),
							processingDepName: '',
							processingContent: this.detailForm.wxcontent,
							processingResult: this.shownum,
							areRemainingProblems: this.checkbox == true ? 1 : 0,
							remainingContent: this.detailForm.losscontent,
							faultType: this.faultType,
							faultAnalysis: this.detailForm.badFX,
							resultStatus: this.shownum,
							confirmResultPersonId: this.problemConfirmorId,
							processingPics: picdata
						}
					}
					console.log(json)
					this.$axios.post('/w/workNoteActWorkFlow/completeTask', json).then(res => {
							if (res.data.code === 0) {
								setTimeout(() => {
									//	console.log(form)
									if (this.shownum == 1) {
										this.$store.commit('getmaintain', '1')
										this.$router.push("/maintain")
									} else {
										this.$store.commit('getmaintain', '2')
										this.$router.push("/maintain")
									}

								}, 300)
							} else {
								this.$toast(res.data.message)
							}
						})
						.catch(res => {
							this.$toast('服务异常')
						})
				}, 300) // 大概时间300ms


			},
			//故障类型选择
			onConfirm(value) {
				let obj = {};
				this.detailForm.badType = value;
				this.showPicker = false;
				obj = this.badTypeData.find((item) => {
					return item.name === value;
				});
				//	console.log(obj)
				this.faultType = obj.code
			},
			//维修状态
			statusConfirm(value) {
				this.detailForm.wxstatus = value
				this.statusshow = false
				if (value == '未修复') {
					// this.problemConfirmorId = ''
					this.shownum = 0
				} else {
					this.shownum = 1
				}
			},
			//结果确认人选择
			personConfirm(value) {
				let obj = {};
				// console.log(value)
				this.detailForm.wxRequestUser = value
				this.personshow = false;
				obj = this.personData.find((item) => {
					return item.personName === value;
				});
				console.log(obj.personId)
				this.problemConfirmorId = obj.personId
			},
			//故障分析
			getFaultType() {
				let json = {}
				this.columns = []
				this.$axios.post('/w/equipmentMaintenanceBussiness/getFaultType').then(res => {
						if (res.data.code === 0) {
							//console.log(res.data.data)
							let data = res.data.data
							this.badTypeData = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.columns.push(data[i].name)
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			//获取下个人
			getNextUser() {
				let json = {
					phase: 4,
					deploymentName: 'workNote'
				}
				this.personNameData = []
				this.$axios.post('/w/equipmentMaintenanceBussiness/getNextAssigent', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							let data = res.data.data
							this.personData = res.data.data
							for (let i = 0; i < data.length; i++) {
								this.personNameData.push(data[i].personName)
							}
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			uploadfile(i) {
				if (i < this.picMsg.length) {
					this.picMsg[i].status = 'uploading'
					this.picMsg[i].message = '上传中...'
					let formData = new FormData()
					formData.append('file', this.picMsg[i].file)
					formData.append('source', 4)
					//console.log(formData)
					let that = this
					this.$axios.post('/u/attach/upload', formData, {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}).then(res => {
							if (res.data.code === 0) {
								console.log(res.data.data)
								setTimeout(() => {
									that.picMsg[i].status = 'done';
									that.picMsg[i].message = '上传成功';
									that.showpic.push(res.data.data)
									that.uploadfile(i + 1)
								}, 500)
							} else {
								setTimeout(() => {
									that.picMsg[i].status = 'failed';
									that.picMsg[i].message = '上传失败';
									that.uploadfile(i + 1)
								}, 500)
							}
						})
						.catch(res => {
							setTimeout(() => {
								that.picMsg[i].status = 'failed';
								that.picMsg[i].message = '上传失败';
								that.uploadfile(i + 1)
							}, 500)
						})
				} else {
					// this.picMsg = []
				}
			},
			afterRead(file) {
				console.log(this.picMsg)
				let that = this
				this.showpic = []
				let current = this.current //当前上传
				if (this.picMsg.length != 0) {
					this.uploadfile(0)
				}
			},
			deletefile(file) {
				//console.log(file)
				//console.log(this.picMsg)
				for (var i = 0; i < this.picMsg.length; i++) {
					if (this.picMsg[i].content === file.content) {
						this.picMsg.splice(i, 1);
					}
				}
				//console.log(this.picMsg)
				for (var i = 0; i < this.showpic.length; i++) {
					if (file.file.name === this.showpic[i].fileName) {
						this.showpic.splice(i, 1)
					}
				}
				console.log(this.showpic)
			},
		}
	};
</script>
<style scoped>
	.checkTwoWX {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.isHaveLoss>>>.van-field__label {
		width: 150px;
	}

	.van-field>>>.van-field__body {
		display: block;
	}

	.van-checkbox {
		position: absolute;
		left: 4.2rem;
	}

	.problem>>>.van-field__control {
		text-align: left;
	}

	.van-field>>>.van-field__label {
		color: #646566;
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.van-checkbox>>>.van-checkbox__icon .van-icon {
		border-radius: 5px;
	}
</style>
