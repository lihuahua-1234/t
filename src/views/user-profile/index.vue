<template>
<!--用户资料-->
  <div class="user-profile">
      <!--导航栏-->
      <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
      />
      <!--/导航栏-->
      <input
      type="file"
      hidden
      ref="file"
      @change="onFileChange"
      >

      <!--个人信息-->
      <van-cell
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
      >
        <van-image
        class="avatar"
         fit="cover"
         round
         :src="user.photo"
         />
      </van-cell>
      <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow=true"
      />

      <van-cell title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"/>

      <van-cell title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow=true"
      />
      <!--/个人信息-->

      <!--编辑昵称 popup弹出层，position="bottom"从下往上弹-->
      <!--:name="user.name"不用他。 用v-model="user.name"因为两边都要用到，要用到数据，还要传回来给父组件改变数据-->
      <van-popup
      v-model="isUpdateNameShow"
      style="height:100%;"
      position="bottom"
      >
       <!--解决vue懒加载办法 v-if="isUpdateNameShow"-->
        <update-name
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow=false"
        v-model="user.name"
        />
      </van-popup>
      <!--/编辑昵称-->

      <!--编辑性别-->
      <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
      >
      <update-gender
      v-if="isUpdateGenderShow"
      v-model="user.gender"
      @close="isUpdateGenderShow = false"/>
      </van-popup>
      <!--/编辑性别-->

      <!--编辑生日-->
      <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
      >
      <update-birthday
      v-if="isUpdateBirthdayShow"
      v-model="user.birthday"
      @close="isUpdateBirthdayShow = false"
      />
      </van-popup>
      <!--/编辑生日-->

      <!--编辑头像-->
      <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height:100%;"
      >
      <update-photo
      v-if="isUpdatePhotoShow"
      :img="img"
      @close="isUpdatePhotoShow=false"
      @update-photo="user.photo = $event"
      />
      </van-popup>
      <!--/编辑头像-->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null // 预览的图片
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据
      const data = window.URL.createObjectURL(file)
      // console.log(data)
      this.img = data
      // 展示预览弹图片出层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发， change 事件
      // 解决办法就是每次使用完毕，把他的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang = "less">
.user-profile {
    .avatar {
     width: 30px;
     height: 30px;
    }
    .van-popup {
        background-color: #f5f7f9;
    }
}
</style>