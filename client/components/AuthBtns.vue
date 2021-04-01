<template>
  <div id="auth-cmp">
      <a :href=fbLink><div id="fb-btn" > <i class="fab fa-facebook-f"></i> &nbsp;Facebook</div></a>
      <a :href=e42Link><div id="ggl-btn"> &nbsp;<b>42</b> Newtork</div></a>
  </div>
</template>

<script>
const queryString = require('query-string');

export default {
    data(){
        return{
            fbLink: `https://www.facebook.com/v4.0/dialog/oauth?${this.fbParams()}`,
            e42Link:  `https://api.intra.42.fr/oauth/authorize?${this.e42Params()}`
        }
    },
    methods:{
        e42Params(){
            return queryString.stringify({
                client_id: process.env.id42,
                redirect_uri: `${process.env.clientUrl}/oauth/42`,
                response_type: 'code',
            });
        },
        fbParams(){
            return queryString.stringify({
                client_id: process.env.idFacebook,
                redirect_uri: `${process.env.clientUrl}/oauth/facebook`,
                scope: ['email'],
                response_type: 'code',
                auth_type: 'rerequest',
            });
        }
    }
}


</script>

<style>
#auth-cmp{
    /* background-color: greenyellow; */
    display: grid;
    grid-template-areas:
    'fbb gglb';
    grid-gap: 10px;
    padding: 10px 0px;
    width: 100%;
    max-width: 400px;
    margin: auto;
    padding-top: 15px;
}
#fb-btn,#ggl-btn{
    font-size: 1rem;
    padding: 7px 0px;
    border-radius: 3px;
    color: white;
    width: 100%;
    text-align: center;
}
#ggl-btn{
    background-color: #00babc;
    grid-area: fbb;
}

#fb-btn{
    background-color: #4267B2;
    grid-area: gglb;
}
</style>