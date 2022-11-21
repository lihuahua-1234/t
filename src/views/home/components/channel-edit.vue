<template>
  <div class="channel-edit">
    <!--我的频道-->
    <!--:border="false" 取消底边线-->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
      class="edit-btn"
      type="danger"
      size="mini"
      plain
      round
      @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
      <!--宫格-->
      <van-grid class="my-grid" :gutter="10">
      <van-grid-item
      class="grid-item"
      v-for="(channel, index) in mychannels"
      :key="index"
      @click="onMyChannelClick(channel, index)"
      >
        <!--
          v-bind:class 语法
          一个对象，对象中的 key 表示要作用的 CSS 类名
                    对象中的 value 要计算出布尔值
                      true，则作用该类名
                      false，不作用类名
         -->
         <!-- fiexdChannels.includes(channel.id)包含频道id  !fiexdChannels.includes(channel.id)不包含频道id-->
         <van-icon
         v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
      <span
      class="text"
      :class="{ active: index === active }"
      slot="text"
      >{{ channel.name }}</span>
      </van-grid-item>
      </van-grid>
      <!--/宫格-->
      <!--/我的频道-->

      <!--频道推荐-->
      <!--:border="false" 取消底边线-->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
      <!--宫格-->
      <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
      class="grid-item"
      v-for="(channel, index) in recommendChannels" :key="index"
      icon="plus"
      :text="channel.name"
      @click="onAddChannel(channel) "/>
      </van-grid>
      <!--/宫格-->
      <!--/频道推荐-->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel' // 加载方法
import { mapState } from 'vuex' // 加载方法 mapState是内置的 作用：可以辅助获取到多个state的值
import { setItem } from '@/utils/storage' // 本地存储aip 加载方法
export default {
  name: 'ChannelEdit',
  components: '',
  props: {
    mychannels: {
      type: Array,
      required: true
    },
    active: { // 我的频道相对应选择状态
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      wehannels: this.mychannels, /** 单向数据流父级prop的更新会向下流动到子组件中，子组件中所有的 prop 都将会刷新为最新的值但是反过来则不行。你不应该在一个子组件内部改变 prop。否则Vue 会在浏览器的控制台中发出如上图的警告
      props: ['goodsItem'],
      data () {
      return {
       localGoods: this.goodsItem
       }
     } */
      isEdit: false, // 控制编辑状态的显示和隐藏
      fiexdChannels: [0] // 固定频道,不允许删除
    }
  },
  computed: { // computed计算属性
    ...mapState(['user']), // 映射user
    // 运算简化版
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels () {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回，filter会自动创建一个接收的数组
      return this.allChannels.filter(channel => {
        // const channels = []
        // 数组的 find 方法：遍历数组，把符合条件的元素项返回
        return !this.mychannels.find(mychannels => {
          return mychannels.id === channel.id
          // 如果 mychannels.id === channel.id的就不让他存到channels数组中去，不等于的就存到数组中
        })
        // return channels
      })
    }
    // // \运算简化版

    // recommendChannels () {
    //   const channels = [] // 定义一个空数组
    //   this.allChannels.forEach(channel => {
    //   // find 遍历数组，找到满足条件的元素项
    //     const ret = this.mychannels.find(mychannels => {
    //       return mychannels.id === channel.id
    //     })
    //     // 如果我的频道中不包括该频道项(channel),则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 把计算结果返回
    //   return channels
    // }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
        // console.log(this.allChannels)
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) { // 频道推荐
      this.wehannels.push(channel) // 频道添加到我的频道

      // 数据持久化处理
      // this.addChannel(channel, this.wehannels) // 方法二

      // 方法一
      if (this.user) {
        try {
          // 已登录.把数据请求接口放到线上
          await addUserChannel({
            // id,seq请求接口规定的
            id: channel.id, // 频道id
            seq: this.wehannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
      // 未登录.把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.wehannels) // 自定义密钥名字key: TOUTIAO_CHANNELS，vlue值:this.wehannels
      }
    },
    onMyChannelClick (channel, index) {
      // console.log(channel, index)
      if (this.isEdit) {
        //  1.如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 2.删除频道项
        // 参数1：要删除的元素的开始索引 (包括)
        // 参数2: 删除的个数，如果不指定。则从参数1开始一直删除到最后
        this.wehannels.splice(index, 1)
        // 3.如果删除的激活频道之前的频道，则更新激活的频道项
        if (index <= this.active) {
        // 让激活频道的索引 -1
          this.$emit('update-active', this.active - 1, true)
        }
        // 4.处理持久化 不想在里面定义，路面代码很多了，我们到外面定义
        this.deleteChannel(channel)
      } else {
      // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false) // 子向父亲传值
      }
    },
    // 方法二 路面代码很多了，我们到外面定义
    // async addChannel (channel, wehannels) {
    //   if (this.user) {
    //     await addUserChannel({
    //       id: channel.id,
    //       seq: this.wehannels.length
    //     })
    //   } else {
    //     setItem('TOUTIAO_CHANNELS', this.wehannels)
    //   }
    // },
    async deleteChannel (channel) {
      try {
        if (this.user) {
        // 已登录删除数据,则将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
        // 未登录删除数据，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.wehannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang = "less">
.van-cell__value{
line-height: normal
}
.channel-edit{
padding: 45px 0;
/**编辑 */
.edit-btn{
  width: 62px;
  height: 24px;
  font-size: 13px;
  color: #f85959;
  border: 1px solid #f85959;
  margin-top: -50px;
}
/**\编辑 */

/**我的频道 */
.title-text{
font-size: 16px;
color: #333333;
}
/**\我的频道 */

/**宫格 */
/deep/ .grid-item{
  width: 80px;
  height: 43px;
  .van-grid-item__content {
   white-space: nowrap;/**\不让文字折行 */
  background-color: #f4f5f6;
  .van-grid-item__text, .text{
    font-size: 14px;
    color: #222;
    margin-top: 0px;
   }
   .active{
     color: red;
   }
   .van-grid-item__icon-wrapper{
    position: absolute;
    right: -5px;
    top: -5px;
    font-size: 15px;
    color: #cccccc;
    z-index: 2;/**层级，类似于图层 */

   }
  }
}
/**\宫格 */

/**我的频道宫格 */
/deep/ .my-grid{
.grid-item {
   .van-grid-item__icon{
    position: absolute;
    right: -5px;
    top: -5px;
    font-size: 15px;
    color: #cccccc;
    z-index: 2;/**层级，类似于图层 */

   }
 }
}
/**\我的频道宫格 */

/**频道推荐宫格 */
/deep/ .recommend-grid{
.grid-item{
  .van-grid-item__content{
    flex-direction:row; /**水平排列 */
    .van-icon-plus{/**图标 */
      font-size: 14px;
      margin-right: 3px;
    }
  }
 }
}
/**\频道推荐宫格 */
}
</style>