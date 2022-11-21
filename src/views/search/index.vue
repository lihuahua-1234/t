<template>
  <div class="search-contain">
    <!--搜索栏 searchText搜索文本-->
    <!--Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。-->
    <form class="search-from" action="/">
    <van-search
    background="#3296fa"
    v-model="searchText"
    show-action
    placeholder="请输入搜索关键词"
    @search="onSearch"
    @cancel="onCancel"
    @focus ="isResultShow = false"
  />
  </form>
  <!--onSearch"搜索"：回车触发搜索结果 , show-action:显示右边取消的按钮，onCancel"取消"取消会触发onCancel事件跳转连接。 @focus：输入框获得焦点时触发-->
  <!--/搜索栏-->

  <!--搜索结果-->
  <search-result
  v-if="isResultShow"
  :search-text="searchText"
  />
  <!--/搜索结果-->

  <!--联想建议 父亲向子组件传值:searchtext="searchText"-->
  <search-suggestion
  v-else-if="searchText"
  :search-text="searchText"
  @search="onSearch"
  />
  <!--/联想建议-->

  <!--搜索历史记录-->
  <search-history
  v-else
  :search-histories="searchHistories"
  @clear-search-histories = "searchHistories = []"
  @search="onSearch"
  />
  <!--/搜索历史记录-->
  </div>
</template>

<script>
import SearchHistory from './components/search-history' // 搜索历史记录
import SearchSuggestion from './components/search-suggestion' // 联想建议
import SearchResult from './components/search-result' // 搜索结果
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex', // 搜索文本
  components: {
    // 组件注册
    SearchSuggestion,
    SearchResult,
    SearchHistory
  },
  props: {},
  data () {
    return {
      searchText: '', // 搜索文本框
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []// 搜索的历史记录 getItem('TOUTIAO_SEARCH_HISTORIES')读取本地历史记录映射到搜索记录去
    }
  },
  computed: {},
  watch: {
    // searchHistories: {
    // handler () {}
    // }
    searchHistories (value) { // 简写
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (val) {
    //  Toast (val)
      // console.log(val)
      // 更新文本框内容
      this.searchText = val // 联想自会点击后，输入框等于联想值

      // 存储搜索历史记录
      // 要求:不要有重复历史记录， 最新的排在最前面
      const index = this.searchHistories.indexOf(val) // 返回指定字符在字符串中第一次出现处的索引，如果此字符串中没有这样的字符，则返回 -1 indexOf遍历val数组中相同的数 如果找到赋予index
      if (index !== -1) { // 如果不等于 -1 就证明里面已经存在这个记录，需要删除重新插入
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val) // unshift最新插在最前面
      // 渲染搜索结果
      this.isResultShow = true // 回车展示搜索结果
    },
    onCancel () {
      this.$router.back() // 从哪来回那去
    }
  }
}
</script>

<style scoped lang = "less">
.search-contain{
  padding-top: 54px;
  .van-search__action{
    color: #fff;
  }
  .search-from{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>