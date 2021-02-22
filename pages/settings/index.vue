<template>
<div class="settings-page">
    <div class="container page">
        <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <!-- <form> -->
            <fieldset>
                <fieldset class="form-group">
                    <input class="form-control" type="text" placeholder="URL of profile picture" v-model="user.image">
                </fieldset>
                <fieldset class="form-group">
                    <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.username">
                </fieldset>
                <fieldset class="form-group">
                    <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" v-model="user.bio"></textarea>
                </fieldset>
                <fieldset class="form-group">
                    <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="user.email">
                </fieldset>
                <fieldset class="form-group">
                    <input class="form-control form-control-lg" type="password" placeholder="Password" v-model="user.password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right" @click="putUser">
                    Update Settings
                </button>
            </fieldset>
            <!-- </form> -->
            <hr>

            <button class="btn btn-outline-danger" @click="logout">
                Or click here to logout.
            </button>
        </div>

        </div>
    </div>
</div>
</template>

<script>
import { getUser, putsUser } from '@/api/user.js'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
    // 路由组件渲染之前先执行中间件
    middleware:'authenticated',
    name:'settings',
    data() {
        return {
            user:{
                email:'',
                bio:'',
                image:'',
                username:'',
                password:''
            }
        }
    },
    async mounted () {
        const { data } = await getUser()
        console.log(data)
        this.user = {
            email: data.user.email,
            bio: data.user.bio,
            image: data.user.image,
            username: data.user.username
        } 
    },
    methods: {
        putUser(){
            try {
                putsUser({ user: this.user })
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
        },
        logout() {
            // 保存登录状态
            this.$store.commit('setUser', '')
            // 持久化保存登陆状态
            Cookie.set('user', '')
            this.$router.push('/')
        }
    }

}
</script>

<style>

</style>