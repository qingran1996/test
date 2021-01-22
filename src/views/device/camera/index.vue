<template>
	<div class="erwm">
		<div class="scan">
			<van-icon name="arrow-left" size="26" color="white" class="iconback" @click="goback" />
			<div id="bcid">
				<div style="height:40%"></div>
				<p class="tip">...载入中...</p>
			</div>
			<footer>
				<p @click="startRecognize"></p>
				<p @click="startScan"></p>
				<p @click="cancelScan"></p>
				<p @click="closeScan"></p>
			</footer>
		</div>
	</div>
</template>



<script type='text/ecmascript-6'>
	var scan = null;

	var styles = {
		frameColor: "#2e5dea",
		scanbarColor: "#2e5dea",
	}; //边框属性，中间线属性，背景色
	// var filter = [plus.barcode.CODE128,plus.barcode.EAN13]
	var filter; //扫码格式 空为全类型

	export default {
		name: 'erwm',
		components: {


		},
		data() {
			return {
				codeUrl: '',

				isShow: true

			}

		},
		mounted() {
			this.startRecognize();
			this.startScan();
			// this.isShow = true;

		},
		created() {
			//this.startRecognize();
			this.$bus.$on('cameraShow', e => {
				if (e === false) {
					this.closeScan()
				}
			})
		},
		methods: {
			//创建扫描控件

			startRecognize() {
				//alert(123);

				let that = this;
				if (!window.plus) return;
				scan = new plus.barcode.Barcode('bcid', filter, styles);
				console.log(scan)
				scan.onmarked = onmarked;


				function onmarked(type, result, file) {
					switch (type) {
						case plus.barcode.QR:
							type = 'QR';
							break;
						case plus.barcode.EAN13:
							type = 'EAN13';
							break;
						case plus.barcode.EAN8:
							type = 'EAN8';
							break;
						case plus.barcode.CODE128:
							type = 'CODE128';
							break;
						default:
							type = '其它' + type;
							break;
					}
					result = result.replace(/\n/g, '');
					that.codeUrl = result;
					//alert(result)
					setTimeout(() => {
						that.$router.push({
							path: "/device",
							query: {
								id: result
							}
						})
					}, 500)
					that.closeScan()
				}
				that.startScan();
			},
			//开始扫描
			startScan() {
				if (!window.plus) return;
				scan.start();
			},
			//关闭扫描
			cancelScan() {
				if (!window.plus) return;
				scan.cancel();
			},
			//关闭条码识别控件
			closeScan() {
				if (!window.plus) return;
				scan.close();
			},
			goback() { // 返回
				this.closeScan()
				this.$router.push({
					path: '/index'
				});
				// this.isShow = false;
			}
		}
	}
</script>
<style>
	.scan {
		height: 100%;
		width: 100%;
		text-align: left;
	}

	.iconback {
		position: absolute;
		left: 0.426667rem;
		right: 0;
		top: 12px;
		z-index: 9999;
	}

	.scan footer {
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 1rem;
		height: 2rem;
		line-height: 2rem;
		z-index: 2;
	}

	.scan #bcid {
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 50px;
		bottom: 0;
		text-align: center;
		color: red;
		background: #fff;
	}
</style>
