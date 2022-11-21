<template>
  <div class="login-container">
    <!--导航栏-->
    <van-nav-bar
    class="page-nav-bar"
    title="登录">
    <van-icon slot="left"
    name="cross"
    @click="$router.back()"/><!--@click="$router.back()"从哪里会哪去-->
    </van-nav-bar>
      <!--登录表单-->
      <!--
      校验规则验证:
      1.给 van-field 组件配置 rules 验证规则
      2.当表单提交的时候会自动触发表单验证
        如果验证通过，会触发submit事件
        如果验证失败，不会触发submit
      -->
    <van-form ref="loginForm"  @submit="onSubmit">

      <van-field
      v-model="user.mobile"
        name="mobile"
        left-icon="smile-o"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11" >
      <!--slot插槽技术-->
      <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>

      <van-field
      v-model="user.code"
        name="code"
        left-icon="smile-o"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
        >
      <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>

      <template #button>
       <!--倒计时 time：倒计时时间-->
        <van-count-down
        v-if="isCountDownShow"
        :time="1000 * 60"
        format="ss s"
        @finish="isCountDownShow = false"
        />

        <van-button
        v-else
        class="send-sms-btm"
        native-type="button"
        round
        size="small"
        type="default"
        @click="onSendSms"
        >发送验证码</van-button>
      </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },

      userFormRules: { // 登录验证规则
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
        // 手机号码正则表达式校验规则
          pattern: /1[3|5|7|8]\d{9}/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /\d{6}/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false// 是否展示倒计时

    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},

  methods: {
    async onSubmit () { // async发请求
      // 1.获取表单数据
      // const user = this.user

      // 稍后表单认证2.表单验证
      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 加载持续时间，默认是2000， 如果为零则是持续展示
      })

      // 3.提交表单请求登录
      try {
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        // console.log('登录成功', res)
        this.$toast.success('登录成功')

        // 登录成功跳转回原来页面
        // 注意back的方式不严谨，
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4.根据请求响应结果处理后续操作
    },
    async onSendSms () {
      console.log('onSendSms')

      // 1. 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2.验证通过，显示倒计时
      this.isCountDownShow = true

      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false // 发送失败也关闭倒计时
        if (err.response.status === 429) {
          this.$toast('发送太频繁，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
  font-size: 26px;
  }
  .send-sms-btm {
    width:80px;
    height: 23px;
    background-color: #ededed;
    font-size: 6px;
    color: #666666;
  }
  .login-btn-wrap {
    padding: 26px 14px;
    .login-btn {
     background-color: #6db4fb;
     border: none;
    }
  }
}
</style>