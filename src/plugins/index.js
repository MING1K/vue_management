import Vue from 'vue'

// import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.config.productionTip = false

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

import tbLayout from '@/layout/tb-layout.vue'
import mainContainer from '@/layout/main-container.vue'
import selectTable from '@/components/SelectTable/index.vue'
import uploadImage from '@/components/UploadImage/index.vue'
import formBox from '@/components/FormBox/index.vue'
import selectCategory from '@/components/SelectCategory/index.vue'
import categorySelectTable from '@/components/CategorySelectTable/index.vue'
import uploadImageList from '@/components/UploadImageList/index.vue'

Vue.component('tbLayout', tbLayout)
Vue.component('mainContainer', mainContainer)
Vue.component('selectTable', selectTable)
Vue.component('uploadImage', uploadImage)
Vue.component('formBox', formBox)
Vue.component('selectCategory', selectCategory)
Vue.component('categorySelectTable', categorySelectTable)
Vue.component('uploadImageList', uploadImageList)

// 引入相关API接口
import API from '@/api'
// 组件实例的原型的原型指向的时Vue.prototype
// 任意组件可使用api
Vue.prototype.$API = API
