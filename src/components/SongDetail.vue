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
        z-index: 1;
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
    }

    #audios{
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      flex-basis: 300px;
      border-left: 1px solid #eee;
      height: 100vh;
    }
    
    #title{
      padding: 0 1em;
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
        <h2>{{song.title}}</h2>

        <textarea-autosize
          id="songEdit"
          v-model="lyrics"
          placeholder="Enter lyrics here...."
          @keyup="saveSong"/>
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
  import { db } from "../firebase";
  import _ from 'lodash'

  import AudioUploader from "./AudioUploader";
  import AudioRecorder from "./AudioRecorder";

  var audiosRef;

  export default {
    name: 'SongDetail',
    props: {
      song: Object
    },

    data: function() {
      return{
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
            this.cursrc = ""; //clean out audio player when new song comes in
            this.audios = [];
          }
          
          if(!newsong.path)
            return;

          this.fetchAudios();
        }
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
      addAudio: function(){

      },
      fetchAudios: function(url){
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
                resolve([]);
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
      'audio-uploader': AudioUploader,
      'audio-recorder': AudioRecorder
    }
  }
</script>