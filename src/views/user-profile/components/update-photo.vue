<template>
<div class="update-photh">
<!--图片上传-->
<img class="img" :src="img" ref="img">
<div class="toolbar">
<div class="cancel" @click="$emit('close')">取消</div>
<div class="confirm" @click="onConfirm">完成</div>
</div>
</div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false
    })
    // console.log(cropper)
  },
  methods: {
    onConfirm () {
      // 基于服务端的裁切使用 getData 方法获取裁切参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      // 错误的使用
      // 如果接口要求 Content-Type 是 application/json
      // 则传递普通 JavaScript 对象
      // updateUserPhoto({
      //   photo: blob
      // })

      // 如果接口要求 Content-Type 是 multipart/form-data
      // 则你必须传递 FormData 对象
      const formData = new FormData()
      formData.append('photo', blob)

      const { data } = await updateUserPhoto(formData)
      // console.log(data)
      // 关闭弹出
      this.$emit('close')
      // 更新视图
      this.$emit('update-photo', data.data.photo)
    }
  }
}
</script>

<style scoped lang = "less">
.update-photh{
    background-color: #000;
    height: 100%;
  .toolbar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex; /**水平排列 */
      justify-content: space-between; /**两端对齐 */
      .cancel,.confirm {
        width: 45px;
        height: 45px;
        font-size: 15px;
        display: flex; /**水平排列 */
        justify-content: center;
        align-items: center;
        color: #fff;
      }
  }
 }
.img {
    max-width: 100%;
}
</style>