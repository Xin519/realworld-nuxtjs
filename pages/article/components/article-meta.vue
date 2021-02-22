<template>
  <div class="article-meta" style="text-align:left">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
  
  <template v-if="user.username !== article.author.username">
    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following
      }"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow Eric Simons <span class="counter"> () </span>
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
    >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">  </span>
    </button>
  </template>

  <template v-else>
    <nuxt-link :to="`/editor/${article.slug}`" class="btn btn-outline-secondary btn-sm">
      <i class="ion-edit"></i> Edit Article
    </nuxt-link>

    <button class="btn btn-outline-danger btn-sm" @click="deleteBom">
      <i class="ion-trash-a"></i> Delete Article
    </button>
  </template>
  </div>
</template> 

<script>
import { deleteArticles } from '@/api/article'
import { mapState } from 'vuex'
import { MessageBox, Message  } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
   computed: {
    ...mapState(['user'])
  },
  methods: {
    deleteBom(){
      console.log(this.article.slug)
      MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticles(this.article.slug)
          this.$router.push('/') 
          Message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    
    }
  }
}
</script>

<style>

</style>
