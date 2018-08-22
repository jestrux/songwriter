<style scoped>
    #audioDrop{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 150px;
      background: #f8f8f8;
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
</style>

<template>
    <div id="audioDrop" :class="{'full' : !audios}">
      Drop your audio here to add to song audios.
    </div>
</template>

<script>
  import {em, Init} from "../filedrag";

  export default {
    props: {
      audios:{
        default: null
      }
    },
    mounted: function() {
      Init(this.$el);

      em.once('loaded', function(len) {
        console.log(`${len} files loaded!!!`);
      });
    },
    methods: {
      processAudio: function(){
        console.log("Processing audio...");
      }
    }
  }
</script>