import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载vant组件
import Vant from 'vant'
// 加载Vant全局样式
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

// 加载动态设置 REM 基准值
import 'amfe-flexible'

// 加载 dayjs 初始化配置
import './utils/dayjs'

// 注册使用vant组件 代码加载规范Vue.use一定要放在import所有的下面
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
