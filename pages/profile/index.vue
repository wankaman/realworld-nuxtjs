<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="user.image" class="user-img" />
            <h4>{{ user.username }}</h4>
            <p>{{ user.bio }}</p>

            <nuxt-link v-if="user.username === $route.params.username" :to="{ name: 'settings' }">
              <button class="btn btn-sm btn-outline-secondary action-btn" >
                &nbsp;
                <i class="ion-gear-a"></i> Edit Profile Settings
              </button>
            </nuxt-link>
            
            
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ user.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link active" href="">My Articles</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="">Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
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

              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class=" {active: article.favorited }"
                :disabled="article.favoriteDisabled"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>

            <nuxt-link class="preview-link" :to="{
              name: 'article',
              params: {
                slug: article.slug
              }
            }">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >{{ tag }}</li>
              </ul>
            </nuxt-link>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
// api
import { getArticles, deleteFavorite, addFavorite } from '@/api/article.js'
import { getProfileUser } from '@/api/profile.js'
// store
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {

    const limit = 5
    const page = 1
    const { user } = store.state

    const [ articleRes, profileRes ] = await Promise.all([
      getArticles({
        author: user.username,
        limit,
        offset: (page - 1) * limit,
      }),
      getProfileUser(route.params.username),
    ])
    
    const { articles, articlesCount } = articleRes.data
    articles.forEach(article => article.favoriteDisabled = false)

    console.log(profileRes.data)

    return {
      articles,
      articlesCount,
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  },
  mounted () {

  }
}
</script>

<style>

</style>