<template>
	<div class="guscontinuedetail">
		<van-form ref="addform" @submit="submit">
			<van-field style="margin-bottom: 10px;" v-model="addForm.workcode" name="workcode" label="作业票编号" placeholder="作业票编号" disabled></van-field>
			<!-- <van-field v-model="addForm.samplingPosition" name="samplingPosition" label="采样部位" placeholder="采样部位" disabled></van-field> -->
			<van-field  class="contenttype" v-for="(item,index) in detectMatters" :key="index" v-model="item['model'+index]" :name="addForm['a'+index]"
			 :label="item.detectMatter+'('+item.detectUnit+')'+'含量'" placeholder="请编辑内容"
			 type="textarea" autosize disabled></van-field>
			 
			 <van-field v-model="addForm.isNeedCheck" style="margin-top: 10px;" name="isNeedCheck" label="是否需要持续监测" disabled></van-field>
			 <van-field v-model="addForm.checkrate" name="checkrate" label="检测频率(分钟)" placeholder="请输入检测频率" disabled></van-field>
			 
			<van-field  v-model="addForm.result" name="result" label="分析结果" placeholder="请选择分析结果"
			 clickable readonly  disabled></van-field>
			 
			 <van-cell style="margin-top: 10px;" center :value="addForm.a" name="sign" placeholder="" disabled>
			 	<template #title>
			 		<div class="nameshow">现场签字<span style="color: #008000;"></span></div>
			 	</template>
			 	<template #right-icon>
			 		<!-- <span>{{getpicurl}}+{{addForm.sign}}</span> -->
			 		<van-image width="40" height="40" fit="cover" :src="addForm.sign" />
			 	</template>
			 </van-cell>
			 
			 <!-- <van-field v-model="addForm.sign" style="margin-top: 10px;" name="sign" label="现场签字" disabled></van-field> -->
			 <van-field v-model="addForm.address" name="address" label="签名地点" disabled></van-field>
			 <van-field v-model="addForm.time" name="time" label="签名时间" disabled></van-field>
			<!-- <div style="margin: 30px;">
				<van-button round block type="info" native-type="submit">
					提交
				</van-button>
			</div> -->
		</van-form>
		<!--下拉选择1234-->
		<van-popup v-model="showPicker1" position="bottom">
			<van-picker show-toolbar :columns="columns1" @confirm="onConfirm1" @cancel="showPicker1 = false" />
		</van-popup>
	</div>
</template>

<script>
	export default {
		name: "guscontinuedetail",
		data () {
			return {
				addForm: {
					workcode: '',
					samplingPosition: '',
					detectMatters: '',
					isNeedCheck: '',
					checkrate: '',
					result: '',
					sign: '',
					address: '',
					time: ''
				},
				detectMatters: [],
				rule: [{
					required: true
				}], // 校验规则
				showPicker1: false,
				columns1: ['合格', '不合格'],
				leader: null,
				jwDetectMatterBoList: null,
				leadercheck: {
					index: 0,
					text: '安全员',
					goway: 1,
					value: '',
					writeType: 0, // 0是还未签名
					address: '', //地址
					jd: '', //精度
					wd: '', //纬度
					fileId: '', //文件id
					fileName: '', //文件名
					filepath: '', //文件路径
					design: 0, //验证身份
					fieldshow: '' //工具人字段
				},
				isFirst: 0
			}
		},
		components: {
			
		},
		destroyed() {
			this.$bus.off()
		},
		mounted() {
			let data = JSON.parse(decodeURI(this.$route.query.data))
			console.log(data)
			this.addForm.result = data.detectResult==1?'合格':'不合格'
			this.leader = data
			this.getdetail(data)
			
		},
		methods: {
			getdetail(data) {
				let json = {
					bussinessId: data.jwId,
					odrId: data.id
				}
				this.detectMatters = []
				this.$axios.post('/w/jobWork/getDetectDetail',json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data.detectDetailList
							this.addForm.workcode = res.data.data.jobWorkNo
							this.addForm.isNeedCheck = res.data.data.isCountinue==1?'是':'否'
							this.addForm.checkrate = res.data.data.frequency
							this.addForm.sign = this.$store.state.picUrl + res.data.data.sidDetailBo.sidPath
							this.addForm.address = res.data.data.sidDetailBo.address
							this.addForm.time = this.formatDate(res.data.data.sidDetailBo.createTime)
							// this.addForm.result = res.data.data
							// this.detectMatters = data
							for (let i=0;i<data.length;i++) {
								this.detectMatters.push({
									detectMatter: data[i].detectMatter,
									detectUnit: data[i].detectUnit,
									['model'+i] : data[i].detectValue
								})
							}
							// console.log(this.detectMatters)
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			
			},
			submit (form) {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					console.log(form)
					this.$bus.emit('signwrite', this.leadercheck)
					// console.log(item)
				}, 300) // 大概时间300ms
			},
			onConfirm1 (event) {
				// console.log(event)
				this.addForm.result = event
				this.showPicker1 = false
			}
		}
	};
</script>
<style scoped>
	.guscontinuedetail {
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: rgb(244, 244, 244);
	}
	.van-cell>>>.van-field__label {
		color: #242424;
		width: auto;
	}
	.van-field>>>.van-field__control {
		text-align: right;
	}
	.van-cell__title {
		text-align: left;
	}
	.chooseleft>>>.van-field__control {
		text-align: center;
	}
	.fieldmargin>>>.van-field__control {
		text-align: center;
	}
	.fieldtype>>>.van-field__control {
		text-align: center;
	}
	.fieldbottom {
		margin-bottom: 10px;
	}
	.bottomnone::after {
		border-bottom: 0;
	}
</style>
