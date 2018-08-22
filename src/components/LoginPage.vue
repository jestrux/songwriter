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
    
    #loginForm #loader{
        background: rgba(255, 255, 255, 0.97);
        color: #854dfe;
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

    #loginWrapper.logged-in{
        pointer-events: none;
    }

    #loginWrapper.logged-in #loginForm{
        transform: translateY(-50%);
        opacity: 0;
        transition: all 0.35s ease-out;
    }

    #loginWrapper.logged-in:before{
        opacity: 0;
        transition: all 0.35s ease-out;
    }
</style>

<template>
    <div id="loginWrapper" :class="{'logged-in': loggedin}">
        <div id="loginForm" :class="{'signing-in': signingin, 'has-qr': !signingin}">
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
        </div>
    </div>
</template>

<script>
    import { linksRef, auth } from "../firebase";
    import VueQrcode from '@xkeshi/vue-qrcode';
    
    var self;

    export default {
        name: 'LoginPage',

        props: {
            loggedin : {
                type: Boolean,
                default: true
            }
        },

        watch: {
            loggedin: {
                handler: function (loggedin) {
                    if(!loggedin){
                        this.createLoginSession();
                    }
                },
                immediate: true
            }
        },

        data(){
            return {
                qrcode: null,
                signingin: false
            }
        },

        methods: {
            createLoginSession: function(){
                self = this;
                linksRef.add({email: "nan", password: "1234"})
                    .then(function (ref) {
                        self.qrcode = ref.id;
                        self._listenForchanges(ref.id);
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
            },
            _listenForchanges: function(id){
                const linkRef = linksRef.doc(id);

                const unsubscribe = linkRef.onSnapshot(function (doc) {
                    var res = doc.data();
                    if(res.email !== "nan"){
                        self.signingin = true;
                        self.loginUser(res);
                        linkRef.delete();
                        unsubscribe();
                    }else{
                        console.log("Initial Setup");
                    }
                });
            },
            loginUser: function(user){
                auth.setPersistence("local")
                .then(() => auth.signInWithEmailAndPassword(user.email, user.password))
                .then(() => self.signingin = false)
                .catch(function (error) {
                    // let errorCode = error.code;
                    // let errorMessage = error.message;
                    console.log("Signing in error", error);
                });
            }
        },

        components : {
            'qrcode' : VueQrcode
        },
    }
</script>