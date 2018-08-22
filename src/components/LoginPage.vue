<style scoped>
    #loginWrapper{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        display: flex;
    }

    #loginForm{
        position: relative;
        min-width: 320px;
        padding: 4em 2em;
        margin: auto;
        border-radius: 5px;
        background: #fff;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.35);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1;
        overflow: hidden;
    }

    body.loading #loginForm{
        opacity: 0;
    }
    
    #loginForm #loader{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1;
        background: rgba(255, 255, 255, 0.97);
        text-transform: uppercase;
        padding-bottom: 20px;
        color: #854dfe;
        transition: all 0.35s ease-out;
    }

    #loginForm #loader span{
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 4px dashed #1ddc6a;
        border-left-width: 2px;
        border-bottom-width: 2px;
        margin-bottom: 1.5em;

        animation: roll 0.7s ease-out infinite alternate;
    }

    #loginForm:not(.signing-in) #loader {
        pointer-events: none;
        opacity: 0;
    }

    #loginForm #logo{
        text-align: center;
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-size: 2em;
        line-height: 0.6;
        margin-bottom: 0.2em;
    }

    #loginForm #logo img{
        display: block;
        margin-bottom: 0.5em;
        width:120px;
        height:120px;
    }

    #loginForm button{
        margin-top: 2em;
        padding: 0.7em 1.3em;
        color: #fff;
        border: none;
        border-radius: 3px;
        font-size: 1em;
        background: #1ddc6a;
    }

    #loginWrapper:before{
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #333;
    }

    body.logged-in #loginWrapper{
        pointer-events: none;
    }

    body.logged-in #loginForm{
        transform: translateY(-50%);
        opacity: 0;
        transition: all 0.35s ease-out;
    }

    body.logged-in #loginWrapper:before{
        opacity: 0;
        transition: all 0.35s ease-out;
    }

    #loginWrapper{
        /* display: none; */
    }
</style>

<template>
    <div id="loginWrapper">
        <div id="loginForm">
            <div id="loader">
                <span></span>
                Signing in...
            </div>
            
            <div id="logo" >
                <img src="../assets/logo.png" v-if="!qrcode" alt="No image"><br>
                Muziki
            </div>
            <br>

            <template v-if="qrcode">
                <qrcode :value="qrcode" :options="{ size: 200 }"></qrcode>
                <span style="margin-top: 1.5em">Scan the QR Code using app to login.</span>
            </template>
            
            <!-- <button @click="createLoginSession()">
                LOGIN WITH QR
            </button> -->
        </div>
    </div>
</template>

<script>
    import { linksRef, auth } from "../firebase";
    import VueQrcode from '@xkeshi/vue-qrcode';
    
    export default {
        name: 'LoginPage',

        data(){
            return {
                qrcode: null
            }
        },

        mounted(){
            this.createLoginSession();
        },

        methods: {
            createLoginSession: function(){
                const self = this;
                linksRef.add({email: "nan", password: "1234"})
                    .then(function (ref) {
                        console.log(ref.id);
                        self.qrcode = ref.id;
                        self._listenForchanges(ref.id);
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
            },
            _listenForchanges: function(id){
                const self = this;
                var linkRef = linksRef.doc(id);

                console.log(id);
                var unsubscribe = linkRef.onSnapshot(function (doc) {
                    var res = doc.data();
                    console.log(res);
                    if(res.email !== "nan"){
                        document.getElementById("loginForm").classList.remove("has-qr");
                        document.getElementById("loginForm").classList.add("signing-in");
                        self.loginUser(res);
                        linkRef.delete();
                        unsubscribe();
                    }else{
                        console.log("Initial Setup");
                    }
                });
            },
            loginUser: function(user){
                var self =  this;
                auth.setPersistence("local") //SESSION
                .then(function () {
                    return auth.signInWithEmailAndPassword(user.email, user.password);
                })
                .then(function(result){
                    var res = result.user;
                    console.log(res);
                    var user = {
                        id: res.uid,
                        name: res.displayName,
                        image: res.photoURL
                    };
                    self.$emit("login", user);
                }).catch(function (error) {
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    console.log(error);
                });
            }
        },

        components : {
            'qrcode' : VueQrcode
        },
    }
</script>