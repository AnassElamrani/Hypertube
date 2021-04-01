<template>
    <div>
        <search @search="search" @reset="reset" :resetb="resetActive"/>
        <div class="mvs">
            <Poster v-for="(mov, i) in movies" :key="i" :movie="mov" :watched="isWatched(mov.imdb_code)" @imageLoadError="imageError(i)"/>
            <div  id="loading">
              <div v-if="isLoading" class="loader"></div>
              <span id="not-found-msg" v-if="stop && params.page === 1">No Results To Show!</span>
              <span id="not-found-msg" v-if="stop && params.page !== 1">No More Results To Show!</span>
            </div>
        </div>
    </div>
</template>

<script>
import Poster from "../../components/Poster.vue";
import Search from "../../components/Search.vue";
export default {
    layout: "home",
    components: { Poster,Search },
  data() {
    return {
      movies: null,
      canFetch: true,
      stop: false,
      isLoading: false,
      resetActive: false,
      params: {
        limit: 20,
        page: 2,
        quality: "",
        minimum_rating: "",
        query_term: "",
        genre: "",
        sort_by: "download_count",
        order_by: "desc", 
      },
    };
  },
  async asyncData({ $axios }) {
    const res = await $axios.$get("https://yts.mx/api/v2/list_movies.json",{params: { sort_by: "download_count"}});
    if (res.status === "ok") {
      let history = await $axios.$get(`/account/profile/me`)
      history = history.user.watched
      return { movies: res.data.movies, history};
      }
    else return { fetched: false };
  },
  mounted(){
    window.addEventListener("scroll", async (e) => {
      if(document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight)
        this.fetchNew()
    })
  },
  methods: {
    isWatched(theid){
      return this.history.find(id =>{
        if(id.imdb_code === theid){
          return true
        }
      })
    },
    imageError(i){
      this.movies.splice(i, 1)
    },
    async search(params){
        this.stop = false
        if(params.query_term.trim() || params.genre || params.sort_by)
        {
          this.params = {...params}
          if(this.params.genre === 'Select a genre')
            this.params.genre = ''
          this.movies = null
          this.fetchNew(false)
        }
    },
    reset()
    {
      this.resetActive = false
      this.stop = false
      const  originalParams = {
        limit: 20,
        page: 1,
        quality: "",
        minimum_rating: "",
        query_term: "",
        genre: "",
        sort_by: "download_count",
        order_by: "",
      }
      this.movies = []
      this.params =  originalParams
      this.fetchNew(false)
    },
    async fetchNew(append = true){
      if(this.params.query_term != "" || this.params.genre != "")
          this.resetActive = true
      if(!append)
        this.params.page = 1
      this.isLoading = true;
      this.canFetch = false
      if(this.params.query_term.length > 100)
        this.params.query_term = "tkharbi9a" 
      const res = await this.$axios.$get("https://yts.mx/api/v2/list_movies.json",  {params: this.params});
      if(res.status === "ok")
      {
        if(!res.data.movies)
          this.stop = true
        else{
          this.params.page++;
          const that = this
          if(append)
            this.movies = this.movies.concat(res.data.movies)
          else
            this.movies = res.data.movies
        }
      }
      else
        alert("something went wrong")
      this.isLoading = false;
      this.canFetch = true
  },
    },
};

</script>

<style lang="scss" scoped>
.mvs {
  display: flex;
  flex-flow: row wrap;
  flex-direction: flex-start;
  justify-content: center;
}
#loading{
  width: 100%;
  height: 200px;
  text-align: center;
}
#not-found-msg{
  line-height: 80px;
  font-size: 1.5rem;
}
.loader {
  margin: 80px auto;
  border: 4px solid #3fc58e;
  border-radius: 50%;
  border-top: 4px solid #27664c;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>