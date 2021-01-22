<template>
	<div class="guscheck">
		<van-form ref="addform" @submit="submit">
			<van-field style="margin-bottom: 10px;" v-model="addForm.workcode" name="workcode" label="作业票编号" placeholder="作业票编号" disabled></van-field>
			<!-- <van-field v-model="addForm.samplingPosition" name="samplingPosition" label="采样部位" placeholder="采样部位" disabled></van-field> -->
			<van-field required :rules="rule" class="contenttype fieldmargin" v-for="(item,index) in detectMatters" :key="index" v-model="item['model'+index]" :name="addForm['a'+index]"
			 :label="item.detectMatter+'('+item.detectUnit+')'+'含量'" placeholder="请编辑内容"
			 type="textarea" autosize></van-field>
			 
			 <van-field style="margin-top: 10px;" name="isNeedCheck" label="是否需要持续监测">
			   <template #input>
			     <van-radio-group style="margin: 0 auto;" v-model="addForm.isNeedCheck" direction="horizontal">
			           <van-radio name="1">是</van-radio>
			           <van-radio name="2">否</van-radio> 
			         </van-radio-group>
			   </template>
			 </van-field>
			 <van-field class="fieldbottom" v-model="addForm.checkrate" name="checkrate" label="检测频率(分钟)" placeholder="请输入检测频率"></van-field>
			 
			<van-field style="margin-bottom: 80px;" required v-model="addForm.result" class="fieldtype" name="result" label="分析结果" placeholder="请选择分析结果"
			 clickable readonly @click="showPicker1=true" :rules="rule" is-link></van-field>
			<div style="margin: 30px;">
				<van-button round block type="info" native-type="submit">
					提交
				</van-button>
			</div>
		</van-form>
		<signwrite :jobLevel="addForm.workLevelcode" :jobTypeCode="addForm.workTypecode"></signwrite>
		<!--下拉选择1234-->
		<van-popup v-model="showPicker1" position="bottom">
			<van-picker show-toolbar :columns="columns1" @confirm="onConfirm1" @cancel="showPicker1 = false" />
		</van-popup>
	</div>
</template>

<script>
	import signwrite from '../../../components/sign.vue'
	export default {
		name: "guscheck",
		data () {
			return {
				addForm: {
					workcode: '',
					samplingPosition: '',
					workLevelcode: '', //作业票级别code
					workTypecode: '', //作业类型code
					detectMatters: '',
					isNeedCheck: '1',
					checkrate: '',
					result: '合格'
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
			signwrite
		},
		destroyed() {
			this.$bus.off()
		},
		mounted() {
			let data = JSON.parse(decodeURI(this.$route.query.data))
			console.log(data)
			
			
			
			this.jwDetectMatterBoList = JSON.parse(decodeURI(this.$route.query.jwDetectMatterBoList))
			this.isFirst = JSON.parse(decodeURI(this.$route.query.isFirst))
			// console.log(this.isFirst)
			this.leader = data
			this.getdetail(data)
			
			this.$bus.on('signshow', e => { //走流程的过程：安全员
				// console.log(e)
				let detectMattersshow = []
				for(let i=0;i<this.detectMatters.length;i++) {
					detectMattersshow.push({
						detectMatter: this.detectMatters[i].detectMatter,
						detectUnit: this.detectMatters[i].detectUnit,
						detectValue: this.detectMatters[i]['model'+i]
					})
				}
				let json = {
					processInstanceId: this.leader.processInstanceId,
					taskId: this.leader.taskId,
					bussinessId: this.leader.bussinessId,
					dmId: this.jwDetectMatterBoList[0].detectManager.id,
					detectResult: this.addForm.result=='合格'?1:0,
					isContinue: this.addForm.isNeedCheck=='1'?1:0,
					frequency: this.addForm.checkrate,
					sid: e.fileId,
					details: detectMattersshow,
					isFirst: this.isFirst
				}
				// console.log(this.detectMatters)
				console.log(json)
				this.$axios.post('/w/jobWork/detectDataSubmit', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							if (this.addForm.isNeedCheck=='1') {
								this.$router.go(-1)
							} else {
								this.$router.push("/work")
							}
							
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			})
		},
		methods: {
			getdetail(data) {
				let json = {
					bussinessId: data.bussinessId,
					detectTypeCode: '001'
				}
				this.detectMatters = []
				this.$axios.post('/w/jobWork/getNeedDetect',json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data.detectMatterBoResponses
							this.addForm.workcode = res.data.data.jobWorkNo
							this.addForm.workLevelcode = res.data.data.jobLevel
							this.addForm.workTypecode = res.data.data.jobTypeCode
							// this.detectMatters = data
							for (let i=0;i<data.length;i++) {
								this.detectMatters.push({
									detectMatter: data[i].detectMatter,
									detectUnit: data[i].detectUnit,
									['model'+i] : ''
								})
							}
							console.log(this.detectMatters)
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
	.guscheck {
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
