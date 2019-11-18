<template>
  <div class="app-policy_rule">
    <div class="app-page-container">

      <!--查询条件-->
      <div class="app-page-box">
        <el-collapse accordion>
          <el-collapse-item>
            <template slot="title">
              <div class="search-header">
                <i class="icon iconfont icon-tiaojianshaixuan"></i>
                <span class="name">搜索条件</span>
              </div>
            </template>
            <div class="app-page-box-content clearfix">
              <el-form :inline="true" :model="searchForm" class="app-form-clear-margin-bottom" label-width="90px">
                <el-form-item label="源IP:">
                  <el-input v-model="searchForm.src_ip" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="源端口:">
                  <el-input v-model="searchForm.src_port" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="目的IP:">
                  <el-input v-model="searchForm.dst_ip" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="目的端口:">
                  <el-input v-model="searchForm.dst_port" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="协议:">
                  <el-select v-model="searchForm.protocol" multiple collapse-tags filterable clearable placeholder="选择协议">
                    <el-option :label="item.label" :value="item.value" v-for="item in protocol" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="启用状态:">
                  <el-select v-model="searchForm.status" multiple filterable clearable placeholder="选择状态">
                    <el-option :label="value" :value="key" v-for="(value, key) in status" :key="key" ></el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item label="触发时间:">-->
                  <!--<el-date-picker-->
                    <!--v-model="searchForm.trigger_time"-->
                    <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                    <!--align="right"-->
                    <!--type="daterange"-->
                    <!--unlink-panels-->
                    <!--range-separator="至"-->
                    <!--start-placeholder="开始日期"-->
                    <!--end-placeholder="结束日期"-->
                    <!--:picker-options="pickerOptions">-->
                  <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="事件类型:">-->
                  <!--<el-select v-model="searchForm.alert_type" multiple collapse-tags filterable clearable placeholder="请选择">-->
                    <!--<el-option :label="value" :value="key" v-for="(value, key) in alertType" :key="key"></el-option>-->
                  <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="指令:">
                  <el-input v-model="searchForm.funcs" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item class="app-search-btn-box">
                  <el-button type="success" @click="search">搜索</el-button>
                  <!--<el-button @click="resetForm('searchForm')">重置</el-button>-->
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 列表 -->
      <div class="app-page-box">
        <div class="app-page-box-content clearfix">

          <el-row class="margin-bottom-10" v-permission="'policy_rule.update.delete.insert'">
            <span class="table-header">策略规则列表</span>
            <el-button icon="icon iconfont icon-xinjian" class="icon-button" v-permission="'policy_rule.insert'"
                       @click="editConfirm('insert')">新增
            </el-button>
            <el-button icon="icon iconfont icon-qidong" class="icon-button" v-permission="'policy_rule.update'"
                       :disabled="enableBtnDisabled" :loading="enableBtnLoading"
                       @click="setEnable()">启用
            </el-button>
            <el-button icon="icon iconfont icon-jinyong" class="icon-button" v-permission="'policy_rule.update'"
                       :disabled="disableBtnDisabled" :loading="disableBtnLoading"
                       @click="setDisable()">禁用
            </el-button>
            <el-button icon="icon iconfont icon-picture-delet" class="icon-button" v-permission="'policy_rule.delete'"
                       :disabled="delBatchBtnDisabled" :loading="delBatchBtnLoading"
                       @click="delBatchConfirm()">删除
            </el-button>
          </el-row>

          <div class="app-page-box margin-bottom-clear">
            <el-table
              stripe
              tooltip-effect="dark"
              ref="tableData"
              v-loading="loading"
              :data="tableData"
              @sort-change="handleSortChange"
              @selection-change="handleSelectionChange">

              <el-table-column
                type="selection"
                width="45">
              </el-table-column>
              <el-table-column
                label="序号"
                align="center"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="src_ip"
                label="源IP"
                align="center"
                sortable="custom">
                <template slot-scope="scope">{{ scope.row.src_ip === 'any' ? '所有' : scope.row.src_ip }}</template>
              </el-table-column>
              <el-table-column
                prop="src_port"
                label="源端口"
                align="center"
                sortable="custom">
                <template slot-scope="scope">{{ scope.row.src_port === 'any' ? '所有' : scope.row.src_port }}</template>
              </el-table-column>
              <el-table-column
                prop="dst_ip"
                label="目的IP"
                align="center"
                sortable="custom">
                <template slot-scope="scope">{{ scope.row.dst_ip  === 'any' ? '所有' : scope.row.dst_ip }}</template>
              </el-table-column>
              <el-table-column
                prop="dst_port"
                label="目的端口"
                align="center"
                sortable="custom">
                <template slot-scope="scope">{{ scope.row.dst_port === 'any' ? '所有' : scope.row.dst_port }}</template>
              </el-table-column>
              <el-table-column
                prop="protocol"
                label="协议"
                align="center"
                sortable="custom">
                <template slot-scope="scope">{{ scope.row.protocol === 'any' ? '所有' : scope.row.protocol }}</template>
              </el-table-column>
              <el-table-column
                prop="funcs"
                label="指令"
                align="center"
                sortable="custom">
                <template slot-scope="scope">
                  {{ scope.row.funcs === 'any' ? '所有' : scope.row.func_dict_name + '/' + scope.row.dictionary.item_name }}
                </template>
              </el-table-column>
              <el-table-column
                prop="event_info"
                label="事件信息"
                align="center"
                sortable="custom">
                <template slot-scope="scope">{{ scope.row.event_info }}</template>
              </el-table-column>
              <el-table-column
                prop="risk_item_id"
                label="风险等级"
                align="center"
                sortable="custom">
                <template slot-scope="scope">{{ riskLevel[scope.row.risk_item_id] }}</template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                align="center"
                sortable="custom">
                <template slot-scope="scope">
                  <div :class="{
                    'text-color-green': scope.row.status === 1,
                    'text-color-red': scope.row.status === 0}">{{ status[scope.row.status] }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100px" v-if="permissionsLock('policy_rule.update.delete')">
                <template slot-scope="scope">
                  <el-button type="text" v-permission="'policy_rule.update'"
                             @click="editConfirm('update', scope.row)">编辑</el-button>
                  <el-button @click="delConfirm(scope.row)" v-permission="'policy_rule.delete'"
                             type="text" class="text-color-red">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <div class="app-pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :total="total"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增 & 编辑 dialog -->
    <el-dialog class="edit-dialog assets-edit-dialog" width="50%" append-to-body @close="resetEditForm()"
               :title="editDialogDisplayTitle" :visible.sync="editDialogVisible">

      <el-form status-icon label-width="105px" :model="editForm" :rules="editFormRules" ref="editForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="源IP:" prop="src_ip_any">
              <el-checkbox v-model="editForm.src_ip_any" @change="changeAny('src_ip')">所有</el-checkbox>
              <el-input v-model="editForm.src_ip" class="checkbox-input" :disabled="src_ip_disabled"></el-input>
            </el-form-item>
            <el-form-item label="目的IP:" prop="dst_ip_any">
              <el-checkbox v-model="editForm.dst_ip_any" @change="changeAny('dst_ip')">所有</el-checkbox>
              <el-input v-model="editForm.dst_ip" class="checkbox-input" :disabled="dst_ip_disabled"></el-input>
            </el-form-item>
            <el-form-item label="协议:" prop="protocol_any">
              <el-checkbox v-model="editForm.protocol_any" @change="changeAny('protocol')">所有</el-checkbox>
              <el-input v-model="editForm.protocol" class="checkbox-input" :disabled="protocol_disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="源端口:" prop="src_port_any">
              <el-checkbox v-model="editForm.src_port_any"  @change="changeAny('src_port')">所有</el-checkbox>
              <el-input v-model="editForm.src_port" class="checkbox-input" :disabled="src_port_disabled"></el-input>
            </el-form-item>
            <el-form-item label="目的端口:" prop="dst_port_any">
              <el-checkbox v-model="editForm.dst_port_any" @change="changeAny('dst_port')">所有</el-checkbox>
              <el-input v-model="editForm.dst_port" class="checkbox-input" :disabled="dst_port_disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="app-form-line"></div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指令:" prop="funcs">
              <el-checkbox v-model="editForm.funcs" @change="changeAny('funcs')">所有</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指令类型:" prop="func_dict_name">
              <el-select v-model="editForm.func_dict_name" @change="changeDictName" :disabled="editForm.funcs || funcs_disabled"
                         filterable clearable placeholder="选择指令类型">
                <el-option :label="item.label" :value="item.value" v-for="item in dictNames" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指令名称:" prop="func_item_id">
              <el-select v-model="editForm.func_item_id" @change="changeItemId" :disabled="funcs_disabled || itemIdsDisabled"
                         filterable clearable placeholder="选择指令名称">
                <el-option :label="item.label" :value="item.value" v-for="item in itemIds" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="app-form-line"></div>
        <el-row>
          <el-col :span="16">
            <el-form-item label="事件类型:" prop="policy_item_id">
              <el-select v-model="editForm.policy_item_id" filterable clearable placeholder="选择事件类型">
                <el-option :label="item.label" :value="item.value" v-for="item in eventType" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="事件信息:" prop="event_info">
              <el-input v-model="editForm.event_info" clearable placeholder="请输入事件信息"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="风险等级:" prop="risk_item_id">
              <el-select v-model="editForm.risk_item_id" clearable placeholder="选择等级">
                <el-option :label="value" :value="key * 1" v-for="(value, key) in riskLevel" :key="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="success" :loading="editBtnLoading" @click="editSave()">保存</el-button>
      </span>
    </el-dialog>

    <!-- 删除 dialog -->
    <el-dialog class="del-dialog" append-to-body title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取消</el-button>
        <el-button type="success" @click="del" :loading="delBtnLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 批量删除 dialog -->
    <el-dialog class="del-batch-dialog" append-to-body title="提示" :visible.sync="delBatchDialogVisible" width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delBatchDialogVisible = false">取消</el-button>
        <el-button type="success" @click="delBatch" :loading="delBatchBtnLoading">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment';
  import permission from '@/components/mixin/permission';
  export default {
    mixins: [permission],
    name: "policy_rule",
    data() {

      // 自定义验证 是否必填
      let validateRequired = (rule, value, callback) => {
        let display = {
          src_ip_any: '源IP',
          src_port_any: '源端口',
          dst_ip_any: '目的IP',
          dst_port_any: '目的端口',
          protocol_any: '协议',
          funcs: '指令类型和指令名称'
        };
        // 判断必填
        let bool = false;
        if (!value) {
          let val = this.editForm[rule.field.replace("_any", "")];
          // ip类型
          if (rule.field === 'src_ip_any' || rule.field === 'dst_ip_any') {
            let ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            !ipReg.test(val) && callback(new Error('请输入正确的IP地址'))
          }
          // port类型
          else if (rule.field === 'src_port_any' || rule.field === 'dst_port_any') {
            val = val * 1;
            !(val >= 1 && val <= 65535 && Number.isInteger(val)) && callback(new Error('请输入整数值, 数值范围 1 - 65535'));
          }
          // funcs指令
          else if (rule.field === 'funcs') {
            !(this.editForm['func_item_id'] && this.editForm['func_dict_name']) && (bool = true);
          }
          // 其他
          else {
            !val && (bool = true)
          }
        }
        if (bool) {
          callback(new Error('如果没选择所有，则必须填写' + display[rule.field] + '字段'))
        } else {
          callback();
        }
      };

      return {
        // 查询
        searchForm: {
          src_ip: '',             // 源ip
          src_port: '',           // 源端口
          dst_ip: '',             // 目的ip
          dst_port: '',           // 目的端口
          protocol: '',           // 协议
          funcs: '',              // 指令
        },
        // 限定时间范围
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        riskLevel: this.$store.state.dictionary['PolicyRiskLevel'],
        status: this.$store.state.dictionary['PolicyStatus'],
        protocol: [],                 // 从字典表中请求获取
        eventType: [],                // 从字典表中请求获取
        dictNames: [],                // 从字典表中请求获取
        itemIds: [],                  // 从字典表中请求获取
        // 新增 & 编辑
        editRow: {},                  // 编辑时当前临时记录
        editDialogVisible: false,     // 编辑弹出框显示状态
        editBtnLoading: false,        // 编辑弹出框的保存按钮的loading
        editDialogType: "",           // 编辑弹出框的当前状态, 是编辑, 还是新增
        editDialogDisplayTitle: "",   // 编辑弹出框的标题
        editDialogDisplay: {          // 编辑弹出框的标题映射
          "insert": "新增",
          "update": "编辑"
        },
        editForm: {
          id: '',                 //
          src_ip_any: '',         // 源ip checkbox
          src_port_any: '',       // 源端口 checkbox
          dst_ip_any: '',         // 目的ip checkbox
          dst_port_any: '',       // 目的端口 checkbox
          protocol_any: '',       // 协议 checkbox
          funcs_any: '',          // 指令 checkbox
          src_ip: '',             // 源ip
          src_port: '',           // 源端口
          dst_ip: '',             // 目的ip
          dst_port: '',           // 目的端口
          protocol: '',           // 协议
          funcs: '',              // 指令
          func_item_id: '',       // 指令编号
          func_dict_name: '',     // 字典类型
          policy_item_id: '',     // 事件类型
          event_info: '',         // 事件信息
          risk_item_id: null,     // 风险等级
          status: '',             // 状态
          create_time: ''         // 创建时间
        },
        //表单验证
        editFormRules: {
          src_ip_any: [
            {validator: validateRequired, trigger: ['blur', 'change']},
          ],
          src_port_any: [
            {validator: validateRequired, trigger: ['blur', 'change']},
          ],
          dst_ip_any: [
            {validator: validateRequired, trigger: ['blur', 'change']},
          ],
          dst_port_any: [
            {validator: validateRequired, trigger: ['blur', 'change']},
          ],
          protocol_any: [
            {validator: validateRequired, trigger: ['blur', 'change']},
          ],
          funcs: [
            {validator: validateRequired, trigger: 'change'},
          ],
          policy_item_id: [
            {required: true, message: '字段不能为空', trigger: 'change'},
          ],
          event_info: [
            {required: true, message: '字段不能为空', trigger: 'blur'},
          ],
          risk_item_id: [
            {required: true, message: '字段不能为空', trigger: 'change'},
          ]
        },
        defaultEditForm: {
        },
        // 表单联动关系
        src_ip_disabled: false,         // 源ip禁用状态
        src_port_disabled: false,       // 源端口禁用状态
        dst_ip_disabled: false,         // 目的ip禁用状态
        dst_port_disabled: false,       // 目的端口禁用状态
        protocol_disabled: false,       // 协议禁用状态
        funcs_disabled: false,          // 指令的禁用状态
        itemIdsDisabled: true,          // 指令名称禁用状态
        // 启用
        enableBtnLoading: false,      // 启用按钮的loding
        enableBtnDisabled: true,      // 启用按钮的禁用状态
        // 禁用
        disableBtnLoading: false,      // 禁用按钮的loding
        disableBtnDisabled: true,      // 禁用按钮的禁用状态
        // 删除弹窗
        delRow: {},                     // 删除时当前临时记录
        delBtnLoading: false,           // 删除弹出框确定按钮的loding
        delDialogVisible: false,        // 删除弹出框弹出框显示状态
        delBatchBtnLoading: false,      // 批量删除弹出框确定按钮的loding
        delBatchDialogVisible: false,   // 批量删除弹出框显示状态
        delBatchBtnDisabled: true,      // 批量删除按钮的禁用状态
        // 列表相关
        tableName: 'policies',
        where: [],
        order: ["id desc"],
        loading: true,
        tableData: [],
        total: 0,
        pageSize: 20,
        pageSizes: [20, 50, 100, 200],
        currentPage: 1,
        multipleSelection: []
      }
    },
    methods: {
      // 搜索
      search: function () {
        // 清空
        this.where = [];
        // 赋值
        let search = this.searchForm;
        for (let key in search) {
          let value = search[key];
          if (value) {
            if (Array.isArray(value)) {
              value.length > 0 && this.where.push(key + '=' + value.join(','))
            } else {
              let str = '%=%' + value + '%';
              this.where.push(key + str)
            }
          }
        }
        this.currentPage = 1;
        this.list()
      },
//      // 搜索
//      search: function () {
//        // 清空
//        this.where = [];
//        // 赋值
//        let search = this.searchForm;
//        for (let key in search) {
//          let value = search[key];
//          if (value) {
//            if (Array.isArray(value) ) {
//              if (key === 'trigger_time') {
//                if (value.length > 0) {
//                  // @特殊处理, 判断同一天的情况 <--- 同一天个屁
//                  // if (value[0] === value[1]) {
//                  let arr = value[1].split(' ')
//                  value[1] = arr[0] + ' 23:59:59'
//                  // }
//                  this.where.push(key + '=' + value[0] + "~" + value[1])
//                }
//              } else {
//                value.length > 0 && this.where.push(key + '=' + value.join(','))
//              }
//            } else {
//              let str ='%=%' + value + '%';
//              if (key === 'src_ip') {
//                this.where.push([
//                  key + str,
//                  {or: 'src_mac' + str}
//                ])
//              } else if (key === 'dst_ip') {
//                this.where.push([
//                  key + str,
//                  {or: 'dst_mac' + str}
//                ])
//              } else {
//                this.where.push(key + str)
//              }
//            }
//          }
//        }
//        this.currentPage = 1;
//        this.getStats()
//        this.list()
//      },
      // 重置
      resetForm() {
        this.searchForm ={};
        this.search();
      },
      // 启用
      setEnable: function () {
        this.enableBtnLoading = true;
        let ids = this.multipleSelection.map(v => v.id).join(',');
        this.$post('/action', {
          data: {
            "update": this.tableName,
            "values": {
              "status": 1
            },
            "where": 'id=' + ids
          }
        }, false).then(data => {
          let len = this.multipleSelection.length;
          if (data && data.count === len) {
            this.enableBtnLoading = false;
            this.$message({message: '启用成功', type: 'success'});
            this.list();
          }
        }).catch(err => {
          this.enableBtnLoading = false;
          this.$message({message: '启用失败', type: 'error'});
        });
      },
      // 禁用
      setDisable: function () {
        this.disableBtnLoading = true;
        let ids = this.multipleSelection.map(v => v.id).join(',');
        this.$post('/action', {
          data: {
            "update": this.tableName,
            "values": {
              "status": 0
            },
            "where": 'id=' + ids
          }
        }, false).then(data => {
          let len = this.multipleSelection.length;
          if (data && data.count === len) {
            this.disableBtnLoading = false;
            this.$message({message: '禁用成功', type: 'success'});
            this.list();
          }
        }).catch(err => {
          this.disableBtnLoading = false;
          this.$message({message: '禁用失败', type: 'error'});
        });
      },
      // 修改分页数量
      handleSizeChange(val) {
        this.pageSize = val;
        this.list();
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.list();
      },
      // 排序
      handleSortChange(column) {
        // console.log(column, prop, order);
        this.order = column.prop && column.order
          ? [column.prop + ' ' + column.order.replace("ending", "")]
          : [];
        this.list();
      },
      // 勾选选中项, 并修改 批量删除 状态
      handleSelectionChange(arr) {
        // 全部选择 this.$refs.multipleTable.data.length === val.length
        // 部分选择
        if (arr.length >= 1) {
          this.enableBtnDisabled = false;
          this.disableBtnDisabled = false;
          this.delBatchBtnDisabled = false;
        } else {
          this.enableBtnDisabled = true;
          this.disableBtnDisabled = true;
          this.delBatchBtnDisabled = true;
        }
        this.multipleSelection = arr;
      },
      // 格式化指令
      formatFuncs(row) {
      },
      // 列表
      list() {
        this.$post('/action', {
          data: {
            "select": this.tableName,
            "join": ["dictionary"],
            "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
            "where": this.where,
            "order": this.order
          }
        }).then((data) => {
          if (data && Array.isArray(data.data)) {
            this.total = data.total;
            this.tableData = data.data;
          }
        })
      },
      // 新增 & 编辑
      editConfirm(type, row) {
        this.editDialogVisible = true;
        this.editDialogType = type;
        this.editDialogDisplayTitle = this.editDialogDisplay[type];
        if (type === 'update') {
          this.detail(row);
        } else {
          // @特殊处理, 编辑后的新增有遗留验证
          this.$nextTick(_ => {
            let editForm = this.$refs["editForm"];
            editForm.clearValidate()
          })
        }
      },
      // 保存事件
      editSave() {
        this[this.editDialogType]();
      },
      // 表单重置
      resetEditForm() {
        this.$nextTick(_ => {
          this.editForm = {
            id: '',                 //
            src_ip_any: '',         // 源ip checkbox
            src_port_any: '',       // 源端口 checkbox
            dst_ip_any: '',         // 目的ip checkbox
            dst_port_any: '',       // 目的端口 checkbox
            protocol_any: '',       // 协议 checkbox
            funcs_any: '',          // 指令 checkbox
            src_ip: '',             // 源ip
            src_port: '',           // 源端口
            dst_ip: '',             // 目的ip
            dst_port: '',           // 目的端口
            protocol: '',           // 协议
            funcs: '',              // 指令
            func_item_id: '',       // 指令编号
            func_dict_name: '',     // 字典类型
            policy_item_id: '',     // 事件类型
            event_info: '',         // 事件信息
            risk_item_id: null,     // 风险等级
            status: '',             // 状态
            create_time: ''         // 创建时间
          }
          let editForm = this.$refs["editForm"];
          editForm.clearValidate()
          editForm.resetFields()
        })
        // @特殊处理, 针对编辑情况的重置
        // this.editForm = JSON.parse(JSON.stringify(this.defaultEditForm))
      },
      // 新增
      insert() {
        // 表单验证
        this.$refs["editForm"].validate((valid) => {
          if (valid) {
            // @特殊处理
            let editForm = JSON.parse(JSON.stringify(this.editForm));

            this.editBtnLoading = true;
            this.$post('/action', {
              data: {
                "insert": this.tableName,
                "values": {
                  src_ip: editForm.src_ip_any ? 'any' : editForm.src_ip,             // 源ip
                  src_port: editForm.src_port_any ? 'any' : editForm.src_port,       // 源端口
                  dst_ip: editForm.dst_ip_any ? 'any' : editForm.dst_ip,             // 目的ip
                  dst_port: editForm.dst_port_any ? 'any' : editForm.dst_port,       // 目的端口
                  protocol: editForm.protocol_any ? 'any' : editForm.protocol,       // 协议
                  funcs: editForm.funcs ? 'any' : '',                                // 指令
                  func_item_id: editForm.funcs ? '' : editForm.func_item_id,         // 指令编号
                  func_dict_name: editForm.funcs ? '' : editForm.func_dict_name,     // 字典类型
                  policy_item_id: editForm.policy_item_id,                           // 事件类型
                  event_info: editForm.event_info,                                   // 事件信息
                  risk_item_id: editForm.risk_item_id,                               // 风险等级
                  status: 0,                                                         // 状态
                  create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')      // 创建时间
                }
              }
            }, true).then((data) => {
              if (data.id !== 0) {
                this.editBtnLoading = false;
                this.editDialogVisible = false;
                this.$message({message: '新增成功', type: 'success'});
                this.list();
              }
            }).catch((err) => {
              this.editBtnLoading = false;
              this.editDialogVisible = false;
              this.$message({message: '新增失败', type: 'error'});
            })
          }
        });
      },
      // 更新时查询单条
      detail(row) {
        this.getItemIdList(row.func_dict_name, _ => {
          this.itemIdsDisabled = false
          this.editRow = row;
          for (let k in this.editForm) {
            if (k === 'src_ip' || k === 'src_port' || k === 'dst_ip' || k === 'dst_port' || k === 'protocol') {
              if (!row[k] || row[k] === 'any' ) {
                this.editForm[k + '_any'] = true       // checkbox赋值
                this[k + '_disabled'] = true           // 禁用
              } else {
                this[k + '_disabled'] = false          // 正常
              }
              this.editForm[k] = row[k] === 'any' ? '' : row[k]
            }
            else if (k === 'func_dict_name') {
              !row[k] && (this.editForm['funcs'] = true)
              this.editForm[k] = row[k]
            }
            else {
              this.editForm[k] = row[k]
            }
          }
        })
      },
      // 更新
      update() {
        // 表单验证
        this.$refs["editForm"].validate((valid) => {
          if (valid) {

            // @特殊处理
            let editForm = JSON.parse(JSON.stringify(this.editForm));

            this.editBtnLoading = true;
            this.$post('/action', {
              data: {
                "update": this.tableName,
                "values": {
                  src_ip: editForm.src_ip_any ? 'any' : editForm.src_ip,             // 源ip
                  src_port: editForm.src_port_any ? 'any' : editForm.src_port,       // 源端口
                  dst_ip: editForm.dst_ip_any ? 'any' : editForm.dst_ip,             // 目的ip
                  dst_port: editForm.dst_port_any ? 'any' : editForm.dst_port,       // 目的端口
                  protocol: editForm.protocol_any ? 'any' : editForm.protocol,       // 协议
                  funcs: editForm.funcs ? 'any' : '',                                // 指令
                  func_item_id: editForm.funcs ? '' : editForm.func_item_id,         // 指令编号
                  func_dict_name: editForm.funcs ? '' : editForm.func_dict_name,     // 字典类型
                  policy_item_id: editForm.policy_item_id,                           // 事件类型
                  event_info: editForm.event_info,                                   // 事件信息
                  risk_item_id: editForm.risk_item_id,                               // 风险等级
                  update_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')      // 更新时间
                },
                "where": "id=" + this.editRow.id
              }
            }, true).then((data) => {
              if (data && data.count === 1) {
                this.editBtnLoading = false;
                this.editDialogVisible = false;
                this.$message({message: '更新成功', type: 'success'});
                this.list();
              }
            }).catch((err) => {
              this.editBtnLoading = false;
              this.editDialogVisible = false;
              this.$message({message: '更新失败', type: 'error'});
            })
          }
        });
      },
      // 切换的表单联动
      changeAny(type) {
        // 指令特殊处理
        if (type === 'funcs') {
          let val = this.editForm[type]
          this[type + '_disabled'] = val;
          return;
        }
        let any = this.editForm[type + '_any']
        if (any) {
          this[type + '_disabled'] = true;
          this.editForm[type] = ''
        } else {
          this[type + '_disabled'] = false
        }
      },
      // 删除框
      delConfirm(row) {
        this.delRow = row;
        this.delDialogVisible = true;
      },
      // 删除
      del() {
        this.delBtnLoading = true;
        this.$post('/action', {
          data: {
            "delete": this.tableName,
            "where": 'id=' + this.delRow.id
          }
        }).then(data => {
          if (data && data.count === 1) {
            this.delBtnLoading = false;
            this.delDialogVisible = false;
            this.$message({message: '删除成功', type: 'success'});
            this.currentPage = 1;
            this.list();
          }
        }).catch(err => {
          this.delBtnLoading = false;
          this.delDialogVisible = false;
          this.$message({message: '删除失败', type: 'error'});
        });
      },
      // 批量删除框
      delBatchConfirm() {
        this.delBatchDialogVisible = true;
      },
      // 批量删除
      delBatch() {
        this.delBatchBtnLoading = true;
        let ids = this.multipleSelection.map(v => v.id).join(',');
        this.$post('/action', {
          data: {
            "delete": this.tableName,
            "where": 'id=' + ids
          }
        }, true).then(data => {
          let len = this.multipleSelection.length;
          if (data && data.count === len) {
            this.delBatchBtnLoading = false;
            this.delBatchDialogVisible = false;
            this.$message({message: '删除成功', type: 'success'});
            this.currentPage = 1;
            this.list();
          }
        }).catch(err => {
          this.delBatchBtnLoading = false;
          this.delBatchDialogVisible = false;
          this.$message({message: '删除失败', type: 'error'});
        });
      },
      // 获取协议
      getProtocolList() {
        this.$post('/action', {
          data: {
            "select": "policies",
            "fields": [
              "protocol as value",
              "protocol as label"
            ],
            "where": ['protocol!=any'],
            "order": "protocol",
            "group": "protocol"
          }
        }, false).then(data => {
          if (data) {
            this.protocol = data
          }
        });
      },
      // 获取事件类型
      getEventTypeList() {
        this.$post('/action', {
          data: {
            "select": "dictionary",
            "fields": ["item_name as label", "item_id as value"],
            "where": ["dict_name=策略事件类型"]
          }
        }, false).then(data => {
          if (data) {
            this.eventType = data
          }
        });
      },
      // 切换事件 指令类型
      changeDictName(val) {
        // @特殊处理, 针对any的联动处理
        this.$refs["editForm"].clearValidate('funcs')
        this.itemIdsDisabled = true
        this.getItemIdList(val, _ => {
          this.itemIdsDisabled = false
        })
      },
      // 切换事件 指令名称
      changeItemId(val) {
        // @特殊处理, 针对any的联动处理
        this.$refs["editForm"].clearValidate('funcs')
      },
      // 获取指令类型
      getDictNameList() {
        this.$post('/action', {
          data: {
            "select": "dictionary",
            "fields": ["item_name as label", "item_name as value"],
            "where": ["dict_name=协议类型"]
          }
        }, false).then(data => {
          if (data) {
            this.dictNames = data
          }
        });
      },
      // 获取指令名称
      getItemIdList(dictName, ck) {
        if (dictName) {
          this.$post('/action', {
            data: {
              "select": "dictionary",
              "fields": ["item_name as label", "item_id as value"],
              "group": "item_id",
              "where": 'dict_name='+dictName
            }
          }, false).then(data => {
            if (data) {
              this.itemIds = data
            }
            ck && ck()
          });
        } else {
          ck && ck()
        }
      },
      // 加载
      load() {
        this.getEventTypeList();        // 事件类型
        this.getProtocolList();         // 协议类型
        this.getDictNameList();         // 指令类型
        this.list();
      }
    },
    mounted() {
      this.load();
    }
//    mounted() {
//      this.load();
//      // 轮训 事件统计
//      this.timeoutId = setTimeout(_ => {this.getStats()}, 60 * 1000)
//    },
//    destroyed() {
//      clearTimeout(this.timeoutId)
//    }
  }
</script>

<style>
  .app-policy_rule {
  }

  .checkbox-input {
    width: calc(100% - 62px);
    float: right;
  }
</style>
