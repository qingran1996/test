<template>
	<div class="applySparePart">
		<van-form @submit="submit" ref="applyform">
			<!-- <van-field v-model="addData.applyNo" name="领用单号" label="领用单号" placeholder="请输入领用单号" disabled></van-field> -->
			<van-field required class="chooseleft" v-model="applyForm.type" name="领用类型" label="领用类型" placeholder="请选择领用类型"
			 clickable readonly @click="showPicker1=true" :rules="rule" is-link></van-field>
			<van-field required v-model="applyForm.bycode" :label="applyForm.type+'单号'" :placeholder="'请输入'+applyForm.type+'单号'"
			 >
				<div style="width: 100%;" slot="input">
					<input style="width: 100%;border: 0;" type="text" placehold="请输入id进行查询" v-model="input_value" @keyup="throttle"
					 ref="input" />
					<ul class="showul" v-show="state">
						<li v-for="(item,index) in list" :key="index" @click="lishow(item)">
							<span>{{item.name}}</span>
						</li>
					</ul>
				</div>
			</van-field>
			<!-- <van-field :label="applyForm.type+'单号'">
				<template #input>
					<input type="text" placehold="请输入id进行查询" v-model="input_value" @keyup="throttle" ref="input" />
					<ul v-show="state">
						<li v-for="(item,index) in list" :key="index">
							<span>{{item.id}}</span>
							<span>{{item.name}}</span>
							<span>{{item.time}}</span>
						</li>
					</ul>
				</template>
			</van-field> -->
			<!-- <van-field v-model="applyForm.name" name="备品备件名称" label="备品备件名称" placeholder="请选择备品备件" clickable readonly @click="showPicker2=true"
			 :rules="rule"></van-field>
			<van-field v-model="applyForm.code" name="备品备件编号" label="备品备件编号" placeholder="请选择备品备件编号" :rules="rule"></van-field>
			<van-field v-model="applyForm.classification" name="分类" label="分类" placeholder="请选择分类" clickable readonly @click="showPicker3=true"
			 :rules="rule"></van-field>
			<van-field v-model="applyForm.warehouse" name="仓库" label="仓库" placeholder="请输入仓库" :rules="rule"></van-field>
			<van-field v-model="applyForm.storeCount" name="实际库存" label="实际库存" disabled></van-field>
			<van-field v-model="applyForm.count" name="实际领用数量" label="实际领用数量" placeholder="请输入领用数量" :rules="rule"></van-field> -->
			<van-field required :rules="rule" v-model="applyForm.remarks" @input="showremarks" name="losscontent" label="领用说明"
			 placeholder="请输入领用说明" type="textarea" autosize></van-field>
			<van-field required class="chooseleft" is-link :value="applyForm.person" name="确认人" label="确认人" placeholder="选择审核人"
			 clickable readonly @click="showPicker4=true" :rules="rule"></van-field>
			<div class="submit">
				<van-button round block type="info" native-type="submit">
					提交
				</van-button>
			</div>


		</van-form>
		<van-divider dashed :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
			备品备件
		</van-divider>
		<van-swipe-cell v-for="(item,index) in addData.sparePartAddLists" :key="index">
			<van-cell @click="gotonav(index)" :border="false" :name="item.name" :title="item.name">
				<template #label>
					<div>规格: {{item.guigecode}}</div>
					<div>实际库存: {{item.housenum}}个</div>
				</template>
				<template #default>
					<div v-if="item.num<=item.housenum" style="color: #000000;">{{item.num}}个</div>
					<div v-else style="color: red;">{{item.num}}个(已超过库存请重置)</div>
				</template>
			</van-cell>
			<template #right>
				<van-button square type="danger" @click="onclose(index)" text="删除" />
			</template>
		</van-swipe-cell>


		<div class="addplus" @click="addplus">
			<van-icon name="add" size="26" color="rgb(28,110,255)" /> <span>添加</span>
		</div>


		<!--下拉选择1234-->
		<van-popup v-model="showPicker1" position="bottom">
			<van-picker show-toolbar :columns="columns1" @confirm="onConfirm1" @cancel="showPicker1 = false" />
		</van-popup>
		<van-popup v-model="showPicker4" position="bottom">
			<van-picker show-toolbar :columns="columns4" @confirm="onConfirm4" @cancel="showPicker4 = false" />
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
				addData: {}, //新增板块信息
				jsonData: {},
				isWxOrBy: true,
				applyForm: {
					lcode: '',
					type: '',
					bycode: '',
					name: '',
					code: '',
					classification: '',
					warehouse: '',
					storeCount: '',
					count: '',
					remarks: '',
					person: ''
				},
				produce: [],
				showPicker1: false,
				showPicker2: false,
				showPicker3: false,
				showPicker4: false,
				columns1: ['维修', '保养'],
				columns4: [],
				userData: [],//完整人员信息
				rule: [{
					required: true
				}], // 校验规则
				input_value: '',
				state: false,
				statu: true,
				dataList: [],
				list: []
			}
		},
		created() {
			let data = JSON.parse(sessionStorage.getItem('produce'))
			console.log('保存的数据',data)
			this.addData = data
			
			for (let i = 0; i < data.sparePartAddLists.length; i++) {
				this.produce.push({
					id: data.sparePartAddLists[i].id,
					name: data.sparePartAddLists[i].name,
					num: parseInt(data.sparePartAddLists[i].num),
					guigecode: data.sparePartAddLists[i].guigecode,
					housenum: parseInt(data.sparePartAddLists[i].housenum),
					stockName: data.sparePartAddLists[i].stockName,
					warehouse: data.sparePartAddLists[i].warehouse,
					label: data.sparePartAddLists[i].label,
					code: data.sparePartAddLists[i].code
				})
			}
			var newArr = [];
			this.produce = this.produce.reverse()
			this.produce.forEach(item => {
				var dataItem = item
				// console.log(dataItem.housenum)
				if (newArr.length > 0) {
					// console.log(dataItem.housenum)
					var filterValue = newArr.filter(v => {
						return dataItem.stockName == v.stockName
					})
					// console.log(filterValue)
					if (filterValue.length > 0) {
						newArr.forEach(n => {
							if (n.stockName == filterValue[0].stockName) {
								// console.log(n)
								n.num = filterValue[0].num + dataItem.num
							}
						})
					} else {
						newArr.push(dataItem)
					}
				} else {
					newArr.push(dataItem)
				}

			})
			this.addData.sparePartAddLists = newArr
			this.applyForm.type = this.addData.applyTypeId==1?'维修':'保养'
			console.log(this.applyForm.type)
			this.applyForm.bycode = this.addData.orderNo
			this.input_value = this.addData.orderNo!=undefined?this.addData.orderNo:''
			this.applyForm.remarks = this.addData.applyDesc
			this.applyForm.person = this.addData.checkUser
			
		},
		mounted() {
			if (this.addData.applyTypeId==1) {
				// console.log(123)
				this.getwordNo() //默认先跑维修
			} else {
				this.queryUserTaskPlan()
			}
			this.getUsers() //获取确认人
		},
		methods: {
			//获取确认人
			getUsers() {
				let json = {
					roleName: "领用单审核人"
				}
				this.columns4 = []
				this.getByRole(json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							let data = res.data.data
							for (let i=0;i<data.length;i++) {
								this.columns4.push(data[i].name)
							}
							this.userData = data
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						// this.$toast('服务异常')
					})
			},
			//获取维修单号
			getwordNo() {
				let json = {
					pageNo: 1,
					pageSize: 10000,
					workNoteNo: this.input_value,
				}
				this.dataList = []
				this.getEMRecordByWorkNoteNoLike(json).then(res => {
						if (res.data.code === 0) {
						//	console.log(res.data.data)
							let data = res.data.data
							for (let i=0;i<data.length;i++) {
								this.dataList.push({
									id: i,
									name: data[i].workNoteNo
								})
							}
							// this.dataList = res.data.data
							// this.addForm.gcode = res.data.data
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			//获取保养单号
			queryUserTaskPlan() {
				let json = {
					executor: localStorage.getItem('userName'),
					planNum: this.input_value
				}
				this.dataList = []
				this.$axios.post('/d/MaintainRuTask/queryUserTaskPlan',json).then(res => {
						if (res.data.code === 0) {
							//console.log(res.data.data)
							let data = res.data.data
							for (let i=0;i<data.length;i++) {
								this.dataList.push({
									id: i,
									name: data[i].planNum
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
			search() {
				//这个变量主要是用来测试节流后和不节流的区别
				var i = 0;
				//console.log(i++);
				//定义的新数组存放筛选之后的数据
				this.list = [];
				//拿到当前input输入框输入的值
				this.input_value = this.$refs.input.value;
				//判断展示ul列表，如果输入了就展示没输入就不展示
				if (this.input_value.length > 0) {
					this.state = true;
				} else {
					this.state = false;
				}
				// console.log('过来了')
				//循环模拟数据的数组
				this.dataList.map((msg) => {
					//拿当前json的id、name、time去分别跟输入的值进行比较
					//indexOf 如果在检索的字符串中没有出现要找的值是会返回-1的，所以我们这里不等于-1就是假设输入框的值在当前json里面找到的情况
					if (msg.name.indexOf(this.input_value) != -1) {
						//然后把当前json添加到list数组中
						// console.log(123)
						this.list.push(msg);
					}
				})
			},
			throttle() {
				//保持this的指向始终指向vue实例
				var that = this;
				// console.log(123)
				this.addData.orderNo = this.input_value
				sessionStorage.setItem('produce', JSON.stringify(this.addData))
				// setTimeout(()=>{
				// 	that.getwordNo()
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
			lishow(item) {
				//console.log(item)
				this.input_value = item.name
				this.applyForm.bycode = item.name
				this.addData.orderNo = item.name
				this.jsonData.orderNo = item.name
				this.state = false
				sessionStorage.setItem('produce', JSON.stringify(this.addData))
			},
			submit(thing) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					//console.log('准备提交')
					let isshow = false
					for (let i=0;i<this.addData.sparePartAddLists.length;i++) {
						// console.log(this.addData.sparePartAddLists[i])
						if (this.addData.sparePartAddLists[i].num>this.addData.sparePartAddLists[i].housenum) {
							isshow = true
						}
					}
					if (isshow) {
						this.$toast("备品备件存在超出库存现象，请重新配置")
					} else {
						// this.addSparePart()
						let sparePartApplyDetail = []
						for (let i=0;i<this.addData.sparePartAddLists.length;i++) {
							sparePartApplyDetail.push({
								sparePartId: this.addData.sparePartAddLists[i].id,
								qty: this.addData.sparePartAddLists[i].num
							})
						}
						this.jsonData = {
							orderNo: this.addData.orderNo,
							applyTypeId: this.isWxOrBy?1:2,
							executor: this.isWxOrBy?'':localStorage.getItem('userName'),
							applyUserId: localStorage.getItem('userId'),
							applyUser: localStorage.getItem('userName'),
							applyDesc: this.addData.applyDesc,
							checkUserId: this.addData.checkUserId,
							checkUser: this.addData.checkUser,
							sparePartApplyDetail: sparePartApplyDetail
						}
						console.log(this.jsonData)
						this.addSparePart()
					}
				}, 300) // 大概时间300ms
			},
			//申请备品备件
			addSparePart () {
				this.$axios.post('/d/sparePartApply/add',this.jsonData).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							// sessionStorage.removeItem('produce')
							this.$router.go(-1);
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			//输入说明内容
			showremarks(event) {
				this.applyForm.remarks = event
				this.addData.applyDesc = event
				this.jsonData.applyDesc = event
				sessionStorage.setItem('produce', JSON.stringify(this.addData))
				//console.log(event)
			},
			gotonav(index) {
				//console.log(this.addData.sparePartAddLists[index])
				this.$router.push({
					path: "/navSparePart",
					query: {
						data: encodeURI(JSON.stringify(this.addData.sparePartAddLists[index]))
					}
				})
			},
			//添加产品
			addplus() {
				//console.log(333)
				this.$router.push({
					path: "/addSparePart"
				})
			},
			onclose(index) {
				this.$dialog.confirm({
						message: '确定删除吗？',
					}).then(() => {
						console.log('确定删除')
						this.produce.splice(index, 1)
						this.addData.sparePartAddLists.splice(index, 1)
						sessionStorage.setItem('produce', JSON.stringify(this.addData))
					})
					.catch(() => {
						console.log('取消')
					});
			},
			beforeClose({
				name,
				position,
				instance
			}) {
				switch (position) {
					case 'left':
					case 'cell':
					case 'outside':
						instance.close();
						break;
					case 'right':
						this.$dialog.confirm({
								message: '确定删除吗？',
							}).then(() => {
								instance.close();
								console.log(name)
								console.log('确定删除')
							})
							.catch(() => {
								console.log('取消')
							});
						break;
				}
			},
			// 领用类型 选择
			onConfirm1(value) {
				this.input_value = ''
				if (value == '维修') {
					this.getwordNo()
					this.isWxOrBy = true
					this.addData.applyTypeId = 1
					this.jsonData.applyTypeId = 1
					this.addData.executor = ''
					this.jsonData.executor = ''
				} else {
					this.queryUserTaskPlan()
					this.isWxOrBy = false
					this.addData.applyTypeId = 2
					this.jsonData.applyTypeId = 2
					this.addData.executor = localStorage.getItem('userName')
					this.jsonData.executor = localStorage.getItem('userName')
				}
				this.applyForm.type = value;
				this.showPicker1 = false;
				sessionStorage.setItem('produce', JSON.stringify(this.addData))
			},
			// 确认人 选择
			onConfirm4(value) {
				//console.log(value)
				this.applyForm.person = value;
				this.showPicker4 = false;
				for(let i=0;i<this.userData.length;i++) {
					if (value == this.userData[i].name) {
						this.addData.checkUser = this.userData[i].name
						this.addData.checkUserId = this.userData[i].id
						this.jsonData.checkUser = this.userData[i].name
						this.jsonData.checkUser = this.userData[i].name
					}
				}
				sessionStorage.setItem('produce', JSON.stringify(this.addData))
			}
		},
		destroyed() {
			console.log('destory')
		}
	}
</script>

<style scoped>
	.applySparePart {
		overflow-y: scroll;
		height: calc(100% - 100px);
		background-color: rgb(244, 244, 244);
	}

	.van-cell__title {
		text-align: left;
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.goods-card {
		margin: 0;
		background-color: @white;
	}

	.van-swipe-cell>>>.van-cell--borderless {
		margin-bottom: 5px;
	}

	.delete-button {
		height: 100%;
	}

	.van-cell>>>.van-field__label {
		color: #242424;
	}

	.van-form {
		margin-bottom: 10px;
		background-color: white;
	}

	.submit {
		position: fixed;
		width: 100%;
		height: 50px;
		background-color: rgb(244, 244, 244);
		bottom: 0;
	}

	.submit button {
		width: 90%;
		margin: 0 5%;
	}

	.addplus {
		font-size: 18px;
		cursor: pointer;
		display: inline-flex;
		margin: 5px auto;
		color: rgb(28, 110, 255);
	}

	.van-swipe-cell__right button {
		height: 100%;
	}

	.addplus span {
		margin-left: 5px;
	}

	.chooseleft>>>.van-field__control {
		text-align: center;
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
