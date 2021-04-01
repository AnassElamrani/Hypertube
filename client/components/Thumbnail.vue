<template>
<div class="thumb-all" ref="thumbnail">
    <i v-if="isme"  class="del fas fa-minus-circle" @click="deleteThis"></i>
    <nuxt-link v-if="fetched" :to="'/movie/'+movie.id">
  <div class="mov-box">
      <img class="thumbnail-img" :src="movie.medium_cover_image" >
    <div id="poster-all">
      <i class="fas fa-play"></i>
        <div id="poster-top">
    </div>
     <div id="poster-bottom">
     </div>
    </div>
      
  </div>
</nuxt-link>
</div>
</template>

<script>
import Poster from './Poster.vue'
export default {
  components: { Poster },
  data(){
    return{
      fetched: true,
      movie: {
        id: null,
        medium_cover_image: null,
        title: null,
      }
    }
  },
  async fetch() {
      const res = await this.$axios.$get("https://yts.mx/api/v2/list_movies.json",{params: { query_term: this.mov_id}})
      if (res.status === "ok") {
        this.movie = res.data.movies[0]
      }
      else return { fetched: false };
  },
  props: ['mov_id', 'type', 'isme'],
  methods: {
    async deleteThis(){
      if(this.type === 'history')
        {
          this.$refs['thumbnail'].style.display = "none" 
          await this.$axios.$delete(`account/watched/${this.mov_id}`)
        }
      if(this.type === 'wish')
        {
          this.$refs['thumbnail'].style.display = "none" 
          await this.$axios.$delete(`account/wishList/${this.mov_id}`)
        }
    }
    
  }

}
</script>

<style scoped>

.thumb-all{
  position: relative;
}
.del{
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 3;
  color: #3fc58e;
}
.del:hover{
  cursor: pointer;
}

.mov-box{
    margin: 10px 10px;
    width: 106px;
    height: 90%;
    background-color: #1e1e1e;
    border-radius: 5px;
    border: solid 1px #3a3b3c;
    position: relative;
    overflow: hidden;
}

#poster-all{
    display: none;
    width: 100%;
    height: 100%;
}
.mov-box:hover{
    background-color: #1e1e1e5d;
    cursor: pointer;
}
.mov-box:hover #poster-all{
    display: block;
}

.thumbnail-img{
  height: 100%;
}
.fa-play{
    position: absolute;
    transform: translate(60%,-50%);
    top: 50%;
    right: 50%;
    color: white;
    font-size: 25px;
    z-index: 3;
}
#poster-top{
    font-weight: 400;
    padding: 4px 10px;
    width: 100%;
    height: 60%;
    position: absolute;
    top: 0px;
    background: linear-gradient(black,rgb(0,0,0,.7), rgb(0,0,0,.5), transparent);
}

#poster-bottom{
    /* display: none; */
    text-align: center;
    width: 100%;
    height: 60%;
    position: absolute;
    bottom: 0px;
    background: linear-gradient(transparent,rgb(0,0,0,.5), rgb(0,0,0,.7), black);
}
#mov-title{
    color: white;
    max-width: 220px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: 500;
    position: absolute;
    transform: translate(50%, -50%);
    bottom: 0px;
    right: 50%;
}
/* .mov-box:hover + #poster-bottom{
    display: block;
} */



</style>