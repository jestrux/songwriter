<style scoped>
    #menubar, 
    #menubar > *{
        -webkit-app-region: drag !important;
    }

    #menubar{
        position: relative;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f2f2f2;
    }

    #menubar #buttons{
        display: flex;
        align-items: center;
        margin-left: 1em;
    }

    #menubar #buttons button{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        margin-right: 0.7em;
        padding: 0;
        border: none;
        outline: none;
        line-height: 0;
        z-index: 100;
    }

    #menubar #buttons button:nth-child(1){
        background: #e64848;
    }
    #menubar #buttons button:nth-child(2){
        background: #f5b92d;
    }
    
    #menubar #buttons button:nth-child(3){
        background: #2cce2a;
    }

    #menubar #buttons:not(:hover) button{
        background: #ddd;
    }

    #menubar #buttons button svg{
        width: 12px;
        height: 12px;
    }

    #menubar #buttons button:nth-child(3) svg{
        transform: rotate(25deg);
        transform-origin: center;
    }
    
    #menubar #buttons:not(:hover) button svg{
        opacity: 0;
    }

    #menubar #menuActions{
        display: flex;
        align-items: center;
        transition: opacity 0.25s ease-out 0.15s;
        z-index: 100;
    }

    #menubar.adding-song #menuActions{
        opacity: 0;
        pointer-events: none;
        transition: none;
    }

    #menubar #menuActions img{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
        background: #ccc;
        border: 1px solid #aaa;
        margin-right: 1em;
        z-index: 100;
    }

    #menubar #menuActions button{
        padding: 1em;
        border: 1px solid #ccc;
        background: transparent;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        border-radius: 3px;
        outline: none;
        line-height: 0;
        margin-right: 1.1em;
        color: #777;
        border-color: #bebebe;
        border-radius: 70px;
        padding: 1.2em 1.4em;
        font-size: 10px;
        z-index: 100;
    }
</style>

<template>
    <div id="menubar" :class="{'adding-song': addingsong}">
      <div id="buttons">
        <button @click="closeApp()">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        </button>
        <button @click="minimizeApp()">
            <svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        </button>
        <!-- <button @click="maximizeApp()">
            <svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/></svg>
        </button> -->
      </div>

      <div id="menuActions">
        <button @click="$emit('addSong')">NEW SONG</button>
        <img :src="userimage" alt="">
      </div>
    </div>
</template>

<script>
    // const { ipcRenderer } = require("electron");
    import { ipcRenderer } from 'electron'
    
    export default {
        name: 'MenuBar',
        props: {
            username: {
                type: String,
                default: "Mzikii"
            },
            userimage: String,
            addingsong: Boolean
        },
        methods: {
            closeApp: function(){
                console.log("Menubar action!", ipcRenderer);
                ipcRenderer.send('close')
            },
            minimizeApp: function(){
                console.log("Menubar action!", ipcRenderer);
                ipcRenderer.send('minimize')
            },
            maximizeApp: function(){
                console.log("Menubar action!", ipcRenderer);
                ipcRenderer.send('maximize')
            }
        }
    }
</script>
