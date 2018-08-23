<style scoped>
    #audioDrop{
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 150px;
      background: #e8e8e8;
      border-bottom: 1px solid #eee;
      padding: 1em;
      text-align: center;
      font-size: 0.9em;
      border: 3px dashed transparent;
    }

    #audioDrop.hover{
      border-color: #ccc;
      margin: 2px;
    }

    #loader{
      background: rgba(255, 255, 255, 0.97);
      color: #854dfe;
    }
</style>

<template>
    <div id="audioDrop">
      Drop your audio here to add to song audios.

      <div id="loader" v-if="uploading">
        <span></span>
        Uploading... {{progress}}%
      </div>
    </div>
</template>

<script>
  import {em, Init} from "../filedrag";
  import {storage, filesRef} from "../firebase";

  // TODO: Fix second upload error

  var self;
  
  export default {
    data: function() {
      return{
          uploading: false,
          progress: 0
      }
    },
    mounted: function() {
      self = this;
      Init(this.$el);

      em.once('loaded', function(file, src) {
        self.uploadAudio(file, src);
      });
    },
    methods: {
      uploadAudio: function(file, src){
        var newMetadata = {
          cacheControl: 'public,max-age=5184000'
        };

        let uploadTask = filesRef(file.name).put(file, newMetadata);
        self.uploading = true;

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
            self.$emit("newaudio", file.name.split(".").shift(), downloadURL);
          });
        });
      }
    }
  }
</script>