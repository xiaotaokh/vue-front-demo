import axios from 'axios'
import CryptoJS from 'crypto-js'
import { is } from '../lib/util'

/**
 * 统一拦截错误码
 * @param vm vue实例
 * @param status 状态码
 */
let parseStatusCode = (vm, data, status) => {
	// 判断请求状态码
	if (status === 200) {
		return data.data
	}
	// 没有权限
	else if (status === 401) {
		throw new Error(status);
	}
	// Session失效
	else if (status === 403) {
		// @特殊处理 阻止到登录页面之前, 需要记录最后的访问页面
		if (vm.$route.fullPath !== '/login') {
			vm.localStore.set("before_403_path", vm.$route.fullPath);
		}
		vm.localStore.remove("user");
		vm.localStore.remove("permission");
		vm.$router.push('/login');
		throw new Error(status);
	}
	// 接口不存在
	else if (data.code === 404) {
		throw new Error(status);
	}
	// 其他异常信息
	else if (data.code === 500) {
		throw new Error(data.message);
	}
	// other
	else {
		throw new Error(status || data.message || 'request.js other error');
		// return data;
	}
}

export default {
	install: function (Vue) {
		Vue.prototype.$request = function (url, config, ignoreLoading) {

			// 指定浏览器前缀
			const apiPrefix = '/api';

			// 请求默认配置
			config = config || {};
			config.headers = config.headers || {};
			if (!config.ignoreApiPrefix) {
				config.url = apiPrefix + url;
			} else {
				config.url = url;
			}

			// @特殊处理, 全局的接口加密传输
			if (url === '/action') {
				// 加密
				let key = CryptoJS.enc.Utf8.parse(window.appSecretKey.KEY);
				let iv = CryptoJS.enc.Utf8.parse(window.appSecretKey.IV);
				let encryptResult = CryptoJS.AES.encrypt(JSON.stringify(config.data), key, {   //  AES加密
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7  // 后台用的是pad.Pkcs5,前台对应为Pkcs7
				});
				// 补充uuid
				config.headers.UUID = window.appSecretKey.UUID
				config.data = encodeURIComponent(CryptoJS.enc.Base64.stringify(encryptResult.ciphertext))
			}

			// 当请求开始, 自动设置loading状态
			!ignoreLoading && (this.loading = true);

			return axios.request(config).then((response) => {

				// 当请求成功, 自动设置loading状态
				!ignoreLoading && (this.loading = false);

				// 根据响应的状态码返回不同消息
				let data = response.data;

				// 二进制大对象 BLOB (binary large object)
				if (config.responseType === 'blob') {
					// console.log(data.type);
					// let suffix = data.type.match(/\/(.*)$/)[1];
					// 文件导出
					let url = URL.createObjectURL(new Blob([data]));
					let link = document.createElement('a');
					link.style.display = 'none';
					link.href = url;
					// let name = response.headers['content-disposition'].split(";")[1].trim().split('=')[1]
					let name = config.fileName;
					link.setAttribute('download', name);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					return;
				}

				// 登录特殊处理
				if (url === '/login') {
					if (data.code === 500) {
						return data
					}
					return data.data
				}

				return parseStatusCode(this, data, data.code);

			}).catch((response) => {

				// @特殊处理, 防止反复拦截
				if (response.message) {
					throw new Error(response.message);
				}

				// 当请求报错, 自动设置loading状态
				!ignoreLoading && (this.loading = false);

				// 根据响应的状态码返回不同消息
				return parseStatusCode(this, {}, response.response && response.response.status);
			})
			// chrome 67 支持
			// .finally(() => {
			// 	// 当请求报错, 自动设置loading状态
			// 	!ignoreLoading && (this.loading = false);
			// })
		}
		Vue.prototype.$get = function (url, config, ignoreLoading) {
			config = Object.assign({}, config, { method: 'get' })
			return this.$request(url, config, ignoreLoading)
		}
		Vue.prototype.$post = function (url, config, ignoreLoading) {
			config = Object.assign({}, config, { method: 'post' })
			return this.$request(url, config, ignoreLoading)
		}
		Vue.prototype.$put = function (url, config, ignoreLoading) {
			config = Object.assign({}, config, { method: 'put' })
			return this.$request(url, config, ignoreLoading)
		}
		Vue.prototype.$delete = function (url, config, ignoreLoading) {
			config = Object.assign({}, config, { method: 'delete' })
			return this.$request(url, config, ignoreLoading)
		}
		Vue.prototype.$all = function (requestInfos) {
			if (!Array.isArray(requestInfos)) {
				requestInfos = [requestInfos]
			}
			this.loading = true
			return Promise.all(requestInfos.map(requestInfo => {
				if (is(String, requestInfo)) {
					requestInfo = [requestInfo]
				}
				const config = Object.assign({}, {method: 'get'}, requestInfo[1])
				const url = requestInfo[0]
				return this.$request(url, config, true)
			}))
				.then(responses => {
					this.loading = false
					return responses
				})
				.catch((response) => {
					if (response.response.status === 401) {
						this.$router.push({
							name: 'login'
						})
					} else {
						// this.$message.error(response.response.data.message)
					}
					this.loading = false
				})
		}
	}
}
