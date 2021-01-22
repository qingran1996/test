<template>
	<div class="changePassword">
		<van-cell-group>
			<van-field v-model="oldpassword" label="新密码" type="password" placeholder="请输入密码" />
			<van-field v-model="newpassword" label="确认密码" type="password" placeholder="请输入密码" />
		</van-cell-group>


		<van-button :loading="isloading" loading-text="退出登陆中..." class="bottomOut" type="info" block @click="changeps">保存并返回登陆</van-button>
	</div>
</template>

<script>
	export default {
		name: "changePassword",
		data() {
			return {
				oldpassword: '',
				newpassword: '',
				persondata: null,
				isloading: false
			};
		},
		mounted() {
			let persondata = JSON.parse(decodeURI(localStorage.getItem('person')))
			console.log(persondata)
			this.persondata = persondata
		},
		methods: {
			changeps() {
				if (this.time) {
					clearTimeout(this.time)
				}
				this.time = setTimeout(() => {
					if (this.oldpassword!=this.newpassword) {
						this.$toast('密码不一致，请确认')
					} else {
						let json = {
							id: localStorage.getItem('userId'),
							password: this.newpassword
						}
						// console.log(json)
						this.isloading = true
						this.$axios.post('/u/user/update', json).then(res => {
							if (res.data.code === 0) {
								// console.log(res.data)
								setTimeout(()=>{
									this.isloading = false
									localStorage.removeItem('eleToken')
									this.$router.push(`/`)
								},1000)
								
							} else {
								this.isloading = false
								this.$toast('修改失败')
							}
						}).catch(res => {
							this.isloading = false
							this.$toast('修改失败')
						})
					}
				}, 300) // 大概时间300ms
			}
		}
	}
</script>

<style scoped>
	.van-cell__title {
		text-align: right;
	}

	.van-field>>>.van-field__control {
		text-align: right;
	}

	.van-field>>>.van-field__label {
		width: auto;
	}

	.changePassword {
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
