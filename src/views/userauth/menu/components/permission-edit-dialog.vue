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
          <el-form-item label="父级名称" prop="pid">
            <el-select v-model="form.pid" placeholder="请输入名称" :disabled="handleType === 'edit'" @change="handleChooseParent($event)">
              <el-option v-for="item in parentList" :key="item.id" :label="`${item.name || '全部'}-${item.level === 4 ? '功能': (item.level || 0) + '级菜单'}`" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="功能权限值" prop="code">
            <el-input v-model="form.code" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="跳转路由权限值" prop="toCode">
            <el-input v-model="form.toCode" placeholder="请输入名称" />
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
      form: {
        id: undefined,
        level: 0, //
        name: '', //
        pid: '',
        code: '', //
        toCode: '' //
      },
      formRules: {
        name: [
          { required: true, message: '菜单名必须输入', trigger: 'blur' },
          { min: 4, message: '菜单名不能小于4位', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限值必须输入', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择父级', trigger: 'blur' }]
      },
      parentList: []
    }
  },
  computed: {
    tip() {
      let { id, level } = this.form
      if (id) return level === 4 ? '功能' : '菜单'
      else return level === 4 ? '功能' : `${level === 1 ? '全部' : (level === 2 ? '一级' : '二级')}菜单`
    },
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
    // 选择父级
    handleChooseParent(row) {
      // console.log(row)
      // this.form.level = row.level + 1
    },
    // 新增菜单或编辑菜单
    handleSave() {
      let { tip } = this
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          let data = utils.clone(this.form)
          if (this.handleType === 'edit') {
            this.$API.permission.updatePermission(data).then((res) => {
              this.$message.success(`编辑${tip}成功！`)
              this.handleClose('edit')
            })
          } else if (this.handleType === 'add') {
            this.$API.permission.addPermission(data).then((res) => {
              this.$message.success(`新增${tip}成功！`)
              this.handleClose('add')
            })
          }
        } else {
          this.$message.error('有必填项未填，请检查后再提交！')
          return
        }
      })
    },
    async initList() {
      await this.$API.permission.getPermissionList().then(res => {
        let data = []
        for (let item of res.data.children) {
          data.push(...utils.tree2Array(item))
        }
        // let data = utils.tree2Array(res.data)
        this.parentList = data
      })
    },
    // 加载数据
    async init() {
      if (this.handleType === 'edit') {
        let { pid } = this.editParams
        await this.initList()
        this.parentList.filter(item => item.id === pid)
        this.form = { ...this.editParams }
      } else {
        if (!this.autoParams) {
          this.initList() // 加载父级数据
        } else {
          let { id, name, level } = this.autoParams
          this.parentList.push({ id: id, name: name, level: level }) // 父级列表
          this.form.pid = id
          this.form.level = level + 1
        }
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

