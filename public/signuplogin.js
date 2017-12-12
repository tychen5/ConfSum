  var config = {
    apiKey: "AIzaSyA-hnI5aquIwwKkxkikcZjUQWrnlzeE3mc",
    authDomain: "sdm-subtitle.firebaseapp.com",
    databaseURL: "https://sdm-subtitle.firebaseio.com",
    projectId: "sdm-subtitle",
    storageBucket: "sdm-subtitle.appspot.com",
    messagingSenderId: "45748735409"
  };
//Login Page Element

var g_signup,g_signin;
window.onload=function(){
    //window.location.assign('loginPage.html');
    buildElement();
    ms = new Date().getTime();
    firebase.initializeApp(config);
    database = firebase.database().ref();
    buildListener();
   
}
function buildElement(){
    g_signup=document.getElementById("g_signup");
    g_signin=document.getElementById("g_signin");
}
function buildListener(){
    
    g_signin.addEventListener("click",signInWithGoogle);
    g_signup.addEventListener("click",signUpWithGoogle);
}
function signUpWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
  // The signed-in user info.
        var user = result.user;
  // ...
    }).catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  // The email of the user's account used.
    var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
  // ...
});
}   
function signInWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
  // The signed-in user info.
        var user = result.user;
  // ...
    }).catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  // The email of the user's account used.
    var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
  // ...
});
}   