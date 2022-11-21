<template>
<!--首页-->
  <div class="home-container">
    <!-- 导航栏 fixed固定定位 to跳转路由-->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

  <!--频道列表-->
  <!--通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过 animated 属性可以开启切换标签内容时的转场动画
      通过 swipeable 属性可以开启滑动切换标签页。-->
  <van-tabs class="channel-tabs" v-model="active" animated swipeable>
  <van-tab
  v-for="obj in Channels" :key="obj.id"
  :title="obj.name">

  <!--文章列表 引入文本组件展示内容-->
  <article-list :channel="obj" /><!--父传子技术-->
  <!--/文章列表-->
  </van-tab>

  <!--占位符-->
  <div slot="nav-right" class="placeholder"></div>
  <!--/占位符-->
  <!--汉堡栏-->
  <div slot="nav-right"
  class="hamburger-btn"
  @click="isChennelEditShow= true">
    <i class="toutiao toutiao-gengduo"></i>
  </div>
  <!--\汉堡栏-->
</van-tabs>
<!--/频道列表-->

<!--频道编辑弹出层-->
<van-popup
  v-model="isChennelEditShow"
  close-icon-position="top-left"
  closeable
  position="bottom"
  :style="{ height: '100%' }">
  <!--父子组件间通信 :my-channels="Channels"数组拿过来子组件遍历，:active="active"高亮-->
  <channel-edit :mychannels="Channels"
  :active="active"
  @update-active = "onUpdateActive"
  />
    <!--子组向父亲通信传值 @update-active = "onUpdateActive"-->
</van-popup>
<!--/频道编辑弹出层-->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage' // 本地存储aip 加载方法
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      Channels: [], // 频道列表
      isChennelEditShow: false// 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels() // 定义加载数据
  },
  mounted () {},
  methods: {
    async loadChannels () {
      try {
        const { data } = await getUserChannels() // 请求数据
        console.log(data)
        this.Channels = data.data.channels
        console.log(this.Channels)

        let Channels = []
        if (this.user) {
          // 已登录,请求获取用户频道列表
          const { data } = await getUserChannels()
          Channels = data.data.channels
          console.log(Channels)
        } else {
        // 未登录,判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          // 有,拿来使用
          if (localChannels) {
            Channels = localChannels
          } else {
            // 没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            Channels = data.data.channels
          }
        }
        this.Channels = Channels
      } catch (err) {
        this.$toast('获取频道失败')
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      // console.log('home', index)
      // 更新激活的频道项
      this.active = index
      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style scoped lang="less">
/*导航栏*/
.home-container {
  padding-top: 40px;
  padding-bottom: 50px;
  .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 210px;
    height: 32px;
    background-color: #5babfb;
    border: none;
    font-size: 14px;
    .van-icon {
      font-size: 16px;
    }
  }
  /*\导航栏*/
  /deep/ .channel-tabs{
    padding-top: 48px;
    .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 41px;
    }
    .van-tab{
     min-width: 100px;
     border-right: 1px solid #edeff3;
     font-size: 15px;
     color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }/*导航条*/
    .van-tabs__line {
      bottom: 4px;
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
    }
    /*\导航条*/
    /*汉堡栏*/
    .hamburger-btn {
     position: fixed; /**定位 */
     right: 0;
     width: 33px;
     height: 41px;

     display: flex;/*弹性布局*/
     justify-content: center;/*垂直居中*/
     align-items: center;/*水平居中*/

     background-color: #fff;
     opacity: 0.902;/*背景透明*/
     i.toutiao{
       font-size: 16px;
     }
     &:before {/*给这个盒子设置一个伪元素，给伪元素设置一个背景图，然后定位到左边框*/
       content: "";
       width: 1px;
       height: 100%;
       background-image: url(~@/assets/gradient-gray-line.png);
       position: absolute;/*定位*/
       left: 0;/*定位到最左侧*/
       background-size: contain;/*填充，然后设置width的宽度现在设为了1px*/
     }
    }
    /*\汉堡栏*/
    /*占位符*/
    .placeholder{
     width: 25px;
     height: 41px;
     flex-shrink: 0;/*默认是1参与空间计算平分， 0不让他参与空间计算平分*/
    }
 /*\占位符*/
  }
}
</style>