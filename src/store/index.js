import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息(token等数据)
    // user: null
    user: getItem(TOKEN_KEY)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY)) // JSON.parse还原成对象 字符串转对象
  },
  mutations: {
    setUser (state, data) { // mutations的规则， 第一个参数永远都是state， data是传过来的参数
      state.user = data // 好比如过来的data = 1， 那么state.user就等于 1
      // 为了防止刷新丢失，我们需要把数据备份到本地存储
      setItem(TOKEN_KEY, state.user)
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user)) // 把对象转为字符串格式 本地存储字符串格式
    }
  },
  actions: {
  },
  modules: {
  }
})
