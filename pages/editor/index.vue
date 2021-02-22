<template>
<div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form>
          <fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Article Title" v-model="article.title" required>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?" v-model="article.description" required>
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)" v-model="article.body" required></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="articlesBom">
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { addArticles, updateArticles, getArticles } from '@/api/article'
export default {
  // 路由组件渲染之前先执行中间件
  middleware:'authenticated',
  name:'editorIndex',
  data() {
    return {
      
    }
  },
  methods:{
    async articlesBom(){
      const blurs = this.slugs !== 'add' 
      const { data } = blurs
        ? await updateArticles({ article: this.article }, this.slugs)
        : await addArticles({ article: this.article })      
      if(data.article.slug !== '' && data.article.slug !== undefined) {
        this.$router.push({ name: 'article',  params: { slug: data.article.slug } }) 
      }
    }

  },
  async asyncData ({ params }) {
    const slugs = params.slug
    let article = {
        title:'',
        description: '',
        body: '',
        tagList: []
      }
    if(params.slug !== 'add'){
      const { data } = await getArticles(params.slug)
      article = {
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
        tagList: data.article.tagList
      }
    }
    return {
      article,
      slugs
    }
  }
  // mounted({ params }){
  //   console.log()
  // }
}
</script>

<style>

</style>