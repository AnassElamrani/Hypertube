<template>
  <div>
    <div class="player-all">
      <div id="mov-ttl">
        {{movie.title}} &nbsp;&nbsp;&nbsp; {{movie.rating}}
        <i class="fas fa-star"></i>&nbsp;&nbsp;&nbsp;
        <i v-if="wished" @click="wishm" class="fas fa-bookmark"></i>
        <i v-else @click="wishm" class="far fa-bookmark"></i>
      </div>
      <div id="player">
        <video id="video-player" controls crossorigin="anonymous">
          <source
            :src="`${$config.baseURL}/movies/trr/${movie.torrents[0].hash}/${movie.imdb_code}`"
            type="video/mp4"
          />
          <track :src="`${$config.baseURL}/${movie.imdb_code}-en.vtt`" />
          <track :src="`${$config.baseURL}/${movie.imdb_code}-fr.vtt`" />
        </video>
      </div>
      <div class="ttl">Porduction Year : {{movie.year}}</div>
      <div class="ttl">Running Time : {{movie.runtime}} min</div>

      <div class="ttl">Description :</div>
      <div class="info">{{movie.description_full}}</div>
      <div class="ttl">Cast :</div>
      <div class="cast">
        <div class="actors" v-for="(actor, i) in movie.cast" :key="i">
          <div class="cast-img">
            <img v-if="actor.url_small_image" class="in-img" :src="actor.url_small_image" />
            <img v-else class="sec-img" src="@/assets/img/profile.png" />
          </div>
          <br />
          <span class="actor-name">{{actor.name}}</span>
        </div>
      </div>
    </div>
    <div id="cmnt-ttl">Comments</div>
    <div class="comments">
      <b-field>
        <div class="comment-cnt">
          <b-field>
            <b-input
              @keyup.native.enter="sendComment"
              v-model="comment"
              name="subject"
              expanded
              placeholder="..."
            ></b-input>
            <b-button @click="sendComment" label="Comment" type="is-primary" />
          </b-field>
          <div class="comments-list">
            <div v-for="(cmt, i) in comments" :key="i" class="comment">
              <div class="prf-cnt">
                <img v-if="cmt.user.profile" :src="`${$config.baseURL}/${cmt.user.profile}`" />
                <img v-else src="@/assets/img/profile.png" />
              </div>
              <div class="the-cmnt">
                <nuxt-link :to="'/profile/'+cmt.user.login">
                  <span class="nm">{{cmt.user.fname}} {{cmt.user.lname}}</span>
                </nuxt-link>
                <br />
                <span>{{cmt.comment}}</span>
              </div>
            </div>
          </div>
        </div>
      </b-field>
    </div>
  </div>
</template>

<script>
export default {
    layout: 'home',
    data(){
        return {
            comments:{
                comment: null,
                user: {
                    fname: null,
                    lname: null,
                    login: null,
                    profile: null
                }
            },
            comment: null,
            user: {
                fname: null,
                lname: null,
                login: null,
                profile: null
            },
        }
    },
    head(){
        return{
            title: this.movie.title+' - Hypertube',
        }
    },
    async mounted(){
        // console.log(this.me)
        // const res = await this.$axios.$get('/account/profile')
        // this.user = res.user
        // console.log(this.user)
        // console.log('8888888', this.movie);
        // Modify updatedAt;
        await this.$axios.$post('movies/updateLastWatch/', {'imdbCode': this.movie.imdb_code}).then((res) => {
          console.log('res', res);
        })
    },
    async asyncData({$nuxt ,$axios, params, redirect}){
        const res = await $axios.$get('https://yts.mx/api/v2/movie_details.json',{ params: {movie_id: params.movid, with_cast: true}})
        if(res.status === 'ok')
        {
            res.data.movie.torrents = res.data.movie.torrents.filter((el) => {
                if(el.quality === '720p' || el.quality === '1080p')
                    return true
            })
            const details = await $axios.$get(`/movies/details/${res.data.movie.imdb_code}`)
            // console.log(details.isWishList)
            const user = await $axios.$get(`/account/me`)
            return {movie:res.data.movie, wished: details.isWishList , comments: (details.movie)?details.movie.comments.reverse() : null, me: user}
        }
        else
        {
            redirect('/not-found')
        }
    },
    methods:{
        sendComment()
        {
            const comment = this.comment.trim()
            if(comment)
            {
                // alert(this.movie.imdb_code)
                this.$axios.$post('/movies/comment',{imdb_code: this.movie.imdb_code, comment})
                if(this.comments)
                    {
                        if(this.me.user.profile == "undefined")
                            this.me.user.profile = null
                        this.comments.unshift({comment, user: this.me.user})
                    }
                else
                this.comments = Array({comment, user: this.me.user})
                this.comment = ""
            }
            else
                this.comment = ""
        },
        async wishm()
        {
            if(!this.wished)
                await this.$axios.$post(`account/addWishList`,{imdb_code: this.movie.imdb_code})
            if(this.wished)
                await this.$axios.$delete(`account/wishList/${this.movie.imdb_code}`)
            this.wished = !this.wished       
        }
    }
}
</script>

<style scoped>
.player-all {
  padding: 20px 5px;
  background-color: #1e1e1e;
  text-align: center;
}
#mov-ttl {
  color: #3fc58e;
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 30px;
}
#player {
  width: 100%;
  max-width: 800px;
  margin: auto;
  /* background-color: red; */
}
#video-player {
  width: 100%;
  border: solid 1px #111111;
}
.info,
.ttl,
.cast,
.comment-cnt {
  width: 100%;
  padding: 0 20px;
  max-width: 800px;
  margin: auto;
  text-align: left;
  color: #b0b3b8;
}
.ttl {
  font-size: 1.2rem;
  margin-top: 20px;
  margin-bottom: 10px;
}
.cast {
  display: flex;
  flex-flow: wrap row;
}
.actors {
  overflow: hidden;
  width: 120px;
  /* height: 80px; */
  /* background-color: red; */
}
.cast-img {
  overflow: hidden;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.in-img {
  width: 100%;
  height: 100%;
}

.fa-star {
  color: goldenrod;
  font-size: 1.2rem;
}
.comments {
  padding: 20px 5px;
  background-color: #1e1e1e;
  text-align: center;
}
#cmnt-ttl {
  margin-top: 30px;
  color: #3fc58e;
  font-size: 1.5rem;
}
textarea {
  background-color: red;
}
textarea.form-control {
  color: #63aeeb;
}
.comments-list {
  margin-top: 40px;
  padding: 30px 20px;
  /* background-color: red; */
}
.comment {
  margin-bottom: 20px;
  background-color: #3a3b3c;
  padding: 10px 20px;
  border-radius: 12px;
  display: flex;
  flex-flow: row nowrap;
}
.nm {
  font-size: 1.2rem;
  color: #3fc58e;
}
.cmnt-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
}
.prf-cnt {
  width: 60px;
  min-width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 50%;
  overflow: hidden;
}
.the-cmnt {
  word-break: break-all;
}
.fa-bookmark:hover {
  cursor: pointer;
}
</style>