<template>
  <div class="article-meta">
    <a href="profile.html"></a>
    <nuxt-link :to="{
      name: 'profile',
      params: { username: article.author.username }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: { username: article.author.username }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>


    <template v-if="article.author.username === user.username">
      <nuxt-link exact :to="{
          name: 'editor',
          params: { slug: article.slug }
        }"
      >
        <button
          class="btn btn-sm btn-outline-secondary"
          :class="{ active: article.author.following }"
        >
          <i class="ion-edit"></i>
          &nbsp;
          Edit Article
        </button>
      </nuxt-link>
      &nbsp;
      <button
        class="btn btn-sm btn-outline-danger"
        :class="{ active: article.favorited }"
        @click.prevent="handleDelete"
      >
        <i class="ion-trash-a"></i>
        &nbsp;
        Delete Article
      </button>
    </template>

    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
        @click.prevent="handleFollow"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
      </button>
      &nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        @click="handleFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Article <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
// api
import { deleteArticle, addFavorite, deleteFavorite } from '@/api/article.js'
import { addFollow, deleteFollow } from '@/api/profile.js'
// store
import { mapState } from 'vuex'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    // 删除文章
    async handleDelete () {
      await deleteArticle(this.article.slug)
      this.$router.push('/')
    },
    // 关注/ 取消关注
    async handleFollow () {
      const handle = this.article.following
        ? deleteFollow
        : addFollow
      await handle(this.article.author.username)
      this.article.author.following = !this.article.author.following
    },
    // 点赞/取消点赞
    async handleFavorite () {
      const handle = this.article.favorited
        ? deleteFavorite
        : addFavorite
      
      await handle(this.article.slug)
      this.article.favorited = !this.article.favorited
      if (this.article.favorited) {
        this.article.favoritesCount += 1
      } else {
        this.article.favoritesCount += -1
      }
    },
  }
}
</script>

<style>

</style>