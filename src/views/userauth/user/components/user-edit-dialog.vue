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
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="用户昵称">
            <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
          </el-form-item>

          <el-form-item v-if="!form.id" label="用户密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入用户密码"
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
        username: '',
        nickName: '',
        password: ''
      },
      formRules: {
        username: [
          { required: true, message: '用户名必须输入', trigger: 'blur' },
          { min: 4, message: '用户名不能小于4位', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: this.validatePassword }
        ]
      }
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
    // 新增用户或编辑用户
    handleSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          let data = utils.clone(this.form)
          if (this.handleType === 'edit') {
            this.$API.user.update(data).then((res) => {
              this.$message.success('编辑用户成功！')
              this.handleClose('edit')
            })
          } else if (this.handleType === 'add') {
            this.$API.user.add(data).then((res) => {
              this.$message.success('新增用户成功！')
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
        let { id, username, nickName, password } = this.editParams
        this.form = { id, username, nickName, password }
      }
    },
    // 自定义密码校验
    validatePassword(rule, value, callback) {
      if (!value) {
        callback('密码必须输入')
      } else if (!value || value.length < 6) {
        callback('密码不能小于6位')
      } else {
        callback()
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

