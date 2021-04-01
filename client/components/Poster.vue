<template>
<nuxt-link :to="'/movie/'+movie.id">
  <div class="mov-box">
      <img class="thumbnail-img" :src="movie.medium_cover_image" @error="$emit('imageLoadError', movie.id)">
    <div id="poster-all">
      <i class="fas fa-play"></i>
        <div id="poster-top">
        {{movie.year}}<span style="float: right;">{{movie.rating?movie.rating:""}} &nbsp;<i class="fas fa-star"></i></span>
    </div>
     <div id="poster-bottom">

         <div id="mov-title">
             {{movie.title}}
             <br>
         </div>
         <div v-if="watched" class="watched"></div>
     </div>
    </div>
      
  </div>
</nuxt-link>
</template>

<script>
export default {
    props : ['movie', 'watched'],

}
</script>

<style scoped>
.mov-box{
    margin: 10px 10px;
    width: 234px;
    height: 350px;
    background-color: #1e1e1e;
    border-radius: 5px;
    border: solid 1px #3a3b3c;
    position: relative;
    overflow: hidden;
}
.watched{
    position: absolute;
    width: 100%;
    height: 5px;
    background-color: green;
    bottom: 0px;
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
    position: absolute;
}
.fa-play{
    position: absolute;
    transform: translate(60%,-50%);
    top: 50%;
    right: 50%;
    color: white;
    font-size: 50px;
    z-index: 3;
}
#poster-top{
    /* display: none; */
    color: white;
    font-weight: 400;
    padding: 4px 10px;
    width: 100%;
    height: 60%;
    position: absolute;
    top: 0px;
    background: linear-gradient(black,rgb(0,0,0,.7), rgb(0,0,0,.5), transparent);
}
.fa-star{
    font-size: 14px;
    color: gold;
    margin-bottom: 2px;
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
    font-weight: 600;
    position: absolute;
    transform: translate(50%, -50%);
    bottom: 0px;
    right: 50%;
}
.mov-box:hover + #poster-bottom{
    display: block;
}
</style>