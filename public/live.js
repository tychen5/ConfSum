  var config = {
    apiKey: "AIzaSyA-hnI5aquIwwKkxkikcZjUQWrnlzeE3mc",
    authDomain: "sdm-subtitle.firebaseapp.com",
    databaseURL: "https://sdm-subtitle.firebaseio.com",
    projectId: "sdm-subtitle",
    storageBucket: "sdm-subtitle.appspot.com",
    messagingSenderId: "45748735409"
  };
//Login Page Element
var id,password,checkpassword,login,setupNewAccount,confirmSetup;
var textarea,textarea2;
var idArray,loginorNot=false;
//Basic Setting Page Element
var greet,mydate,title,lang,confirmSetting,settingControl,inputText,play,stop,timelabel;
var sessionNumber,meetinggoal,texttitle;
var signinTAB;
//var readRecordProject;
var display=true,titleArray;
//Remodify Page Element
var showSubtitle,saveSubtitle,plus,minus;
var set_meeting_btn;
//Download Page Element
var downloadName,downloadText;
//Content Bar item
var BasicSetting,Remodify;
var roomNumber="test";
//recognizer Object
var recognition, recognizing = false;
var subArray,timeArray;
var interval,timeCount=0,firstword=true,startTime,endTime;
var subRef,wordNum,allsubref;
var database,ms;
//確認後的各項變數
var final_id="",final_password="",final_title="";
var biguser;
var biguser_name, biguser_email, biguser_photoUrl, biguser_uid, biguser_emailVerified;
window.onload=function(){
    //window.location.assign('loginPage.html');
    buildElement();
    ms = new Date().getTime()
    firebase.initializeApp(config);
    database = firebase.database().ref();
   
    buildListener();
    showdate();
    getAccountInfo();
    elementhide();
    
    
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
    checkAuth();
    
    /*
    var text;
    var string;
    firebase.database().ref('users/'+id.value+'/Subtitle').on("child_added", function(snapshot) {
        
        string=JSON.stringify(snapshot.val());        
        text = document.createTextNode(string.substr(1,string.length-2)+"\n");
        textarea.appendChild(text);
        console.log(textarea.value);
    });
      */  
}
function checkAuth(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            
            
            $("#BasicSetting").trigger( "click" );
            console.log("SignIn!");
            
            // User is signed in.
        }
        else{
            console.log("Not SignIn yet!");
        }
    });
}
function makeUser(){
    biguser = firebase.auth().currentUser;
    biguser_name = biguser.displayName;    
    biguser_email = biguser.email;
    biguser_photoUrl = biguser.photoURL;
    biguser_emailVerified = biguser.emailVerified;
    biguser_uid = biguser.uid;
}
function buildElement(){
    id=document.getElementById("id");
    password=document.getElementById("password");
    gSigninBTN=document.getElementById("gSigninBTN");
    fbSigninBTN=document.getElementById("fbSigninBTN");
    checkpassword=document.getElementById("checkpassword");
    login=document.getElementById("login");
    setupNewAccount=document.getElementById("setupNewAccount");
    confirmSetup=document.getElementById("confirmSetup");
    set_meeting_btn=document.getElementById("set_meeting_btn");
    texttitle=document.getElementById("texttitle");
    greet=document.getElementById("greet");
    mydate=document.getElementById("mydate");
    title=document.getElementById("titleInput");
    sessionNumber=document.getElementById("roomnumberInput");    
    meetinggoal=document.getElementById("meetinggoalInput");
    lang=document.getElementById("lang");
    confirmSetting=document.getElementById("confirmSetting");
    //readRecordProject=document.getElementById("readRecordProject");
    settingControl=document.getElementById("settingControl");
    inputText=document.getElementById("inputText");
    
    textarea=document.getElementById("textarea");
    textarea2=document.getElementById("textarea2");
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
}
function buildListener(){
    login.addEventListener("click",getAccountPermission);
   // greet.innerHTML="Hello，"+final_id;
    setupNewAccount.addEventListener("click",createAccount);
    confirmSetup.addEventListener("click",confirmNewAccount);
    confirmSetting.addEventListener("click",settingConfirm);
    //readRecordProject.addEventListener("click",readProject);
    settingControl.addEventListener("click",controlSetting);
    play.addEventListener("click",startrecord);
    stop.addEventListener("click",stoprecord);
    showSubtitle.addEventListener("click",showsub);
    saveSubtitle.addEventListener("click",savesub);
    plus.addEventListener("click",plusTime);
    minus.addEventListener("click",minusTime);
    Remodify.addEventListener("click",recover);
}
function elementhide(){
    $("#record").hide();
    $("#recordchart").hide();
    $("#textarea").hide();
    $("#textarea2").hide();
    $("#textoutbound").hide();
    $("#recheckPassword").hide();
    $("#confirmSetup").hide();
    $("#saveSubtitle").hide();
    $("#plusTime").hide();
    $("#minusTime").hide();
}

