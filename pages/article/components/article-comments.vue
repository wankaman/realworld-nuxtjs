<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea v-model="body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click.prevent="handleComment">
          Post Comment
        </button>
      </div>
    </form>
    
    <div class="card" v-for="(comment, index) in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: { username: comment.author.username }
        }">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: { username: comment.author.username }
        }">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>

        <span
          class="mod-options"
          v-if="comment.author.username === user.username"
          @click.prevent="handleDelete(comment, index)"
        >
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// api
import { getComments, addComments, deleteComments } from '@/api/article.js'
// vuex
import { mapState } from 'vuex'
export default {
  name: 'ArticleCommonts',
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      comments: [], // 评论列表
      body: '', // 输入评论
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async loadComments () {
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    // 评论
    async handleComment () {
      const { data } = await addComments({
        slug: this.article.slug,
        data: {
          comment: { body: this.body },
        }
      })
      if (!data) return

      this.body = ''
      const { comment } = data
      this.comments.unshift(comment)
    },
    // 删除评论
    async handleDelete (comment, index) {
      await deleteComments({
        slug: this.article.slug,
        id: comment.id
      })
      this.comments.splice(index, 1)
    },
  },
  mounted () {
    this.loadComments()
  },
}
</script>

<style>

</style>