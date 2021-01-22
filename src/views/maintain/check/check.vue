<template>
	<div class="check">
		<van-form ref="addform" @submit="submit">
			<van-field v-model="addForm.wcode" name="equipmentId" label="设备位号" placeholder="输入设备位号" disabled></van-field>
			<van-field v-model="addForm.gcode" name="workOrderNo" label="工单编号" placeholder="输入工单编号" disabled></van-field>
			<van-field v-model="addForm.place" name="equipmentLocation" label="设备位置" placeholder="填写设备位置" disabled></van-field>
			<van-field required v-model="addForm.question" class="problem" name="problemContent" label="问题描述" placeholder="写下问题描述" :rules="rules"
			 type="textarea" autosize></van-field>
			<van-field v-model="addForm.questionpic" name="questionpic" label="问题图片" placeholder="问题图片" disabled>
				<template #input>
					<van-row>
						<van-col span="24">
							<van-image v-for="(item,index) in uploader " :key="index" style="margin: 5px;" width="1.8rem" fit="cover" height="1.8rem"
							 :src="item.url" @click="seeBigImg(uploader,index)" />
						</van-col>
					</van-row>
				</template>
			</van-field>
			<van-field v-model="addForm.person" name="person" label="申请人" placeholder="申请人" disabled></van-field>
			<van-field v-model="addForm.dept" name="dept" label="申请部门" placeholder="申请部门" disabled></van-field>
			<van-field v-model="addForm.time" name="time" label="申请时间" placeholder="申请时间" disabled></van-field>
			<van-field required is-link readonly clickable label="问题确认" name="problem" :rules="rules" :value="addForm.problem"
			 placeholder="请选择问题并确认" @click="showPicker = true" />
			<van-popup v-model="showPicker" round position="bottom">
				<van-picker show-toolbar :columns="problemData" @cancel="showPicker = false" @confirm="onConfirm" />
			</van-popup>
			<van-field required is-link v-if="auditStatus==1" readonly clickable label="维修人" :rules="rules" :value="weixiuPerson"
			 placeholder="请选择维修人" @click="showPerson = true" />
			<van-popup v-model="showPerson" round position="bottom">
				<van-picker show-toolbar :columns="personNameData" @cancel="showPerson = false" @confirm="personSure" />
			</van-popup>
			<van-field required v-model="addForm.reason" class="problem" name="problemContent" label="审核意见" placeholder="请写下审核意见" :rules="rules"
			 type="textarea" autosize></van-field>
			<div style="margin: 30px;">
				<van-button round block type="info" native-type="submit">
					提交
				</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import {
		ImagePreview
	} from 'vant'
	export default {
		name: "check",
		components: {},
		data() {
			return {
				showDialog: false,
				fromlastData: [],
				addForm: {
					wcode: this.$route.query.kks,
					gcode: '',
					place: '',
					question: '',
					questionpic: '',
					person: '',
					dept: '',
					time: '',
					problem: '',
					reason: ''
				},
				personNameData: [],
				personData: [], //获取下个人详细信息
				weixiuPerson: '', //维修人姓名
				showPerson: false,
				problemData: ['存在问题', '不存在问题'],
				auditStatus: 1, //判断是否存在问题
				processorId: null, //处理人Id
				uploader: [],
				showPicker: false,
				rules: [{
					required: true
				}] //验证规则
			};
		},
		mounted() {
			let data = JSON.parse(this.$route.query.data)
			console.log(data)
			this.fromlastData = data
			let picData = []
			if (data.applyPics.length != 0) {
				for (let i = 0; i < data.applyPics.length; i++) {
					picData.push({
						url: this.$store.state.picUrl + data.applyPics[i].picPath
					})
				}
			}
			this.uploader = picData
			this.addForm = {
				wcode: data.equipmentNo,
				gcode: data.workOrderNo,
				place: data.equipmentLocation,
				question: data.problemContent,
				questionpic: '',
				person: data.applyerName,
				dept: '',
				time: this.formatDate(data.applyTime),
				problem: '',
				reason: ''
			}
			this.getNextUser() //获取下个人
		},
		methods: {
			//问题确认
			onConfirm(value) {
				let obj = {};
				this.addForm.problem = value;
				this.showPicker = false
				console.log(value)
				if (value === '存在问题') {
					this.auditStatus = 1
				} else {
					this.auditStatus = 0
					this.weixiuPerson = null
				}
				// this.showPicker = false;
				// obj = this.problemData.find((item) => {
				// 	return item === value;
				// });
				// console.log(obj)
			},
			//选择维修人
			personSure(value) {
				let obj = {};
				this.weixiuPerson = value;
				this.showPerson = false;
				obj = this.personData.find((item) => {
					return item.personName === value;
				});
				console.log(obj)
				this.processorId = obj.personId
			},
			//获取下个人
			getNextUser() {
				let json = {
					phase: 3,
					deploymentName: 'workNote'
				}
				this.personNameData = []
				this.$axios.post('/w/equipmentMaintenanceBussiness/getNextAssigent', json).then(res => {
						if (res.data.code === 0) {
							//	 console.log(res.data.data)
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
			submit(form) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					let json = {
						processInstanceId: this.fromlastData.processInsatnceId,
						message: this.addForm.reason,
						auditStatus: this.auditStatus,
						nextAssigent: this.processorId,
						forNameCode: 1,
						stage: 2,
						data: {
							id: this.fromlastData.id,
							problemConfirmorId: localStorage.getItem('userId'),
							arePotentialProblems: 0,
							resultStatus: this.auditStatus,
							processorId: this.processorId,
							processingDepName: ''
						}
					}
					console.log(json)
					this.$axios.post('/w/workNoteActWorkFlow/completeTask', json).then(res => {
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
			seeBigImg(images, index) {
				//console.log(images)
				let imgUrl = []
				for (let i = 0; i < images.length; i++) {
					imgUrl.push(images[i].url)
				}
				ImagePreview({
					images: imgUrl,
					showIndex: true,
					loop: false,
					startPosition: index
				})
			}
		}
	}
</script>

<style scoped>
	.check {
		overflow-y: scroll;
		height: calc(100% - 50px);
	}

	.van-field>>>.van-field__control:disabled {
		-webkit-text-fill-color: #999999;
	}

	.van-cell>>>.van-field__label {
		color: #242424;
	}

	.problem>>>.van-field__control {
		text-align: left;
	}

	.van-field>>>.van-field__control {
		text-align: right;
		color: #999999;
	}

	.van-dialog>>>.van-dialog__header {
		padding: 10px 0 !important;
	}

	.van-cell__value {
		text-align: left;
	}

	.van-cell__title {
		text-align: left;
	}
</style>
