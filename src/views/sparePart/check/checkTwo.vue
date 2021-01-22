<template>
	<div class="sparePartcheckTwo">
		<van-form ref="applyform">
			<van-field v-model="applyForm.lcode" name="领用单号" label="领用单号" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.type" name="领用类型" label="领用类型" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.bycode" name="维修保养单号" label="维修保养单号" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.name" name="备品备件名称" label="备品备件名称" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.code" name="备品备件编号" label="备品备件编号" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.classification" name="分类" label="分类" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.storeCount" name="实际库存" label="实际库存" disabled></van-field>
			<van-field v-model="applyForm.count" name="领用数量" label="领用数量" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.getuser" name="领用人" label="领用人" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.gettime" name="领用时间" label="领用时间" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.remarks" name="losscontent" label="领用说明" placeholder="" disabled type="textarea"
			 autosize></van-field>
		</van-form>
		<van-form ref="sureform">
			<van-field :value="sureform.person" name="person" label="确认人" placeholder="" disabled></van-field>
			<van-field :value="sureform.time" name="time" label="确认时间" placeholder="" disabled></van-field>
			<van-field :value="sureform.isagree" name="isagree" label="是否同意" placeholder="" disabled></van-field>
			<van-field :value="sureform.content" name="content" label="审核说明" placeholder="" disabled type="textarea"
			 autosize></van-field>
		</van-form>
		<van-form @submit="submit" ref="agreeform">
			<van-field v-model="agreeform.warehouse" name="warehouse" label="仓库" placeholder="" disabled></van-field>
			<van-field :value="agreeform.checkcontent" name="checkcontent" label="出库说明" placeholder="请输入出库说明"  type="textarea"
			 autosize :rules="rule"></van-field>
			<div style="margin: 16px;">
				<van-button round block type="info" native-type="submit">
					出库
				</van-button>
			</div>
		</van-form>
		<!--下拉选择1234-->
		<van-popup v-model="showPicker1" position="bottom">
			<van-picker show-toolbar :columns="columns1" @confirm="onConfirm1" @cancel="showPicker1 = false" />
		</van-popup>
		<van-popup v-model="showPicker2" position="bottom">
			<van-picker show-toolbar :columns="columns2" @confirm="onConfirm2" @cancel="showPicker2 = false" />
		</van-popup>
	</div>
</template>

<script>
	import {
		Toast
	} from 'vant'
	export default {
		//执行表单 提交&退出提交等操作,表单清空功能没实现！！！！
		data() {
			return {
				applyForm: {
					lcode: '',
					type: '',
					bycode: '',
					name: '',
					code: '',
					classification: '',
					storeCount: '',
					count: '',
					getuser: '',
					gettime: '',
					remarks: '',
					person: ''
				},
				sureform:{
					person: '',
					time: '',
					isagree: '',
					content: ''
				},
				agreeform: {
					isagree: '',
					checkcontent: '',
					warehouse: '',
					outperson: ''
				},
				showPicker1: false,
				showPicker2: false,
				showPicker3: false,
				showPicker4: false,
				columns1: ['类型1', '类型2'],
				columns2: ['tes1', 'test2'],
				columns3: ['分类1', '分类2'],
				columns4: ['人1', '人2'],
				rule: [{
					required: true
				}] // 校验规则
			}
		},
		methods: {
			submit(thing) {
				console.log(thing);
				// 提交实现后,对此进行退出并且表单清空
				for (let it in this.agreeform) {
					this.agreeform[it] = " ";
				}
				this.$router.go(-1);
				Toast("提交成功..");
			},
			// 是否同意
			onConfirm1(value) {
				this.agreeform.isagree = value;
				this.showPicker1 = false;
			},
			// 出库人
			onConfirm2(value) {
				this.agreeform.outperson = value;
				this.showPicker2 = false;
			}
		},
		destroyed() {
			console.log('destory')
		}
	}
</script>

<style scoped>
	.sparePartcheckTwo {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.van-cell>>>.van-field__label {
		color: #242424;
	}

	.van-form {
		margin-bottom: 10px;
		background-color: white;
	}
</style>
