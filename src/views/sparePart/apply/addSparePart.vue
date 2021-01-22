<template>
	<div class="addSparePart">
		<van-form @submit="submit" ref="applyform">
			<van-field required class="chooseleft"  v-model="applyForm.name" name="name" label="名称" placeholder="请输入名称" clickable readonly
			 :rules="rule">
			 <template #input>
			    <div style="width: 100%;" slot="input">
			    	<input style="width: 100%;border: 0;" name="name"  type="text" placehold="请输入id进行查询" v-model="input_value" v-on:input="throttle"  ref="input" />
			    	<ul class="showul" v-show="state">
			    		<li v-for="(item,index) in list" :key="index" @click="lishow(item)">	
			    			<div>名称: {{item.name}}</div>
							<div>规格: {{item.specificationModel}}</div>
							<div>备注: {{item.remark}}</div>
			    		</li>
			    	</ul>
			    </div>
			   </template>
			 
			 </van-field>
			<van-field v-model="applyForm.guigecode" name="guigecode" label="规格型号" placeholder="请输入规格型号" disabled>
			<!-- <div style="width: 100%;" slot="input">
			 	<input style="width: 100%;border: 0;" type="text" placehold="请输入id进行查询" v-model="input_value1" @keyup="throttle1" ref="input1" />
			 	<ul class="showul" v-show="state1">
			 		<li v-for="(item,index) in list1" :key="index" @click="lishow1(item)">	
			 			<span>{{item.specificationModel}}</span>
			 		</li>
			 	</ul>
			 </div> -->
			 </van-field>
			<van-field v-model="applyForm.code" name="code" label="备品备件编号" placeholder="备品备件编号" disabled></van-field>
			<van-field v-model="applyForm.label" name="label" label="分类" placeholder="分类" disabled></van-field>
			<van-field v-model="applyForm.warehouse" name="warehouse" label="仓库" placeholder="仓库" disabled></van-field>
			<van-field v-model="applyForm.housenum" name="housenum" label="实际库存" placeholder="实际库存" disabled></van-field>
			<van-field required v-model="applyForm.num" name="num" label="领用数量" @input="shownum" placeholder="领用数量" :rules="rule"></van-field>
			<div style="margin: 16px;">
				<van-button round block type="info" native-type="submit">
					保存
				</van-button>
			</div>
		</van-form>
		<!-- 下拉选择 -->
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
		name: "addSparePart",
		data() {
			return {
				showdata: {},
				addData: {}, //新增板块信息
				showPicker1: false,
				columns1: ['液位计', '大西瓜','螺母'],
				showPicker2: false,
				columns2: ['规格1', '规格2'],
				applyForm: {
					id: null,
					name: '',
					guigecode: '',
					code: '',
					label: '',
					warehouse: '',
					housenum: '',
					num: ''
				},
				/*名称输入选择参数*/
				state: false,
				statu: true,
				input_value: '',
				dataList: [],
				list: [],
				/*规格型号输入选择*/
				state1: false,
				statu1: true,
				input_value1: '',
				dataList1: [],
				list1: [],
				rule: [{
					required: true
				}] // 校验规则
			}
		},
		components: {

		},
		created() {
			this.showdata = JSON.parse(sessionStorage.getItem('produce'))
			console.log(this.showdata)
			this.getsparePartname()
		},
		methods: {
			//获取工单号
			getsparePartname() {
				let json = {
					name: this.input_value,
					specificationModel: this.input_value1
				}
				this.dataList = []
				this.$axios.post('/d/sparePart/queryForApp',json).then(res => {
						if (res.data.code === 0) {
							let data = res.data.data
							console.log(res.data.data)
							console.log(this.list)
							this.dataList = data
							// this.addForm.gcode = res.data.data
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			//设备分类名字查询
			getdeviceType(data) {
				let json = {
					id: data
				}
				this.deviceType(json).then(res => {
						if (res.data.code === 0) {
							//let data = res.data.data
							// console.log(res.data.data)
							this.applyForm.label = res.data.data.longName
							// this.addForm.gcode = res.data.data
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			/*名称输入选择*/
			search() {
				//这个变量主要是用来测试节流后和不节流的区别
				var i = 0;
				//console.log(i++);
				//定义的新数组存放筛选之后的数据
				this.list = [];
				//拿到当前input输入框输入的值
				this.input_value = this.$refs.input.value;
				//判断展示ul列表，如果输入了就展示没输入就不展示
				// if (this.input_value.length > 0) {
				// 	this.state = true;
				// } else {
				// 	this.state = false;
				// }
				this.state = true;
				//循环模拟数据的数组
				this.dataList.map((msg) => {
					//拿当前json的id、name、time去分别跟输入的值进行比较
					//indexOf 如果在检索的字符串中没有出现要找的值是会返回-1的，所以我们这里不等于-1就是假设输入框的值在当前json里面找到的情况
					if (msg.name.indexOf(this.input_value) != -1) {
						//然后把当前json添加到list数组中
						this.list.push(msg);
					}
				})
			},
			throttle() {
				//保持this的指向始终指向vue实例
				var that = this;
				//console.log(123)
				// setTimeout(()=>{
				// 	that.getsparePartname()
				// },1000)
				
				if (!that.statu) {
					return;
				}
				that.statu = false;
				setTimeout(function() {
					that.search();
					that.statu = true;
				}, 500)
			},
			lishow (item) {
				// console.log(item)
				this.input_value = item.name
				this.applyForm.name = item.name
				this.applyForm.guigecode = item.specificationModel
				this.applyForm.id = item.id
				this.applyForm.code = item.code
				// this.applyForm.label = '大西瓜'
				this.getdeviceType(item.deviceTypeId)
				this.applyForm.warehouse = item.stock.name
				this.applyForm.housenum = item.stockCurrent
				this.state = false
			},
			
			submit(form) {
				console.log(this.applyForm)
				this.showdata.sparePartAddLists.push({
					id: this.applyForm.id,
					name: this.applyForm.name,
					guigecode: this.applyForm.guigecode,
					code: this.applyForm.code,
					label: this.applyForm.label,
					warehouse: this.applyForm.warehouse,
					housenum: this.applyForm.housenum,
					num: this.applyForm.num,
					sparePartId: 0,
					qty: this.applyForm.num,
					stockId: 0,
					stockName: this.applyForm.name+this.applyForm.guigecode
				})
				sessionStorage.setItem('produce',JSON.stringify(this.showdata))
				this.$router.go(-1);
				
			},
			//领用数量
			shownum(event) {
				console.log(event)
				console.log(this.applyForm.housenum)
				if (parseInt(event)>=parseInt(this.applyForm.housenum)) {
					this.applyForm.num = this.applyForm.housenum
				} else {
					this.applyForm.num = event
				}
			},
			//名称选择
			onConfirm1(value) {
				//this.addData.
				// this.showdata.sparePartAddLists.push({
				// 		sparePartId: 0,
				// 		qty: 0,
				// 		stockId: 0,
				// 		stockName: ''
				// })
				this.applyForm.name = value;
				this.showPicker1 = false;
			},
			//规格型号选择
			onConfirm2(value) {
				this.applyForm.guigecode = value;
				this.showPicker2 = false;
			}
		}
	};
</script>
<style scoped>
	.addSparePart {
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
	.showul {
		text-align: left;
		overflow-y: scroll;
		max-height: 200px;
	}
	.showul li {
		color: #c8c9cc;
		
		margin: 15px 0;
	}
</style>
