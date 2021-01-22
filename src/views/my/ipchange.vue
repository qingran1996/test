<template>
	<div class="ipchange">
		<van-cell-group>
			<!-- <van-field name="switch" label="IP地址头切换">
				<template #input>
					<van-switch v-model="switchChecked" size="20" @input="showcs" />
					<span style="margin-left: 20px;">{{shownum}}</span>
				</template>
			</van-field> -->
			<van-field v-model="shownum" label="IP地址头输入" placeholder="" />
		</van-cell-group>
		<van-button class="bottomOut" type="info" @click="changeip" block>保存</van-button>
	</div>
</template>

<script>
	export default {
		name: "ipchange",
		data() {
			return {
				switchChecked: false,
				shownum: 'http://192.168.10.152:10005',
			};
		},
		mounted() {
			if (this.$store.state.devNum == 'http://192.168.10.152:10005') {
				this.switchChecked = false
				this.shownum = 'http://192.168.10.152:10005'
			} else {
				this.switchChecked = true
				this.shownum = 'http://192.168.10.153:10005'
			}
		},
		methods: {
			changeip (event) {
				this.$axios.defaults.baseURL = this.shownum
				this.$store.commit('getdevNum', this.shownum)
				this.$toast('修改成功')
				// this.$store.commit('getpicUrl', 'http://192.168.10.153:10005/u/file/')
				// this.shownum = 'http://192.168.10.153:10005'
			},
			showcs(event) {
				console.log(event)
				if (event) {
					this.$axios.defaults.baseURL = 'http://192.168.10.153:10005'
					this.$store.commit('getdevNum', '153')
					this.$store.commit('getpicUrl', 'http://192.168.10.153:10005/u/file/')
					this.shownum = 'http://192.168.10.153:10005'
				} else {
					this.$axios.defaults.baseURL = 'http://192.168.10.152:10005'
					this.$store.commit('getdevNum', '152')
					this.$store.commit('getpicUrl', 'http://192.168.10.152:10005/u/file/')
					this.shownum = 'http://192.168.10.152:10005'
				}
			},
		}
	}
</script>

<style scoped>
	.van-cell__title {
		text-align: right;
	}

	.van-field>>>.van-field__control {
		text-align: center;
	}

	.van-field>>>.van-field__label {
		width: auto;
	}

	.ipchange {
		height: 100%;
	}

	.passshow {
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