/*
        以下為語音辨識的各類事件            
                                     */
                        
function onstart(){
    recognizing = true;
    subArray=new Array();
    timeArray=new Array();
}
function onend(){
    recognizing = false; 
}
function onerror(event){
    alert("發生錯誤，錯誤類型::"+event.error);
}
function onresult(event){
    var text;
    var d = new Date();
    var hour,minutes,seconds;
    hour=d.getHours();
    minutes=d.getMinutes();
    seconds=d.getSeconds();
    if(hour<10){
        hour = '0'+hour;
    }
    if(minutes<10){
        minutes = '0' + minutes;
    }
    if(seconds<10){
        seconds = '0' + seconds;
    }
    var timing=hour+':'+minutes+':'+seconds;
    
    var interim_transcript = '';
    var final_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            endTime=timeCount*100+Math.floor(Math.random()*100);
            timeArray.push(endTime);
            updateTime(final_id,final_title,timeArray);
            
            final_transcript = event.results[i][0].transcript; 
            //textarea.value=final_transcript;
            subArray.push(final_transcript);            
            updateRealtimeSubtitle(final_id,final_title,final_transcript);
            updateSubtitle(final_id,final_title,subArray);
            var postData = {
                            name:biguser_name,
                            id:biguser_uid,
                            title:final_title,
                            time:timing,
                            record_perSentence:subArray[subArray.length-1]
                            };

            firebase.database().ref('test/Subtitle/').push(postData);
            firstword=true;
            } 
            else { 
                if(firstword){
                startTime=timeCount*100+Math.floor(Math.random()*100);
                timeArray.push(startTime);
                updateTime(final_id,final_title,timeArray);
                firstword=false;
                }
            interim_transcript = event.results[i][0].transcript;
            inputText.value=interim_transcript;
            
            updateRealtimeSubtitle(final_id,final_title,interim_transcript);
        }
    }
}

/*
       以下為Listener的各類method            
                                    */
function startrecord(event){
    if(!recognizing&&checkTitle()){
        recognition.start();
        interval=setInterval(function(){
            timeCount++;
            timelabel.innerHTML=changetoTime(false,timeCount*100);
        },100);
        
        readSubtitle(final_id);
    }
}
function readSubtitle(id_string){//讀取所有字幕
    var text;
    var string;
    var name;
    var timestamp;
    //allsubref = firebase.database().ref('users/'+id_string+"/RecordTitle/"+final_title+'/Subtitle');
    allsubref = firebase.database().ref('test/Subtitle');
    //allsubref2 = firebase.database().ref('test/Subtitle');
    allsubref.limitToLast(1).on('value', function(snapshot) {
        
      for(var i in snapshot.val()){
          
              
          console.log("這是console.log:"+i.id+".id");
          name=JSON.stringify(snapshot.val()[i].id);
          string=JSON.stringify(snapshot.val()[i].record_perSentence);
          timestamp=JSON.stringify(snapshot.val()[i].time);
          //textarea.append('<span>'+snapshot.val()[i].id+'說：'+string+","+snapshot.val()[i].time+'</span><br/>');
          text = document.createTextNode(snapshot.val()[i].id+"說:"+string.substr(1,string.length-2)+snapshot.val()[i].time+"\n");
          textarea.append(text);
                
          
        }
        console.log("這是console.log(textarea.value):"+textarea.value);
        
    });
    //allsubref2.limitToLast(1).on('value', function(snapshot) {
        
    //  for(var i in snapshot.val()){
    //      textarea2.append('<span>'+snapshot.val()[i].id+' 說：'+snapshot.val()[i].record_perSentence+","+snapshot.val()[i].time+'</span><br/>');
    //      console.log(i.id);
          //string=JSON.stringify(snapshot.val()[i].record_perSentence);
          
          //text = document.createTextNode(i.id+"說:"+string.substr(1,string.length-2)+"\n");
          //textarea2.append(text);
                
          
    //    }
    //    console.log(textarea2.value);
        
    //});
    
}
/*, function (errorObject) {
        text = document.createTextNode("The read failed: " + errorObject.code);
        textarea.append(text);
    }*/

