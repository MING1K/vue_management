<template>
  <el-dialog
    append-to-body
    visible
    :title="title"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="60%"
  >
    <el-scrollbar max-height="70vh">
      <div class="dialog-main gl-scrollbar">
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="120px"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名" disabled />
          </el-form-item>

          <el-form-item label="角色权限">
            <el-tree
              ref="eltree"
              node-key="id"
              :data="selectData"
              :props="props"
              show-checkbox
              default-expand-all
              @check-change="handleCheckChange"
            />
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
import utils from '@/utils/utils'
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
        roleName: '' // 角色名
      },
      formRules: {
        roleName: [{ required: true, message: '角色名必须输入', trigger: 'blur' }]
      },
      // el-tree配置项
      props: {
        label: 'name',
        children: 'children'
      },
      // el-tree数据
      selectData: []
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
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    handleClose(res) {
      this.$emit('closedialog', res)
    },
    // 在渲染节点后选中节点
    setCheckedKeysOrigion(ids) {
      // console.log(ids)
      this.$refs.eltree.setCheckedKeys(ids)
    },
    handleCheckChange(node, checked, checkedChild) {
      // console.log('handleCheckChange', node, checked, checkedChild)
      // console.log('getCheckedKeys()', this.$refs.eltree.getCheckedKeys())
    },
    // 新增或编辑角色权限
    handleSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          let checked = this.$refs.eltree.getCheckedKeys()
          let data = {
            roleId: this.form.id,
            permissionId: checked.join(',')
          }
          if (this.handleType === 'edit') {
            this.$API.permission.doAssign(data).then((res) => {
              this.$message.success('角色权限编辑成功！')
              this.handleClose('edit')
            })
          } else if (this.handleType === 'add') {
            this.$API.permission.doAssign(data).then((res) => {
              this.$message.success('角色权限分配成功！')
              this.handleClose('add')
            })
          }
        } else {
          this.$message.error('有必填项未填，请检查后再提交！')
          return
        }
      })
    },
    // 获取角色信息
    async initRolesAuth(id) {
      await this.$API.permission.toAssign(id).then(res => {
        console.log(res)
        this.selectData = res.data.children
        let ids = (utils.tree2Array(res.data)).filter(item => item.select === true).map(item => item.id)
        this.$nextTick(() => {
          this.setCheckedKeysOrigion(ids)
        })
      })
    },
    // 加载数据
    async init() {
      if (this.handleType === 'edit') {
        let { id, roleName } = this.editParams
        this.initRolesAuth(id)
        this.form = { id, roleName }
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
.dialog-main {
  width: 98%;
  overflow: auto;
  margin: 10px 5px;
  height: 50vh;
}
</style>

