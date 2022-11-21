<template>
<!--更新性别-->
  <div class="update-gender">
<van-picker
  show-toolbar
  title="请选择性别"
  :columns="columns"
  :default-index="value"
  @cancel="$emit('close')"
  @confirm="onConfirm"
  @change="onPickerChange"
/>
<!--@confirm="onConfirm" 事件确定，@change="onPickerChange"获取选择的值-->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value // 选择默认值
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
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender
        })
        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹出
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },
    onPickerChange (picker, value, index) {
      // console.log(picker, value, index)
      this.localGender = index
    }
  }
}
</script>

<style scoped lang = "less">
</style>