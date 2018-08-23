<style scoped>
    #audioRecorder{
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 150px;
      background: #e8e8e8;
      border-bottom: 1px solid #eee;
      padding: 1em;
      text-align: center;
      font-size: 0.9em;
      border: 3px dashed transparent;
    }

    #audioRecorder.hover{
      border-color: #ccc;
      margin: 2px;
    }

    #loader{
      background: rgba(255, 255, 255, 0.97);
      color: #854dfe;
    }

    button{
      outline: none;
      border: none;
      background: #fff;
    }

    button:active{
      transform: scale(0.95);
    }

    #recorder{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      padding: 0;
      border-radius: 50%;
    }

    #audioRecorder.recording #recorder{
      width: 45px;
      height: 45px;
      background: #D75A4A;
    }

    button:not(#recorder){
      padding: 1.2em 1em;
      border: 1px solid #ddd;
      border-radius: 3px;
      outline: none;
      line-height: 0;
    }

    p{
      margin: 0.5em 0;
    }

    svg{
      width: 40px;
      height: 40px;
    }

    #recordSvg{
      width: 24px !important;
      height: 24px !important;
    }

    #audioWrapper{
      margin: 0.5em 0;
    }

    canvas{
      background: #000;
      height: 60px;
      width: 100%;
      margin-bottom: 0.8em;
    }

    #audioRecorder:not(.recording) canvas{
      display: none;
    }
</style>

<template>
    <div id="audioRecorder" :class="{'recording': recording}">
      <canvas></canvas>
      <div id="audioWrapper" v-if="!recording && src">
        <audio :src="src" autoplay controls></audio>
      </div>

      <div style="display: flex; align-items: center">
        <button v-if="!src" id="recorder" @click="recording = !recording">
          <svg id="recordSvg" v-if="!recording" x="0px" y="0px" viewBox="0 0 58 58" style="enable-background:new 0 0 58 58;" xml:space="preserve" width="512px" height="512px"><g><path d="M44,28c-0.552,0-1,0.447-1,1v6c0,7.72-6.28,14-14,14s-14-6.28-14-14v-6c0-0.553-0.448-1-1-1s-1,0.447-1,1v6   c0,8.485,6.644,15.429,15,15.949V56h-5c-0.552,0-1,0.447-1,1s0.448,1,1,1h12c0.552,0,1-0.447,1-1s-0.448-1-1-1h-5v-5.051   c8.356-0.52,15-7.465,15-15.949v-6C45,28.447,44.552,28,44,28z" fill="#D80027"/><path d="M29,46c6.065,0,11-4.935,11-11V11c0-6.065-4.935-11-11-11S18,4.935,18,11v24C18,41.065,22.935,46,29,46z" fill="#D80027"/></g></svg>
          <svg v-else x="0px" y="0px" viewBox="0 0 58 58" style="enable-background:new 0 0 58 58;" xml:space="preserve"><circle style="fill:#D75A4A;" cx="29" cy="29" r="29"/><g><rect x="16" y="16" style="fill:#FFFFFF;" width="26" height="26"/><path style="fill:#FFFFFF;" d="M43,43H15V15h28V43z M17,41h24V17H17V41z"/></g></svg>
        </button>
        
        &emsp;

        <button v-if="src" @click="uploadAudio">
          Save Ssong
        </button>

        &emsp;

        <button @click="cancel">
          {{src ? 'Discard' : 'Cancel'}}
        </button>
      </div>
      
      <p v-if="!recording && !src">
        Click button to record.
      </p>

      <div id="loader" v-if="uploading">
        <span></span>
        Uploading... {{progress}}%
      </div>
    </div>
</template>

<script>
  import {storage, filesRef} from "../firebase";
  import {Init, em, stop, record} from "../recorder";
  
  var self;

  export default {
    data: function() {
      return{
          uploading: false,
          progress: 0,
          recording: false,
          src: null,
          blob: null
      }
    },
    mounted: function() {
      self = this;
      Init(this.$el);

      em.once('recorded', function(blob) {
        self.blob = blob;
        self.src = URL.createObjectURL(blob);
      });
    },
    beforeDestroy: function(){
      this.src = "";
    },
    watch : {
      recording : function(recording){
        if(recording)
          record();
        else
          stop();
      }
    },
    methods: {
      cancel: function(){
        this.src = null;
        this.blob = null;
        this.recording = false;
        this.$emit("cancel");
      },
      uploadAudio: function(){
        const name = "Rec" + (Math.random() * 1e32).toString(36);
        let uploadTask = filesRef(name).put(this.blob);
        this.uploading = true;
        this.src = null;
        this.blob = null;

        uploadTask.on('state_changed', function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          self.progress = parseInt(progress);
        }, function(error) {
          console.log("Upload failed, ", error);
          self.uploading = false;
        }, function() {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            self.uploading = false;
            console.log('File available at', downloadURL);
            self.$emit("newaudio", name, downloadURL);
          });
        });
      }
    }
  }
</script>