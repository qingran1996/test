<template>
	<div class="keepfitadd">
		<van-form ref="addform" @submit="submit">
			<van-field v-model="addForm.devicename" name="devicename" label="设备名称" placeholder="" disabled type="textarea"
			 autosize></van-field>
			<van-field v-model="addForm.devicecode" name="devicecode" label="设备位号" placeholder="" disabled></van-field>
			<van-field v-model="addForm.deviceplace" name="deviceplace" label="设备位置" placeholder="" disabled></van-field>
			<van-field v-model="addForm.plancode" name="plancode" label="保养计划编号" placeholder="" disabled></van-field>
			<van-field v-model="addForm.plancontent" name="plancontent" label="保养内容" placeholder="" disabled></van-field>
			<van-field v-model="addForm.keepfittime" name="keepfittime" label="预计保养时间(h)" placeholder="" disabled></van-field>
			<van-field v-model="addForm.keepfitrate" name="keepfitrate" label="保养频率" placeholder="" disabled></van-field>
			<van-field v-model="addForm.keepfitweek" name="keepfitweek" label="保养频率周期" placeholder="" disabled></van-field>
			<van-field required v-model="addForm.keepfitpicbefore" name="pic" label="保养前图片" disabled>
				<template #button>
					<van-uploader multiple v-model="beforepicMsg" :before-delete="deletefile" :after-read="afterRead" :max-count="1" />
				</template>
			</van-field>
			<van-field required v-model="addForm.keepfitpicafter" name="pic" label="保养后图片" disabled>
				<template #button>
					<van-uploader multiple v-model="afterpicmsg" :before-delete="deletefile1" :after-read="afterRead1" :max-count="1" />
				</template>
			</van-field>

			<van-field class="fieldshow" required is-link readonly clickable label="保养结果" :rules="rules" :value="addForm.result"
			 placeholder="请选择保养结果" @click="showPicker = true" />
			<van-popup v-model="showPicker" round position="bottom">
				<van-picker show-toolbar :columns="personNameData" @cancel="showPicker = false" @confirm="onConfirm" />
			</van-popup>
			<van-field required v-model="addForm.remark" name="remark" label="备注" placeholder="请填写备注" :rules="rules" type="textarea"
			 autosize></van-field>
			<div style="margin: 30px;">
				<van-button round block type="info" native-type="submit">
					提交
				</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				addForm: {
					devicename: '',
					deviceId: null,
					maintainPlanId: null,
					devicecode: '',
					deviceplace: '',
					plancode: '',
					plancontent: '',
					keepfittime: '',
					keepfitrate: '',
					keepfitweek: '',
					keepfitpicbefore: '',
					keepfitpicafter: '',
					result: '',
					remark: ''
				},
				showPicker: false,
				problemConfirmorId: null, //确认人id
				personNameData: ['正常', '异常'],
				personData: [],
				picAll: [],
				beforepicId: null,
				afterpicId: null,
				beforepicMsg: [],
				afterpicmsg: [],
				showbeforepic: [],
				showafterpic: [],
				current: 0,
				uploadmisg: '',
				rules: [{
					required: true
				}] //验证规则
			}
		},
		activated() {
			this.showbeforepic = []
		},
		created() {
			let data = JSON.parse(decodeURI(this.$route.query.data))
			// console.log(data)
			this.addForm.deviceId = data.deviceId
			this.addForm.maintainPlanId = data.maintainPlanId
			this.addForm.devicename = data.device.deviceName
			this.addForm.devicecode = data.device.deviceKks
			this.addForm.deviceplace = data.device.installAreaName
			this.addForm.plancode = data.maintainPlan.planNum
			this.addForm.plancontent = data.maintainPlan.content
			this.addForm.keepfittime = data.maintainPlan.time
			this.addForm.keepfitrate = data.maintainPlan.frequency
			if (data.maintainPlan.frequencyType === 1) {
				this.addForm.keepfitweek = '日'
			} else if (data.maintainPlan.frequencyType === 2) {
				this.addForm.keepfitweek = '周'
			} else {
				this.addForm.keepfitweek = '月'
			}
		},
		mounted() {

		},
		methods: {
			onConfirm(event) {
				// console.log(event)
				this.addForm.result = event
				this.showPicker = false
			},
			submit(form) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					if (this.beforepicMsg.length == 0&& this.afterpicmsg.length != 0) {
						this.$toast('请上传保养前图片')
					} else if (this.beforepicMsg.length == 0 && this.afterpicmsg.length == 0) {
						this.$toast('请上传保养前与保养后的图片')
					} else if (this.afterpicmsg.length == 0 && this.beforepicMsg.length != 0) {
						this.$toast('请上传保养后图片')
					} else {
						let json = {
							deviceId: this.addForm.deviceId,
							maintainPlanId: this.addForm.maintainPlanId,
							executor: localStorage.getItem('userName'),
							beforeImagePath: this.beforepicId,
							afterImagePath: this.afterpicId,
							executeTime: Date.parse(new Date()),
							resultType: this.addForm.result == '正常' ? 1 : 2,
							remark: this.addForm.remark
						}
						// console.log(json)
						this.$axios.post('d/MaintainRuTask/completeTask',json).then(res => {
								if (res.data.code === 0) {
									setTimeout(() => {
										this.$store.commit('getkeepfit','2')
										this.$router.push("/keepfit")
									}, 300)
								} else {
									this.$toast(res.data.message)
								}
							})
							.catch(res => {
								this.$toast('服务异常')
							})
					}
				}, 300) // 大概时间300ms
			},
			uploadfile(i) {
				if (i < this.beforepicMsg.length) {
					this.beforepicMsg[i].status = 'uploading'
					this.beforepicMsg[i].message = '上传中...'
					let formData = new FormData()
					formData.append('file', this.beforepicMsg[i].file)
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
								that.beforepicId = this.$store.state.picUrl + res.data.data.filePath
								setTimeout(() => {
									that.beforepicMsg[i].status = 'done';
									that.beforepicMsg[i].message = '上传成功';
									that.showbeforepic.push(res.data.data)
									that.uploadfile(i + 1)
								}, 500)
							} else {
								setTimeout(() => {
									that.beforepicMsg[i].status = 'failed';
									that.beforepicMsg[i].message = '上传失败';
									that.uploadfile(i + 1)
								}, 500)
							}
						})
						.catch(res => {
							setTimeout(() => {
								that.beforepicMsg[i].status = 'failed';
								that.beforepicMsg[i].message = '上传失败';
								that.uploadfile(i + 1)
							}, 500)
						})
				} else {
					// this.beforepicMsg = []
				}
			},
			afterRead(file) {
				// console.log(file)
				console.log(this.beforepicMsg)
				let that = this
				this.showbeforepic = []
				let current = this.current //当前上传
				if (this.beforepicMsg.length != 0) {
					this.uploadfile(0)
				}


				//this.uploadmisg = file.content
			},
			deletefile(file) {
				//console.log(file)
				//console.log(this.picMsg)
				for (var i = 0; i < this.beforepicMsg.length; i++) {
					if (this.beforepicMsg[i].content === file.content) {
						this.beforepicMsg.splice(i, 1);
					}
				}
				//console.log(this.beforepicMsg)
				for (var i = 0; i < this.showbeforepic.length; i++) {
					if (file.file.name === this.showbeforepic[i].fileName) {
						this.showbeforepic.splice(i, 1)
					}
				}
				console.log(this.showbeforepic)
			},
			uploadfile1(i) {
				if (i < this.afterpicmsg.length) {
					this.afterpicmsg[i].status = 'uploading'
					this.afterpicmsg[i].message = '上传中...'
					let formData = new FormData()
					formData.append('file', this.afterpicmsg[i].file)
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
								that.afterpicId = this.$store.state.picUrl + res.data.data.filePath
								setTimeout(() => {
									that.afterpicmsg[i].status = 'done';
									that.afterpicmsg[i].message = '上传成功';
									that.showafterpic.push(res.data.data)
									that.uploadfile(i + 1)
								}, 500)
							} else {
								setTimeout(() => {
									that.afterpicmsg[i].status = 'failed';
									that.afterpicmsg[i].message = '上传失败';
									that.uploadfile(i + 1)
								}, 500)
							}
						})
						.catch(res => {
							setTimeout(() => {
								that.afterpicmsg[i].status = 'failed';
								that.afterpicmsg[i].message = '上传失败';
								that.uploadfile(i + 1)
							}, 500)
						})
				} else {
					// this.afterpicmsg = []
				}
			},
			afterRead1(file) {
				// console.log(file)
				// console.log(this.afterpicmsg)
				let that = this
				this.showafterpic = []
				let current = this.current //当前上传
				if (this.afterpicmsg.length != 0) {
					this.uploadfile1(0)
				}


				//this.uploadmisg = file.content
			},
			deletefile1(file) {
				//console.log(file)
				//console.log(this.picMsg)
				for (var i = 0; i < this.afterpicmsg.length; i++) {
					if (this.afterpicmsg[i].content === file.content) {
						this.afterpicmsg.splice(i, 1);
					}
				}
				//console.log(this.afterpicmsg)
				for (var i = 0; i < this.showafterpic.length; i++) {
					if (file.file.name === this.showafterpic[i].fileName) {
						this.showafterpic.splice(i, 1)
					}
				}
				// console.log(this.showafterpic)
			}
		}
	}
</script>

<style scoped>
	.keepfitadd {
		height: calc(100% - 50px);
		overflow-y: scroll;
	}

	.van-field>>>.van-field__body {
		display: block;
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.fieldshow>>>.van-field__control {
		text-align: center;
	}

	.van-cell>>>.van-field__label {
		color: #242424;
		width: auto;
	}
</style>
