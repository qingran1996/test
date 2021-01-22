<template>
	<div>
		<div class="van-dropdown-menu">
			<div class="van-dropdown-menu__bar van-dropdown-menu__bar--opened" @click="selectActive()">
				<div role="button" tabindex="0" class="van-dropdown-menu__item">
					<span class="van-dropdown-menu__title">
						<!-- <div class="van-ellipsis">{{ selectName }}</div> -->
						<van-icon class="addmore" name="add" color="#1989fa" size="30" />
					</span>

					<!-- <div v-if="showSelectMultiple" class="btn_left">
						<span v-if="!all" @click="toggleAll()">全选</span>
						<span v-if="all" @click="toggleFalseAll()">取消全选</span>

					</div> -->

				</div>
			</div>

		</div>
		<div v-if="showSelectMultiple" class="van-dropdown-item van-dropdown-item--down">
			<div class="van-overlay" style="z-index: 2005; position: absolute; animation-duration: 0.2s;" />
			<div ref="content" class="van-popup van-popup--top van-dropdown-item__content" :style="{maxHeight: showheight}">

				<van-checkbox-group v-model="checked" res="checkboxGroup" @change="selectDataOptsChange">
					<div v-for="(item,index) in selectDataOpts" :key="item.value" role="button" :tabindex="index" class="van-cell van-cell--clickable van-dropdown-item__option">
						<div class="van-cell__title">
							<span>
								<van-checkbox :name="item.value" checked-color="#A9B910">{{ index+1 }}.{{ item.text }}</van-checkbox>
							</span>
						</div>
					</div>
					<div v-show="selectDataOpts.length==0" style="text-align: center;line-height: 50px;">暂无记录</div>
					<!-- <div class="footer_btn">
            <div class="btn_d" @click="cancelSelect()">取消</div>
            <div class="btn_d btn_cur" @click="submitSelect()">确定</div>
          </div> -->
					<!-- <div class="blank"> </div> -->
				</van-checkbox-group>

			</div>
			<div v-if="showSelectMultiple" class="btn_true1">
				<span v-if="!all" @click="toggleAll()">全选</span>
				<span v-if="all" @click="toggleFalseAll()">取消全选</span>
			</div>
			<div v-if="showSelectMultiple" class="btn_true" @click="submitSelect()">确定</div>
			<!-- <div v-if="showSelectMultiple" class="btn_true" @click="submitSelect()">确定</div> -->
		</div>
	</div>
