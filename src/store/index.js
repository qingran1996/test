import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		title: '',
		url: '',
		picUrl: 'http://192.168.10.152:10005/u/file/',
		maintain: '1',
		sparePart: '1',
		work: '0',
		workactive: 0,
		keepfit: '1',
		change: '1',
		devNum: 'http://192.168.10.152:10005',
		projectnav: '',
	},
	getters: { //实时监听state值的变化 
		showtitle() {
			return state.title
		},
		showpicUrl() {
			return state.picUrl
		},
		showurl() {
			return state.url
		},
		showmaintain() {
			return state.maintain
		},
		showsparePart() {
			return state.sparePart
		},
		showwork() {
			return state.work
		},
		showworkactive() {
			return state.workactive
		},
		showkeepfit() {
			return state.keepfit
		},
		showchange() {
			return state.change
		},
		showdevNum() {
			return state.devNum
		},
		showprojectnav() {
			return state.projectnav
		}
	},
	mutations: {
		gettitle(state, data) {
			state.title = data
		},
		getpicUrl(state, data) {
			state.picUrl = data
		},
		geturl(state, data) {
			state.url = data
		},
		getmaintain(state, data) {
			state.maintain = data
		},
		getsparePart(state, data) {
			state.sparePart = data
		},
		getwork(state, data) {
			state.work = data
		},
		getworkactive(state, data) {
			state.workactive = data
		},
		getkeepfit(state, data) {
			state.keepfit = data
		},
		getchange(state, data) {
			state.change = data
		},
		getdevNum(state, data) {
			state.devNum = data
		},
		getprojectnav(state, data) {
			state.projectnav = data
		}
	},
	actions: {},
	modules: {}
});
