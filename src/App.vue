<style scoped>
  #appWrapper{
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
  }

  #appWrapper:before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    max-height: 400px;
    background: #61e997;
    display: none;
    /* opacity: 0; */
    /* transform: translateY(-70%); */
  }

  #app{
    width: 100vw;
    height: 100vh;
    max-width: 1400px;
    max-height: 980px;
    display: flex;
    background: #fff;
    border: 1px solid #ddd;
    box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.15);
  }

  body.logged-in #app,
  body.logged-in #appWrapper:before{
    transform: none;
    opacity: 1;
    transition: all 0.35s ease-out 0.25s;
  }

  #app #list,
  #app #detail {
    background: #fff;
    z-index: 1;
  }
</style>

<template>
  <div id="wrapper">
    <div id="loader" v-if="!user_fetched">
        <span></span>
        Loading...
    </div>

    <template v-if="user_fetched">
      <div id="appWrapper" v-if="!no_user">
          <div id="app">
              <song-list :userid="user.id" :username="user.name" :userimage="user.image"
                        @logout="logout" @viewsong="viewSong"/>
              <song-detail :song="cursong"></song-detail>
          </div>
      </div>
      
      <login-page :loggedin="!no_user"></login-page>
    </template>
    
  </div>
</template>

<script>
  import { auth } from "./firebase";
  import LoginPage from './components/LoginPage.vue'
  import SongList from './components/SongList.vue'
  import SongDetail from './components/SongDetail.vue'

  export default {
    data(){
      return {
        cursong: {},
        user: {},
        no_user: false,
        user_fetched: false
      }
    },

    mounted: function(){
      var self = this;
      auth.onAuthStateChanged((res_user) => {
        this.user_fetched = true;
        if (res_user) {
            var user = {
                id: res_user.uid,
                name: res_user.displayName,
                email: res_user.email,
                image: res_user.photoURL,
            }

            self.setUser(user);
            console.log("Signed In", user);
        }else{
          self.no_user = true;
          console.log("Signed Out: ");
        }
      });
    },
    
    methods: {
      setUser: function(user){
        this.user = user;
        this.no_user = false;
      },
      viewSong: function(song){
        this.cursong = song
      },
      logout: function(){
        auth.signOut();
        this.no_user = true;
      }
    },

    components : {
      'login-page' : LoginPage,
      'song-list' : SongList,
      'song-detail' : SongDetail
    },

    filters: {
      json: s => JSON.stringify(s)
    }
  }
</script>
