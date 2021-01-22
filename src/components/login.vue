<template>
	<div class="login">
		<!-- <canvaShow /> -->
		<vue-particles style="position: absolute;height: 100%;" color="#fff" :particleOpacity="0.7" :particlesNumber="60"
		 shapeType="triangle" :particleSize="4" linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4"
		 :linesDistance="150" :moveSpeed="2" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="lizi">
		</vue-particles>
		<!-- <div class="manage_tip">
			<span class="title">EAM</span>
			<van-form @submit="onSubmit" class="loginForm">
				<van-field v-model="username" name="用户名" label="用户名" placeholder="请填写用户名" :rules="[{ required: true}]" />
				<van-field v-model="password" type="password" name="密码" label="密码" placeholder="请填写密码" :rules="[{ required: true}]" />
				<div style="margin: 16px;">
					<van-button round block type="info" size="large" native-type="submit" :loading="isloading" loading-text="登陆中...">
						登陆
					</van-button>
				</div>
			</van-form>
		</div> -->
		<div class="usershow">
			<van-image width="100" height="100" :src="loginlogo" />
			<div style="text-align: center;font-size: 20px;color: white;margin-top: 20px;">方兴EAM管理系统</div>
			<van-cell style="margin-top: 15%;">
				<template #default>
					<div style="margin-bottom: 10px;">用 户 名</div>
					<div>
						<van-field clearable v-model="username" label="" placeholder="请输入用户名" :rules="[{ required: true}]" />
					</div>
				</template>
			</van-cell>
			<van-cell style="margin-top: 5%;">
				<template #default>
					<div style="margin-bottom: 10px;">用 户 密 码</div>
					<div>
						<van-field @click-right-icon="righticon" :right-icon="iconshow?'eye-o':'closed-eye'" @input="focusshow" v-model="password" :type="iconshow?'text':'password'" label="" placeholder="请输入用户密码" :rules="[{ required: true}]" />
					</div>
				</template>
			</van-cell>
			<div style="margin: 100px 7% 0 7%;">
				<van-button @click="onSubmit" round block type="info" color="rgba(255,255,255,0.37)" size="normal" native-type="submit"
				 :loading="isloading" loading-text="登陆中...">
					登 陆
				</van-button>
			</div>
		</div>

	</div>
</template>
<script>
	// import canvaShow from './canvas_show.vue'
	export default {
		name: 'login',
		components: {
			// canvaShow
		},
		data() {
			return {
				isloading: false,
				isshow: true,
				username: 'sAdmin',
				password: '123456',
				showpassword: '123456',
				loginlogo: require('../assets/eamlogo.jpg'),
				iconshow: true
				// userName: 'root',
				// passWord: 'root'
			}
		},
		mounted() {
			// this.password = this.password.replace(/./g,'*');
		},
		methods: {
			righticon (event) {
				// console.log(event)
				this.iconshow = !this.iconshow
				// if (!this.iconshow) {
				// 	this.showpassword = this.password.replace(/./g,'*')
				// }
			},
			focusshow (event) {
				// console.log(event)
				
			},
			onSubmit() {
				// console.log('submit', values);
				if (this.username != '' && this.password != '') {
					let json = {
						userName: this.username,
						password: this.password
					}
					let that = this
					that.isloading = true
					this.$axios.post('/u/login', json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							setTimeout(function() {
								that.isloading = false
								localStorage.setItem('eleToken', res.data.data.accessToken)
								localStorage.setItem('userId', res.data.data.id) //用户id
								localStorage.setItem('routerlist', encodeURI(JSON.stringify(res.data.data.userMenuMapList))) //路由
								localStorage.setItem('userName', res.data.data.name) //用户姓名
								localStorage.setItem('loginName', res.data.data.userName) //用户姓名
								localStorage.setItem('attachUrl', res.data.data.attachUrl) //用户登陆头像
								localStorage.setItem('passwordIsInit', res.data.data.passwordIsInit) //用户登陆是否初次
								localStorage.setItem('person', encodeURI(JSON.stringify(res.data.data.person))) //人员信息
								that.$router.push('/index');
							}, 500)
						} else {
							that.isloading = false
							this.$toast(res.data.message)
						}
					}).catch(res => {
						that.isloading = false
						this.$toast(res.data.message)
					})
				} else {
					this.$toast('请完善用户名及密码')
				}

			},
		}
	}
</script>
<style scoped>
	.login {
		width: 100%;
		height: 100%;
		/* background-color: #39A9ED; */
		background: url(../assets/bg.png) no-repeat center/cover;
	}

	.van-cell__title {
		text-align: left;
		border-bottom: 1px solid #F0ffff;
	}

	.van-button--round {
		border: 0;
	}

	.van-cell {
		text-align: left;
		font-size: 18px;
		background: transparent;
		color: white;
	}

	.van-cell::after {
		border: 0;
	}

	.van-cell>>>.van-cell__value {
		text-align: left;
		font-size: 16px;
		background: transparent;
		color: white;
	}

	.van-cell>>>.van-field__body {
		color: rgba(255, 255, 255, 0.5);
		border-bottom: 1px solid whitesmoke;
	}
	.van-cell>>>.van-field__control {
		color: rgba(255, 255, 255, 0.5);
	}

	.van-cell>>>.van-field {
		text-align: left;
		padding: 0;
	}

	.van-image>>>.van-image__img {
		border-radius: 10px;

		box-shadow: 3px 5px 0px rgba(255, 255, 255, 0.45);
	}

	.usershow {
		margin: 0 5% 10px 5%;
		padding-top: 20%;
	}

	::-webkit-input-placeholder {
		/*Webkit browsers 谷歌*/
		color: rgba(255, 255, 255, 0.5) !important;
		font-size: 12px;
	}

	:-moz-placeholder {
		/*Mozilla Firefox 4 to 8 火狐*/
		color: rgba(255, 255, 255, 0.5) !important;
		font-size: 12px;
	}

	::moz-placeholder {
		/*Mozilla Firefox 19+ 火狐*/
		color: rgba(255, 255, 255, 0.5) !important;
		font-size: 12px;
	}

	:-ms-input-placeholder {
		/*Internet Explorer 10+ IE10以上*/
		color: rgba(255, 255, 255, 0.5) !important;
		font-size: 12px;
	}
</style>
