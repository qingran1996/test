<template>
	<div class="dangerTagged">
		<van-form ref="addform" @submit="submit">
			<van-field style="margin-bottom: 10px;" v-model="addForm.workcode" name="workcode" label="作业票编号" placeholder="作业票编号" disabled></van-field>
			<van-field class="bottomnone" v-model="addForm.safeway" center disabled label="采取安全措施"></van-field>
			<van-cell v-show="gascontentList.length!=0" value="内容">
				<van-row gutter="10">
					<van-col v-for="(item,index) in gascontentList" :key="index" style="text-align: center;margin-bottom: 10px;" span="24">
						<van-tag class="gassafeshow" style="padding: 5px 10px;text-align: left;width: 90%;" color="rgb(246,247,251)" text-color="rgba(0,0,0,0.8)"
						 size="large" type="primary">
							<span style="width: 90%;">{{item.protectContent}}</span>
						</van-tag>
					</van-col>
				</van-row>
			</van-cell>
			<van-field name="isNeedCheck" label="现场是否采取安全措施">
			  <template #input>
			    <van-radio-group style="margin: 0 auto;" v-model="addForm.isNeedCheck" direction="horizontal">
			          <van-radio name="1">是</van-radio>
			          <van-radio name="2">否</van-radio> 
			        </van-radio-group>
			  </template>
			</van-field>
			<van-field v-model="addForm.otherdanger"
			 name="otherdanger" label="其他危害" placeholder="请输入其他危害" type="textarea" autosize></van-field>
			<van-field  v-model="addForm.aboutwork"
			 name="aboutwork" label="相关特殊作业" placeholder="请输入相关特殊作业" type="textarea" autosize></van-field>
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
		name: "dangerTagged",
		data () {
			return {
				addForm: {
					workcode: '',
					workLevelcode: '', //作业票级别code
					workTypecode: '', //作业类型code
					safeway: '',
					isNeedCheck: '1',
					result: '合格',
					otherdanger: '',
					aboutwork: ''
				},
				gascontentList:[],
				rule: [{
					required: true
				}], // 校验规则
				showPicker1: false,
				columns1: ['合格', '不合格'],
				leader: null,
				leadercheck: {
					index: 0,
					text: '危险辨识人员',
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
				}
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
			this.leader = data
			this.getdetail(data)
			
			this.$bus.on('signshow', e => { //走流程的过程：领导
				// console.log(e)
				let json = {
					bussinessId: this.leader.bussinessId,
					isSafe: this.addForm.isNeedCheck=='1'?1:0,
					otherDanger: this.addForm.otherdanger,
					specialWork: this.addForm.aboutwork,
					protectManagerSid: e.fileId
				}
				console.log(json)
				this.$axios.post('/w/jobWork/submitDangerIdentity', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							this.$router.go(-1)
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
					bussinessId: data.bussinessId
				}
				// this.detectMatters = []
				this.$axios.post('/w/jobWork/getProtectMeasuresDetail',json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							this.addForm.workcode = data.jobWorkNo
							this.addForm.workLevelcode = res.data.data.jobLevel
							this.addForm.workTypecode = res.data.data.jobTypeCode
							this.gascontentList = data.jwProtectMeasuresList
							// this.addForm.
							// this.detectMatters = data
							// for (let i=0;i<data.length;i++) {
							// 	this.detectMatters.push({
							// 		detectMatter: data[i].detectMatter,
							// 		detectUnit: data[i].detectUnit,
							// 		['model'+i] : ''
							// 	})
							// }
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
					// console.log(this.addForm.isNeedCheck)
					this.$bus.emit('signwrite', this.leadercheck)
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
	.dangerTagged {
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
	.fieldbottom {
		margin-bottom: 10px;
	}
	.bottomnone::after {
		border-bottom: 0;
	}
</style>
