  var config = {
    apiKey: "AIzaSyA-hnI5aquIwwKkxkikcZjUQWrnlzeE3mc",
    authDomain: "sdm-subtitle.firebaseapp.com",
    databaseURL: "https://sdm-subtitle.firebaseio.com",
    projectId: "sdm-subtitle",
    storageBucket: "sdm-subtitle.appspot.com",
    messagingSenderId: "45748735409"
  };
var keywords=["皮卡丘","巴哈姆特","亞歷山大"];
var keywordcontent=["皮卡丘是神奇寶貝系列登場的721種虛構角色（怪獸）中的一種。因為動畫和可愛的外表，所以成了所有寶可夢中最知名的角色。","原本是阿拉伯神話中的一種水中生物，是一條巨大的魚，居住在廣闊的海洋之中，在巴哈姆特之下是幽黯無盡的海洋。它支撐著一隻名為「Kujuta」的巨大公牛，Kujuta有著四千隻眼睛、耳朵、鼻子、嘴巴、舌頭和腳，而在每個器官之間有著五百年的旅程。Kujuta支撐了在他之上一粒紅寶石，在那之上站著一個天使，他支撐著七個大地。\n在現代，巴哈姆特常被人描述成一種懂得飛翔的巨龍。而會被比喻成龍，是因為體型巨大和新約聖經中所說利維坦（Leviathan）有一些相似性，也擁有翅膀，但《約伯記》中的插畫形象比較像東方古代的龍，有長條形的體型，與之不同的是沒有腳。","古希臘北部馬其頓國王。生於佩拉，到16歲為止一直由亞里士多德任其導師。30歲時，已經創立歷史上最大的帝國之一，其疆域從愛奧尼亞海一直延伸到印度河流域。他一生未嘗敗績，被認為是歷史上最成功的軍事統帥之一"]
var id,send,reset,translateLang,FontColorSelected,FontSizeSelected,FontFamilySelected;
var font,sample;//將字幕顯示區的id存入此變數即可
var iframe,textarea,readRealSubtitle;
var counter=-150,lineArray,sentenceline=0;
var ani;

window.onload=function(){
    id=document.getElementById("id");
    send=document.getElementById("send");
    reset=document.getElementById("reset"); 
    translateLang=document.getElementById("translateLang");
    chatroom=document.getElementById("chatroom");
    //------這邊到時將2456改成字幕顯示區的ID----
    //font=document.getElementById("realtimeSubtitle");
    sample=document.getElementById("sample");
    //-------------------------------------
    iframe=document.getElementById("iframe");
    textarea=document.getElementById("textarea");
    readRealSubtitle=document.getElementById("realtimeSubtitle");
    FontColorSelected=document.getElementById("FontColorSelected");
    FontSizeSelected=document.getElementById("FontSizeSelected");
    FontSizeSelected.stepDown(1);
    FontSizeSelected.stepUp(1);
    FontFamilySelected=document.getElementById("FontFamilySelected");
    firebase.initializeApp(config);
    
    lineArray=new Array();
    
    send.addEventListener("click",setID);
    FontColorSelected.addEventListener("change",setSampleFontColor);
    FontSizeSelected.addEventListener("change",setSampleFontSize);
    FontFamilySelected.addEventListener("change",setSampleFontFamily);
}

function readRealtimeSubtitle(id){//讀取及時字幕
    var string;
    firebase.database().ref('users/'+ id +"/Subtitle").on("child_added", function(snapshot) {
        setTimeout(function(){
            string=JSON.stringify(snapshot.val());
            var substr=string.substr(1,string.length-2);
            for(var i=0;i<keywords.length;i++){
                if(string.indexOf(keywords[i])!=-1){
                    document.getElementById("keywordtitle").innerHTML=keywords[i];
                    document.getElementById("keyword").innerHTML=keywordcontent[i];
                }
            }
            readRealSubtitle.innerHTML=substr;
        },15500);
    }, function (errorObject) {
       readRealSubtitle.innerHTML="The read failed: " +errorObject.code;
    });
      
    /*firebase.database().ref('users/'+id+'/StartEndTime').on("child_added", function(snapshot) {
         lineArray.push(snapshot.val());
    });
    firebase.database().ref('users/'+id+'/Timecount').once("value").then(function(timedata){
        counter=counter+timedata.val();
        alert(counter);
    });
    setInterval(function(){
        counter++;
        if(counter==lineArray[sentenceline*2]){
           alert(counter); firebase.database().ref('users/'+id+'/Subtitle/'+sentenceline).once("value").then(function(data){
                string=JSON.stringify(data.val());
                readRealSubtitle.innerHTML=string.substr(1,string.length-2);
            });
            sentenceline++;
         }
    },1000);*/
}

function readSubtitle(id){//讀取所有字幕
    var text;
    var string;
    firebase.database().ref('users/'+ id +"/Subtitle").on("child_added", function(snapshot) {
        setTimeout(function(){
            string=JSON.stringify(snapshot.val());
            getTranslateResponse(string.substr(1,string.length-2));
            text = document.createTextNode(string.substr(1,string.length-2)+"\n");
            textarea.appendChild(text);
        },15500);
    }, function (errorObject) {
        text = document.createTextNode("The read failed: " + errorObject.code);
        textarea.appendChild(text);
    });
   
}

function setID(){
    var ID=id.value;
    iframe.src="https://player.twitch.tv/?channel="+ID;
    chatroom.src="https://www.twitch.tv/"+ID+"/chat?popout=";
    readRealSubtitle.style.color=FontColorSelected.value; 
    readRealSubtitle.style.fontSize=FontSizeSelected.value+"px";
    readRealSubtitle.style.fontFamily=FontFamilySelected.value;
    $("#page2").trigger("click");
    readSubtitle(ID);
    readRealtimeSubtitle(ID);
}
function setSampleFontColor()
{
    sample.style.color=FontColorSelected.value;
}
function setSampleFontSize()
{
    sample.style.fontSize=FontSizeSelected.value+"px";
}
function setSampleFontFamily()
{
    sample.style.fontFamily=FontFamilySelected.value;
}
function slices(text,n){
    if(text.length>n){
        readRealSubtitle.appendChild(document.createTextNode(text.substring(0,n)));
        readRealSubtitle.appendChild(document.createElement("br"));
        slices(text.slice(n),n);
    }
    else{
        readRealSubtitle.appendChild(document.createTextNode(text));
        return text;
    }
}
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
