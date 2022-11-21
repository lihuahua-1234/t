<template>
<!--收藏-->
 <!--is_collected ? 'star' : star-o. is_collected 如果为turn 显示'star' 如果不是显示'star-o'-->
      <van-button
      :icon="is_collected ? 'star' : 'star-o'"
      :class="{
          collested:is_collected
          }"
          :loading="loading"
          @click="onCollect"
      />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  components: '',
  model: {
    prop: 'is_collected', // 默认是value 收藏文章
    event: 'update-is_collected' // 默认是 默认是input 提交
  },
  props: {
    is_collected: {
      type: Boolean,
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
        if (this.is_collected) {
          // 已收藏，取下收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏， 添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('update-is_collected', !this.is_collected)

        this.$toast.success(!this.is_collected ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast('操作失败，稍后重试')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang = "less">
.collested {
    .van-icon {
        color: #ffa500;
    }
}
</style>