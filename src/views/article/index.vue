<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条">
      <van-icon slot="left"
       name="arrow-left"
       size="20px"
       @click="$router.back()"/><!--@click="$router.back()"从哪里会哪去-->
    </van-nav-bar>
    <!-- /导航栏 -->
    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          text-color="#c9c9c9"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情  v-else-if="article.title" 判断条件为是否能获取到数据里的内容-->
      <div v-else-if="article.title"  class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"/>
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <!--
            1.模板中的 $event 是事件参数

            2.当我们传递给子组件的数据既要使用还要修改。
              传递：props
                :is-followed="article.is_followed"
              修改：自定义事件
                @update-is_followed="article.is_followed = $event"
            2.1简写方式：在组件上使用 v-model
              value="article.is_followed"
              @input="article.is_followed = $event"
              然后在子组件
                props: {
                   value: { isFollowed 改为 value} //用到他的相关参数也是要this.value, 而不是this.isFollowed了

                // this.$emit('update-is_followed', !this.value)
                this.$emit('input', !this.value) // 父亲使用了v-mode绑定，子组件自定义事件名必须是input

            2.2如果需要修改 v-model 的规则名称，可以通过子组件的 model 属性来配置修改
              model: { // 更改value定义事件名，为了语义化更加明白些
              prop: 'isFollowed', // prop 定义事件名
              event: 'update-is_followed' // 自定义事件
              },
               props: {
                   isFollowed: { value 改为 isFollowed}用到他的相关参数也是要this.isFollowed, 而不是this.value了
            其实就是修改了这些
            :is-followed="article.is_followed" // 父亲
            // 儿子里定义
            model: { // 更改value定义事件名，为了语义化更加明白些
              prop: 'isFollowed', // prop 定义事件名
              event: 'update-is_followed' // 自定义事件
              },
               props: {
                   isFollowed: {

                   }
              // this.$emit('update-is_followed', !this.isFollowed)

             3.一个组件上只能使用一次 v-model，
            如果有多个数据需要实现类似于 v-model 的效果，咋办？
            可以使用属性的 .sync 修饰符。
           -->
          <follow-user
          v-model="article.is_followed"
          class="follow-btn"
          :user-id="article.aut_id"
          />
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            @click="onFollow"
          >关注
          </van-button> -->
        </van-cell>
        <!--v-if="article.is_followed"判断隐藏和显示-->
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
        class="article-content markdown-body"
        v-html="article.content"
        ref="article-content">
        <!-- ref="article-content" 找到所有图片 -->
        </div>
        <van-divider>正文结束</van-divider>

        <!--文章评论列表-->
        <!--接收来自孙子的传值 @reply-click="onReplyClick"  从comment-item传过来的-->
        <comment-list
        :source="article.art_id"
        :list="commentList"
        @onload-success="totalCommentCount = $event.total_count"
        @reply-click="onReplyClick"
        />
        <!--/文章评论列表-->

            <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
      <van-icon
      class="comment-icon"
        name="comment-o"
        :badge="totalCommentCount"
      />
      <!--封装收藏-->
      <collect-article
      class="btn-item"
      v-model="article.is_collected"
      :article-id="article.art_id"
      />
      <!--封装点赞-->
      <like-article
      class="btn-item"
      v-model="article.attitude"
      :article-id="article.art_id"
      />

      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论弹出层 -->
    <van-popup
    v-model="isPostShow"
    position="bottom">
    <comment-post
    :target="article.art_id"
    @post-success="onPostSuccess"
    />
    </van-popup>
    <!-- /发布评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
       <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button
        class="retry-btn"
        @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!--评论回复-->
    <!--弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏-->
    <van-popup
    v-model="isReplyShow"
    position="bottom"
    style="height: 100%;"
    >
    <!--v-if 条件渲染
        true: 渲染元素节点
        false: 不渲染
    -->
    <comment-reply
    v-if="isReplyShow"
    :comment="currentComment"
    @close="isReplyShow = false"
    />
    </van-popup>
    <!--/评论回复-->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 给所有的后代组件提供数据 依赖注入声明
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: { // components下的封装好的文章组件传递过来额
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading状态
      errStatus: 0, // 失败的状态码
      followLoading: false, // loading加载
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论的显示状态
      commentList: [], // 评论列表
      isReplyShow: false, // 控制回复评论的显示状态
      currentComment: {} // 当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created () { // 初始请求调用
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      // 点击了重新加载我们得让login转起来
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // 加载失败的测试方法
        // if (Math.random() > 0.5) {
        //   JSON.parse('ASV')
        // }

        // 数据驱动视频这件事不是立即的
        this.article = data.data

        // 请求成功，初始化图片点击预览
        // console.log(this.$refs['article-content']) // this.$refs得到正文得容器节点
        // 数据驱动视频这件事不是立即的，所以我们定义一个延迟方法
        setTimeout(() => {
          this.previewImage()
        }, 0)

        // 请求成功，关闭loading
        // this.loading = false
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.loading = false
        // console.log('获取数据失败', err)
      }
      // 无论成功还数失败，都需要关闭loading
      this.loading = false
    },
    previewImage () {
      // 得到所有得 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs)

      // 获取所有 img 地址
      const images = [] // 定义一个空数据，接收地址
      imgs.forEach((img, index) => { // 循环imgs里得数组照片地址
        images.push(img.src)
        // 给每个img 注册点击事件， 在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览得图片地址数组
            images,
            // 预览起始位置
            startPosition: index
          })
        }
      })
      // console.log(images)
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj) // data.new_obj 最新的评论数据, unshift放在顶部
      window.location.reload()
    },
    onReplyClick (comment) {
      // console.log(comment)
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 45px;
    bottom: 44px;
    overflow-y: scroll;
    background-color: #fff;
  }

.loading-wrap {
    padding: 100px 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .article-detail {
    .article-title {
      font-size: 20px;
      padding: 25px 16px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 16px;
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 12px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 10px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }

    .article-content {
      padding: 27px 16px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .error-wrap {
    padding: 100px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 61px;
      color: #b4b4b4;
    }
    .text {
      font-size: 15px;
      color: #666666;
      margin: 16px 0 23px;
    }
    .retry-btn {
      width: 140px;
      height: 35px;
      line-height: 35px;
      border: 1px solid #c3c3c3;
      font-size: 15px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
  /deep/ .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 8px;
        background-color: #e22829;
      }
    }
  }
}
</style>