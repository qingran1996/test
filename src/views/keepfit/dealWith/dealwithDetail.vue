<template>
	<div class="dealwithDetail">
		<van-form ref="addform">
			<van-field v-model="addForm.devicename" name="devicename" label="设备名称" placeholder="" disabled type="textarea"
			 autosize></van-field>
			<van-field v-model="addForm.devicecode" name="devicecode" label="设备位号" placeholder="" disabled></van-field>
			<van-field v-model="addForm.deviceplace" name="deviceplace" label="设备位置" placeholder="" disabled></van-field>
			<van-field v-model="addForm.plancode" name="plancode" label="保养计划编号" placeholder="" disabled></van-field>
			<van-field v-model="addForm.plancontent" name="plancontent" label="保养内容" placeholder="" disabled></van-field>
			<van-field v-model="addForm.keepfittime" name="keepfittime" label="预计保养时间(h)" placeholder="" disabled></van-field>
			<van-field v-model="addForm.keepfitrate" name="keepfitrate" label="保养频率" placeholder="" disabled></van-field>
			<van-field v-model="addForm.keepfitweek" name="keepfitweek" label="保养频率周期" placeholder="" disabled></van-field>
			<van-cell title="保养前图片">
			  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
			  <template #default>
			    <van-image
			      width="40"
			      height="40"
			      fit="cover"
			      :src="addForm.keepfitpicbefore"
				  @click="showbefore"
			    />
			  </template>
			</van-cell>
			<van-cell title="保养后图片">
			  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
			  <template #default>
			    <van-image
			      width="40"
			      height="40"
			      fit="cover"
			      :src="addForm.keepfitpicafter"
				  @click="showafter"
			    />
			  </template>
			</van-cell>
			<van-field v-model="addForm.result" name="result" label="保养结果" placeholder="" disabled></van-field>
			<van-field v-model="addForm.remark" name="remark" label="备注" placeholder="" disabled type="textarea"
			 autosize></van-field>
		</van-form>
	</div>
</template>

<script>
	import { ImagePreview } from 'vant';
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
			}
		},
		methods: {
			showbefore () {
				let data = []
				data.push(this.addForm.keepfitpicbefore)
				ImagePreview(data);
			},
			showafter () {
				let data = []
				data.push(this.addForm.keepfitpicafter)
				ImagePreview(data);
			},
		},
		created() {
			let data = JSON.parse(decodeURI(this.$route.query.data))
			console.log(data)
			this.addForm.deviceId = data.deviceId
			this.addForm.maintainPlanId = data.maintainPlanId
			this.addForm.devicename = data.device.deviceName
			this.addForm.devicecode = data.device.deviceKks
			this.addForm.deviceplace = data.device.installAreaName
			this.addForm.plancode = data.maintainPlan.planNum
			this.addForm.plancontent = data.maintainPlan.content
			this.addForm.keepfittime = data.maintainPlan.time
			this.addForm.keepfitrate = data.maintainPlan.frequency
			this.addForm.keepfitpicbefore = data.beforeImagePath
			this.addForm.keepfitpicafter = data.afterImagePath
			if (data.maintainPlan.frequencyType === 1) {
				this.addForm.keepfitweek = '日'
			} else if (data.maintainPlan.frequencyType === 2) {
				this.addForm.keepfitweek = '周'
			} else {
				this.addForm.keepfitweek = '月'
			}
			this.addForm.result = data.resultType==1?'正常':'异常'
			this.addForm.remark = data.remark
		}
	}
</script>

<style scoped>
	.dealwithDetail {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}
	.van-cell__title {
		text-align: left;
	}
	.van-cell>>>.van-field__label {
		color: #242424;
	}

	.van-form {
		margin-bottom: 10px;
		background-color: white;
	}
</style>
