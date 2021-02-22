<template>
  <div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }} </h1>
        <p class="text-xs-center">
          <!-- <a href="">Have an account?</a> -->
          <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
          <nuxt-link v-if="!isLogin" to="/login">Have an account?</nuxt-link>
        </p>

        <ul class="error-messages">
          <template v-for="(messige, field) in errors">
            <li v-for="messige in messige" :key="messige">{{ field }} {{ messige }}</li>
          </template>
        </ul>

        <form @submit.prevent="onSubmit">
          <fieldset class="form-group" v-if="!isLogin">
            <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name" required>
          </fieldset>
          <fieldset class="form-group">
            <input v-model="user.email" class="form-control form-control-lg" type="email" placeholder="Email" required>
          </fieldset>
          <fieldset class="form-group">
            <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password" required>
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">
           {{ isLogin ? 'Sign in' : 'Sign up' }} 
          </button>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { login, registration } from '@/api/user.js'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
    // 路由组件渲染之前先执行中间件
    middleware:'notAuth',
    name:'loginIndex',
    computed: {
        isLogin () {
            return this.$route.name === 'login'
        }
    },
    data () {
      return {
        user: {
          username:'',
          email: '',
          password: ''
        },
        errors:{}
      }
    },
    methods:{
      async onSubmit () {
        try {
          const { data } = this.isLogin
          ? await login({ user: this.user })
          : await registration({ user: this.user })
          
          // 保存登录状态
          this.$store.commit('setUser', data.user)
          // 持久化保存登陆状态
          Cookie.set('user', data.user)
          console.log(data)
          
          this.$router.push('/')
        } catch (err) {
          console.log(err)
          this.errors = err.response.data.errors
        }

      }
    }
}
</script>

<style>

</style>