<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>

            <nuxt-link v-if="profile.username === user.username" :to="{ name: 'settings' }">
              <button class="btn btn-sm btn-outline-secondary action-btn" >
                &nbsp;
                <i class="ion-gear-a"></i> Edit Profile Settings
              </button>
            </nuxt-link>

            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{ active: profile.following }"
              @click.prevent="handleFollow"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
               {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
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
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{active: $route.path === `/rofile/${user.username}`}"
                  :to="{
                    name: 'profile',
                    params: { username: user.username },
                  }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{active: $route.path === `/rofile/${user.username}/favorites`}"
                  :to="{
                    name: 'profile',
                    params: { username: user.username },
                    query: { tab: 'favorites' }
                  }">
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: { username: article.author.username },
              }">
                <img :src="article.author.image" />
              </nuxt-link>

              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: { username: article.author.username },
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

          <!-- 分页列表 -->
          <nav v-if="totalPage > 1">
            <ul class="pagination">
              <li class="page-item" :class="{active: item === page}" v-for="item in totalPage" :key="item">
                <nuxt-link class="page-link" :to="{
                  name: 'profile',
                  query: {
                      page: item,
                      tab: $route.query.tab,
                    },
                  }"
                >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// api
import { getArticles, deleteFavorite, addFavorite } from '@/api/article.js'
import { getProfileUser, addFollow, deleteFollow } from '@/api/profile.js'
// store
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    const page = Number.parseInt(query.page || 1)
    const limit = 5
    const { user } = store.state
    
    const { tab } = route.query
    const { username } = route.params

    let paramsTarget = {
      limit,
      offset: (page - 1) * limit,
    }
    if (username && tab === 'favorites') {
      paramsTarget.favorited = username
    } else if (username) {
      paramsTarget.author = username
    }

    const [articleRes, userInfoRes] = await Promise.all([
      getArticles(paramsTarget),
      getProfileUser(username),
    ])
    
    const { articles, articlesCount } = articleRes.data
    articles.forEach(article => article.favoriteDisabled = false)

    const { profile } = userInfoRes.data

    return {
      articles,
      articlesCount,
      profile,
      limit,
      page,
      tab,
    }
  },
  watchQuery: ['page', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return  Math.ceil(this.articlesCount / this.limit)
    },
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
    },

    // 关注/ 取消关注
    async handleFollow () {
      const handle = this.profile.following
        ? deleteFollow
        : addFollow
      await handle(this.profile.username)
      this.profile.following = !this.profile.following
    },
  },
}
</script>

<style>

</style>