</template>
<script>
	import {
		Checkbox,
		CheckboxGroup,
		DropdownMenu,
		DropdownItem
	} from 'vant'
	export default {
		name: 'CopyCode',
		components: {
			VanCheckbox: Checkbox,
			VanCheckboxGroup: CheckboxGroup,
			// eslint-disable-next-line
			VanDropdownMenu: DropdownMenu,
			// eslint-disable-next-line
			VanDropdownItem: DropdownItem
		},
		props: {
			selectName: {
				type: String,
				default: '全部'
			},
			disabled: {
				type: Boolean,
				default: false
			},
			otherName: {
				type: String,
				default: '个人员'
			},
			checkedList: {
				type: Array,
				default: function() {
					return []
				}
			},
			selectDataOpts: {
				type: Array,
				default: function() {
					return []
				}
			}
			// showSelectMultiple: {
			//   type: Boolean,
			//   default: false
			// }
		},
		data() {
			return {
				showSelectMultiple: false,
				checked: [], //选中的value组
				alldata: [], //选中的整体
				all: false,
				lastdata: [],
				childData: true,
				showheight: document.body.clientHeight * 0.6 + 'px',
			}
		},
		watch: {
			'selectDataOpts'(newValue, oldValue) {
			// 　　　　console.log(newValue,oldValue)
			    }
		},
		mounted() {
			// console.log(this.checkedList)
			this.checked = this.checkedList
			sessionStorage.setItem('selectall', JSON.stringify(this.selectDataOpts))
			this.lastdata = JSON.parse(sessionStorage.getItem('selectall'))
			//console.log(this.selectName)
		},
		methods: {
			selectActive() {
				
				// console.log(this.selectDataOpts)
				// console.log(this.lastdata)
				JSON.stringify(this.lastdata.sort())
				if (JSON.stringify(this.lastdata.sort()) != JSON.stringify(this.selectDataOpts.sort())) {
					console.log('切换了不同')
					sessionStorage.setItem('selectall', JSON.stringify(this.selectDataOpts))
					this.lastdata = JSON.parse(sessionStorage.getItem('selectall'))
					this.checked = []
					this.alldata = []
					this.all = false
					// console.log(this.selectDataOpts)
					// console.log(this.lastdata)
				} else {
					console.log('相同的')
					// console.log(this.selectDataOpts)
					// console.log(this.lastdata)
				}
				
				
				if (this.disabled) {
					return
				}
				this.showSelectMultiple = !this.showSelectMultiple
			},
			toggleAll() {
				const data = []
				for (let i = 0; i < this.selectDataOpts.length; i++) {
					data.push(this.selectDataOpts[i].value)
				}
				this.all = true
				this.checked = data
			},
			toggleFalseAll() {
				this.all = false
				this.checked = []
			},
			submitSelect() {
				this.showSelectMultiple = false
				this.selectNameData()
			},
			cancelSelect() {
				this.showSelectMultiple = false
			},
			selectDataOptsChange(data) {
				//	console.log(data)
				this.alldata = []
				for (let i = 0; i < this.selectDataOpts.length; i++) {
					for (let j = 0; j < data.length; j++) {
						if (data[j] == this.selectDataOpts[i].value) {
							this.alldata.push(this.selectDataOpts[i])
						}
					}
				}
				//this.selectNameData()
			},
			selectNameData() {
				if (!this.checked.length || this.selectDataOpts.length === this.checked.length) {
					this.$emit('selectMutiple', {
						checked: this.checked,
						all: this.alldata,
						type: this.selectName,
						name: '全部' + this.otherName
					})
				} else {
					this.$emit('selectMutiple', {
						checked: this.checked,
						all: this.alldata,
						type: this.selectName,
						name: '已选中（' + this.checked.length + ')' + this.otherName
					})
				}
			},
			onCopy() {},
			onError() {}

		}
	}
</script>
<style scoped>
	.copy {
		font-size: 14px;
	}

	.van-dropdown-item {
		top: 50px;
	}

	.van-dropdown-item__content {
		transition-duration: 0.2s;
		z-index: 2006;
		position: relative;
	}

	.blank {
		position: relative;
		width: 100%;
		height: 60px;
	}

	.btn_true {
		width: 60px;
		height: 30px;
		border-radius: 5px;
		background-color: #A2C14D;
		color: #fff;
		position: absolute;
		right: 10px;
		margin-top: 10px;
		text-align: center;
		line-height: 30px;
		float: right;
		z-index: 9999;
		font-size: 14px;
	}

	.btn_true1 {
		width: 60px;
		height: 30px;
		border-radius: 5px;
		background-color: #1989fa;
		color: #fff;
		position: absolute;
		right: 80px;
		margin-top: 10px;
		text-align: center;
		line-height: 30px;
		float: right;
		z-index: 9999;
		font-size: 14px;
	}

	.btn_left {
		width: 60px;
		height: 30px;
		position: absolute;
		text-align: center;
		line-height: 30px;
		left: 10px;
		font-size: 14px;
		top: 10px;
	}

	.van-dropdown-menu__title {
		position: absolute;
		right: 0;
	}

	.van-dropdown-menu__title::after {
		display: none;
	}

	.block_content {
		width: 100%;
	}

	.van-dropdown-menu__bar--opened {
		/* z-index: 9 !important; */
		width: 200px;
	}

	.flex_bottom {
		position: absolute;
		bottom: -10px;
		left: 0;
	}

	.van-dropdown-menu__bar {
		box-shadow: none;
	}

	.van-dropdown-menu__bar--opened {
		z-index: 9;
	}
</style>
