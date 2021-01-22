import Vue from 'vue'
import service from '../static/http.js'


export default {
	install(Vue, options) {
		//时间戳转时间
		Vue.prototype.formatDate = function(value) {
			let date = new Date(value);
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? ('0' + MM) : MM;
			let d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			let h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			let m = date.getMinutes();
			m = m < 10 ? ('0' + m) : m;
			let s = date.getSeconds();
			s = s < 10 ? ('0' + s) : s;
			return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
		};
		//base64转file
		Vue.prototype.dataURLtoFile = function(dataurl, filename) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, {
				type: mime
			});
		};
		//将base64转换成可用formdata提交的文件
		Vue.prototype.convertBase64UrlToBlob = function(urlData) {
			//去掉url的头，并转换为byte 
				var split = urlData.split(',');
				var bytes=window.atob(split[1]);        
				//处理异常,将ascii码小于0的转换为大于0  
				var ab = new ArrayBuffer(bytes.length);  
				var ia = new Uint8Array(ab);  
				for (var i = 0; i < bytes.length; i++) {  
					ia[i] = bytes.charCodeAt(i);  
				}  
				return new Blob( [ab] , {type : split[0]}); 
		};
		//计算时间差
		Vue.prototype.DateDifference = function(startDate, endDate) {
			var ms = endDate - startDate;
			if (ms < 0) return 0;
			return Math.floor(ms / 1000 / 60 / 60);
		};
		//维修获取下个人
		Vue.prototype.getNextAssigent = function(data) { //全局函数
			return service({
				url: '/w/equipmentMaintenanceBussiness/getNextAssigent',
				method: 'post',
				data: data
			})
		};
		//设备维修管理待处理
		Vue.prototype.getEMDetail = function(data) { //全局函数
			return service({
				url: '/w/equipmentMaintenanceBussiness/getEMDetail',
				method: 'post',
				data: data
			})
		};
		//维修单号查询
		Vue.prototype.getEMRecordByWorkNoteNoLike = function(data) { //全局函数
			return service({
				url: '/w/equipmentMaintenanceBussiness/getWorkOrderNoInProcessInstanceByLike',
				method: 'post',
				data: data
			})
		};
		//设备分类名字查询
		Vue.prototype.deviceType = function(data) { //全局函数
			return service({
				url: '/d/deviceType/getById',
				method: 'post',
				data: data
			})
		};
		//根据角色获取人员
		Vue.prototype.getByRole = function(data) { //全局函数
			return service({
				url: '/u/user/getByRole',
				method: 'post',
				data: data
			})
		};
		//根据角色获取用户(工作票)
		Vue.prototype.getworkByRole = function(data) { //全局函数
			return service({
				url: '/w/jobWork/getByRole',
				method: 'post',
				data: data
			})
		};
		//获取施工单位
		Vue.prototype.getqueryForApp = function(data) { //全局函数
			return service({
				url: '/p/unit/queryForApp',
				method: 'post',
				data: data
			})
		};
		//获取施工单位下的人员
		Vue.prototype.getByUnitId = function(data) { //全局函数
			return service({
				url: '/p/personJobInfo/getByUnitId',
				method: 'post',
				data: data
			})
		};
		//获取下个审核人(工作票)
		Vue.prototype.getworkNextAssigent = function(data) { //全局函数
			return service({
				url: '/w/jobWork/getNextAssigent',
				method: 'post',
				data: data
			})
		};
		//任务详情
		Vue.prototype.gettaskDetail = function(data) { //全局函数
			return service({
				url: '/w/jobWork/taskDetail',
				method: 'post',
				data: data
			})
		};
	}
}
