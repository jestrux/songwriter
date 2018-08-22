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
        content: "Click a song to show it here.";
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
    }

    #wrapper{
      display: flex;
    }

    #lyrics{
      flex: 1;
      height: 100vh;
      overflow: auto;
      padding: 0 3em;
    }

    textarea{
      width: 100%;
      resize: none;
      font-family: 'Courier New', Courier, monospace;
      font-size: 1.05em;
      line-height: 1.5;
      border: none;
      outline: none;
      /* overflow: hidden; */
      /* min-height: 100vh; */
      /* max-height: 300px; */
    }

    #audios{
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      flex-basis: 300px;
      border-left: 1px solid #eee;
      height: 100vh;
    }

    #title, .audio{
      padding: 0 1em;
    }
    
    #title{
      display: flex;
      align-items: center;
      height: 63px;
      border-bottom: 1px solid #eee;
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
</style>

<template>
  <div id="detail" :class="{'no-song': !song.path}">
    <div id="wrapper">
      <div id="lyrics">
        <h2>{{song.title}}</h2>

        <textarea-autosize
          id="songEdit"
          v-model="lyrics"
          placeholder="Enter lyrics here...."
          @keyup.alt.86="saveSong"
          @keyup.meta.86="saveSong"/>
      </div>

      <div id="audios">
        <div id="title">
          <h3>Audios</h3>
          <button @click="addAudio">ADD AUDIO</button>
        </div>

        <div id="audioListWrapper">

          <audio-uploader></audio-uploader>

          <div id="audioList">
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { db } from "../firebase";
  import _ from 'lodash'

  import AudioUploader from "./AudioUploader";

  export default {
    name: 'SongDetail',
    props: {
      song: Object
    },

    data: function() {
      return{
          hovered: false
      }
    },

    watch: {
      lyrics: function (lyrics, old_lyrics) {
        if(!lyrics && !old_lyrics){
          return;
        }

        this.saveSong();
      }
    },

    computed:{
      song_html: function(){
        return this.song && this.song.description ? this.song.description.replace(/\n/g, "<br />") : "";
      },
      lyrics: {
        get: function(){
          return this.song && this.song.description ? this.song.description : null;
        },
        set: function(lyrics){
          this.song.description = lyrics;
        }
      },
      audios:{
        get: function(){
          return this.song && this.song.audios ? this.song.audios : null;
        },
        set: function(lyrics){
          // this.song.audios = audios;
        }
      }
    },
    methods: {
      addAudio: function(){

      },
      saveSong: _.debounce(
        function () {
          this.song.last_modified = new Date();
          console.log("Saving song...");
          db.doc(this.song.path).set(this.song)
          .then(function() {
              console.log("Song saved!");
          })
          .catch(function(error) {
              console.error("Error saving document: ", error);
          });
        }, 2000
      )
    },
    components: {
      'audio-uploader': AudioUploader
    }
  }
</script>