<template>
  <div class="page-user_manage">
    <div class="app-page-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="t in filterTabs" :key="t.name" :label="t.label" :name="t.name"></el-tab-pane>
      </el-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import permission from '@/components/mixin/permission';
  export default {
    mixins: [permission],
    name: "user_manage",
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'activeTab'
    },
    computed: {
      filterTabs() {
//        let tabs = this.tabs.filter(v => {
//          return !!this.permission[v.name];
//        });
//        return tabs;
        return this.tabs
      },
    },
    data() {
      return {
        tabs: [
          {label: "用户管理", name: "user"},
          {label: "角色管理", name: "role"}
        ],
        // TAB默认选中
        activeName: "",
      }
    },
    methods: {
      handleClick(tab, event) {
        this.activeName = tab.name;
        this.$router.push({name: tab.name});
      },
      activeTab() {
        const names = this.filterTabs.map(v => v.name);
        if (!names.includes(this.$route.name)) {
          this.activeName = this.filterTabs[0].name;
          this.$router.push({name: this.activeName});
        } else {
          this.activeName = this.$route.name;
        }
      }
    },
    mounted() {
      this.activeTab();
    }
  };



//  // 被忽略的路由地址
//  const ignore = [
//    '/', 'login', 'page-404', 'page-403', 'page-500',
//    'demo', 'demo.filter', 'demo.request', 'demo.chart', 'demo.dialog'
//  ]
//
//  /**
//   * 主要用来拦截路由的钩子
//   * @param to Route: 即将要进入的目标 路由对象
//   * @param from: Route: 当前导航正要离开的路由
//   * @param next: Function: 一定要调用该方法来 resolve 这个钩子
//   */
//  router.beforeEach((to, from, next) => {
//    let path = to.path === '/' ? to.path : to.path.substring(1);
//    let index = path.indexOf('/');
//    // 控制菜单显示
//    store.commit('sidebarShow', {sidebarShow: true});
//    // 控制导航菜单
//    store.commit('navName', {navName: index === -1 ? path : path.substring(0, index)});
//    // 控制页面权限
//    // @特殊处理, 过滤无关路由, 可以显示的路由, 权限内的路由
//    let permission = Vue.prototype.localStore.get("permission") || store.state.permission;
//    let per = permission[to.name]
//    if (ignore.indexOf(to.name) !== -1 || to.meta.show || per && per.query) {
//      next();
//    } else {
//      if (!to.name) {
//        router.push({name: 'page-404'});
//      } else {
//        router.push({name: 'page-403'});
//      }
//    }
//  });


//  <el-table-column
//  label="操作"
//  align="center"
//  width="160px"
//  v-if="permissionsLock('scan_template.update.delete')">
//    <template slot-scope="scope">
//    <el-button type="text" v-permission="'scan_template.update'"
//  @click="editConfirm('update', scope.row)" class="text-color-blue">修改
//    </el-button>
//    <div class="operation-line"></div>
//    <el-button type="text" v-permission="'scan_template.delete'"
//  @click="delConfirm(scope.row)" class="text-color-red">删除
//    </el-button>
//    </template>
//    </el-table-column>


//  {
//    path: 'user_manage', name: 'user_manage', component: user_manage, meta: {name: '用户中心'},
//    children: [
//      {
//        path: '/', redirect: 'user',
//      },
//      {
//        path: 'user', name: 'user', component: user, meta: {name: '用户管理'},
//      },
//      {
//        path: 'role', name: 'role', component: role, meta: {name: '角色管理'},
//      },
//    ]
//  },

</script>

<style>
  .page-user_manage {
  }
</style>
