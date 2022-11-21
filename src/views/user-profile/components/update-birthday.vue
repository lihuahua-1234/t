<template>
<!--编辑生日-->
  <div class="update-birthday">
  <!--
  v-model="currentDate" 双向绑定日期选择器
  设置日期选择器的默认值
  同步日期选择器选择的日期
  -->
  <van-datetime-picker
  v-model="currentDate"
  type="date"
  title="请选择日期"
  :min-date="minDate"
  :max-date="maxDate"
  @confirm="onConfirm"
  @cancel="$emit('close')"

/>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1997, 0, 1), // 最新日期
      maxDate: new Date(), // 最大日期
      currentDate: new Date(this.value) // 把字符串转为标准日期对象
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD') // 把标准日期对象转换成后台需要的日期对象
        await updateUserProfile({
          birthday: currentDate
        })
        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹出
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang = "less">
</style>