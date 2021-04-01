<template>
<div>
    <div v-if="fetched" class="profile-card">
        <div id="prf-pic">
            <img v-if="user.profile" :src="user.profile">
            <img v-else src="@/assets/img/profile.png">
        </div>
        <div id="full-name">{{user.fname}} {{user.lname}} </div>
        <div id="username">@{{user.login}}</div>
        <span class="mytitle"><i class="fas fa-history"></i> &nbsp; Watch History</span>
        <div  class="watch-history scl">
            <thumbnail  v-for="(history, i) in user.watched" :key="i" :mov_id="history.imdb_code" :isme="user.isMe" type="history"/>
        </div>
        <span class="mytitle"><i class="fas fa-bookmark"></i> &nbsp; Wish List</span>
        <div class="wish-list scl">
            
            <thumbnail v-for="(wish, i) in user.wishList" :key="i" :mov_id="wish.imdb_code" :isme="user.isMe" type="wish"/>
            
        </div>
    </div>        
</div>
</template>

<script>
import Thumbnail from '../../components/Thumbnail.vue'
export default {
  components: { Thumbnail }, 
    layout: 'home',
    data(){
        return{
            fetched: false,
            user:{
                profile: null,
                fname: null,
                lname: null,
                login: null,
                watched: null,
                wishList: null,
            }
        }
    },
    async mounted(){
        const res = await this.$axios.$get(`/account/profile/me`)
        if(res.user)
        {
            this.fetched = true
            this.user = res.user
        }
        else
            this.$nuxt.error({ statusCode: 404})
    } 
}
</script>

<style>
.mytitle{
    color: #3fc58e;
}
.profile-card{
    color: #b0b3b8;
    padding: 40px 20px;
    text-align: center;
    background-color: #1e1e1e;
    width: 100%;
    margin: auto;
    max-width: 700px;
    border-radius: 12px;
}
#prf-pic{

    margin: auto;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
}
#full-name{
    margin-top: 20px;
    font-size: 1.5rem;
}
#username{
    margin-bottom: 30px;
}
.watch-history, .wish-list{
    padding: 5px 15px;
    width: 100%;
    height: 200px;
    background-color: #111111;
    margin-bottom: 20px;
    margin-top: 5px;
    border-radius: 12px;
    display: flex;
    /* flex-direction: row; */
    flex-flow: nowrap row;
    overflow: auto;
}
.scl::-webkit-scrollbar {
  height: 10px;
}
 
.scl::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
 
.scl::-webkit-scrollbar-thumb {
  background-color: #3fc58e;
  border-radius: 12px;
  width: 5px;
}
</style>