function stoprecord(event){
    if(recognizing){
        /*
        clearInterval(interval);
        updateTimecount(final_id,final_title,timeCount*100);
        timeCount=0;
        timelabel.innerHTML="00:00:00,000";
        */
        recognition.stop();
    }
}
function Signout() {
   firebase.auth().signOut()
	
   .then(function() {
      window.alert('Subtitler Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}

function GoogleSignin(){
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

function FBSignin(){
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    //var user = result.user;

<<<<<<< HEAD
    makeUser();
    // The signed-in user info.
     //var user = result.user;
    var user2 =biguser.displayName;
    window.alert("Welcome:"+user2);
        
=======
    biguser = firebase.auth().currentUser;
      // The signed-in user info.
      //var user = result.user;
      var user2 =biguser.displayName;
        window.alert("Welcome:"+user2);
       greet.innerHTML="Hello，"+user2; 
>>>>>>> 9c1d750d8e94da8eb25f336cd5c9cd890456f88e


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
function getAccountPermission(){ 
  /*  var checkpassword=""; firebase.database().ref('users/'+id.value+"/Password").once("value").then(function(snapshot){
         checkpassword=snapshot.val();
         if(!checkRepeatAccount(id.value,idArray))
             alert("找無此帳號");
         else if(checkpassword!=password.value)
             alert("密碼錯誤");
         else{ */  
             final_id=biguser.displayName;
             final_password=password.value;
             greet.innerHTML="Hello，"+final_id;
             loginorNot=true;
             $("#BasicSetting").trigger( "click" );
   //      }
 //   });
    
    
}
function createAccount(){
    $("#recheckPassword").show("slow");
    $("#fbSigninBTN").hide();
    $("#gSigninBTN").hide();
    $("#setupNewAccount").hide();
    $("#confirmSetup").show();
    
}
function confirmNewAccount(){
    if(id.value==""){
        window.alert("帳戶名稱不可為空直");
    }else if(!checkRepeatAccount(id.value,idArray)){
        if(password.value=="")
            alert("密碼不能為空直");
        else if(password.value!=checkpassword.value)
            alert("確認密碼與密碼不一致")
        else{            
            firebase.auth().createUserWithEmailAndPassword(id.value.toString(), password.value.toString()).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
            window.alert("成功創立帳號");
            final_id=id.value;
            final_password=password.value;
            //writeUserData(final_id,final_password);
        }
    }else{
        alert("此「"+id.value+"」帳戶名稱已被使用");
    }
}
function checkRepeatAccount(id,idArray){
    for(var i=0;i<idArray.length;i++){
        if(id==idArray[i]){
            return true;
        }
    }
    return false;
}
function writeUserData(id,password) {
    var d=new Date();
    var year,month,day;
    year=d.getFullYear();
    month=d.getMonth()+1;
    day=d.getDate();
    hour=d.getHours();
    minutes=d.getMinutes();
    seconds=d.getSeconds();
    var date="建立日期:"+year+month+day;
    var timing=","+hour+minutes+seconds;
    firebase.database().ref('users/'+ id).set(
    {
        "Password": password,
        "Date": date,
        "Time": timing,
        "RecordTitle":""
    });
}
function settingConfirm(){
    /*if(loginorNot!=true){
        alert("尚未登入請重新登入")
    }else */ 
        if(checkTitle() && checkGoal() && checkSession()){
        loginorNot=true
        roomNumber=sessionNumber.value;
        console.log(roomNumber);
        var d=new Date();
        var year,month,day;
        year=d.getFullYear();
        month=d.getMonth()+1;
        day=d.getDate();
        var date=""+year+"/"+month+"/"+day;
        final_title=title.value;
        downloadName.value=final_id+"會議記錄_"+final_title+".txt";
        recognition.lang=lang.value;
        $("#record").show("slow");
        $("#recordchat").show("slow");
        $("#textarea").show("slow");
        $("#textoutbound").show("slow");
        
        controlSetting();
        texttitle.textContent=title.value+"_會議記錄_"+date;
        getUserTitle(final_id);
        firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title).set(
        {
            "Date":date,
            "Lang":lang.value,
            "StartEndTime":{0:0,1:0},
            "Subtitle":{0:""}
        });
    }
    
}
function readProject(){
    var getFileOrNot=false;
    if(loginorNot!=true){
        alert("尚未登入請重新登入")
    }else if(checkTitle()){
        getUserTitle(final_id);
        for(var i=0;i<titleArray.length;i++){
            if(title.value==titleArray[i]){
                getFileOrNot=true;
                final_title=title.value;
                downloadName.value=final_id+"會議記錄_"+final_title+".txt";
                $("#Remodify").trigger("click");
                $("#showSubtitle").trigger("click");
            }
        }
        if(getFileOrNot!=true)
            alert("查無此會議記錄");
    }

}
function controlSetting(){
    if ( display == true ) {
        settingControl.setAttribute("class","btn-radius glyphicon glyphicon-chevron-down");
        display=false;
        $("#setting").toggle("slow");
    } else if ( display == false ) {
        settingControl.setAttribute("class","btn-radius glyphicon glyphicon-chevron-up");
        display=true;
        $("#setting").toggle("slow");
    }
}
function showsub(){
    if(loginorNot!=true){
        alert("尚未登入請重新登入")
    }
    else{    
        $("#showSubtitle").hide();
        $("#saveSubtitle").show();
        $("#plusTime").show();
        $("#minusTime").show();
        var text="";
        var firsttime=true;
        subRef = firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title+'/Subtitle'); //這邊可要改~~~
        timeRef=firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title+'/StartEndTime'); //不然會抓不到字幕QQ
    
        subRef.once("value").then(function(data){
            //document.getElementById("content").innerHTML=JSON.stringify(data.val());
            wordNum=data.numChildren();
            //alert(data.val());
            var string=JSON.stringify(data.val());
            var words=getsubStr(string).split(",");
            timeRef.once("value").then(function(snapshot){
                //alert(words);
                //alert(snapshot.val());
                var timestring=JSON.stringify(snapshot.val());
                var timewords=getsubStr(timestring).split(",");
                for(var i=0;i<words.length;i++){
                    var label0=document.createElement("label");
                    label0.innerHTML=i+1;
                    label0.setAttribute("name","label");
                
                    var label1=document.createElement("label");
                    label1.innerHTML=changetoTime(true,timewords[i*2]);
                    label1.setAttribute("class","btn");
                    label1.setAttribute("name","label");
                
                    var label2=document.createElement("label");
                    label2.innerHTML=changetoTime(true,timewords[i*2+1]);
                    label2.setAttribute("class","btn");
                    label2.setAttribute("name","label");
                
                    var input=document.createElement("input");
                    input.setAttribute("id", i);
                    input.setAttribute("type", "text");
                    input.setAttribute("class","form-control input-lg");
                    input.setAttribute("value",getsubStr(words[i]));
                
                    downloadText.appendChild(document.createTextNode((i+1)+"\r\n"+changetoTime(true,timewords[i*2])+" --> "+changetoTime(true,timewords[i*2+1])+"\r\n"+getsubStr(words[i])+"\r\n\r\n"));
                    text=downloadText.value;
                    $("#downloadlink").click(function(){
                        if(firsttime==true){
                            download(downloadName.value,text);
                            firsttime=false;
                        }
                    });
                    document.getElementById("div").appendChild(label0); 
                    document.getElementById("div").appendChild(document.createElement("br"));
                    document.getElementById("div").appendChild(label1); 
                    document.getElementById("div").appendChild(label2); 
                    document.getElementById("div").appendChild(input); 
                    document.getElementById("div").appendChild(document.createElement("br"));
            }   
            });
        });
    }
   
    /* var savebtn=document.createElement("button");
    savebtn.setAttribute("id","saveSubtitle");
    savebtn.appendChild(document.createTextNode("儲存字幕"));
    savebtn.addEventListener("click",savesub);
    document.getElementById("div").appendChild(savebtn);
    document.getElementById("div").appendChild(document.createElement("br"));*/
    
}
function download(filename,text) {
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download",filename);
    element.style.display = 'none';
    element.click();
}
function savesub(){
    $("#saveSubtitle").hide();
    $("#plusTime").hide();
    $("#minusTime").hide();
    $("#showSubtitle").show();
    
    var array=new Array();
    for(var i=0;i<wordNum;i++){
        array.push(document.getElementById(i).value);
    }
    firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title).update({"Subtitle":array});
    
    var div=document.getElementById("div");
    while (div.hasChildNodes()) {   
        div.removeChild(div.firstChild);
    }
}
function plusTime(){
    var plusTimeArray=new Array();
    firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title+"/StartEndTime").once("value").then(function(snapshot){
        var timestring=JSON.stringify(snapshot.val());
        var timewords=getsubStr(timestring).split(",");
        for(var t=0;t<timewords.length;t++){
            timewords[t]=parseInt(timewords[t])+1000;
            plusTimeArray.push(timewords[t]);
            document.getElementsByName("label")[t+1].innerHTML=changetoTime(true,timewords[t]);
        }
        firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title).update({"StartEndTime":plusTimeArray});
    });
    
}
function minusTime(){
    var minusTimeArray=new Array();
    firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title+"/StartEndTime").once("value").then(function(snapshot){
        var timestring=JSON.stringify(snapshot.val());
        var timewords=getsubStr(timestring).split(",");
        for(var t=0;t<timewords.length;t++){
            timewords[t]=parseInt(timewords[t])-1000;
            minusTimeArray.push(timewords[t]);
            document.getElementsByName("label")[t+1].innerHTML=changetoTime(true,timewords[t]);
        }
        firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title).update({"StartEndTime":minusTimeArray});
    });
    
}
function recover(){
    $("#showSubtitle").show();
    $("#saveSubtitle").hide();
    $("#plusTime").hide();
    $("#minusTime").hide();

    var div=document.getElementById("div");
    while (div.hasChildNodes()) {   
    div.removeChild(div.firstChild);
    }
}

