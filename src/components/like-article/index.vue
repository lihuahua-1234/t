<template>
<!--点赞-->
      <van-button
      :icon="attitude === 1 ? 'good-job' : 'good-job-o'"
      :class="{
          liked: attitude === 1
      }"
      :loading= "loading"
      @click="onCollect"
      />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: '',
  model: {
    prop: 'attitude',
    event: 'update-attitude'
  },
  props: {
    attitude: {
      type: Number,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false // 加载
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onCollect () {
      this.loading = true
      try {
        let status = -1 // -1未点赞，
        if (this.attitude === 1) {
        // 已点赞，取消点赞
          await deleteLike(this.articleId)
        } else {
        // 未点赞，点赞
          await addLike(this.articleId)
          status = 1 // 1已点赞，
        }
        // 更新视图层
        this.$emit('update-attitude', status)
        this.$toast(status === 1 ? '点赞' : '取消点赞')
      } catch (err) {
        this.$toast('操作失败，稍后重试')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang = "less">
.liked {
    .van-icon {
        color: #e5645f;
    }
}
</style>