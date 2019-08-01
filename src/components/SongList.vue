<style scoped>
    #list{
        position: relative;
        width: 380px;
        border-right: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        background: #fff;
        z-index: 1;
    }
    
    #addSong{
        position: absolute;
        top: 45px;
        left: 0;
        width: 100%;
        height: 51px;
        z-index: 10;
    }

    #list:not(.adding-song) #addSong{
        pointer-events: none;
    }
    
    #addSong::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 51px;
        background: #f2f2f2;

        transition: transform 0.25s ease-out;
    }

    #list:not(.adding-song) #addSong::before{
        transform: translateY(-100%);
        pointer-events: none;
    }

    #addSong > input{
        position: relative;
        padding: 1em 1.5em;
        border: none;
        font-size: 1em;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-weight: 500;
        outline: none;
        width: 100%;
        background: transparent;
        z-index: 1;
    }

    #addSong button{
        position: absolute;
        top: -33px;
        right: 1.1em;
        z-index: 100;
        padding: 1em;
        border: 1px solid #cfcfcf;
        background: #f3f3f3;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        border-radius: 3px;
        outline: none;
        line-height: 0;
        color: #555;
        border-color: none;
        padding: 1.2em 1em;
        font-size: 10px;
    }

    #list.adding-song #addSong input,
    #list.adding-song #addSong button{
        transition: opacity 0.25s ease-out 0.1s;
    }
    
    #list:not(.adding-song) #addSong input,
    #list:not(.adding-song) #addSong button{
        opacity: 0;
    }
    
    #addSong > input.blur{
        pointer-events: none;
        opacity: 0.5;
    }

    #addSong > input::placeholder{
        color: #bbb;
        font-weight: 100;
    }

    #searchBar{
        position: relative;
    }

    #searchBar > svg{
        position: absolute;
        top: 0;
        left: calc(1em + 7px);
        bottom: 0;
        margin: auto 0;
        fill: #888;
    }

    #searchBar > svg:not(.order-by){
        width: 20px;
        height: 20px;
        fill: #bbb;
    }

    #searchBar input ~ svg{
        left: auto;
        right: calc(1em + 4px);
    }

    #searchBar input ~ svg:not(.order-by):not(.clear-search){
        right: calc(1em + 37px);
    }

    #searchBar input{
        padding: 1em 1.5em;
        padding-left: calc(1em + 40px);
        width: 100%;
        border: none;
        background: #fff;
        border-bottom: 1px solid #e9e9e9;
        font-size: 1em;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-weight: 500;
        outline: none;
    }

    #searchBar input:focus{
        border-color: #ddd;
    }
    
    #searchBar input.blur{
        pointer-events: none;
        background: #ddd;
    }

    #searchBar input::placeholder{
        color: #bbb;
        font-weight: 100;
    }

    #songs{
        position: relative;
        flex: 1;
        overflow: auto;
    }

    #list.adding-song #songs,
    #list.adding-song #songs > *{
        pointer-events: none !important;
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
  <div id="list" :class="{'adding-song': addingSong}">
    <menu-bar :username="username" :userimage="userimage"
        :addingsong="addingSong"
        @addSong="addingSong = true"></menu-bar>

    <div id="addSong">
        <button @click="addingSong = false">CANCEL</button>
        <input ref="newSongInput" type="text" placeholder="Enter song title and press enter"
            @keyup.enter="addSong" v-model="newsong">
    </div>

    <div id="searchBar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        <input type="text" placeholder="Search songs"
            v-model="query">
        <svg class="clear-search" v-if="query.length" @click="query = ''" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>

        <template v-else>
            <svg class="order-by" @click="setOrder('last_modified')" v-if="order.by === 'title'" width="22" height="22" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <svg class="order-by" @click="setOrder('title')" v-if="order.by === 'last_modified'" width="22" height="22" viewBox="0 0 24 24"><path d="M15.75 5h-1.5L9.5 16h2.1l.9-2.2h5l.9 2.2h2.1L15.75 5zm-2.62 7L15 6.98 16.87 12h-3.74zM6 19.75l3-3H7V4.25H5v12.5H3l3 3z"/><path fill="none" d="M0 0h24v24H0z"/></svg>

            <svg style="fill: #555" @click="favoritesOnly = !favoritesOnly" v-if="!favoritesOnly" viewBox="0 0 24 24"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
            <svg style="fill: #555" @click="favoritesOnly = !favoritesOnly" v-else viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </template>
    </div>

    <div id="songs" :class="{'no-songs': !songs || !songs.length || !filteredSongs || !filteredSongs.length}" :empty="empty_message">
        <template v-for="(song, index) in filteredSongs">
            <article v-if="song.liked || !favoritesOnly"
                :class="{'active': curidx === song.id, 'unsaved': !song.path}"
                :key="index" @click="viewSong(song)">
                <h3>{{song.title}}</h3>
                <p>
                    <template v-if="song.description">
                        {{song.description}}
                    </template>

                    <span v-else style="opacity: 0.7">
                        This song has no lyrics.
                    </span>
                </p>
            </article>
        </template>
    </div>
  </div>
