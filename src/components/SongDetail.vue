<style scoped>
    #detail{
        flex: 1;
        flex-shrink: 0;
        padding: 0 3em;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.05em;
        line-height: 1.5;
        overflow: auto;
        background: #fff;
        z-index: 1;
        position: relative;
    }

    #detail:empty{
        background: #f8f8f8;
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
        color: #ccc;
        font-size: 1.5em;
        letter-spacing: 1px;
    }

    textarea{
      width: 100%;
      resize: none;
      font-family: 'Courier New', Courier, monospace;
      font-size: 1.05em;
      line-height: 1.5;
      border: none;
      outline: none;
      min-height: 100vh;
    }
</style>

<template>
  <div id="detail" :class="{'no-song': !song.path}">
    <h2>{{song.title}}</h2>
    
    <!-- <div v-html="song_html"></div> -->

    <textarea
      id="songEdit"
      v-model="lyrics"
      placeholder="Enter lyrics here...."
      v-if="song.path"
      rows="1"
      @keyup.alt.86="saveSong"
      @keyup.meta.86="saveSong"/>
  </div>
</template>

<script>
  import { db } from "../firebase";
  import autosize from 'autosize'
  import _ from 'lodash'
  export default {
    name: 'SongDetail',
    props: {
      song: Object
    },
    mounted: function() {
      autosize(this.$el.querySelector("#songEdit"));
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
      }
    },
    methods: {
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
        }, 10 //2000
      )
    }
  }
</script>