/*
       以下為跟Firebase相關的各項method 
                                    */

function updateSubtitle(id,title,subtitle) {
    firebase.database().ref('users/'+id+"/RecordTitle/"+title).update({
        "Subtitle":subtitle
    });
}
function updateRealtimeSubtitle(id,title,realtimeSubtitle) {
    firebase.database().ref('users/'+id+"/RecordTitle/"+title).update({
        "RealtimeSubtitle": realtimeSubtitle 
    });
}
function updateTime(id,title,time){//跟新目前錄音時間
    firebase.database().ref('users/'+id+"/RecordTitle/"+title).update({
        "StartEndTime":time
    });
}
function updateTimecount(id,title,timeCount){
    firebase.database().ref('users/'+id+"/RecordTitle/"+title).update({
        "RecordTime": timeCount
    });
}
function getAccountInfo(){
    idArray=new Array();
    firebase.database().ref('users').orderByChild("Aiden").on("child_added", function(snapshot) {
        idArray.push(snapshot.key);
    });
}
function getUserTitle(id){
    titleArray=new Array();
    firebase.database().ref('users/'+id+"/RecordTitle").orderByChild("Aiden").on("child_added", function(snapshot) {
        titleArray.push(snapshot.key);
    });
}

/*
         其餘method           
                            */

