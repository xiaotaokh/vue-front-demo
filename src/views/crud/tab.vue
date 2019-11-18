<template>
  <div class="app-config_manage">
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
    name: "config_manage",
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
          {label: "基础设置", name: "basic_setting"},
          {label: "字典管理", name: "dictionary_manage"}
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
  }
</script>

<style>
  .app-config_manage {}
</style>
