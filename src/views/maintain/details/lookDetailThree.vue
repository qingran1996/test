<template>
	<div class="lookDetailThree">
		<van-form ref="detailform">
			<van-field v-model="detailForm.wcode" name="设备位号" label="设备位号" placeholder="设备位号" disabled></van-field>
			<van-field v-model="detailForm.gcode" name="工单编号" label="工单编号" placeholder="工单编号" disabled></van-field>
			<van-field v-model="detailForm.place" name="设备位置" label="设备位置" placeholder="设备位置" disabled></van-field>
			<van-field v-model="detailForm.question" class="problem" name="问题描述" label="问题描述" placeholder="问题描述" type="textarea"
			 autosize disabled></van-field>
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
			<van-field v-model="detailForm.person" name="person" label="申请人" placeholder="" disabled></van-field>
			<van-field v-model="detailForm.dept" name="dept" label="申请部门" placeholder="" disabled></van-field>
			<van-field v-model="detailForm.time" name="time" label="申请时间" placeholder="" disabled border></van-field>
			<van-field v-model="detailForm.problemConfirmerName" name="problemConfirmerName" label="确认人" placeholder="" disabled></van-field>
			<van-field v-model="detailForm.content" class="problem" name="content" label="确认意见" placeholder="" type="textarea" autosize
			 disabled></van-field>
			<van-field v-model="detailForm.status" name="status" label="问题确认" placeholder="" disabled></van-field>
			<van-field v-model="detailForm.weixiuPerson" name="weixiuPerson" label="维修人" placeholder="" disabled border></van-field>
			<van-field v-model="detailForm.wxcontent" class="problem" name="wxcontent" label="维修意见" placeholder="" type="textarea" autosize
			 disabled></van-field>
			<!-- <van-field v-model="detailForm.isDanger" name="isDanger" label="是否危险作业" placeholder="" disabled border></van-field> -->
		</van-form>
		<!-- 维修工单 -->
		<van-form ref="workOrder">
			<van-divider dashed :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">维修工单</van-divider>
			<van-field v-model="workOrder.dept" name="dept" label="维修部门" placeholder="" disabled></van-field>
			<van-field v-model="workOrder.weixiuPerson" name="weixiuPerson" label="维修人" placeholder="" disabled></van-field>
			<van-field v-model="workOrder.time" name="time" label="维修时间" placeholder="" disabled></van-field>
			<van-field v-model="workOrder.result" name="result" label="维修结果" placeholder="" disabled></van-field>
			<van-field v-model="workOrder.content" class="problem" name="content" label="维修内容" placeholder="" type="textarea" autosize
			 disabled></van-field>
			<van-field v-model="workOrder.pic" name="pic" label="维修图片" placeholder="维修图片" disabled>
				<template #input>
					<van-row>
					  <van-col span="24">
						  <van-image v-for="(item,index) in weixiuPic " :key="index" style="margin: 5px;" width="1.8rem" fit="cover" height="1.8rem"
						   :src="item.url" @click="seeBigImg(weixiuPic,index)" />
					  </van-col>
					</van-row>
				</template>
			</van-field>
			<van-field class="isHaveProblem" v-model="workOrder.isHaveProblem" name="isHaveProblem" label="是否有遗留问题" placeholder="是否有遗留问题"
			 disabled>
				<template #input>
					<van-checkbox v-model="checkbox" disabled shape="square" />
				</template>
			</van-field>
			<van-field v-show="checkbox" v-model="workOrder.problem" class="problem" name="problem" label="遗留问题内容" placeholder="遗留问题内容" type="textarea"
			 autosize disabled></van-field>
			<van-field v-model="workOrder.badType" name="badType" label="故障类型" placeholder="故障类型" disabled></van-field>
			<van-field v-model="workOrder.badFX" class="problem" name="badFX" label="故障分析" placeholder="故障分析" type="textarea" autosize disabled></van-field>
			<van-field class="isHaveProblem" v-model="workOrder.weixiuResultPerson" name="weixiuResultPerson" label="维修结果确认人"
			 placeholder="维修结果确认人" disabled></van-field>
		</van-form>
	</div>
</template>

<script>
	import {ImagePreview} from 'vant'
	export default {
		name: "lookDetailThree",
		components: {},
		data() {
			return {
				checkbox: false,
				detailForm: {
					wcode: '',
					gcode: '',
					place: '',
					question: '',
					questionpic: '',
					person: '',
					content: '',
					dept: '',
					problemConfirmerName: '',
					wxcontent: '',
					status: '',
					time: '',
					weixiuPerson: '',
					isDanger: ''
				},
				//维修工单
				workOrder: {
					dept: '',
					weixiuPerson: '',
					time: '',
					result: '',
					content: '',
					pic: '',
					isHaveProblem: '',
					problem: '',
					badType: '',
					badFX: '',
					weixiuResultPerson: '',
					weixiuResultType: ''
				},
				resultshow: '',
				badPic: [],
				weixiuPic: [],
			};
		},
		mounted() {
			let data = JSON.parse(this.$route.query.data)
			console.log(data)
			let picData = []
			let wxpic = []
			if (data.applyPics.length!=0) {
				for (let i=0;i<data.applyPics.length;i++) {
					picData.push({
						url: this.$store.state.picUrl + data.applyPics[i].picPath
					})
				}
			}
			this.badPic = picData
			if (data.processingPics.length!=0) {
				for (let i=0;i<data.processingPics.length;i++) {
					wxpic.push({
						url: this.$store.state.picUrl + data.processingPics[i].picPath
					})
				}
			}
			this.weixiuPic = wxpic
			this.detailForm = {
				wcode: data.equipmentNo,
				gcode: data.workOrderNo,
				place: data.equipmentLocation,
				question: data.problemContent,
				questionpic: '',
				person: data.applyerName,
				content: data.problemConfirmComment!=null?data.problemConfirmComment:'',
				dept: '',
				problemConfirmerName: data.problemConfirmerName,
				wxcontent: data.processingContent!=null?data.processingContent:'',
				status: data.isConfirm==1?'存在问题':'不存在问题',
				time: this.formatDate(data.applyTime),
				weixiuPerson: data.processingPersonName,
				isDanger: data.isDangerous==0?'否':'是'
			}
			this.workOrder = {
				dept: data.processingDepName,
				weixiuPerson: data.processingPersonName,
				time: this.formatDate(data.processingTime),
				result: data.processingResult==1?'已修复':'未修复',
				content: data.processingContent,
				pic: '',
				isHaveProblem: '',
				problem: data.legacyContent,
				badType: data.faultTypeName,
				badFX: data.faultAnalysis,
				weixiuResultPerson: data.confirmResultPersonName,
				weixiuResultType: ''
			}
			if (data.isLegacy==1) {
				this.checkbox=true
			} else {
				this.checkbox=false
			}
		},
		methods: {
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
	.lookDetailThree {
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
	.problem>>>.van-field__control {
		text-align: left;
	}
	.van-field>>>.van-field__control:disabled {
		-webkit-text-fill-color: #999999;
	}
	
	.van-cell>>>.van-field__label {
		color: #242424;
	}
	
	.van-checkbox {
		position: absolute;
		left: 4.2rem;
	}
	
	.van-checkbox>>>.van-checkbox__icon .van-icon {
		border-radius: 5px;
	}
</style>
