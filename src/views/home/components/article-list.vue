<template>
<!--文章列表组件-->
  <div class="article-list">
    <!--下拉刷新组件，在被刷新的组件下包裹住-->
    <!--
      :success-text="refreshSuccessText" 成功提示的文本
      :success-duration= "1000" 下拉刷新展示的时间 1秒
    -->
    <van-pull-refresh
    v-model="isLoading"
    :success-text="refreshSuccessText"
    :success-duration= "1000"
    @refresh="onRefresh" >
    <!--文章列表-->
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  :error.sync="error"
  error-text="请求失败，点击重新加载"
  @load="onLoad"
>
<!--文章列表项 :article="article"父传子-->
<article-item v-for="(article, index) in list" :key="index"
:article="article"/>
<!--/文章列表项-->
  <!--<van-cell v-for="(article, index) in list" :key="index" :title="article.title">
    :title="article.title"文章的标题-->
</van-list>
<!--/文章列表-->
</van-pull-refresh>
<!--/下拉刷新组件，在被刷新的组件下包裹住-->
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem// 注册组件
  },
  props: {
    // 声明一下，接收父传过来的组件
    channel: {
      type: Object,
      required: true // 意思是：必须你不给我就标错
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页的时间戳
      error: false, // 控制列表加载失败提示状态
      isLoading: false, // 控制下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本

    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 初始化成滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      try {
      // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // timestamp简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          timestamp: this.timestamp || Date.now(), // 用于请求之后数据时间戳会再当前请求结果中返回给你
          with_top: 1 // 我们没有置顶接口，写不写都行 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }
        // 2.把请求结果数据放到list数组中
        const { results } = data.data
        console.log(results)
        // 数组的展开操作符，它会把元素1个1个拿出来 展开意思是this.list.push(resuIts[0],resuIts[1],resuIts[2]...)这样子不科学因为我们不知道数据库里有多少条工作量太大
        this.list.push(...results)
        // 3.本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4.判断数据全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将 finished设置为 true 不再 load 加载更多了
          this.finished = true
        }
      } catch (err) {
        // console.log('请求失败', err)
        // this.$toast('请求失败') //交互方式效果不好
        this.error = true // 展示提示状态
        this.loading = false // 请求失败了，loading 也需要关闭
      }
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh () {
      try {
      // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 下拉刷新， 每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1 // 我们没有置顶接口，写不写都行 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }
        // 2.将数据追加搭配列表的顶部,unshift追加到顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3.关闭下拉刷新的 loading 状态
        this.isLoading = false
        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        // console.log('请求失败', err)
        this.refreshSuccessText = '刷新失败'
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang = "less">
.article-list {
  /**记住列表的滚动位置
     百分比，相对于父元素的，父元素有高，子元素 % 才会有效，这样子太麻烦
  height: 100%; */
  height: 80vh;
  overflow: auto;
}
</style>