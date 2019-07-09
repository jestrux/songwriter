<style scoped>
    #detail{
        flex: 1;
        flex-shrink: 0;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.05em;
        line-height: 1.5;
        height: 100v;
        overflow: hidden;
        background: #fff;
        z-index: 1;
        position: relative;
    }

    #detail.no-song:before {
        content: "Click a song to view it here.";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1em;
        font-family: Tahoma, sans-serif;
        background: #f8f8f8;
        color: #ccc;
        font-size: 1.5em;
        letter-spacing: 1px;
        z-index: 1;
    }

    #wrapper{
      display: flex;
    }

    #lyrics{
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      height: 100vh;
    }

    #songDetailTitle{
      display: flex;
      align-items: center;
      min-height: 63px;
      border-bottom: 1px solid #ddd;
      padding: .5em 2em;
      z-index: 1;
      background: #fff;
      -webkit-app-region: drag !important;
    }

    #detail.no-song #songDetailTitle{
      display: none;
    }

    #songDetailTitle button{
      border: none;
      background: transparent;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1
    }

    #songDetailTitle button:active{
      background: #eee;
    }

    #songDetailTitle button svg{
      height: 20px;
      width: 20px;
    }

    #songEdit{
      width: 100%;
      resize: none;
      font-family: 'Courier New', Courier, monospace;
      font-size: 1.05em;
      line-height: 1.5;
      border: none;
      outline: none;
      padding: 1em 2em;
      flex: 1;
      /* min-height: calc(100vh - 90px); */
      overflow: auto;
    }

    #audios{
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      flex-basis: 300px;
      border-left: 1px solid #ddd;
      height: 100vh;
    }
    
    #title{
      padding: 0 1em;
      display: flex;
      align-items: center;
      height: 63px;
      border-bottom: 1px solid #ddd;
      -webkit-app-region: drag !important;
    }

    h2{
      outline: none;
      margin: 0;
      padding: 0;
      flex: 1;
      max-width: calc(100% - 45px);
    }

    h3{
      flex: 1;
      margin: 0;
      padding: 0;  
    }

    #title button{
      padding: 1em;
      border: 1px solid #ddd;
      background: transparent;
      border-radius: 3px;
      outline: none;
      line-height: 0;
    }
    
    #audioListWrapper{
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    #audioList{
      flex: 1;
      overflow: auto;
      border-top: 1px solid #eee;
    }

    .audio{
      padding: 1em;
      border-bottom: 1px solid #f3f3f3;
      cursor: default;
    }
    
    .audio.current{
      background: #f8f8f8;
    }
</style>

<template>
  <div id="detail" :class="{'no-song': !song.path}">
    <div id="wrapper">
      <div id="lyrics">
        <div id="songDetailTitle">
          <h2 v-contenteditable:title="editTitle"
            @keyup="saveSong"></h2>

          <button @click="toggleFavorite()">
            <!-- {{ song.liked }} -->
            <svg v-if="!song.liked" viewBox="0 0 24 24"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
            <svg v-else viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>

        <div id="songEdit" 
          v-contenteditable:lyrics="editing"
          @keyup="saveSong" />

        <!-- <textarea-autosize
          id="songEdit"
          v-model="lyrics"
          placeholder="Enter lyrics here...."
          @keyup.native="saveSong"/> -->
      </div>

      <div id="audios">
        <div id="title">
          <h3>Audios</h3>
          <button @click="recording = true" v-if="!recording">RECORD AUDIO</button>
        </div>

        <div id="audioListWrapper">

          <audio-uploader v-if="!recording" @newaudio="pushAudio"/>
          <audio-recorder v-if="recording" @cancel="recording = false" @newaudio="pushAudio"/>

          <audio :src="cursrc" autoplay controls v-if="audios && audios.length"></audio>

          <div id="audioList">
            <div class="audio" 
              v-for="(audio, index) in audios" :key="index"
              :class="{'current' : cursrc == audio.url}"
              @click="cursrc = audio.url">
              {{audio.name}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { db } from "../firebase";
  import _ from 'lodash'
  import contenteditableDirective from 'vue-contenteditable-directive'
  
  Vue.use(contenteditableDirective)

  import AudioUploader from "./AudioUploader";
  import AudioRecorder from "./AudioRecorder";

  var audiosRef;

  // TODO: Fix Ctrl V error

  export default {
    name: 'SongDetail',
    props: {
      song: Object
    },

    data: function() {
      return{
          editing: true,
          editTitle: true,
          hovered: false,
          audios: [],
          cursrc: "",
          recording: false
      }
    },

    watch: {
      song: {
        immediate: true,
        deep: true,
        handler: function(newsong, oldsong){
          if(!newsong || !oldsong || (newsong.path != oldsong.path)){
            console.log(newsong);
            this.cursrc = ""; //clean out audio player when new song comes in
            this.audios = [];

            this.title = newsong && newsong.title ? newsong.title : "";
            this.lyrics = newsong && newsong.description ? newsong.description : "";

            if(newsong && newsong.path){
              this.fetchAudios();
            }
          }
        }
      }
    },

    computed:{
      title: {
        get: function(){
          return this.song && this.song.title ? this.song.title : "";
        },
        set: function(title){
          this.song.title = title;
        }
      },
      song_html: function(){
        return this.song && this.song.description ? this.song.description.replace(/\n/g, "<br />") : "";
      },
      lyrics: {
        get: function(){
          return this.song && this.song.description ? this.song.description : "";
        },
        set: function(lyrics){
          this.song.description = lyrics;
        }
      }
    },

    methods: {
      addAudio: function(){

      },
      fetchAudios: function(){
        var self = this;
        audiosRef = db.collection(this.song.path + "/audios");

        audiosRef.orderBy("last_modified", "desc").get()
            .then(function (audios) {
                self.audios = [];

                if (audios.length < 1)
                    return;

                audios.forEach(function (doc) {
                    var audio = doc.data();
                    audio.id = doc.ref.id;
                    audio.path = doc.ref.path;
                    self.audios.push(audio);

                    console.log(audio);
                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                // reject(error);
                // resolve([]);
            });
      },
      pushAudio: function(name, url){
        this.recording = false;
        let self = this;
        let audio = {name: name, url: url, last_modified: new Date()};
        audiosRef.add(audio)
          .then(function(docRef) {
            console.log("Audio saved!");
            audio.path = docRef.path;
            audio.id = docRef.id;

            self.audios.unshift(audio)
          })
          .catch(function(error) {
            console.error("Error saving audio", error);
          });
      },
      async toggleFavorite(){
        try {
          const liked = !this.song.liked;
          await db.doc(this.song.path).set({...this.song, liked});
          this.$set(this.song, 'liked', liked);
        } catch (error) {
          console.error("Error when liking song: ", error); 
        }
      },
      saveSong: _.debounce(
        function (e) {
          this.song.last_modified = new Date().getTime();
          this.song.title = this.title;
          this.song.description = this.lyrics;
          console.log("Saving song...", e);
          db.doc(this.song.path).set(this.song)
            .then(function() {
              console.log("Song saved!");
            })
            .catch(function(error) {
              console.error("Error saving document: ", error);
            });
        }, 2000)
    },
    components: {
      'audio-uploader': AudioUploader,
      'audio-recorder': AudioRecorder
    }
  }
</script>