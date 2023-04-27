"use strict";

//定義
const GAME_FPS = 1000/60;
let mode = 0;
let importedFile = null;
let usedArray=[];//使われる配列
let checktext =[];
let readyTime = 180;
let starttime = null;
let fTime = null;//finishtime
 

const mainloop_screen = () => {
    switch(mode){
        case 0:
            mode++;
            break;
        case 1:
            //title
            draw_title();
            mode++;
            break;
        case 2:
            //import
            if(importedFile!==null){
                mode++;
            }
            break;
        case 3:
            //配列化
            csvToArray(importedFile);
            mode++;
            break;
        case 4:
            //画面消す
            clear_screen();
            mode++;
            break;
        case 5:
            //html記述
            draw_gamearea();
            starttime = performance.now();
            mode++;
            break;
        case 6:
            readyTimer();
            break;
        case 7:
            wordset();
            mode++;
            break;
        case 8:
            game();
            break;
        case 9:
            gamefinish();
            mode++;
            break;
            //

        }
    window.requestAnimationFrame(mainloop_screen);
}
window.requestAnimationFrame(mainloop_screen);




function draw_title(){
    $("#mainarea").append(
        `<div id="title">
            <div class="titlearea">TypingGame</div>
            <input type="file" class="filearea" id="input" onchange="loadFile(this)">
        </div>`
    )
}

function loadFile(input){
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(){
        importedFile = reader.result;
    };
    reader.onerror = function(){
        console.log(reader.onerror);
    };
}

function csvToArray(file){
    let lines = file.split(/\r\n|\n|\r/);
    let table = lines.map(function(line){
        return line.split(',');
    });
    usedArray = table; 
}

function clear_screen(){
    const title_element = document.getElementById("title");
    title_element.remove();
}

function draw_gamearea(){
    $("#mainarea").append(
        `<div class="secondscr" id="secondscr">
            <div class="mainarea1" id="text1">
                <div id="count"></div>
            </div>
            <div class="mainarea2" id="text2">
                <span id="typed"></span><span id="untyped"></span>
            </div>
        </div>`
    )
}

function readyTimer(){
    readyTime--;
    const count = document.getElementById("count");
    count.innerHTML=readyTime;
    count.innerHTML=parseInt(readyTime/60+1);
    if(readyTime<=0){
        count.remove();
        mode++;
    }
}

function randamArray(){//usedArrayの値をランダムにした配列 
    for(let i= usedArray.length -1;i>=0;i--){
        let rand = Math.floor(Math.random()*(i+1));
        [usedArray[i],usedArray[rand]]=[usedArray[rand],usedArray[i]]
    }
    return usedArray;
}


function wordset(){
    randamArray();

}

function isFinish(){
    if(usedArray.length-1===qNum){
        return true;
    }
    return false;
}


let eFlug = false;//一問終わった時のflug
let qNum = 0;
let typed = '';
let untyped;

let typedField;
let untypedField;
let text1;
let sFlug =true;//set用のflug

function set(qNum){
    text1.innerHTML = '<div>'+ usedArray[qNum][0] +'<div>';
    typed ='';
    untyped = usedArray[qNum][1];
    typedField.innerHTML = typed;
    untypedField.innerHTML = untyped;
}

function game(){

    typedField = document.getElementById('typed');
    untypedField = document.getElementById('untyped');
    text1 = document.getElementById("text1");


    if(eFlug){
        qNum++;
        eFlug = false;
        sFlug = true;
    }


    if(sFlug){
        set(qNum);
        sFlug = false;
    }

    document.addEventListener('keydown',function(e){
        if(e.key!==untyped.substring(0,1)){return ;}
        typed = typed + untyped.substring(0,1);
        untyped = untyped.substring(1);

        typedField.innerHTML = typed;
        untypedField.innerHTML = untyped;

        if(untyped===''){
            eFlug = true;
            if(isFinish()){
                mode++;
                fTime = performance.now();
            }
        }
    });
}

function gamefinish(){
    const sscr = document.getElementById("secondscr");
    sscr.remove();

    $("#mainarea").append(
        `<div class="finishscr">
            <div id="endtime"></div>
            <div id="end">完了</div>
        </div>`
    );

    const endtime = document.getElementById("endtime");

    let Atime = Math.floor(fTime-starttime);


    endtime.innerHTML = ( Atime )+ "ミリ秒";


}

