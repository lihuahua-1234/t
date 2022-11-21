<template>
<!--搜索历史-->
  <div class="search-history">
  <!--搜索历史记录-->
  <!--<van-cell>单元格-->
  <van-cell title="搜索历史">

    <div v-if="isDeleteShow">
    <span @click="$emit('clear-search-histories', [])">全部删除</span>
    &nbsp;&nbsp;
    <span  @click="isDeleteShow= false">完成</span>
    </div>
    <van-icon name="delete" v-else @click="isDeleteShow= true"/>
  </van-cell>
  <van-cell
  :title="item"
  v-for="(item, index) in searchHistories"
  :key="index"
  @click="onSearchItemClick(item, index)"
  >
    <van-icon v-show="isDeleteShow" name="close" />
  </van-cell>

  <!--/搜索历史记录-->
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: '',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false, // 控制删除显示状态
      SearchHistories: this.searchHistories /** 单向数据流父级prop的更新会向下流动到子组件中，子组件中所有的 prop 都将会刷新为最新的值但是反过来则不行。你不应该在一个子组件内部改变 prop。否则Vue 会在浏览器的控制台中发出如上图的警告
      props: ['goodsItem'],
      data () {
      return {
       localGoods: this.goodsItem
       }
     } */
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态， 删除历史记录数据
        this.SearchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang = "less">
</style>