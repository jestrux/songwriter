<style scoped>
    #list{
        width: 350px;
        border-right: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        background: #fff;
        z-index: 1;
    }
    
    #title{
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-size: 1.1em;
        padding: 0.7em 0.8em;
        border-bottom: 1px solid #ddd;
        display: flex;
        line-height: 0;
        align-items: center;
        flex-shrink: 0;
        position: relative;
    }
    
    #title button{
        padding: 1em;
        border: 1px solid #ddd;
        background: transparent;
        border-radius: 3px;
        outline: none;
        line-height: 0;
    }
    
    #title img{
        float: left;
        flex-shrink: 0;
        margin-right: 0.5em;
        border-radius: 50%;
        overflow: hidden;
        background: #ddd;
    }

    #title div{
        position: relative;
        line-height: 40px;
        position: relative;
        flex:1;
        max-width: calc(100% - 68px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    #songs{
        position: relative;
        flex: 1;
        overflow: auto;
    }

    #songs.no-songs:before {
        content: attr(empty);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 1em;
        text-transform: uppercase;
    }

    #songs > input{
        padding: 1em 1.5em;
        width: 100%;
        border: none;
        background: #f8f8f8;
        border-bottom: 1px solid #eee;
        font-size: 1em;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-weight: 500;
    }

    #songs > input.blur{
        pointer-events: none;
        background: #ddd;
    }

    #songs > input::placeholder{
        color: #bbb;
        font-weight: 100;
    }

    article{
        cursor: default;
        padding: 1em 1.5em;
        border-bottom: 1px solid #eee;
    }

    article.unsaved{
        opacity: 0.5;
    }

    article:hover{
        background: #f5f5f5;
    }

    article.active{
        background: #e9e9e9;
    }

    article h3{
        margin: 0;
        margin-bottom: 0.1em;
        font-size: 1em;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-weight: 400;
    }

    article p{
        margin-top: 0;
        margin-bottom: 0;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #555;
        font-size: 1em;
        font-family: 'Courier New', Courier, monospace;
    }
</style>

<template>
  <div id="list">
    <div id="title">
        <div class="flex">
            <img id="userimage" :src="userimage" alt="" width="40px" height="40px">{{username}}
        </div>
        <button @click="logout">LOGOUT</button>
    </div>

    <div id="songs" :class="{'no-songs': !songs || !songs.length}" :empty="empty_message">
        <input type="text" placeholder="Enter title then enter to add song"
            @keyup.enter="addSong" v-model="newsong">
        <article v-for="(song, index) in songs" 
            :class="{'active': curidx === index, 'unsaved': !song.path}"
            :key="index" @click="viewSong(index)">
            <h3>{{song.title}}</h3>
            <p>
                <template v-if="song.description">
                    {{song.description}}
                </template>

                <span v-else style="opacity: 0.7">
                    This song has no lyrics.
                </span>
            </p>
        </article>`
    </div>
  </div>
</template>

<script>
    import Vue from 'vue';
    import { db, auth } from "../firebase";
    var songsRef = null;

    export default {
        name: 'SongList',
        props: {
            userid: [String, Number],
            username: {
                type: String,
                default: "Mzikii"
            },
            userimage: String
        },
        data: function() {
            return{
                songs: [],
                newsong: "",
                curidx: -1,
                empty_message: "Loading songs...."
            }
        },
        watch: {
            userid: {
                handler: function (userid) {
                    this.fetchSongs(userid);
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            fetchSongs: function(user_id){
                let self = this;
                console.log("Fetching songs!");
                songsRef = db.collection("songs/" + user_id + "/list");

                songsRef.orderBy("last_modified", "desc").get()
                    .then(function (songs) {
                        self.songs = [];
                        self.empty_message = "No songs found.";

                        if (songs.length < 1)
                            return;

                        songs.forEach(function (doc) {
                            var song = doc.data();
                            song.id = doc.ref.id;
                            song.path = doc.ref.path;
                            self.songs.push(song);
                        });
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                        // reject(error);
                        resolve([]);
                    });

                var unsubscribeNewSongs = songsRef.onSnapshot(function(){});    
                unsubscribeNewSongs();
            },
            addSong: function(){
                var self = this;
                var song = {
                    title: this.newsong,
                    description: "",
                    last_modified : new Date()
                }
                this.songs.unshift(song);

                this.newsong = "";
                this.$el.querySelector("input").blur();
                this.$el.querySelector("input").classList.add("blur");

                songsRef.add(song)
                    .then((docRef) => {
                        song.path = docRef.path;
                        song.id = docRef.id;

                        self.viewSong(0, song);

                        self.$el.querySelector("input").classList.remove("blur");
                        console.log("Document written with path: ", docRef.path);
                    })
                    .catch(function(error) {
                        self.songs.shift();
                        self.newsong = song.title;
                        self.$el.querySelector("input").classList.remove("blur");
                        self.$el.querySelector("input").focus();

                        console.error("Error adding document: ", error);
                    });
            },
            viewSong: function(idx, song){
                if(song){
                    Vue.set(this.songs, 0, song);
                }
                var song = this.songs[idx];
                this.curidx = idx;
                this.$emit("viewsong", song);
            },
            logout: function(){
                this.$emit("logout");

                // document.getElementById("username").innerText = "";
                // document.getElementById("userimage").src = "";
                // document.body.classList.remove("logged-in");
                // document.body.classList.add("loading");
            }
        }
    }
</script>