</template>

<script>
    import _ from 'lodash'
    import { db } from "../firebase";

    import MenuBar from "./MenuBar";

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
                order: {by: "title", dir: "asc"},
                favoritesOnly: false,
                newsong: "",
                query: "",
                curidx: -1,
                addingSong: false,
                empty_message: "Loading songs...."
            }
        },
        computed: {
            filteredSongs: function(){
                const query = this.query.toLowerCase();
                const songs = _.orderBy(this.songs, this.order.by, this.order.dir);

                if(!query || !query.length || !songs || !songs.length){
                    console.log("Uh, duhhhh!");
                    return songs;
                }
                
                return songs.filter(song => {
                    return song.title.toLowerCase().indexOf(query) != -1 || (song.description && song.description.toLowerCase().indexOf(query) != -1);
                });
            }
        },
        watch: {
            userid: {
                handler: function (userid) {
                    this.fetchSongs(userid);
                },
                immediate: true,
                deep: true
            },
            filteredSongs: function(){
                if(this.songs.length && !this.filteredSongs.length){
                    this.empty_message = `No songs matching '${this.query}'`;
                }
            },
            addingSong: function(newvalue) {
                console.log("Adding song changed: ", newvalue, this.$refs);
                if(newvalue){
                    this.$refs.newSongInput.focus();
                }else{
                    // hack to force updating order of filteredSongs
                    const old_order = (' ' + this.orderBy).slice(1);
                    this.orderBy = '😄';
                    const self = this;
                    setTimeout(() => {
                        self.orderBy = (' ' + old_order).slice(1);
                    });
                }
            }
        },
        methods: {
            fetchSongs: function(user_id){
                let self = this;
                console.log("Fetching songs!");
                songsRef = db.collection("songs/" + user_id + "/list");

                songsRef.orderBy("title", "asc").get()
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
                    });

                var unsubscribeNewSongs = songsRef.onSnapshot(function(){});    
                unsubscribeNewSongs();
            },
            addSong: function(){
                var self = this;
                const temp_id = 'temp-id-' + Math.random().toString(36).substr(2, 5);
                var song = {
                    id: temp_id,
                    title: this.newsong,
                    description: "",
                    last_modified : new Date().getTime()
                }
                this.songs.push(song);
                this.addingSong = false;

                this.newsong = "";
                this.$refs.newSongInput.classList.add("blur");

                songsRef.add(song)
                    .then((docRef) => {
                        song.path = docRef.path;
                        song.id = docRef.id;

                        self.viewSong(song);

                        self.$refs.newSongInput.classList.remove("blur");
                    })
                    .catch(function(error) {
                        const idx = _.findIndex(self.songs, ['id', temp_id]);
                        self.songs.splice(idx, 1);
                        self.newsong = song.title;
                        self.addingSong = true;
                        
                        self.$refs.newSongInput.classList.remove("blur");
                        console.error("Error adding document: ", error);
                    });
            },
            setOrder(by){
                const dir = by === 'title' ? 'asc' : 'desc';
                this.order = { by, dir};
            },
            viewSong: function(song){
                this.curidx = song.id;
                this.$emit("viewsong", song);
            },
            logout: function(){
                this.$emit("logout");
            }
        },

        components : {
            'menu-bar' : MenuBar
        },
    }
</script>
