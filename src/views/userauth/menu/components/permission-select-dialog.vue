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
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名" />
          </el-form-item>
          <el-tree
          show-checkbox
          highlight-current
          node-key="gid"
          :expand-on-click-node="false"
          class="filter-tree gl-scrollbar"
          :data="treeData"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
            <span> </span>
          </span>
        </el-tree>
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
      tip: '角色', // title
      form: {
        id: undefined,
        roleName: ''
      },
      formRules: {
        roleName: [
          { required: true, message: '角色名必须输入', trigger: 'blur' },
          { min: 4, message: '角色名不能小于4位', trigger: 'blur' }
        ]
      },
      treeData: []
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
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 新增角色或编辑角色
    handleSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          let data = utils.clone(this.form)
          if (this.handleType === 'edit') {
            this.$API.role.updateById(data).then((res) => {
              this.$message.success('编辑角色成功！')
              this.handleClose('edit')
            })
          } else if (this.handleType === 'add') {
            this.$API.role.save(data).then((res) => {
              this.$message.success('新增角色成功！')
              this.handleClose('add')
            })
          }
        } else {
          this.$message.error('有必填项未填，请检查后再提交！')
          return
        }
      })
    },
    // 加载数据
    async init() {
      if (this.handleType === 'edit') {
        let { id, roleName } = this.editParams
        this.form = { id, roleName }
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

