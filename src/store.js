import Vue from 'vue'
import Vuex from 'vuex'
import localStore from 'store'		// 浏览器存储

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		sidebarShow: true,
		navName: '',
		user: {},
		permission: {},
		dictionary: {}
	},
	mutations: {
		sidebarShow (state, params) {
			state.sidebarShow = params.sidebarShow;
		},
		navName(state, params) {
			state.navName = params.navName;		// 切换导航和菜单
		},
		user(state, params) {
			localStore.set('user', params);
			state.user = params;
		},
		dictionary(state, params) {					// 全局字典
			localStore.set('dictionary', params);
			state.dictionary = params;
		},
		permission(state, params) {
			let permission = {};
			// 转换格式
			if (Array.isArray(params)) {
				params.forEach(v => {
					if (!permission[v.module]) {
						permission[v.module] = {}
					}
					permission[v.module][v.action] = true;
				});
			}
			localStore.set('permission', permission);
			state.permission = permission;
		}
	},
	actions: {

	}
})
