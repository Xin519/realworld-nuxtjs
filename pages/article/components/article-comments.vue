<template>
  <div style="text-align:left">
    <form class="card comment-form">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="bodys"></textarea>
      </div>
      <div class="card-footer">
        
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click="commentBut()" >
          Post Comment
        </button>
      </div>
    </form>

    <div
      class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, CommentsArticle } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [], // 评论列表
      bodys:''
    }
  },
  
  computed: {
    ...mapState(['user'])
  },
  methods:{
    async ArticleCommentsDatas(){
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    commentBut(){
      let params = {
        comment: {
            body: this.bodys
        }
      }
      const { data } = CommentsArticle(params, this.article.slug)
      // console.log(data)
    }

  },
  mounted () {
    this.ArticleCommentsDatas()
    
  },
}
</script>

<style>

</style>
