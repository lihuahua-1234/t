<template>
<!--我的-->
  <div class="my-container">
    <!--已登录-->
    <div v-if="user" class="header user-info">

      <div class="base-info">
        <div class="left">
        <van-image
          class="avatar"
          :src="userInfo.photo"
          round
          fit="cover" />
           <span class="name">{{userInfo.name}}</span>
        </div>

        <div class="right">
        <van-button
        size="mini"
        round
        to="/user/profile">编辑资料</van-button><!--round圆角-->
        </div>
      </div>

      <!--数据统计模块-->
      <div class="data-stats">

        <div class="data-item">

          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>

        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>

        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>

        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>

      </div>
    </div>
    <!--\已登录-->

    <!--未登录-->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')"><!--@click="$router.push('/login')"跳转到login-->
        <img class="mobile" src="~@/assets/mobile.png" alt="">
        <span class="text">登录/注册</span>
      </div>

    </div>
    <!--\未登录-->

 <!--导航宫格-->
  <van-grid class="grid-nav" :column-num="2" clickable><!--clickable是否开启格子点击反馈-->
  <van-grid-item class="grid-item">
  <i slot="icon" class="toutiao toutiao-shoucang"></i>
  <span slot="text" class="text">收藏</span>
  </van-grid-item>

  <van-grid-item class="grid-item">
  <i slot="icon" class="toutiao toutiao-lishi"></i>
  <span slot="text" class="text">历史</span>
  </van-grid-item>
</van-grid>
    <!--/导航宫格-->

<!--信息通知，小李同学-->
<div class="dxt">
<van-cell title="信息通知" is-link/>
<van-cell title="小李同学" is-link/>
</div>
<!--/信息通知，小李同学-->

<!--退出-->
<van-cell
v-if="user"
class="tuichu"
title="退出"
clickable
@click="onLogout"/>
<!--clickable 点击有一个点击状态 \退出-->

  </div>
</template>

<script>
import { mapState } from 'vuex' // mapState 接收一个对象， mapState是内置的 作用：可以辅助获取到多个state的值
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  components: '',
  props: {},
  data () {
    return {
      userInfo: {}// 用户信息
    }
  },
  computed: {
    ...mapState(['user'])// mapState 接收一个对象 拿到容器里面的 user里的登录状态 来判断隐藏和显示
  },
  watch: {},
  created () {
    // 如果用户登录了，则请求加载用户数据
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () {},
  methods: {
    onLogout () {
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹窗组件
      this.$dialog.confirm({
        title: '确认退出吗?'
      })
        .then(() => {
          // on confirm
          // console.log('确定')
          // 确认退出:清除登录状态(容器中的 user + 本地存储的 user)
          this.$store.commit('setUser', null) // 文件store文件下的index 把setUser里的data设置为空(null) commit: 同步操作存储：this.$store.commit('changeValue',name)取值this.$store.state.changeValue
        })
        .catch(() => {
          // on cancel
          console.log('取消')
        })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo() // 没在aip请求头加上Headers:会提示 获取数据失败,请稍后重试
        console.log(data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败,请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang = "less">
.my-container{
  /**共用背景图片 */
  .header{
    height: 200px;
    background: url("~@/assets/banner.png");
    background-size:cover;
  }
  /**\共用背景图片 */
  /**未登录 */
  .not-login{
    display: flex;
    justify-content: center;
    align-items: center;

    .login-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile{
      width: 66px;
      height: 66px;
      margin-bottom: 5px;
    }
    .text {
      font-size: 14px;
      color: #fff;
     }
    }
  }
  /**\未登录 */

  /**登录 */
  .user-info {

    .base-info{
      height: 135px;
      padding: 38px 16px 12px; /**上 左 下 右 */
      box-sizing: border-box; /**padding的高度计算在height里，不然盒子会变高*/
      display: flex;
      justify-content: space-between;/*均匀排列每个元素*/
      align-items: center;

      .left{
        display: flex;
        align-items: center;/*水平居中*/

        .avatar{
          width: 65px;
          height: 65px;
          margin-right: 10px;
          border: 2px solid #fff;/*描边*/
        }

        .name{
          font-size: 15px;
          color: #fff;
        }

      }
    }

  .data-stats{
      /*height: 65px;*/
      display: flex;/* 弹性布局 父级元素定义display:flex,子元素宽度用flex来定义,flex:1 是均分父级元素*/

      .data-item {
        height: 65px;
        flex: 1;/*孩子平分父亲的宽度*/
        display: flex;/*弹性布局*/
        flex-direction: column;/*垂直显示*/
        justify-content: center;/*垂直居中*/
        align-items: center;/*水平居中*/
        color: #fff;

        .count{
          font-size: 18px;
        }

        .text{
          font-size: 12px;
        }

      }

    }
}
 /**\登录 */

     /**导航宫格 */
      .grid-nav{
      .grid-item{
        height: 70px;

        i.toutiao {
          font-size: 22px;
        }
        .toutiao-shoucang{
          color: #eb5253;
        }
        .toutiao-lishi{
          color:#ff9d1d;
        }
        span.text{
          font-size: 13px;
        }
      }
    }
    /**\导航宫格*/
    /**信息通知,小李同学*/
    .dxt{
      padding-top: 10px;
       .van-cell{
         font-size: 14px;
        }
    }
    /**\信息通知,小李同学*/
    /*退出登录 */
    .tuichu{
      display: flex;
      color: #d86262;
      display: flex;/*弹性布局*/
      flex-direction: column;/*垂直显示*/
      align-items: center;/*水平居中*/
      margin-top: 10px;
    }
    /*\退出登录*/

  }
</style>