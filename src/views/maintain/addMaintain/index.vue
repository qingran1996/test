<template>
	<div class="maintainAdd">
		<van-form ref="addform" @submit="submit">
			<!-- <van-field  v-model="addForm.scode" name="1" label="设备单号" placeholder="填写设备单号" :rules="rules"></van-field> -->
			<van-field v-model="addForm.wcode" name="equipmentId" label="设备位号" placeholder="输入设备位号" disabled></van-field>
			<van-field v-model="addForm.gcode" name="workOrderNo" label="工单编号" placeholder="输入工单编号" disabled></van-field>
			<van-field v-model="addForm.place" name="equipmentLocation" label="设备位置" placeholder="填写设备位置" disabled></van-field>
			<van-field required v-model="addForm.question" name="problemContent" label="问题描述" placeholder="写下问题描述" :rules="rules" type="textarea"
			 autosize></van-field>
			<van-field v-model="addForm.questionpic" name="pic" label="问题图片" disabled>
				<template #button>
					<van-uploader multiple v-model="picMsg" :before-delete="deletefile" :after-read="afterRead" />
				</template>
			</van-field>
			<!-- <van-field v-model="addForm.person" name="确认人" label="确认人" placeholder="请选择确认人" :rules="rules"></van-field> -->
			<van-field required is-link readonly clickable label="确认人" :rules="rules" :value="addForm.person" placeholder="选择确认人" @click="showPicker = true" />
			<van-popup v-model="showPicker" round position="bottom">
				<van-picker show-toolbar :columns="personNameData" @cancel="showPicker = false" @confirm="onConfirm" />
			</van-popup>
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
					scode: '',
					wcode: this.$route.query.kks,
					gcode: '',
					place: this.$route.query.area,
					question: '',
					questionpic: '',
					person: ''
				},
				showPicker: false,
				problemConfirmorId: null, //确认人id
				personNameData: [],
				personData: [],
				picAll: [],
				picMsg: [],
				showpic: [],
				current: 0,
				uploadmisg: '',
				rules: [{
					required: true
				}] //验证规则
			}
		},
		activated() {
			this.showpic = []
		},
		mounted() {
			//console.log(this.$route.query)
			this.getwordNo() //获取工单号
			this.getNextUser() //获取下个人
		},
		methods: {
			onConfirm(value) {
				let obj = {};
				// console.log(value)
				this.addForm.person = value;
				this.showPicker = false;
				obj = this.personData.find((item) => {
					return item.personName === value;
				});
				// console.log(obj.personId)
				this.problemConfirmorId = obj.personId
			},
			//获取下个人
			getNextUser() {
				let json = {
					phase: 2,
					deploymentName: 'workNote'
				}
				this.personNameData = []
				this.getNextAssigent(json).then(res => {
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
			//获取工单号
			getwordNo() {
				let json = {}
				this.$axios.post('/w/equipmentMaintenanceBussiness/getWorkOrderNo').then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							this.addForm.gcode = res.data.data
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
					form.pic = this.uploadmisg
					let picdata = []
					for (var i = 0; i < this.showpic.length; i++) {
						picdata.push({
							pictureType: 1,
							attachId: this.showpic[i].id
						})
					}
					//	console.log(picdata)
					let json = {
						assigent: localStorage.getItem('userId'),
						deploymentName: 'workNote',
						processInsatnceName: this.addForm.question,
						auditeStatus: '1',
						nextAssigent: this.problemConfirmorId,
						forNameCode: 1,
						stage: 1,
						data: {
							equipmentId: this.$route.query.id,
							equipmentLocation: form.equipmentLocation,
							workOrderNo: form.workOrderNo,
							problemContent: form.problemContent,
							applyerId: localStorage.getItem('userId'),
							applyDepName: '申请部门',
							problemConfirmorId: this.problemConfirmorId,
							applyPics: picdata
						}
					}
					console.log(json)
					this.$axios.post('/w/workNoteActWorkFlow/initProcessInstance', json).then(res => {
							if (res.data.code === 0) {
								setTimeout(() => {
									//	console.log(form)
									this.$router.push("/maintain")
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
				// console.log(file)
				console.log(this.picMsg)
				let that = this
				this.showpic = []
				let current = this.current //当前上传
				if (this.picMsg.length != 0) {
					this.uploadfile(0)
				}


				//this.uploadmisg = file.content
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
				// let obj = {};
				// obj = this.picMsg.find((item) => {
				// 	return item.content === file.content;
				// });
				// console.log(obj)
			}
		}
	}
</script>

<style scoped>
	.maintainAdd {
		height: calc(100% - 50px);
		overflow-y: scroll;
	}

	.van-field>>>.van-field__body {
		display: block;
	}

	.van-cell>>>.van-field__label {
		color: #242424;
	}
</style>
