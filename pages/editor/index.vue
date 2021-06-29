<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="handleCreate">
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="formData.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="formData.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="formData.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="formData.tagList" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary">
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
import { createArticle, updateArticle, getArticle } from '@/api/article.js'
export default {
  middleware: 'authenticated',
  name: 'EditorIndex',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    const { slug } = params

    let formData = {
      title: undefined,
      description: undefined,
      body: undefined,
      tagList: undefined,
    }
    if (slug) {
      const { data } = await getArticle(slug)
      const { article } = data
      formData = {
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList.join(','),
      }
    }
    
    return {
      formData,
      slug,
    }
  },
  data () {
    return {
      errors: [],
    }
  },
  methods: {
    async handleCreate () {
      try {
        let res
        const article = {
          ...this.formData,
          tagList: this.formData.tagList.split(',')
        }
        if (!this.slug) {
          // 新增
          res = await createArticle({ article })
        } else {
          // 编辑
          res = await updateArticle({
            slug: this.slug,
            data: { article }
          })
          
        }

        const { data } = res
        this.$router.push(`/article/${data.article.slug}`)
      } catch (err) {
        this.errors = err.response.data.errors
      }
    },
  }
}
</script>

<style>

</style>