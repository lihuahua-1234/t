<template>
<!--文章列表项 方法一：to="/article/文章id" :to="'/article/' + article.art_id" 方法二:es6方法 :to="`/article/${article.art_id}`" 方法三:-->
  <van-cell
  class="article-item"
  :to="{// 根据路由名称进行跳转
    name: 'article',
    // 传递路由动态参数
    params: {
      articleId: article.art_id
    }
  }"
  >
  <!--文章标题 van-multi-ellipsis--l2标题最多显示两行-->
  <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title}}</div>
  <!--/文章标题-->

  <!--标题下方 label 的内容-->
  <div slot="label" class="label">
    <!--三张图的片封面 -->
    <div class="cover-wrap" v-if="article.cover.type === 3">
      <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
      <!--fit="cover"不给拉伸-->
        <van-image
        class="cover-item-img"
        fit="cover"
        :src="img"
        />
      </div>
    </div>
    <!--/三张图的片封面-->
    <div class="label-info-wrap">
    <span>{{ article.aut_name }}</span>
    <span>{{ article.comm_count }}评论</span>
    <!--| ‘|’意思为管道符-->
    <span>{{ article.pubdate | relativeTime}}</span>
    </div>
  </div>
  <!--/标题下方 label 的内容-->

  <!--右侧的单个封面,slot="default"右侧插入。 images[0]找到数组中图片下标为0的第一个元素, fit="cover"不给拉伸-->
  <van-image
  class="right-cover"
  v-if="article.cover.type === 1"
  slot="default"
  :src="article.cover.images[0]"
  fit="cover"
/>
  <!--/右侧的单个封面-->
  </van-cell>
  <!--/文章列表项-->
</template>

<script>
export default {
  name: 'ArticleItem',
  components: '',
  props: {
    // 父传子，子接收
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang = "less">
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    padding-left: 13px;
  }
  .right-cover{
    width: 116px;
    height: 73px;
  }
  .label-info-wrap span{
  font-size: 11px;
  color: #b4b4b4;
  margin-right: 12px;
  }
  .cover-wrap{
    display: flex; /**弹性布局 */
    padding: 10px 0;
    .cover-item{
      flex: 1;/**平分宽度 */
      height: 73px;
      &:not(:last-child){/**:not(:first-child)设置第一个以外的元素样式
:not(:last-child)设置除最后一个以外其他的元素样式 */
      padding-right: 4px;

      }
      .cover-item-img{
        width: 100%;
        height: 73px;
      }
    }
  }
}
</style>