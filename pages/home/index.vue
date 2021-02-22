<template>

	<div class="home-page">

		<div class="banner">
			<div class="container">
				<h1 class="logo-font">conduit</h1>
				<p>A place to share your knowledge.</p>
			</div>
		</div>

		<div class="container page">
			<div class="row">

				<div class="col-md-9">
					<div class="feed-toggle">
						<ul class="nav nav-pills outline-active">

							<li class="nav-item" v-if="user">
								<nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                >
                  Your Feed
                </nuxt-link>
							</li>
							<li class="nav-item">
								<nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'Global_Feed'
                  }"
                  exact
                  :to="{
                    name: 'home'
                  }"
                >
                  Global Feed
                </nuxt-link>
							</li>

              <li v-if="tag" class="nav-item">
								<nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'tag'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                >
                  {{ tag }}
                </nuxt-link >
							</li>


						</ul>
					</div>

					<!-- 列表 -->
					<div class="article-preview" v-for="article in articles" :key="article.slug">
						<div class="article-meta">
							<nuxt-link :to="`/profile/${article.author.username}`">
								<img :src="article.author.image" />
							</nuxt-link>
							<div class="info">
								<nuxt-link :to="`/profile/${article.author.username}`" class="author">{{ article.author.username }}</nuxt-link>
								<span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
							</div>
							<button 
                class="btn btn-outline-primary btn-sm pull-xs-right" 
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
								<i class="ion-heart"></i> {{ article.favoritesCount }}
							</button>
						</div>
						<!-- <nuxt-link :to="{ name: `article/${article.slug}`, params: { slug: article.slug } }" class="preview-link"> -->
            <nuxt-link :to="`/article/${article.slug}`" class="preview-link">
							<h1>{{ article.title }}</h1>
							<p>{{ article.description }}</p>
							<span @click="$router.push({ 
							 name: 'article', 
							 params: { slug: article.slug } 
							})">Read more...</span>
						</nuxt-link>
					</div>
					<!-- 列表 -->

					<!-- 页码 -->
					<nav>
            <ul class="pagination">
              <li class="page-item" :class="{active: item === page }" v-for="item in totalPage" :key="item">
                <nuxt-link class="page-link" :to="{name: 'home', query: { 
                  page: item,
                  tag: $route.query.tag, 
                  tab: tab
                }}">
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav> 
					<!-- 页码 -->

				</div>

        <!-- 标签 -->
				<div class="col-md-3">
					<div class="sidebar">
						<p>Popular Tags</p>

						<div class="tag-list">
							<nuxt-link 
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: item
                  }
                }" 
                v-for="item in tags" 
                :key="item" 
                class="tag-pill tag-default"> 
                  {{ item }} 
            </nuxt-link>
							
						</div>
					</div>
				</div>

			</div>
		</div>

	</div>

</template>

<script>
  import { getArticle, getYourFeedArticles, deleteFavorite, addFavorite } from '@/api/article.js'
  import { getTags } from '@/api/tag.js'
  import { mapState } from 'vuex'

	export default {
		name: 'homeIndex',
		async asyncData({ query, store }) {
      
			const page = Number.parseInt(query.page || 1) // 当前页码
      const limit = 20 // 每页几条数据
      const tag = query.tag // 标签
      const tab = query.tab || 'global_feed' // 选项卡
			// const {
			// 	data
			// } = await getArticle({
			// 	limit,
			// 	offset: (page - 1) * limit
      // })
      // const {
			// 	data: tagData
			// } = await getTags()
      const loadArticles = store.state.user && tab === 'your_feed'  // 判断 tab 调用不同接口
        ? getYourFeedArticles
        : getArticle

      const [ articleRes, tagRes ] = await Promise.all([
        loadArticles({
          limit,
          offset: (page - 1) * limit,
          tag
        }),
        getTags()
      ])

      const { articles, articlesCount } = articleRes.data
      const { tags } = tagRes.data
      articles.forEach(article => article.favoriteDisabled = false)

			return {
			  articles, // 文章列表
        articlesCount, // 文章总数
        tags, // 标签列表
        limit, // 每页大小
        page, // 页码
        tab, // 选项卡
        tag // 数据标签
			}
    },
    computed: {
      ...mapState(['user']),
      totalPage () { 
        return Math.ceil(this.articlesCount / this.limit) 
      }
    },
    watchQuery: ['page','tag','tab'],
    methods: {
      async onFavorite (article){
        article.favoriteDisabled = true
        if(article.favorited){
          // 取消点赞
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount += -1
        }else{
          // 添加点赞
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount += 1
        }
        article.favoriteDisabled = false
      }
    }

	}
</script>

<style>

</style>
