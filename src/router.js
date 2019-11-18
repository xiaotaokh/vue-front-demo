import Vue from 'vue'
import store from './store'
import Router from 'vue-router'

Vue.use(Router);

// test 测试页面
import Demo from './views/demo'
import DemoFilter from './views/demo/filter'
import DemoRequest from './views/demo/request'
import DemoChart from './views/demo/chart'
import DemoDialog from './views/demo/dialog'

// 根页面
import main from '@/views/main.vue'
import empty from '@/views/empty.vue'

// 登录
const login = resolve => require(['@/views/login/login.vue'], resolve);

// 错误页面
const page404 = resolve => require(['@/views/common/page-404.vue'], resolve);
const page403 = resolve => require(['@/views/common/page-403.vue'], resolve);
const page500 = resolve => require(['@/views/common/page-500.vue'], resolve);

// 用户管理
const user_manage = resolve => require(['@/views/user_manage/user_manage.vue'], resolve);

const router = new Router({
	routes: [
		{
			path: '/', redirect: '/main',
		},
		{
			path: '/main', name: 'main', component: main,
			children: [
				{
					path: '/', redirect: 'user_manage',
				},
				// 用户管理
				{
					path: 'user_manage', name: 'user_manage', component: user_manage, meta: {name: '用户管理'}
				}
			]
		},
		{
			path: '*', component: page404
		},
		{
			path: '/404', name: 'page-404', component: page404
		},
		{
			path: '/403', name: 'page-403', component: page403
		},
		{
			path: '/500', name: 'page-500', component: page500
		},
		{
			path: '/demo', name: 'demo', component: Demo,
			children: [
				{
					path: 'filter', name: 'demo.filter', component: DemoFilter
				},
				{
					path: 'request', name: 'demo.request', component: DemoRequest
				},
				{
					path: 'chart', name: 'demo.chart', component: DemoChart
				},
				{
					path: 'dialog', name: 'demo.dialog', component: DemoDialog
				},
			]
		}
	]
});

/**
 * 主要用来拦截路由的钩子
 * @param to Route: 即将要进入的目标 路由对象
 * @param from: Route: 当前导航正要离开的路由
 * @param next: Function: 一定要调用该方法来 resolve 这个钩子
 */
router.beforeEach((to, from, next) => {
	let path = to.path === '/' ? to.path : to.path.substring(1);
	let index = path.indexOf('/');
	// 控制菜单显示
	store.commit('sidebarShow', {sidebarShow: true});
	// 控制导航菜单
	store.commit('navName', {navName: index === -1 ? path : path.substring(0, index)});
	// 控制页面权限
	// let per = store.state.permission[to.name];
	// if (per && per.query) {
	// } else {
	// 	// router.app.$router.push('403');
	// }
	next();
});

export default router
