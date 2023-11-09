<template>
  <el-dialog
    append-to-body
    visible
    :title="title"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="40%"
  >
    <el-scrollbar max-height="70vh">
      <div class="dialog-main gl-scrollbar">
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="120px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" disabled />
          </el-form-item>

          <el-form-item label="用户昵称">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
              <el-checkbox v-for="role in rolesList" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <div class="commit-row">
            <el-button
              type="primary"
              size="mini"
              @click="handleSave"
            >保存</el-button>
            <el-button size="mini" @click="handleClose">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    // 编辑参数
    editParams: {
      type: Object,
      default: null
    },
    autoParams: {
      type: Object,
      default: null
    },
    handleType: {
      type: String,
      default: 'add' // 添加
    }
  },
  data() {
    return {
      tip: '用户', // title
      form: {
        id: undefined,
        username: '',
        roleName: '' // 权限
      },
      formRules: {
        username: [
          { required: true, message: '用户名必须输入', trigger: 'blur' },
          { min: 4, message: '用户名不能小于4位', trigger: 'blur' }
        ]
      },
      checkAll: false,
      checkedRoles: [],
      // cities: cityOptions,
      isIndeterminate: true,
      rolesList: []
    }
  },
  computed: {
    title() {
      let { tip } = this
      return this.handleType === 'add' ? `新增${tip}` : `编辑${tip}`
    },
    savecontent() {
      return this.handleType === 'add' ? '新增' : '提交'
    }
  },
  watch: {
    checkedRoles: {
      deep: true,
      handler(newVal) {
        let len = newVal.length
        if (len === 0) {
          this.isIndeterminate = false
          this.checkAll = false
        } else if (len === this.rolesList.length) {
          this.checkAll = true
          this.isIndeterminate = false
        } else {
          this.checkAll = false
          this.isIndeterminate = true
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleClose(res) {
      this.$emit('closedialog', res)
    },
    // 多选框全选
    handleCheckAllChange(val) {
      this.checkedRoles = val ? this.rolesList.map(item => item.id) : []
      // this.isIndeterminate = false
    },
    // 多选框变化
    handleCheckedRolesChange(value) {
      // let checkedCount = value.length
      // this.checkAll = checkedCount === this.rolesList.length
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.rolesList.length
    },
    // 新增或编辑用户角色
    handleSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          let data = {
            userId: this.form.id,
            roleId: this.checkedRoles.join(',')
          }
          if (this.handleType === 'edit') {
            this.$API.user.assignRoles(data).then((res) => {
              this.$message.success('编辑用户角色成功！')
              this.handleClose('edit')
            })
          } else if (this.handleType === 'add') {
            this.$API.user.assignRoles(data).then((res) => {
              this.$message.success('用户分配角色成功！')
              this.handleClose('add')
            })
          }
        } else {
          this.$message.error('有必填项未填，请检查后再提交！')
          return
        }
      })
    },
    // 获取用户角色信息
    async initUserRoles(id) {
      await this.$API.user.getRoles(id).then(res => {
        this.rolesList = res.data.allRolesList
        this.checkedRoles = res.data.assignRoles.map(item => {
          return item.id
        })
      })
    },
    // 加载数据
    async init() {
      if (this.handleType === 'edit') {
        let { id, username } = this.editParams
        this.initUserRoles(id)
        this.form = { id, username }
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
.dialog-main {
  height: 98%;
  width: 98%;
  overflow: auto;
  margin: 10px 5px;
}
</style>

