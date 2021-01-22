<template>
	<div class="checkTwo">
		<van-form ref="detailform" @submit="submit">
			<van-field v-model="detailForm.wcode" name="设备位号" label="设备位号" placeholder="设备位号" disabled></van-field>
			<van-field v-model="detailForm.gcode" name="工单编号" label="工单编号" placeholder="工单编号" disabled></van-field>
			<van-field v-model="detailForm.place" name="设备位置" label="设备位置" placeholder="设备位置" disabled></van-field>
			<van-field v-model="detailForm.question" class="problem" name="问题描述" label="问题描述" placeholder="问题描述" type="textarea"
			 autosize disabled></van-field>
			<van-field v-model="detailForm.askperson" name="申请人" label="申请人" placeholder="申请人" disabled></van-field>
			<van-field v-model="detailForm.askdept" name="申请部门" label="申请部门" placeholder="申请部门" disabled></van-field>
			<van-field v-model="detailForm.asktime" name="申请时间" label="申请时间" placeholder="申请时间" disabled></van-field>
			<van-field v-model="detailForm.questionpic" name="问题图片" label="问题图片" placeholder="问题图片" disabled>
				<template #input>
					<van-row>
						<van-col span="24">
							<van-image v-for="(item,index) in badPic " :key="index" style="margin: 5px;" width="1.8rem" fit="cover" height="1.8rem"
							 :src="item.url" @click="seeBigImg(badPic,index)" />
						</van-col>
					</van-row>
				</template>
			</van-field>
			<van-field v-model="detailForm.person" name="person" label="确认人" placeholder="确认人" disabled></van-field>
			<van-field v-model="detailForm.content" class="problem" name="content" label="确认意见" placeholder="" type="textarea" autosize
			 disabled></van-field>
			<van-field v-model="detailForm.status" name="status" label="问题确认" placeholder="问题确认状态" disabled></van-field>
			<!-- <van-field is-link readonly clickable v-model="detailForm.isDanger" name="isDanger" label="是否危险作业" placeholder="是否危险作业"
			 border @click="showPicker = true"></van-field> -->
			<van-popup v-model="showPicker" round position="bottom">
				<van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
			</van-popup>
			<div style="margin: 30px;">
				<van-button round block type="info" native-type="submit">
					{{workname}}
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
		name: "checkTwo",
		components: {},
		data() {
			return {
				checkbox: false,
				workname: '填写维修工单',
				detailForm: {
					wcode: '',
					gcode: '',
					place: '',
					question: '',
					askperson: '',
					askdept: '',
					asktime: '',
					questionpic: '',
					person: '',
					content: '',
					dept: '',
					status: '',
					time: '',
					weixiuPerson: '',
					processInsatnceId: '',
					isDanger: '否'
				},
				showPicker: false,
				fromlastData: [],
				columns: ['否', '是'],
				showResult: false,
				resultType: ['已修复', '未修复'],
				resultshow: '',
				// 问题图片
				badPic: [],

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
			this.badPic = picData
			this.detailForm = {
				wcode: data.equipmentNo,
				gcode: data.workOrderNo,
				place: data.equipmentLocation,
				question: data.problemContent,
				askperson: data.applyerName,
				askdept: '',
				asktime: this.formatDate(data.applyTime),
				questionpic: '',
				processInsatnceId: data.processInsatnceId,
				person: data.problemConfirmerName,
				content: data.problemConfirmComment!=null?data.problemConfirmComment:'',
				dept: '',
				status: data.isConfirm == 1 ? '存在问题' : '不存在问题',
				weixiuPerson: '',
				isDanger: data.isDangerous == 0 ? '否' : '是'
			}
		},
		methods: {
			onConfirm(value) {
				this.detailForm.isDanger = value
				if (value == '是') {
					this.workname = '填写作业票'
				} else {
					this.workname = '填写维修工单'
				}
				this.showPicker = false;
			},
			//维修结果确认
			resultSure(value) {
				let obj = {};
				this.resultshow = value;
				this.showResult = false;
				obj = this.resultType.find((item) => {
					return item === value;
				});
				console.log(obj)
			},
			submit(form) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					this.$router.push({
						path: "/checkTwoWX",
						query: {
							data: JSON.stringify(this.fromlastData)
						}
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
	.checkTwo {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.van-form {
		margin-bottom: 10px;
		background-color: white;
	}

	.isHaveProblem>>>.van-field__label {
		width: 150px;
	}

	.van-field>>>.van-field__control {
		text-align: right;
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

	.van-checkbox {
		position: absolute;
		left: 4.2rem;
	}

	.van-checkbox>>>.van-checkbox__icon .van-icon {
		border-radius: 5px;
	}
</style>
