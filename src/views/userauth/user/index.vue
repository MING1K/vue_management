<template>
  <div class="trade-mark">
    <tb-layout>
      <div slot="top" class="header-row-view top-view">
        <div class="left-btns">
          <el-button
            v-show="hasAddPermission"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >添加</el-button>
          <el-button
            v-show="hasDeletePermission"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="ids.length < 1"
            @click="handleDeleteMultiple"
          >批量删除</el-button>
        </div>
        <div class="input-search">
          <el-input v-model="searchUserName" placeholder="请输入用户名" clearable />
          <el-button type="primary" icon="el-icon-search" size="mini" @click="initTable(1)">查询</el-button>
        </div>
      </div>
      <userauth-select-table
        ref="selectTable"
        :page="true"
        :get-table-data="getTableData"
        :table-params="searchParams"
        :cols="cols"
        :page-number-string="pageNumberString"
        :page-size-string="pageSizeString"
        :show-selection="true"
        :show-no="true"
        @selectionChange="selectionChange"
      >
        <template slot="operate" slot-scope="{ row, $index }">
          <el-button
            v-show="hasRolePermission"
            type="info"
            size="mini"
            icon="el-icon-setting"
            title="分配权限"
            @click="handleEditRoles(row, $index)"
          />
          <el-button
            v-show="hasEditPermission"
            type="warning"
            size="mini"
            icon="el-icon-edit"
            title="修改"
            @click="handleEdit(row, $index)"
          />
          <el-button
            v-show="hasDeletePermission"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            title="删除"
            @click="handleDelete(row, $index)"
          />
        </template>
      </userauth-select-table>
    </tb-layout>
    <user-edit-dialog
      v-if="userEditDialog.visible"
      :edit-params="userEditDialog.editParams"
      :handle-type="userEditDialog.handleType"
      @closedialog="handleCloseEdit"
    />
    <user-edit-role
      v-if="userEditRole.visible"
      :edit-params="userEditRole.editParams"
      :handle-type="userEditRole.handleType"
      @closedialog="handleCloseEditRole"
    />
  </div>
</template>

<script>
import utils from '@/utils/utils'
import userauthSelectTable from '../components/userauth-select-table.vue'
import userEditDialog from './components/user-edit-dialog.vue'
import userEditRole from './components/user-edit-role.vue'
import { hasPermission } from '@/api/auth'

export default {
  components: { userauthSelectTable, userEditDialog, userEditRole },
  data() {
    return {
      cols: [
        { prop: 'username', label: '用户名', width: 150, tooltip: true },
        { prop: 'nickName', label: '用户昵称', tooltip: true },
        { prop: 'roleName', label: '权限列表', tooltip: true },
        { prop: 'gmtCreate', label: '创建时间', width: 180, tooltip: true },
        { prop: 'gmtModified', label: '更新时间', width: 180, tooltip: true },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      pageNumberString: 'page',
      pageSizeString: 'limit',
      // 搜索框
      searchUserName: '',
      // 编辑用户
      userEditDialog: {
        visible: false,
        editParams: null,
        handleType: 'add'
      },
      // 用户角色管理
      userEditRole: {
        visible: false,
        editParams: null,
        handleType: 'add'
      },
      // 要批量删除的用户
      ids: []
    }
  },
  computed: {
    getTableData() {
      return this.$API.user.getPageList
    },
    searchParams() {
      return {
        username: this.searchUserName === '' ? undefined : this.searchUserName
      }
    },
    // 新增按钮
    hasAddPermission() {
      return hasPermission('btn.User.add')
    },
    // 编辑按钮
    hasEditPermission() {
      return hasPermission('btn.User.update')
    },
    // 角色授权
    hasRolePermission() {
      return hasPermission('btn.User.assgin')
    },
    // 删除按钮
    hasDeletePermission() {
      return hasPermission('btn.User.remove')
    }
  },
  methods: {
    initTable(pageNumber) {
      this.$nextTick(() => {
        this.$refs.selectTable.pageChange(pageNumber)
      })
    },
    // 添加用户
    handleAdd() {
      this.userEditDialog.handleType = 'add'
      this.userEditDialog.visible = true
    },
    // 获取选中用户
    selectionChange(selection) {
      this.ids = selection.map(item => {
        return item.id
      })
    },
    // 清除所有选中用户
    clearSelections() {
      this.$refs.selectTable.clearSelection()
      this.ids = []
    },
    // 批量删除用户
    handleDeleteMultiple() {
      this.$confirm(`确定删除这些用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$API.user.removeUsers(this.ids).then((res) => {
            this.$message.success('删除用户成功！')
            this.clearSelections() // 清除选中
            // 如果为此页最后一项则加载前一页数据
            this.initTable(
              this.$refs.selectTable.list.length > 1
                ? this.$refs.selectTable.pageNumber
                : this.$refs.selectTable.pageNumber - 1
            )
          })
        })
        .catch(() => {
          this.$message.info('已取消操作')
        })
    },
    // 修改用户
    handleEdit(row, index) {
      this.userEditDialog.handleType = 'edit'
      this.userEditDialog.editParams = utils.clone(row)
      this.userEditDialog.visible = true
    },
    // 删除用户
    handleDelete(row, index) {
      this.$confirm(`确定删除用户 ${row.username} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$API.user.removeById(row.id).then((res) => {
            this.$message.success('删除用户成功！')
            // 如果为此页最后一项则加载前一页数据
            this.initTable(
              this.$refs.selectTable.list.length > 1
                ? this.$refs.selectTable.pageNumber
                : this.$refs.selectTable.pageNumber - 1
            )
          })
        })
        .catch(() => {
          this.$message.info('已取消操作')
        })
    },
    // 关闭编辑页面
    handleCloseEdit(res) {
      this.userEditDialog.visible = false
      if (res === 'add') this.initTable(1)
      else if (res === 'edit') this.initTable() // 留在当前页
    },
    // 为用户分配角色
    handleEditRoles(row, index) {
      this.userEditRole.handleType = 'edit'
      this.userEditRole.editParams = utils.clone(row)
      this.userEditRole.visible = true
    },
    // 关闭角色分配页面
    handleCloseEditRole(res) {
      this.userEditRole.visible = false
      if (res === 'add') this.initTable(1)
      else if (res === 'edit') this.initTable() // 留在当前页
    }
  }
}
</script>

  <style lang="scss" scoped>
.trade-mark {
  width: 100%;
  height: 100%;
  // height: 850px;
}
</style>

