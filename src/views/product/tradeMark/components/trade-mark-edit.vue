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
      <div class="dialog-main">
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="150px"
        >
          <form-box :header="tip">
            <div v-for="(item, row) in formList" :key="row">
              <div class="form-row">
                <el-form-item
                  v-if="item.type === 'input'"
                  :label="item.label"
                  :prop="item.prop"
                >
                  <el-input
                    v-model="form[item.prop]"
                    :placeholder="'请输入' + item.label"
                    :disabled="item.disable"
                  />
                </el-form-item>
                <el-form-item
                  v-else-if="item.type === 'image'"
                  :label="item.label"
                  :prop="item.prop"
                >
                  <upload-image
                    :image-url="form[item.prop]"
                    @changeUrl="changeUrl"
                  />
                </el-form-item>
              </div>
            </div>
          </form-box>
          <div class="commit-row">
            <el-button type="primary" size="mini" @click="handleSave()">
              {{ savecontent }}
            </el-button>
            <el-button size="mini" @click="handleClose()">取消</el-button>
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
      tip: '品牌信息', // title
      // 表单
      form: {},
      formList: [
        { prop: 'tmName', label: '品牌名称', type: 'input' },
        { prop: 'logoUrl', label: '品牌Logo', type: 'image' }
      ],
      // 表单校验
      formRules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌logo' }
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
    //   userInfo() {
    //     return storageHelper.getUserInfo() || {};
    //   },
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    handleClose(res) {
      this.$emit('closedialog', res)
      // this.$confirm('确认关闭？')
      //   .then(() => {
      //     this.$emit('closedialog')
      //   })
      //   .catch(() => {})
    },
    changeUrl(url) {
      this.form.logoUrl = url
    },
    handleSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (this.handleType === 'edit') {
            let data = utils.clone(this.form)
            this.$API.product.updateTradeMark(data).then((res) => {
              this.$message.success('编辑增加品牌成功！')
              this.handleClose('edit')
            })
          } else if (this.handleType === 'add') {
            let data = utils.clone(this.form)
            this.$API.product.addTradeMark(data).then((res) => {
              this.$message.success('增加编辑品牌成功！')
              this.handleClose('add')
            })
          }
        } else {
          this.$message.error('有必填项未填，请检查后再提交！')
          return
        }
      })
    },
    async init() {
      if (this.handleType === 'edit') {
        this.form = {
          ...this.editParams
        }
      } else {
        this.form = {
          tmName: '',
          logoUrl: ''
        }
      }
    }
  }
}
</script>
  <style lang="css" scoped>
.dialog-main {
  max-height: 75vh;
  width: 99%;
}
</style>

