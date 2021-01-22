<template>
	<div class="my">

		<van-cell-group>
			<!-- <van-cell  :key="username" title="当前登陆账号" is-link /> -->
			<van-cell title="头像" center>
				<template #default>
					<van-image @click="show = true" round fit="cover" width="50" height="50" :src="img" />
				</template>
			</van-cell>
			<van-action-sheet v-model="show" cancel-text="取消" close-on-click-action @cancel="show = false">
				<van-cell-group>
					<van-cell value="查看头像" @click="seeBigImg(img,0)" />
					<van-cell>
						<!-- 使用 title 插槽来自定义标题 -->
						<template #default>
							<van-uploader :upload-text="'我靠'" :preview-image="false" v-model="beforepicMsg" :before-delete="deletefile"
							 :after-read="afterRead">
								<template #default>
									<span class="custom-title">拍照或上传本地图片</span>
								</template>
							</van-uploader>
						</template>
					</van-cell>
				</van-cell-group>
			</van-action-sheet>
			<van-cell title="姓名" :value="username" />
			<van-cell title="性别" :value="sex" />
			<van-cell title="部门" :value="dept" />
			<van-cell title="角色" :value="role" />
			<van-cell title="工号" :value="num" />
			<van-cell title="手机号" :value="phone" />
			<van-cell title="邮箱" :value="email" />
			<van-cell title="相关证书" is-link>
				<template #default>
					<span class="custom-title" style="color: #39A9ED;">查看详情</span>
				</template>
			</van-cell>

			<van-cell title="修改密码" :value="password" is-link to="/changePassword" />
			<!-- <van-field name="switch" label="服务器切换">
				<template #input>
					<van-switch v-model="switchChecked" size="20" @input="showcs" />
					<span style="margin-left: 50px;">{{shownum}}端口</span>
				</template>
			</van-field> -->
			<van-cell title="IP地址修改" value="" is-link to="/ipchange" />
			<!-- <van-cell v-for="value in 6" :key="value" title="内容块" is-link /> -->
		</van-cell-group>
		<van-button :loading="isloading" loading-text="退出登陆中..." class="bottomOut" type="info" @click="goback" block>退出</van-button>
		<!-- <van-tabbar route>
		  <van-tabbar-item replace to="/index" icon="wap-home-o">
		    首页
		  </van-tabbar-item>
		  <van-tabbar-item replace to="/my" icon="friends-o">
		    我的
		  </van-tabbar-item>
		</van-tabbar> -->
	</div>
</template>

