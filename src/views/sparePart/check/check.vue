<template>
	<div class="sparePartcheck">
		<van-form ref="applyform">
			<van-field v-model="applyForm.lcode" name="lcode" label="领用单号" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.type" name="type" label="领用类型" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.bycode" name="bycode" :label="applyForm.type+'单号'" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.content" name="content" label="申请说明" placeholder="" disabled type="textarea"
			 autosize></van-field>
			<van-field v-model="applyForm.getuser" name="getuser" label="申请人" placeholder="" disabled></van-field>
			<van-field v-model="applyForm.applytime" name="applytime" label="申请时间" placeholder="" disabled></van-field>
			<van-field :value="applyForm.person" name="person" label="确认人" placeholder="" disabled></van-field>
			<!-- <van-field class="fieldts" required is-link readonly clickable label="是否同意" name="isagree" :rules="rule" :value="applyForm.isagree"
			 placeholder="请选择是否同意" @click="showPicker1 = true" /> -->
			<van-field :value="applyForm.checkResultString" name="checkResultString" label="审核状态" placeholder="" disabled></van-field>
			<!-- <van-field v-model="applyForm.applytime" name="applytime" label="领用时间" placeholder="" disabled></van-field> -->	 
			
		</van-form>
		<van-cell v-for="(item,index) in sparePartData" :key="index" @click="gotonav(index)" :border="false" :name="item.name" :title="item.name" is-link="">
			<template #label>
				<div>规格: {{item.guigecode}}</div>
				<div>实际库存: {{item.housenum}}个</div>
			</template>
			<template #default>
				<div v-if="item.num<=item.housenum" style="color: #000000;">{{item.num}}个</div>
				<div v-else style="color: red;">{{item.num}}个(已超过库存请重置)</div>
			</template>
		</van-cell>
		<van-form style="margin-top: 10px;" ref="agreeform" @submit="submit">
			<van-field class="fieldts" required is-link readonly clickable label="是否同意" name="isagree" :rules="rule" :value="agreeform.isagree"
			 placeholder="请选择是否同意" @click="showPicker1 = true" />
			 <van-field class="fieldts" required :rules="rule" v-model="agreeform.content" name="content" label="审核说明" placeholder="请输入审核说明" type="textarea"
			  autosize></van-field>
			<div style="margin: 30px;">
				<van-button round block type="info" native-type="submit">
					提交
				</van-button>
			</div>
		</van-form>
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
				spareId: null,
				applyForm: {
					lcode: '',
					type: '',
					bycode: '',
					content: '',
					getuser: '',
					applytime: '',
					person: '',
					isagree: '',
					checkResultString: '',
				},
				agreeform: {
					isagree: '同意',
					content: ''
				},
				sparePartData: [],
				showPicker1: false,
				showPicker2: false,
				showPicker3: false,
				showPicker4: false,
				columns1: ['同意', '不同意'],
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
			this.spareId = data
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
								checkResultString: data.checkResultString,
							}
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
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					console.log(thing)
					if (thing.isagree==='同意') {
						this.checkUserSubmit(1)
					} else {
						this.checkUserSubmit(0)
					}
					
				}, 300) // 大概时间300ms
			},
			checkUserSubmit (type) {
				let json = {
					id: this.spareId,
					checkUserId: localStorage.getItem('userId'),
					checkUser: localStorage.getItem('userName'),
					checkDesc: this.agreeform.content,
					checkResult: type
				}
				this.$axios.post('/d/sparePartApply/checkUserSubmit', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							// let data = res.data.data
							this.$router.go(-1);
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
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
	.sparePartcheck {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}
	.fieldts>>>.van-field__control {
		text-align: center;
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
