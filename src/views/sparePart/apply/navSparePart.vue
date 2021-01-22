<template>
	<div class="navSparePart">
		<van-form ref="applyform">
			<van-field v-model="applyForm.name" name="name" label="名称" placeholder="请选择名称" disabled></van-field>
			<van-field v-model="applyForm.guigecode" name="guigecode" label="规格型号" placeholder="请选择规格型号" disabled></van-field>
			<van-field v-model="applyForm.code" name="code" label="备品备件编号" placeholder="备品备件编号" disabled></van-field>
			<van-field v-model="applyForm.label" name="label" label="分类" placeholder="分类" disabled></van-field>
			<van-field v-model="applyForm.warehouse" name="warehouse" label="仓库" placeholder="仓库" disabled></van-field>
			<van-field v-model="applyForm.housenum" name="housenum" label="实际库存" placeholder="实际库存" disabled></van-field>
			<van-field v-model="applyForm.num" name="num" label="领用数量" placeholder="领用数量" disabled></van-field>
		</van-form>
	</div>
</template>	

<script>
	export default {
		name: "navSparePart",
		data() {
			return {
				showdata: {},
				addData: {}, //新增板块信息
				showPicker1: false,
				columns1: ['液位计', '大西瓜'],
				showPicker2: false,
				columns2: ['规格1', '规格2'],
				applyForm: {
					name: '',
					guigecode: '',
					code: '',
					label: '',
					warehouse: '',
					housenum: '',
					num: ''
				},
				rule: [{
					required: true
				}] // 校验规则
			}
		},
		components: {

		},
		created() {
			
			let data = JSON.parse(decodeURI(this.$route.query.data))
			console.log(data)
			this.applyForm = {
				name: data.name,
				guigecode: data.guigecode,
				code: data.code,
				label: data.label,
				warehouse: data.warehouse,
				housenum: data.housenum,
				num: data.num
			}
		},
		methods: {}
	};
</script>
<style scoped>
	.navSparePart {
		overflow-y: scroll;
		height: calc(100% - 50px);
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}
	.van-field>>>.van-field__label {
		color: #646566;
	}
	.chooseleft>>>.van-field__control {
		text-align: left;
	}
</style>