<script>
	import {
		ImagePreview
	} from 'vant'
	export default {
		name: "my",
		data() {
			return {
				isloading: false,
				img: '',
				username: localStorage.getItem('userName'),
				beforepicMsg: [],
				showhead: '',
				showbeforepic: [],
				sex: '',
				dept: '',
				role: '',
				num: '',
				phone: '',
				email: '',
				book: '',
				password: '',
				switchChecked: false,
				shownum: '152',
				show: false,
				// user: localStorage.getItem('userId')
			};
		},
		mounted() {
			let persondata = JSON.parse(decodeURI(localStorage.getItem('person')))
			console.log(persondata)
			this.img = this.$store.state.picUrl + localStorage.getItem('attachUrl')
			this.sex = persondata.sex == 1 ? '男' : '女'
			this.dept = persondata.organization != null ? persondata.organization.longName : ''
			this.role = ''
			this.num = persondata.code
			this.phone = persondata.phone
			this.email = persondata.email
			this.book = ''

			console.log(localStorage.getItem('userName'))
			if (this.$store.state.devNum == '152') {
				this.switchChecked = false
				this.shownum = '152'
			} else {
				this.switchChecked = true
				this.shownum = '153'
			}
		},
		methods: {
			
			changehead (path) {
				let json = {
					id: localStorage.getItem('userId'),
					attachUrl: path,
				}
				// console.log(json)
				this.$axios.post('/u/user/update', json).then(res => {
					if (res.data.code === 0) {
						console.log(res.data)
						this.img = this.$store.state.picUrl + res.data.data.attachUrl
						localStorage.setItem('attachUrl', res.data.data.attachUrl) //用户登陆头像
					} else {
						this.$toast('修改头像失败')
					}
				}).catch(res => {
					this.$toast('修改头像失败')
				})
			},
			uploadfile(i) {
				this.beforepicMsg[i].status = 'uploading'
				this.beforepicMsg[i].message = '上传中...'
				let formData = new FormData()
				formData.append('file', this.beforepicMsg[i].file)
				formData.append('source', 5)
				//console.log(formData)
				let that = this
				this.$axios.post('/u/attach/upload', formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}).then(res => {
						that.show = false
						if (res.data.code === 0) {
							console.log(res.data.data)
							that.changehead(res.data.data.filePath)
							// that.beforepicId = this.$store.state.picUrl + res.data.data.filePath
							setTimeout(() => {
								that.beforepicMsg[i].status = 'done';
								that.beforepicMsg[i].message = '上传成功';
								// that.showbeforepic.push(res.data.data)
							}, 500)
						} else {
							setTimeout(() => {
								that.beforepicMsg[i].status = 'failed';
								that.beforepicMsg[i].message = '上传失败';
							}, 500)
						}
					})
					.catch(res => {
						that.show = false
						setTimeout(() => {
							that.beforepicMsg[i].status = 'failed';
							that.beforepicMsg[i].message = '上传失败';
						}, 500)
					})
			},
			afterRead(file) {
				// console.log(file)
				// console.log(this.beforepicMsg)
				let that = this
				this.showbeforepic = []
				let current = this.current //当前上传
				// if (this.beforepicMsg.length != 0) {
				// 	this.uploadfile(0)
				// }
				this.uploadfile(this.beforepicMsg.length - 1)

				//this.uploadmisg = file.content
			},
			deletefile(file) {
				//console.log(file)
				//console.log(this.picMsg)
				for (var i = 0; i < this.beforepicMsg.length; i++) {
					if (this.beforepicMsg[i].content === file.content) {
						this.beforepicMsg.splice(i, 1);
					}
				}
				//console.log(this.beforepicMsg)
				for (var i = 0; i < this.showbeforepic.length; i++) {
					if (file.file.name === this.showbeforepic[i].fileName) {
						this.showbeforepic.splice(i, 1)
					}
				}
				console.log(this.showbeforepic)
			},
			showcs(event) {
				console.log(event)
				if (event) {
					this.$axios.defaults.baseURL = 'http://192.168.10.153:10005'
					this.$store.commit('getdevNum', '153')
					this.shownum = '153'
				} else {
					this.$axios.defaults.baseURL = 'http://192.168.10.152:10005'
					this.$store.commit('getdevNum', '152')
					this.shownum = '152'
				}
			},
			seeBigImg(images, index) {
				this.show = false;
				//console.log(images)
				let imgUrl = []
				imgUrl.push(images)
				// for (let i = 0; i < images.length; i++) {
				// 	imgUrl.push(images[i].url)
				// }
				ImagePreview({
					images: imgUrl,
					showIndex: true,
					loop: false,
					startPosition: index
				})
			},
			goback() {
				let that = this
				that.isloading = true
				setTimeout(function() {
					that.isloading = false
					localStorage.removeItem('eleToken')
					that.$router.push(`/`)
				}, 1000)

			}
		}
	}
</script>

<style scoped>
	.van-cell__title {
		text-align: left;
	}

	.van-cell__value--alone {
		text-align: center;
	}

	.van-field>>>.van-field__label {
		width: auto;
	}

	.my {
		height: calc(100% - 150px);
		overflow-y: scroll;
	}

	.bottomOut {
		position: fixed;
		width: 90%;
		margin: 0 5%;
		bottom: 50px;
		border-radius: 10px;
	}
</style>
