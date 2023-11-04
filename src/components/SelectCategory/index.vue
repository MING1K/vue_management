<template>
  <div class="btn-lists">
    <el-form
      ref="selectCategory"
      :inline="true"
      class="inline-form"
      :model="form"
      :rules="formRules"
      label-width="80px"
    >
      <template v-for="(item, index) in formList">
        <el-form-item
          v-if="item.type === 'select'"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <el-select
            v-model="form[item.prop]"
            :placeholder="'请选择' + item.label"
            :disabled="item.disable || disabled"
            filterable
            clearable
            @change="handleChange(item.prop)"
          >
            <el-option
              v-for="(choice, cho) in selectData[item.prop]"
              :key="cho"
              :label="choice.name"
              :value="choice.id"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import utils from '@/utils/utils'
export default {
  props: {
    selectCategory: {
      type: Object,
      default: null
    },
    // 是否可修改
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单
      form: {},
      formList: [
        { prop: 'category1Id', label: '一级分类', type: 'select' },
        { prop: 'category2Id', label: '二级分类', type: 'select' },
        { prop: 'category3Id', label: '三级分类', type: 'select' }
      ],
      // 表单校验
      formRules: {
        category1Id: [{ required: false, message: '请选择一级分类' }],
        category2Id: [{ required: false, message: '请选择二级分类' }],
        category3Id: [{ required: false, message: '请选择三级分类' }]
      },
      selectData: {
        category1Id: [],
        category2Id: [],
        category3Id: []
      }
    }
  },
  mounted() {
    this.getCategory1List()
    this.init()
  },
  methods: {
    init() {
      this.form = {
        ...this.selectCategory
      }
    },
    getCategory1List() {
      this.$API.product.getFirstCategory().then(res => {
        this.selectData.category1Id = res?.data || []
      })
    },
    handleChange(category) {
      if (category === 'category1Id' && this.form.category1Id) {
        this.form.category2Id = ''
        this.form.category3Id = ''
        this.selectData.category2Id = []
        this.selectData.category3Id = []
        const { category1Id } = this.form
        this.$API.product.getSecondCategory(category1Id).then(res => {
          this.selectData.category2Id = res?.data || []
        })
      } else if (category === 'category2Id' && this.form.category2Id) {
        this.form.category3Id = ''
        this.selectData.category3Id = []
        const { category2Id } = this.form
        this.$API.product.getThirdCategory(category2Id).then(res => {
          this.selectData.category3Id = res?.data || []
        })
      }
      if (category === 'category1Id' && !this.form.category1Id) {
        this.form.category2Id = ''
        this.form.category3Id = ''
        this.selectData.category2Id = []
        this.selectData.category3Id = []
      } else if (category === 'category2Id' && !this.form.category2Id) {
        this.form.category3Id = ''
        this.selectData.category3Id = []
      }
      let data = utils.clone(this.form)
      this.$emit('handleChangeCategory', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-lists {
  display: flex;

  > * + * {
    margin-left: 10px;
  }

  .el-input {
    width: 175px;
  }
}
.el-form-item {
  margin-bottom: 0;
}
</style>
