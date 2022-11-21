<template>
<!--搜索结果-->
  <div class="search-suggestion">
    <!--联想建议-->
    <van-cell
    icon="search"
    v-for="(text, index) in suggestions"
    :key="index"
    @click="$emit('search', text)"
    >
    <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
    <!--\联想建议 highlight是个函数,我们需要定义一下-->

    <!--使用v-html 指令可以绑定渲染带有html标签字符串-->
    <!-- <div v-html="htmlStr"></div> -->

  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载有好处：只会把使用都的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
      // htmlStr: 'Hello<span style="color:red">World</span>'
    }
  },
  computed: {},
  // 监听watch功能监听输入框
  watch: {
    // 输入框
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 函数
      // 注意: handler 函数名称是固定的

      // debounce函数
      // 参数1：一个函数
      // 参数2： 延迟时间，单位是毫秒
      // 返回值: 防抖之后的函数
      handler: debounce(function (value) {
      // console.log(value)
        this.loadSearchSuggestions(value)
      }, 1000),
      // handler (value) {
      //   // console.log(value)
      //   this.loadSearchSuggestions(value)
      // },
      immediate: true // 该回调将会在侦听开始之后被立即调用, 如果不加我们输入第一个字符他侦听不到
    }
    // \输入框
  },
  created () {},
  mounted () {},
  methods: {
    // 请求数据
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // console.log(data)
        this.suggestions = data.data.options // 拿到数据给data定义空数据，然后循环出来
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlighStr = `<span class="active">${this.searchText}</span>`

      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')// g全局，i不区分大小写
      return text.replace(reg, highlighStr)// 字符替换，
    }
  }
}
</script>

<style scoped lang = "less">
.search-suggestion{
/deep/  span.active {
    color: #3296fa;
  }
}
</style>