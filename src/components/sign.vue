<template>
	<div class="sign">
		<van-popup v-model="shownav" closeable close-icon="close" round position="bottom" :style="{ height: '90%' }">
			<div class="watchshow" ref="watchshow" v-html="safeContent">
				<!-- {{safeContent}} -->
			</div>
			<van-button v-if="!isbutton" class="watchnav" disabled round type="info">
				<div style="display: flex;">
					<div style="margin-right: 3px;">{{lookbutton}} </div>
					<div> ( </div>
					<div>
						<van-count-down ref="countDown" :time="looknum" :auto-start="false" format="ss" @finish="finish" />
					</div>
					<div style="font-size: 15px;">s</div>
					<div> ) </div>
				</div>
			</van-button>
			<van-button v-if="isbutton" @click="changesign" class="watchnav" round type="info">
				已读并签名
			</van-button>
		</van-popup>
		<van-popup class="watchshow" ref="watchshow1" v-model="showpopup" closeable close-icon="close" round position="bottom"
		 :style="{ height: popheight }">
			<div class="signtitle">{{writeMan}}请签名</div>
			<div class="nav" :style="{ height: popheight1 }">
				<van-cell title="您的位置" size="large">
					<template #default>
						<van-button v-show="address==''" round type="info" size="mini" @click="fixedPos()">点击获取位置</van-button>
						<span class="custom-title">{{address}}</span>
					</template>
				</van-cell>
				<div id="mapshow" :style="{height: mapheight}"></div>
				<van-cell value="您的签名" size="large" />
				<sign-canvas class="sign-canvas" ref="SignCanvas" :options="options" v-model="value" />
				<!-- <img class="view-image" :src="value" width="150" height="150"> -->
				<div class="sign-btns">
					<span id="clear" @click="canvasClear()">重签</span>
					<!-- <span id="save" @click="saveAsImg()">保存</span> -->
					<span id="save" @click="tj()">提交</span>
					<!-- <span id="save" @click="downloadSignImg()">下载</span> -->
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	export default {
		name: "sign",
		components: {},
		props: {
			jobLevel: {
				type: String,
				default: ''
			},
			jobTypeCode: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				popheight: document.body.clientHeight * 0.85 + 'px',
				popheight1: document.body.clientHeight * 0.85 - 55 + 'px',
				mapheight: document.body.clientHeight * 0.3 + 'px',
				shownav: false, //注意事项
				lookbutton: '请仔细阅读注意事项',
				isbutton: false,
				looknum: 3000,
				showpopup: false, //展示底部弹出
				getshow: null, //获取的数据
				writeMan: '签名', //顶部人员签名
				design: 0, //判断是单个签名0，还是人群签名1
				address: '',
				map: null,
				local: null,
				jw: '', //经纬左边组合
				mk: null,
				latitude: '',
				longitude: '',
				keyWords: '',
				// -----签字版信息
				value: null,
				safeContent: '',
				options: {
					lastWriteWidth: 1, //下笔的宽度 [Number] 可选
					writeWidth: 3, //基础轨迹宽度  [Number] 可选
					isSign: true, //签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
					isShowBorder: false, //是否显示边框 [可选]
					canvasWidth: document.body.clientWidth * 0.95, //canvas宽高 [Number] 可选
					canvasHeight: 300, //高度  [Number] 可选
					bgColor: '#fff',
					// writeColor: 'blue', // 轨迹颜色  [String] 可选
					borderColor: "yellow",
					lineCap: 'round', //线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]	正方形线帽
					lineJoin: 'round',
					goway: false
				}
			};
		},
		created() {
			this.$bus.off('signwrite')
		},
		mounted() {
			// this.$store.commit('getwork', name)
			this.$bus.on('signwrite', e => {
				// console.log(e)
				console.log('进入签名页面')
				this.getshow = e
				this.writeMan = e.text
				this.design = e.design //判断是单个签名0，还是人群签名1
				this.shownav = true
				
				this.getSecurityToldTpl() //获取模板
				// console.log(e.goway)
				if (e.goway!=undefined) { //走流程专用
					this.goway = true
				} else {
					this.goway = false
				}
				this.isbutton = false
				this.looknum = 3000
				this.$nextTick(() => {
					this.$refs.watchshow.scrollTop = 0
					this.$refs.watchshow1.scrollTop = 0
					this.$refs.countDown.start()
				})
				
			})

		},
		methods: {
			getSecurityToldTpl() {
				let json = {
					jobTypeCode: this.jobTypeCode,
					jobLevel: this.jobLevel
				}
				this.$axios.post('/w/jobWork/getSecurityToldTpl',json).then(res => {
						if (res.data.code === 0) {
							// console.log(res.data.data)
							let data = res.data.data
							this.safeContent = data.safeContent
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						this.$toast('服务异常')
					})
			},
			finish() {
				// this.$toast('倒计时结束');
				this.isbutton = true
				this.$refs.countDown.reset();
			},
			changesign() {
				this.shownav = false
				this.showpopup = true
				this.$nextTick(() => {
					this.initMap()
				})
			},
			initMap() {
				this.map = new BMap.Map('mapshow')
				let point = new BMap.Point(120.619907, 31.317987)
				this.map.centerAndZoom(point, 12)
				this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
				this.fixedPos()
			},
			//获取定位
			fixedPos() {
				const _this = this
				const geolocation = new BMap.Geolocation()
				this.confirmLoading = true
				geolocation.getCurrentPosition(function(r) {
					if (this.getStatus() == BMAP_STATUS_SUCCESS) {
						let myGeo = new BMap.Geocoder()
						myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result) {
							_this.confirmLoading = false
							if (result) {
								_this.latitude = result.point.lat
								_this.longitude = result.point.lng
								_this.address = result.address
							}
							_this.map.centerAndZoom(new BMap.Point(result.point.lng, result.point.lat), 16)
							_this.handleMarker(_this, r.point)
							// console.log(result)
						})
					} else {
						_this.$message.error('failed' + this.getStatus())
					}
				})
			},
			// 设置标注
			handleMarker(obj, point) {
				obj.mk = new BMap.Marker(point)
				obj.map.addOverlay(obj.mk)
				obj.mk.enableDragging() // 可拖拽
				obj.mk.addEventListener('dragend', function(e) { // 监听标注的拖拽，获取拖拽后的经纬度
					this.latitude = point.lat
					this.longitude = point.lng
				})
				obj.map.panTo(point)
			},
			/**
			 * 清除画板
			 */
			canvasClear() {
				this.$refs.SignCanvas.canvasClear();
			},

			/**
			 * 保存图片
			 */
			saveAsImg() {
				const img = this.$refs.SignCanvas.saveAsImg();
				alert(`image 的base64：${img}`);
			},
			//提交签名
			tj() {
				// console.log(this.value)
				// console.log(this.convertBase64UrlToBlob(this.value))
				let fileshow = this.dataURLtoFile(this.value, this.writeMan + '的签名.png')
				let formData = new FormData()
				let sign = {
					"source": 5,
					"longitude": this.longitude,
					"latitude": this.latitude,
					"address": this.address
				}
				formData.append('file', fileshow)
				formData.append('sign', JSON.stringify(sign))
				let that = this
				this.$axios.post('/u/attach/uploadSign', formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}).then(res => {
						if (res.data.code === 0) {
							let data = res.data.data
							that.getshow.writeType = 1
							that.getshow.address = that.address
							that.getshow.jd = that.longitude
							that.getshow.wd = that.latitude
							that.getshow.fileId = data.id
							that.getshow.fileName = data.fileName
							that.getshow.filepath = that.$store.state.picUrl + data.filePath
							that.canvasClear()
							that.showpopup = false
							if (that.goway) {
								that.$bus.emit('signshow',that.getshow)
							}
							// that.$bus.emit('signshow',that.getshow)
						} else {
							this.$toast(res.data.message)
						}
					})
					.catch(res => {
						console.log(res)
					})
			},
			/**
			 * 下载图片
			 */
			downloadSignImg() {
				this.$refs.SignCanvas.downloadSignImg();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.signtitle {
		margin: 15px 0 30px 0;
		font-weight: bold;
		font-size: 18px;
		width: 100%;
		text-align: center;
	}

	.watchshow {
		width: 100%;
		text-align: left;
		margin-top: 50px;
		height: calc(100% - 110px);
		overflow-y: scroll;
	}

	.van-cell__title {
		text-align: left;
	}

	#mapshow {
		width: 90%;
		margin: 0 5%;
	}

	.nav {
		
		overflow-y: scroll;
	}

	.watchnav {
		width: 90%;
		margin: 0 5%;
		position: absolute;
		left: 0;
		bottom: 10px;
	}

	.van-count-down {
		color: white !important;
	}

	/* -----------------签字版css */


	.sign-canvas {
		// width: 100% !important;
		// height: 300px !important;
		display: block;
		margin: 0 auto;
	}

	.view-image {
		display: block;
		margin: 20px auto;
	}

	.sign-btns {
		margin: 0 auto;
		display: flex;
		justify-content: space-between;

		#clear,
		#clear1,
		#save {
			margin: 0 auto;
			display: inline-block;
			padding: 5px 10px;
			width: 150px;
			height: 40px;
			line-height: 40px;
			border: 1px solid #eee;
			background: #e1e1e1;
			border-radius: 10px;
			text-align: center;
			margin: 20px auto;
			cursor: pointer;
		}

		#clear {
			background: seagreen !important;
			color: white;
		}

		#save {
			background: rgb(25, 137, 250) !important;
			color: white;
		}
	}
</style>
