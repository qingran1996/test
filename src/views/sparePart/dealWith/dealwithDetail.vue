<template>
	<div class="sparePartdealwithdetail">
		<van-form ref="applyform">
			<van-field v-model="applyForm.lcode" name="lcode" label="领用单号" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.type" name="type" label="领用类型" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.bycode" name="bycode" :label="applyForm.type+'单号'" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.content" name="content" label="申请说明" placeholder="" disabled type="textarea"
			 autosize></van-field>
			<van-field v-model="applyForm.getuser" name="getuser" label="申请人" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.applytime" name="applytime" label="申请时间" placeholder="" disabled></van-field>
			<van-field :value="applyForm.person" name="person" label="确认人" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.checkTime" name="checkTime" label="确认时间" placeholder="" disabled></van-field>
			<van-field :value="applyForm.checkResultString" name="checkResultString" label="审核状态" placeholder="" disabled></van-field>
			<!-- <van-field v-model="applyForm.applytime" name="applytime" label="领用时间" placeholder="" disabled></van-field> -->	 
		</van-form>
		<van-cell-group>
		  <van-cell v-for="(item,index) in sparePartData" :key="index" @click="gotonav(index)" :border="false" :name="item.name" :title="item.name" is-link="">
		  	<template #label>
		  		<div>规格: {{item.guigecode}}</div>
		  		<div>实际库存: {{item.housenum}}个</div>
		  	</template>
		  	<template #default>
		  		<div v-if="item.num<=item.housenum" style="color: #000000;">{{item.num}}个</div>
		  		<div v-else style="color: red;">{{item.num}}个(已超过库存)</div>
		  	</template>
		  </van-cell>
		</van-cell-group>
		
		<div class="jsbarcode" v-show="applyForm.checkResult==1">
			<div class="jsqtext">领用条码</div>
			<div class="jsq">
				<svg id="barcode"></svg>
			</div>
			
		</div>
		
		<van-popup v-model="showPicker1" position="bottom">
			<van-picker show-toolbar :columns="columns1" @confirm="onConfirm1" @cancel="showPicker1 = false" />
		</van-popup>
		<van-popup v-model="showPicker2" position="bottom">
			<van-picker show-toolbar :columns="columns2" @confirm="onConfirm2" @cancel="showPicker2 = false" />
		</van-popup>
	</div>
</template>

<script>
	export default {
		//执行表单 提交&退出提交等操作,表单清空功能没实现！！！！
		data() {
			return {
				applyForm: {
					lcode: '',
					type: '',
					bycode: '',
					content: '',
					getuser: '',
					applytime: '',
					person: '',
					checkTime: '',
					checkResult: null,
					checkResultString: '',
				},
				agreeform: {
					isagree: '',
					checkcontent: '',
					warehouse: '',
					outperson: ''
				},
				sparePartData: [],
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
		mounted() {
			let data = this.$route.query.data
			console.log(data)
			this.getById(data) //待申请详情
			
		},
		methods: {
			getById(data) {
				let json = {
					id: data
				}
				this.sparePartData = []
				this.$axios.post('/d/sparePartApply/getById', json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							this.applyForm = {
								lcode: data.applyBarCode,
								type: data.applyTypeId==1?'维修':'保养',
								bycode: data.orderNo,
								content: data.applyDesc,
								getuser: data.applyUser,
								applytime: this.formatDate(data.applyTime),
								person: data.checkUser,
								checkTime: this.formatDate(data.checkTime),
								checkResult: data.checkResult,
								checkResultString: data.checkResultString,
							}
							let JsBarcode = require('jsbarcode')
							JsBarcode("#barcode", data.applyBarCode)
							for (let i=0;i<data.details.length;i++) {
								this.sparePartData.push({
									name: data.details[i].sparePartName,
									guigecode: data.details[i].specificationModel,
									code: data.details[i].code,
									label: data.details[i].deviceTypeName,
									warehouse: data.details[i].stockName,
									housenum: data.details[i].stockCurrent,
									num: data.details[i].qty
								})
							}
							
							// this.personData = res.data.data
							// for (let i = 0; i < data.length; i++) {
							// 	this.personNameData.push(data[i].personName)
							// }
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			gotonav(index) {
				console.log(index)
				// console.log(this.addData.sparePartAddLists[index])
				this.$router.push({
					path: "/navSparePart",
					query: {
						data: encodeURI(JSON.stringify(this.sparePartData[index]))
					}
				})
			},
			submit(thing) {
				console.log(thing);
				// 提交实现后,对此进行退出并且表单清空
				for (let it in this.applyForm) {
					this.applyForm[it] = " ";
				}
				this.$router.go(-1);
				//Toast("提交成功..");
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
	.sparePartdealwithdetail {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}
	.jsbarcode {
		margin: 10px auto;
	}
	.jsqtext{
		width: 100%;
		text-align: center;
		font-size: 18px;
		height: 50px;
		line-height: 50px;
	}
	.jsq {
		width: 94%;
		margin: 0 3%;
		text-align: center;
		background-color: #FFFFFF;
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