function showdate(){
    var d=new Date();
    var year,month,day;
    year=d.getFullYear();
    month=d.getMonth()+1;
    day=d.getDate();
    var date=""+year+"/"+month+"/"+day;
    mydate.innerHTML="今日日期:"+date;
}
function getsubStr(string){//將一字串的頭尾去除
    return string.substring(1,string.length-1);
}
function changetoTime(type,timeCount){
    var millsec,second,minute,hour,timeString;
    if(type==true){
        millsec=Math.floor(timeCount%1000);
        second=Math.floor(timeCount/1000%60);
        minute=Math.floor(timeCount/1000/60%60); 
        hour=Math.floor(timeCount/1000/60/60); 
        timeString=paddingLeft(hour+"",2)+":"+paddingLeft(minute+"",2)+":"+paddingLeft(second+"",2)+","+paddingLeft(millsec+"",3);
        return timeString;
    
    }else{
        millsec=Math.floor(timeCount%1000+Math.random()*100);
        second=Math.floor(timeCount/1000%60);
        minute=Math.floor(timeCount/1000/60); 
        hour=Math.floor(timeCount/1000/60/60); 
        timeString=paddingLeft(hour+"",2)+":"+paddingLeft(minute+"",2)+":"+paddingLeft(second+"",2)+","+paddingLeft(millsec+"",3);
        return timeString;
    }
    return timeString;
}
function paddingLeft(str,lengh){
	if(str.length >= lengh)
	return str;
	else
	return paddingLeft("0" +str,lengh);
}
function checkTitle(){
    if(title.value==""){
        alert("標題不可為空值");
        return false;
    }
    return true;
}
function checkSession(){
    if(sessionNumber.value==""){
        alert("會議室編號不可為空值");
        return false;
    }
    return true;
}function checkGoal(){
    if(meetinggoal.value==""){
        alert("會議目標不可為空值");
        return false;
    }
    return true;
}
/*
function getTranslateResponse(context){
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    var sourceText = escape(context);
    // WARNING: Your API key will be visible in the page source.
    // To prevent misuse, restrict your key to designated domains or use a
    // proxy to hide your key.
    var source = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyB7RbkCari0Ufg_vsuGUba1iMg6pBRC4lc&source=zh&target='+translateLang.value+'&callback=translateText&q=' + sourceText;
    newScript.src = source;
    document.getElementsByTagName('head')[0].appendChild(newScript);
}
function translateText(response) {
    var text=document.createTextNode(response.data.translations[0].translatedText);
    document.getElementById("translation").appendChild(text);
    document.getElementById("translation").appendChild(document.createElement("br"));
}
*/


