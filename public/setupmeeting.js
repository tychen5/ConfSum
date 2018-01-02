  var config = {
    apiKey: "AIzaSyA-hnI5aquIwwKkxkikcZjUQWrnlzeE3mc",
    authDomain: "sdm-subtitle.firebaseapp.com",
    databaseURL: "https://sdm-subtitle.firebaseio.com",
    projectId: "sdm-subtitle",
    storageBucket: "sdm-subtitle.appspot.com",
    messagingSenderId: "45748735409"
  };
firebase.initializeApp(config);
var database = firebase.database().ref();
var first_name,last_name;
var email_address,password;
var biguser;
//Login Page Element
window.onload=function(){
    //window.location.assign('loginPage.html');
    buildElement();
    ms = new Date().getTime();      
    buildListener();
    checkAuth();
    //showdate();
    //getAccountInfo();
    //elementhide();
    
    /*
    if (!('webkitSpeechRecognition' in window)) {
        alert("此瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25版以上才支援語音辨識)");
    }
    else {
        recognition = new webkitSpeechRecognition(); 
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang="cmn-Hant-TW";
    }
    recognition.onstart =onstart;
    recognition.onend =onend;
    recognition.onerror= onerror;
    recognition.onresult = onresult;
    */
    
    
    
}
function buildElement(){
    email_address=document.getElementById("emailInput").value;
    password=document.getElementById("passwordInput").value;
    g_signupBTN=document.getElementById("g_signupBTN");
    signUPBTN=document.getElementById("signUPBTN");
    lang=document.getElementById("lang");
    
    play=document.getElementById("play");
    stop=document.getElementById("stop");
    timelabel=document.getElementById("timelabel");
    
    showSubtitle=document.getElementById("showSubtitle");
    saveSubtitle=document.getElementById("saveSubtitle");
    plus=document.getElementById("plusTime");
    minus=document.getElementById("minusTime");
    
    downloadName=document.getElementById("downloadName");
    downloadText=document.getElementById("downloadText");
    
    BasicSetting=document.getElementById("BasicSetting");
    Remodify=document.getElementById("Remodify");
    downloadlink=document.getElementById("downloadlink");
    
    //fbSigninBTN=document.getElementById("fbSigninBTN");
    //checkpassword=document.getElementById("checkpassword");    
    //setupNewAccount=document.getElementById("setupNewAccount");
    //confirmSetup=document.getElementById("confirmSetup");
    //set_meeting_btn=document.getElementById("set_meeting_btn");
    //texttitle=document.getElementById("texttitle");
    //greet=document.getElementById("greet");
    //mydate=document.getElementById("mydate");
    //title=document.getElementById("titleInput");
    //sessionNumber=document.getElementById("roomnumberInput");    
    //meetinggoal=document.getElementById("meetinggoalInput");
    //confirmSetting=document.getElementById("confirmSetting");
    //readRecordProject=document.getElementById("readRecordProject");
    //settingControl=document.getElementById("settingControl");
    //inputText=document.getElementById("inputText");
    /*
    textarea=document.getElementById("textarea");
    textarea2=document.getElementById("textarea2");
    */
    
}
function buildListener(){
    signUPBTN.addEventListener("click",GoogleSignUp);
    g_signupBTN.addEventListener("click",GoogleSignUp);
    //greet.innerHTML="Hello，"+final_id;
    //setupNewAccount.addEventListener("click",createAccount);
    //confirmSetup.addEventListener("click",confirmNewAccount);
    //confirmSetting.addEventListener("click",settingConfirm);    
    //settingControl.addEventListener("click",controlSetting);
    //play.addEventListener("click",startrecord);
    //stop.addEventListener("click",stoprecord);
    //showSubtitle.addEventListener("click",showsub);
    //saveSubtitle.addEventListener("click",savesub);
    //plus.addEventListener("click",plusTime);
    //minus.addEventListener("click",minusTime);
    //Remodify.addEventListener("click",recover);
    //fbSigninBTN.addEventListener("click",FBSignin);
}
function GoogleSignUp(){
    window.location.assign("Setmeeting.html");
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
        
      makeUser();
      // The signed-in user info.
      //var user = result.user;
      var user2 =biguser.displayName;
        console.log(result);
        window.alert("Welcome:"+user2);
      greet.innerHTML="Hello，"+user2;
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
    checkAuth();
}
function checkAuth(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {   
            
            window.location.assign("Setmeeting.html");
            console.log("登入成功");
            return true;
            // User is signed in.
            
        }
        else{
            console.log("尚未登入，請登入");
            return false;
        }
    });
}
function createAccountWithEmail(){
    if(email_address.value==""){
        window.alert("帳戶不可為空直");
    }else if(true){
        if(password.value=="")
            alert("密碼不能為空直");
        /*else if(password.value!=checkpassword.value)
            alert("確認密碼與密碼不一致")*/
        else{            
            firebase.auth().createUserWithEmailAndPassword(email_address.value.toString(), password.value.toString()).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
            window.alert("成功創立帳號");
            $("#recheckPassword").hide();
            $("#fbSigninBTN").show("slow");
            $("#gSigninBTN").show("slow");
            $("#setupNewAccount").show("slow");
            $("#confirmSetup").hide();
            //final_id=id.value;
            //final_password=password.value;
            //writeUserData(final_id,final_password);
        }
    }/*else{
        alert("此「"+id.value+"」帳戶名稱已被使用");
    }*/
    
}
