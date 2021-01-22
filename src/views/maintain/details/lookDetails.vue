<template>
	<div class="detail">
		<van-form ref="detailform">
			<van-field v-model="detailForm.wcode" name="设备位号" label="设备位号" placeholder="设备位号" disabled></van-field>
			<van-field v-model="detailForm.gcode" name="工单编号" label="工单编号" placeholder="工单编号" disabled></van-field>
			<van-field v-model="detailForm.place" name="设备位置" label="设备位置" placeholder="设备位置" disabled></van-field>
			<van-field v-model="detailForm.question" class="problem" name="问题描述" label="问题描述" placeholder="问题描述" type="textarea"
			 autosize disabled></van-field>
			<van-field v-model="detailForm.questionpic" name="问题图片" label="问题图片" placeholder="问题图片" disabled>
				<template #input>
					<van-row>
					  <van-col span="24">
						  <van-image v-for="(item,index) in uploader " :key="index" style="margin: 5px;" width="1.8rem" fit="cover" height="1.8rem"
						   :src="item.url" @click="seeBigImg(uploader,index)" />
					  </van-col>
					</van-row>
				</template>
			</van-field>
			<van-field v-model="detailForm.person" name="确认人" label="确认人" placeholder="确认人" disabled></van-field>
			<van-field v-model="detailForm.status" name="问题确认" label="问题确认状态" placeholder="问题确认状态" disabled></van-field>
			<van-field v-model="detailForm.time" name="申请时间" label="申请时间" placeholder="申请时间" disabled border></van-field>
		</van-form>
	</div>
</template>

<script>
	import {
		ImagePreview
	} from 'vant'
	export default {
		data() {
			return {
				detailForm: {
					wcode: '',
					gcode: '',
					place: '',
					question: '',
					questionpic: '',
					person: '',
					status: '',
					time: '',
				},
				uploader: [],
			}
		},
		mounted() {
			let data = JSON.parse(this.$route.query.data)
			console.log(data)
			let picData = []
			if (data.applyPics.length != 0) {
				for (let i = 0; i < data.applyPics.length; i++) {
					picData.push({
						url: this.$store.state.picUrl + data.applyPics[i].picPath
					})
				}
			}
			this.uploader = picData
			this.detailForm = {
				wcode: data.equipmentNo,
				gcode: data.workOrderNo,
				place: data.equipmentLocation,
				question: data.problemContent,
				person: data.problemConfirmerName,
				status: '待确认',
				time: this.formatDate(data.applyTime),
			}
		},
		methods: {
			seeBigImg(images, index) {
				//console.log(images)
				let imgUrl = []
				for (let i = 0; i < images.length; i++) {
					imgUrl.push(images[i].url)
				}
				ImagePreview({
					images: imgUrl,
					showIndex: true,
					loop: false,
					startPosition: index
				})
			}
		}

	}
</script>

<style scoped>
	.detail {
		overflow-y: scroll;
		height: calc(100% - 50px);
	}

	.van-field__label {
		font-size: 15px;
	}
	.problem>>>.van-field__control {
		text-align: left;
	}
	.van-field>>>.van-field__control {
		text-align: right;
	}

	.van-field>>>.van-field__control:disabled {
		-webkit-text-fill-color: #999999;
	}

	.van-cell>>>.van-field__label {
		color: #242424;
	}
</style>
