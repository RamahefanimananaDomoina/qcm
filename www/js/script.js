var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById("invitefb").addEventListener("click", this.invitefb);
    },

    onDeviceReady: function() {
     },
 
    invitefb:function(){
        console.log("Sending invite");
        var fbOptions={
              url: "https://fb.me/123456789012345",// App link that you got from facebook
              picture:"https://placehold.it/150x150" // Link to any image on the web
            };
         facebookConnectPlugin.appInvite(fbOptions,
                 function(postId){
                    console.log("success");
                    console.log(postId);
                },
                 function(error){
                    console.log("failure");
                    console.log(error);
                }
        );
   }
};

app.initialize();

