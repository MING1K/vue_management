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
          <el-input v-model="searchRoleName" placeholder="请输入角色名" clearable />
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
    <role-edit-dialog
      v-if="roleEditDialog.visible"
      :edit-params="roleEditDialog.editParams"
      :handle-type="roleEditDialog.handleType"
      @closedialog="handleCloseEdit"
    />
    <role-edit-auth
      v-if="roleEditAuth.visible"
      :edit-params="roleEditAuth.editParams"
      :handle-type="roleEditAuth.handleType"
      @closedialog="handleCloseEditAuth"
    />
  </div>
</template>

<script>
import utils from '@/utils/utils'
import userauthSelectTable from '../components/userauth-select-table.vue'
import roleEditDialog from './components/role-edit-dialog.vue'
import roleEditAuth from './components/role-edit-auth.vue'
import { hasPermission } from '@/api/auth'

export default {
  components: { userauthSelectTable, roleEditDialog, roleEditAuth },
  data() {
    return {
      cols: [
        { prop: 'roleName', label: '角色名', tooltip: true },
        { prop: 'gmtCreate', label: '创建时间', width: 180, tooltip: true },
        { prop: 'gmtModified', label: '更新时间', width: 180, tooltip: true },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      pageNumberString: 'page',
      pageSizeString: 'limit',
      // 搜索框
      searchRoleName: '',
      // 编辑角色
      roleEditDialog: {
        visible: false,
        editParams: null,
        handleType: 'add'
      },
      // 要批量删除的角色
      ids: [],
      // 编辑角色权限
      roleEditAuth: {
        visible: false,
        editParams: null,
        handleType: 'add'
      }
    }
  },
  computed: {
    getTableData() {
      return this.$API.role.getPageList
    },
    searchParams() {
      return {
        roleName: this.searchRoleName === '' ? undefined : this.searchRoleName
      }
    },
    // 新增按钮
    hasAddPermission() {
      return hasPermission('btn.Role.add')
    },
    // 编辑按钮
    hasEditPermission() {
      return hasPermission('btn.Role.update')
    },
    // 分配权限
    hasRolePermission() {
      return hasPermission('btn.Role.assgin')
    },
    // 删除按钮
    hasDeletePermission() {
      return hasPermission('btn.Role.remove')
    }
  },
  methods: {
    initTable(pageNumber) {
      this.$nextTick(() => {
        this.$refs.selectTable.pageChange(pageNumber)
      })
    },
    // 添加角色
    handleAdd() {
      this.roleEditDialog.handleType = 'add'
      this.roleEditDialog.visible = true
    },
    // 获取选中角色
    selectionChange(selection) {
      this.ids = selection.map(item => {
        return item.id
      })
    },
    // 清除所有选中角色
    clearSelections() {
      this.$refs.selectTable.clearSelection()
      this.ids = []
    },
    // 批量删除角色
    handleDeleteMultiple() {
      this.$confirm(`确定删除这些角色吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$API.role.removeRoles(this.ids).then((res) => {
            this.$message.success('删除角色成功！')
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
    // 修改角色
    handleEdit(row, index) {
      this.roleEditDialog.handleType = 'edit'
      this.roleEditDialog.editParams = utils.clone(row)
      this.roleEditDialog.visible = true
    },
    // 删除角色
    handleDelete(row, index) {
      this.$confirm(`确定删除角色 ${row.roleName} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$API.role.removeById(row.id).then((res) => {
            this.$message.success('删除角色成功！')
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
      this.roleEditDialog.visible = false
      if (res === 'add') this.initTable(1)
      else if (res === 'edit') this.initTable() // 留在当前页
    },
    // 为角色分配权限
    handleEditRoles(row, index) {
      this.roleEditAuth.handleType = 'edit'
      this.roleEditAuth.editParams = utils.clone(row)
      this.roleEditAuth.visible = true
    },
    // 关闭角色权限编辑页面
    handleCloseEditAuth(res) {
      this.roleEditAuth.visible = false
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

