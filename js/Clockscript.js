//var leftcanvas = document.getElementById('leftoptioncanvas'),
//leftcontext = leftcanvas.getContext('2d'),
canvas = document.getElementById('currentclockcanvas'),
    context = canvas.getContext('2d'),
    refreshClockCanavas = document.getElementById('refreshClock'),
    refreshClockContext = refreshClockCanavas.getContext('2d'),
    helpCanavas = document.getElementById('helpCan'),
    helpContext = helpCanavas.getContext('2d'),
    lowerbase4canvas = document.getElementById('lowerbase4canvas');
lowerbase4context = lowerbase4canvas.getContext('2d'),
    lowerbase5canvas = document.getElementById('lowerbase5canvas');
lowerbase5context = lowerbase5canvas.getContext('2d');




//var appfont = "isgvf-font";
var appfont = "Helvetica Neue,Helvetica,Arial,sans-serif";

var currentDate;
var settingmode = false;
var monthNum, yearNumSetting;

var timeLimitArcColor = "#00ACC1"; //"#0099CC";
var timeLimitArcColorRGB = "rgba(0,172,193,0.7)";
var fadeIn = true;
var fadeInClock = true;
var reloadClockAnimation = false;
var todayAutoPrayertimes;
//leftcanvas1 = document.getElementById('leftoptioncanvas2'),
//leftcontext1 = leftcanvas1.getContext('2d');


var clocksArray = [{
        FIRST: {
            "name": "name",
            "time": "10 min",
            "next": "UP",
            "maxtime": "maxtime",
            "mintime": "mintime",
            "steps": []
        },
        SECOND: {
            "name": "name",
            "time": "10 min",
            "next": "UP",
            "maxtime": "maxtime",
            "mintime": "mintime",
            "steps": []
        },
        THIRD: {
            "name": "name",
            "time": "10 min",
            "next": "UP",
            "maxtime": "maxtime",
            "mintime": "mintime",
            "steps": []
        },
        FOURTH: {
            "name": "name",
            "time": "10 min",
            "next": "UP",
            "maxtime": "maxtime",
            "mintime": "mintime",
            "steps": []
        },
        FIFTH: {
            "name": "name",
            "time": "10 min",
            "next": "UP",
            "maxtime": "maxtime",
            "mintime": "mintime",
            "steps": []
        },
        CURRENT: {
            "name": "name",
            "time": "10 min",
            "next": "UP",
            "maxtime": "maxtime",
            "mintime": "mintime",
            "steps": []
        },
    }],

    clockSequence = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH"],

    font = 35,
    padding = 55,
    x = canvas.width / 25,
    Hx = canvas.width / 10,
    space = 20,
    r = canvas.width / 2 - (padding + 15),
    smallRadius = 25;
Hr = r + space;
var sunrise;
var currentPrayerIndex = -1;
var currentCanvasName = "";

//var times;
var prayerClockIns;
var clockTitle = "";

function createCircle(mycanvas, lineWidth, radius) {
    mycontext = mycanvas.getContext("2d");
    mycontext.beginPath();
    mycontext.arc(mycanvas.width / 2, mycanvas.height / 2, radius, 0, Math.PI * 2, true);
    //mycontext.fillStyle = '#212124';
    // mycontext.fill();
    mycontext.lineWidth = lineWidth;
    mycontext.strokeStyle = 'white';
    mycontext.stroke();
}

function createCenter(mycanvas, mylineWidth, radius, color) {
    mycontext = mycanvas.getContext("2d");
    mycontext.beginPath();
    mycontext.fillStyle = color;
    mycontext.lineWidth = mylineWidth;
    mycontext.arc(mycanvas.width / 2, mycanvas.height / 2, radius, 0, Math.PI * 2, true);
    mycontext.fill();
}

function createTimeLimitArc(givenTime, startTime, endTime, next, radius, lineWidth, context, darwArrow) {
    context.beginPath();
    context.strokeStyle = 'white';
    var stAngle = convertTimeToRadianAngle(startTime),
        enAngle = convertTimeToRadianAngle(endTime);

    // size of the arrow
    sdate1 = new Date(givenTime.getTime() - 8 * 60 * 1000),
        sdate3 = new Date(givenTime.getTime() + 8 * 60 * 1000),

        stAngle1 = convertTimeToRadianAngle(sdate1), //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
        enAngle2 = convertTimeToRadianAngle(sdate3); //(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;

    context.fillSyle = 'blue';
    context.lineWidth = 2;

    if (darwArrow) {
        if (next == 'UP') {
            arrowType = 1;
        } else if (next == 'DOWN') {
            arrowType = 3;
        } else {
            arrowType = 0;
        }
        //console.log("darwArrow"+darwArrow+"next:"+next+"arrowType"+arrowType);
        drawArcedArrow(context, canvas.width / 2, canvas.height / 2, radius - 15, stAngle1, enAngle2, false, 2, arrowType);
    }
    context.stroke();
    context.beginPath();
    context.lineWidth = lineWidth;
    context.strokeStyle = timeLimitArcColor;

    /**
     *  Below four line to create a shadow effect. Save the previous setting
     *  of context here to restore it after drawing arc. This will help us
     *  to limit shadow effect only for the arc.
     */
    context.save();
    context.shadowColor = 'white';
    context.shadowBlur = 40;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.arc(canvas.width / 2, canvas.height / 2, radius, stAngle, enAngle, true);
    context.fillSyle = '#FF3300';
    context.stroke();
    context.restore();
}

function createClockAnimation(canvasIndexPassed) {

    //console.log("Is it running..");
    var canvasIndex = 7;
    var radius = r;
    lineWidth = 2;
    isSmallClock = true;
    for (var index in clocksArray[0]) {
        //console.log(clocksArray[0].CURRENT.name);
        if(index == 'CURRENT'){
            break;
        }

        var timeAnimation = false;
        animateSteps = clocksArray[0][index].steps;
        
        /*
        if (clocksArray[0].CURRENT.name == clocksArray[0][index].name) {
            canvas = document.getElementById('currentclockcanvas');
            var ratio = canvas.width / canvas.height;
            if (ratio > 0.60) {
                radius = canvas.height / 2 - canvas.height / 7;
            } else {
                radius = canvas.width / 2 - canvas.width / 12;
            }
            lineWidth = radius * 0.05;
            isSmallClock = false;

            var canvasName = 'lowerbase' + canvasIndex + 'canvas';
            canvas = document.getElementById(canvasName);
            radius = canvas.width / 2 - canvas.width / 12;
            lineWidth = 3;
            isSmallClock = true;
            //canvasIndex++;

        } else {
        */
            var canvasName = 'lowerbase' + canvasIndex + 'canvas';
            canvas = document.getElementById(canvasName);
            radius = canvas.width / 2 - canvas.width / 12;
            lineWidth = 3;
            isSmallClock = true;
            canvasIndex++;
        //}
        if (animateSteps.length > 0) {
            var timeDiff = animateSteps[0].getTime() - clocksArray[0][index].time.getTime();
            var sdate = new Date(clocksArray[0][index].maxtime.getTime() + timeDiff);
            var edate = new Date(clocksArray[0][index].mintime.getTime() + timeDiff);
            // edate = new Date(animateSteps[0].getTime() - 60* 60 * 1000);
            //console.log(formDateToString(clocksArray[0][index].maxtime));

            if (animateSteps.length == 1) {
                timeAnimation = true;
            }
            createClock(canvas, animateSteps[0], sdate, edate,
                clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock, timeAnimation);
            animateSteps = animateSteps.slice(1);
        } else {
            clearTimeout(animateloop);
        }
        clocksArray[0][index].steps = animateSteps;

    }
}

function refreshClock() {
    //console.log("Update Clock:"+date.getHours()+":"+date.getMinutes());
    canvasIndexPassed = 7; // 7 is the canvas number defined in index.html. It will start with lowerbase7canvas;

    //if (reloadClockAnimation == true) {
    //    reloadClockAnimation = false;
        //reloadClockWithTodayDate();
        //createClockAnimation(15);
    //}

    // var currentTimeChanged = updatePrayerClockTime();

    //fillClockArray();
    var currentTimeChanged = false;
    var todayDate = new Date();
    //var currentTime = formDateToString(todayDate);

    // if(clocksArray[0][currentPrayerIndex] != null){
    //     if (formDateToStringHMMA(clocksArray[0][currentPrayerIndex].time) == formDateToStringHMMA(todayDate) || updatePrayerClockTime() ) {
    //         currentTimeChanged = true;
    //     }else{
    //         currentTimeChanged = false;
    //     }
    // }

    if(clocksArray[0][currentPrayerIndex] != null){
       var color="red";
        if (formDateToStringHMMA(clocksArray[0][currentPrayerIndex].time) == formDateToStringHMMA(todayDate) ) {
            //        color="red";
            if(fadeInClock){

            $("#"+currentCanvasName).css("background", "none");
                    fadeInClock = false;
            }else{
            $("#"+currentCanvasName).css("background", "rgba(255,207,0,0.6)");
                fadeInClock = true;
            }
        }else{
            //$("#lowerbase7canvas").css("background", "yellow");
        }
        // var canvasName = 'lowerbase7canvas';
        
        //mycontext = mycanvas.getContext("2d"),
        
        //mycontext.strokeStyle = color;

    }

    var currDateForAnim = new Date();
    if (currentPrayerIndex != -1) {
        var currTimeForAnim = new Date();
        currTimeForAnim.setHours(clocksArray[0][currentPrayerIndex].time.getHours());
        currTimeForAnim.setMinutes(clocksArray[0][currentPrayerIndex].time.getMinutes() + 1);
        currTimeForAnim.setSeconds(0);

        //console.log(currDateForAnim+"CUrren prayer time:"+currTimeForAnim);
        console.log(formDateToStringHMMA(currDateForAnim)+"CUrren prayer time:"+formDateToStringHMMA(currTimeForAnim));

        if (formDateToStringHMMA(currDateForAnim) === formDateToStringHMMA(currTimeForAnim)) {
            console.log("Matched...");
            animateloop = setInterval(createClockAnimation, 15);
        }
    }

    var currentTimeChanged = updatePrayerClockTime();

   
    
    updateTimeWidget();
    
    

    var currentPrayerName  = getCurrentPrayerTime().name;
    console.log("Upcoming prayer :"+currentPrayerName+ " -- currentTimeChanged  ::" + currentTimeChanged);
    if (settingmode == false) {
        if (currentTimeChanged) {
            clocksArray[0].CURRENT.name =  currentPrayerName;
            createUtilityIcon();
            createFixedUtilityIcon();

            var canvasIndex = canvasIndexPassed;
            var radius = r;
            lineWidth = 2;
            isSmallClock = true;
            for (var index in clocksArray[0]) {
                if(index == 'CURRENT'){
                    break;
                }
                animateSteps = clocksArray[0][index].steps;

                /*
                if (clocksArray[0].CURRENT.name == clocksArray[0][index].name) {
                    canvas = document.getElementById('currentclockcanvas');
                    var ratio = canvas.width / canvas.height;
                    if (ratio > 0.60) {
                        radius = canvas.height / 2 - canvas.height / 7;
                    } else {
                        radius = canvas.width / 2 - canvas.width / 12;
                    }
                    lineWidth = radius * 0.05;
                    isSmallClock = false;
                    //console.log(canvas.width+"radius" + radius+"-->"+isSmallClock);


                    //var canvasName = 'lowerbase'+canvasIndex+'canvas';
                    //canvas = document.getElementById(canvasName);
                    //radius = canvas.width/2 - canvas.width/12; lineWidth = 2; isSmallClock = true;
                    //createClock(canvas, clocksArray[0][index].time,clocksArray[0][index].maxtime, clocksArray[0][index].mintime, 
                    //clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock);
                    //canvasIndex++;
                } else {
                */
                    //$("#clock"+canvasIndex).css("background-color","blue");
                    var canvasName = 'lowerbase' + canvasIndex + 'canvas';
                    if (getCurrentPrayerTime().name == clocksArray[0][index].name) {
                        //$("#clock"+canvasIndex).css("padding-top","10px");
                        $("#" + canvasName).css("background", "rgba(255,207,0,0.6)");
                        $("#" + canvasName).css("border-bottom", "3px solid white");
                        currentPrayerIndex = index;
                        currentCanvasName = canvasName;

                    } else {
                        $("#" + canvasName).css("background", "none");
                        $("#" + canvasName).css("border-bottom", "");
                    }

                    canvas = document.getElementById(canvasName);
                    radius = canvas.width / 2 - canvas.width / 12;
                    lineWidth = 2;
                    isSmallClock = true;
                    //console.log(canvas.width+"radius" + radius+"-->"+isSmallClock+"canvasName"+canvasName);
                    //console.log(canvas.width+"radius" + radius+"-->"+isSmallClock+"canvasName"+canvasName);

                    createClock(canvas, clocksArray[0][index].time, clocksArray[0][index].maxtime, clocksArray[0][index].mintime,
                        clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock);


                    //canvasName = 'lowerbase'+(canvasIndex-4)+'canvas';
                    // if(canvasName != 'lowerbase1canvas' || ){
                    // canvas = document.getElementById(canvasName);
                    //      createClock(canvas, clocksArray[0][index].time,clocksArray[0][index].maxtime, clocksArray[0][index].mintime, 
                    //         clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock);
                    // }
                    canvasIndex++;

                //}
            }
        }
    }



}

function createHand(mycanvas, loc, isHour, width, radius, color) {
    var x = mycanvas.width / 8,
        Hx = mycanvas.width / 15,
        mycontext = mycanvas.getContext("2d"),
        angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2,
        handRadius = isHour ? radius - x - Hx : radius - x;
    mycontext.beginPath();
    mycontext.lineWidth = 10;
    mycontext.strokeStyle = color;
    //mycontext.globalAlpha=1;

    if (!isHour) {
        // mycontext.strokeStyle = 'rgba(245,245,245,0.7)';
        //mycontext.globalAlpha=0.7;
    }
    //mycontext.fillStyle=rgba(41, 226, 41, 0.33);
    mycontext.lineCap = 'round';
    mycontext.moveTo(mycanvas.width / 2, mycanvas.height / 2);
    mycontext.lineTo(mycanvas.width / 2 + Math.cos(angle) * handRadius, mycanvas.height / 2 + Math.sin(angle) * handRadius);
    mycontext.stroke();
}

function createHands(mycanvas, date, radius, lineWidth) {

    hour = date.getHours();
    hour = hour > 12 ? hour - 12 : hour;
    var minLineWidth = (lineWidth > 3) ? lineWidth - 2 : lineWidth;
    //console.log(minLineWidth+"--->lineWidth"+lineWidth);
    createHand(mycanvas, hour * 5 + (date.getMinutes() / 60) * 5, true, lineWidth, radius, 'rgba(245,245,245,0.8)');
    createHand(mycanvas, date.getMinutes(), false, minLineWidth, radius, "rgba(245,245,245,0.6)");
    //createSechand(date.getSeconds(), false, 0.2);
}

function createClock(canvas, animateDate, sdate, edate, name, next, lineWidth, radius, isSmallClock) {

    console.log("Inside CLock createClock::");
    var minLineWidth = (lineWidth > 3) ? lineWidth - 2 : lineWidth;
    var context = canvas.getContext("2d");
    //console.log(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    var todayDate = new Date();
    var currentTime = formDateToString(todayDate);
    //radius = canvas.width - padding;
    //console.log(canvas.width+":"+canvas.height+","+radius);
    if (!isSmallClock) {
        createCircle(canvas, minLineWidth - 1, radius);
        createTimeLimitArc(animateDate, sdate, edate, next, radius + 2, minLineWidth, context, true);
        writeTimeInClock(animateDate, context, canvas, radius);

        context.font = "lighter 20px Source Sans Pro";
        writeInfoInClock(context, clockTitle + " - " + currentTime, radius + 15, 'UP', 'BIG');
        //writeInfoInClock(context,"Prayer time is not updated.", radius+15,'UP', 'BIG');
        writeInfoInClock(context, name, radius + 15, 'DOWN', 'BIG');
        createCenter(canvas, lineWidth, lineWidth, 'white'); //2,3        
    } else {
        createCircle(canvas, lineWidth, radius + 5);

        //createTimeLimitArc(animateDate, sdate, edate, next, radius+5, minLineWidth, context, true);
        createCenter(canvas, lineWidth, lineWidth + 1, 'white'); //2,3
        //context.font="lighter 12px Source Sans Pro";
        var ampm = formDateToStringHMMA(animateDate).indexOf("AM");
        var info = formDateToStringHMM(animateDate);
        //console.log(formDateToStringHMMA(animateDate)+"pppp"+ampm);
        writeInfoInClock(context, info, radius, 'DOWN', 'SMALL');
        writeAMPMfterTime(context, info, radius, ampm);

        writeInfoInClock(context, name, radius, 'UP', 'SMALL');

    }

    var hour = animateDate.getHours();
    //console.log(formDateToStringHMM(animateDate)+"-->"+formDateToStringHMM(todayDate)+","+fadeIn);
    if (formDateToStringHMMA(animateDate) == formDateToStringHMMA(todayDate)) {
        reloadClockAnimation = true;
        if (isSmallClock) {
            if (fadeIn) {
                //canvas.style.display="none";
                //document.getElementById('currentclockcanvas').style.display="none";
                createCenter(canvas, lineWidth, lineWidth + 1, 'white');
                createHand(canvas, hour * 5 + (animateDate.getMinutes() / 60) * 5, true, lineWidth, radius, 'white');
                createHand(canvas, animateDate.getMinutes(), false, minLineWidth, radius, "rgba(245,245,245,0.7)");

                fadeIn = false;

            } else {
                //canvas.style.display="block";
                createCenter(canvas, lineWidth, lineWidth + 1, timeLimitArcColor);
                createHand(canvas, hour * 5 + (animateDate.getMinutes() / 60) * 5, true, lineWidth, radius, timeLimitArcColor);
                createHand(canvas, animateDate.getMinutes(), false, minLineWidth, radius, timeLimitArcColorRGB);

                //document.getElementById('currentclockcanvas').style.display="block";
                fadeIn = true;
            }
        }
    } else {
        createCenter(canvas, lineWidth, lineWidth + 1, 'white');
        createHand(canvas, hour * 5 + (animateDate.getMinutes() / 60) * 5, true, lineWidth, radius, 'rgba(245,245,245,0.7)');
        createHand(canvas, animateDate.getMinutes(), false, minLineWidth, radius, "rgba(245,245,245,0.6)");
        //writeHourNumberInClock(context, canvas, "232",radius,"IP", 12);
        //writeRomanHourNumberInClock(context, canvas, radius);
        drawHourMarkInClock(context, canvas, radius);
    }

}

function writeHourNumberInClock(context, canvas, info, radius, where, size) {
    context.beginPath();
    var x = canvas.width / 2;
    info = info.toUpperCase();
    var gap = 0;
    var ugap = 0;

    context.font = fontsize + "px " + appfont;
    var infoWidth = context.measureText(info).width;
    context.shadowColor = '#333';
    context.shadowBlur = 10;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;

    context.fillText("12", canvas.width / 2 - 12, canvas.height / 2 - radius + 20);
    context.fillText("3", canvas.width / 2 + radius - 20, canvas.height / 2 + 5)
    context.fillText("6", canvas.width / 2 - 8, canvas.height / 2 + radius - 4);
    context.fillText("9", canvas.width / 2 - radius + 6, canvas.height / 2 + 5);

}

function drawHourMarkInClock(context, canvas, radius) {
    context.beginPath();
    var x = canvas.width / 2;
    // info = info.toUpperCase();
    var gap = 0;
    var ugap = 0;
    var hourMark = 1;

    context.font = fontsize + "px " + appfont;

    context.lineCap = 'square';
    context.moveTo(canvas.width / 2, canvas.height / 2 - radius - hourMark);
    context.lineTo(canvas.width / 2, canvas.height / 2 - radius);

    context.moveTo(canvas.width / 2, canvas.height / 2 + radius - hourMark);
    context.lineTo(canvas.width / 2, canvas.height / 2 + radius);

    context.moveTo(canvas.width / 2 + radius - hourMark, canvas.height / 2);
    context.lineTo(canvas.width / 2 + radius, canvas.height / 2);

    context.moveTo(canvas.width / 2 - radius - hourMark, canvas.height / 2);
    context.lineTo(canvas.width / 2 - radius, canvas.height / 2);

    context.stroke();


}

function writeRomanHourNumberInClock(context, canvas, radius) {
    context.beginPath();
    var x = canvas.width / 2;
    //info = info.toUpperCase();
    var gap = 0;
    var ugap = 0;

    context.font = fontsize + "px " + appfont;
    //var infoWidth = context.measureText(info).width;


    context.fillText("XII", canvas.width / 2 - 12, canvas.height / 2 - radius + 20);
    context.fillText("III", canvas.width / 2 + radius - 20, canvas.height / 2 + 5)
    context.fillText("VI", canvas.width / 2 - 8, canvas.height / 2 + radius - 4);
    context.fillText("IX", canvas.width / 2 - radius + 6, canvas.height / 2 + 5);

}

function writeRomanHourNumberInClock(context, canvas, radius) {
    context.beginPath();
    var x = canvas.width / 2;
    //info = info.toUpperCase();
    var gap = 0;
    var ugap = 0;

    context.font = fontsize + "px " + appfont;
    //var infoWidth = context.measureText(info).width;


    context.fillText("XII", canvas.width / 2 - 12, canvas.height / 2 - radius + 20);
    context.fillText("III", canvas.width / 2 + radius - 20, canvas.height / 2 + 5)
    context.fillText("VI", canvas.width / 2 - 8, canvas.height / 2 + radius - 4);
    context.fillText("IX", canvas.width / 2 - radius + 6, canvas.height / 2 + 5);

}




function writeTimeInClock(sdate, context, canvas, radius) {

    context.beginPath();
    context.strokeStyle = 'white';
    //context.font="lighter 30px Source Sans Pro";//Sans Pro, Source Sans Pro, Open Sans
    context.font = Math.round(radius / 4.5) + "px " + appfont;
    context.fillStyle = "white";
    //var x = canvas.width/2 - (r - 10),
    //height = canvas.height/2 - 20;
    hour = sdate.getHours(),
        am = "AM";

    if (hour > 12) {
        hour = hour - 12;
        am = "PM";
    } else if (hour == 0) {
        hour = 12;
    }

    var dim = getDimToWriteInsideClock(canvas, sdate, radius);

    var crTime = formDateToStringHMM(sdate);
    //console.log("writeTimeInClock"+dim+"radius"+radius+"crTime"+crTime);
    // var timeWidth = context.measureText(crTime).width;
    // console.log(hour+":"+sdate.getMinutes());

    //if(radius > 150){
    //context.font="lighter "+Math.round(radius/3)+"px Source Sans Pro";//Sans Pro, Source Sans Pro, Open Sans
    //}else{
    //    context.font="lighter 50px Source Sans Pro";//Sans Pro, Source Sans Pro, Open Sans        
    //}

    var width = context.measureText(crTime).width;
    var height = context.measureText(crTime).height;

    //context.beginPath();
    //context.fillText(hour,dim[0],dim[1]);
    //Sans Pro, Source Sans Pro
    context.fillText(crTime, dim[0], dim[1]);
    context.stroke();
}

function writeInfoInClock(context, info, radius, where, size) {
    context.beginPath();
    var x = canvas.width / 2;
    info = info.toUpperCase();
    var gap = 0;
    var ugap = 0;
    if (size == 'BIG') {
        ugap = radius * 0.10;
        gap = radius * 0.18;
        fontsize = Math.round(radius / 4);
        if (where == 'UP') {
            fontsize = fontsize - 10;
        } else {
            fontsize = fontsize - 5;
        }
    } else {
        ugap = 30;
        gap = radius * 0.50;
        if (where == 'UP') {
            fontsize = Math.round(radius / 4);
        } else {
            fontsize = Math.round(radius / 2.5);
        }

    }
    context.font = fontsize + "px " + appfont;
    if (where == 'UP') {
        height = canvas.height / 2 - (radius + ugap);
    } else if (where == 'DOWN') {
        height = canvas.height / 2 + radius + gap;
    }
    var infoWidth = context.measureText(info).width;
    context.shadowColor = '#333';
    context.shadowBlur = 10;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;

    context.fillText(info, x - (infoWidth / 2), height);

    if (where == 'DOWN') {
        // fontsize = Math.round(radius/3*0.5);
        // context.font=fontsize+"px Calibri";

        // var aWidth = context.measureText("A").width;    
        // context.fillText("A", canvas.width/2 + infoWidth/2 + 4, height - 10);

    }
    //var aWidth = leftcontext.measureText("M").width;    
    //leftcontext.fillText("M",leftcanvas.width/2 + timeWidth/2 + 1, leftcanvas.height/2 -3 );

    context.stroke();
}


function writeAMPMfterTimeVertical(context, info, ampm) {
    context.beginPath();
    var radius = canvas.width * 0.10;
    var gap = radius * 0.50;
    var height = canvas.height / 2 + radius + gap;
    var infoWidth = context.measureText(info).width;
    var fontsize = Math.round(radius / 3 * 0.4);
    context.font = fontsize + "px Calibri";
    var achar = "A";
    var aWidth = context.measureText(achar).width;

    if (ampm == -1) {
        achar = "P";
        aWidth = context.measureText(achar).width;
    }

    context.fillText(achar, canvas.width / 2 + infoWidth / 2 + 6, height - 10);

    aWidth = context.measureText("M").width;
    context.fillText("M", canvas.width / 2 + infoWidth / 2 + 4, height);
    context.stroke();

}


function getAnimationSteps(sdate, steps) {
    /**
     * This function stores 15 timestamp,
     * (15 minutes - given time) and store it in an array
     * to be used for the animation on load of clock.
     */
    edate = new Date(sdate.getTime() - steps * 60 * 1000);
    var animateStepForClock = [];
    for (; edate.getTime() <= sdate.getTime();) {
        animateStepForClock.push(new Date(edate.getTime()));
        edate.setMinutes(edate.getMinutes() + 1);
    }
    return animateStepForClock;
}

function setupPrayerTimeSetting() {
    //var clockSetting = clockSetting.getPrayerClockSetting('sETTING');
    $('#header-title').text(clockSetting.getName());
    $('#header-subtitle').text(clockSetting.getWebsite());
    $('#scrollingmessage').text(clockSetting.getAllActiveDateMessage());
}


function setupSlider() {

    // Get all the file names from the folder;

    //var m = ["images/enter.jpg", "images/exit.jpg"];
    var m = clockSetting.getAllActiveSlides();
    for (var i = 0; i < m.length; i++) {
        var delay = m[i].delayinsec;
        var type = m[i].type;
        $('<li data-target="#myCarousel" data-slide-to="' + (i) + '"></li>').appendTo('.carousel-indicators');
        if (type === 'dailytime') {
            $('#myCarousel').find('#dailytime').attr('data-interval', delay * 1000);
        } else {
            $('<div class="item" style="height:auto" data-interval="' + delay * 1000 + '"><div class="container">' +
                '<img src="' + m[i].source + '" style="padding-top:20px;width:900px;height:530px">' +
                '</div><div class="carousel-caption"></div>   </div>'
            ).appendTo('.carousel-inner');
        }

    }

    if (!clockSetting.isSlidingOn()) {
        $('#myCarousel').carousel({
            interval: false
        });
    }

    $('.item').first().addClass('active');
    $('.carousel-indicators > li').first().addClass('active');



    var t;

    var start = $('#myCarousel').find('div.active').attr('data-interval');
    //t = setTimeout("$('#myCarousel').carousel('cycle');", start-1000);
    t = setTimeout("$('#myCarousel').carousel({interval: 1000});", start - 1000);


    $('#myCarousel').on('slid.bs.carousel', function() {
        clearTimeout(t);
        var duration = $(this).find('div.active').attr('data-interval');

        $('#myCarousel').carousel('pause');
        t = setTimeout("$('#myCarousel').carousel();", duration - 1000);


        var currentIndex = $('div.active').index() + 1;
        console.log("currentIndex:" + currentIndex);
        if (currentIndex == 1) {
            $("#utilityfooter").fadeIn("slow");
            // $("#utilityfooter").show();
            $("#iqama-time").show();

        } else {
            $("#utilityfooter").fadeOut("slow");
            // $("#utilityfooter").hide();  
            $("#iqama-time").hide();
        }

    });



}

function setupApp() {

    setupPrayerTimeSetting();
    setupSlider();


    var date = new Date(); // today
    currentDate = date;
    mode = 'manual'; // manual
    dayLightSaving = 'auto',
        method = 'ISNA';
    if (mode == 'auto') {
        prayerClocks.initClock(date.getFullYear(), method, [40.06, -122.4212], -8, dayLightSaving);
        prayerClockIns = prayerClocks.getPrayerClockForDay(date);
    } else {
        prayerClocks.initManualClock(date.getFullYear(), method, [37.7933, -122.4212], -8, dayLightSaving);
        prayerClockIns = prayerClocks.getPrayerClockForDay(date);
        clockTitle = prayerClocks.getPrayerClockConfig()[0].title;
        //prayerClockIns = prayerClocks.getManualPrayerClockForDay(date);
    }

    prayTimes.setMethod(method);
    todayAutoPrayertimes = prayTimes.getTimes(new Date(), [40.0319, -75.4555], -5); // 40.066955, -75.433935
    console.log("Sunrise : " + todayAutoPrayertimes['sunrise']);
    console.log('Noon : ' + todayAutoPrayertimes['dhuhr']);
    //loadSetting(currentDate.getMonth(),currentDate.getFullYear());

    //prayTime.midDay();

    //console.log(prayerClockIns);


    //refreshClockCanavas.addEventListener('click', function(event) {
    //    reloadClockWithTodayDate();
    //}, false);

    lowerbase4canvas.addEventListener('click', function(event) {
        reloadClockWithLeft();
    }, false);

    lowerbase5canvas.addEventListener('click', function(event) {
        reloadClockWithRight();
    }, false);

    lowerbase3canvas.addEventListener('click', function(event) {
        loadSetting(currentDate.getMonth(), currentDate.getFullYear());
    }, false);

    currentclockcanvas.addEventListener('click', function(event) {
        showMaxMinTime();
    }, false);

    //helpCanavas.addEventListener('click', function(event) {
    //    showHelp();
    //}, false);




    //$('#myCarousel').carousel('pause');
    /*
    $('#myCarousel').carousel({
        //interval:2000,
        pause: "true"
    });
    */

    // http://jsfiddle.net/hibbard_eu/gars3/
    /*
    $('#myCarousel').carousel({
        interval: true
    });

    
    var i;

    $('.carousel-control').on("mouseover", function () {
        var control = $(this),
            interval = 500;

        i = setInterval(function () {
            control.trigger("click");
        }, interval);
    })
    .on("mouseout", function () {
        clearInterval(i);
    });
    */


    updatePrayerClockTime();
    clocksArray[0].CURRENT.name  = "NONE";
    //createUtilityIcon();
    //createFixedUtilityIcon();
}

function closesetting() {
    var c = $('#currentclockcanvas');
    var container = $(c).parent();

    document.getElementById("clockBody").style.display = "block";
    document.getElementById("settingpanel").style.display = "none";
    settingmode = false;
    var conWidth = $(container).width();
    //console.log("Window Width:"+window.innerWidth+"-->"+window.innerHeight+"Ratio: "+(appWidth/appHight)+"container width"+conWidth);
    var appWidth, appHeight;
    if (conWidth > window.innerHeight) {
        appWidth = window.innerHeight;
        appHight = conWidth;
    } else {
        appWidth = conWidth;
        appHight = window.innerHeight;
    }
    c.attr('width', appWidth); //max width
    c.attr('height', (appHight / 10) * 6); //max height
    refreshClock(7);


}

function loadSetting(monthNumSetting, _yearNumSetting) {
    //monthNum = 0;
    monthNum = monthNumSetting;
    yearNumSetting = _yearNumSetting;
    var todayDate = new Date();
    var crdate = new Date();
    var one_day = 1000 * 60 * 60 * 24;

    todayDate.setDate(1);
    todayDate.setMonth(monthNum);
    todayDate.setYear(_yearNumSetting);
    //if(yearNumSetting != 'undefined'){
    //     todayDate.setYear(yearNumSetting);
    //}

    var monthBegin = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    if (monthBegin.getDay() != 0) {
        monthBegin = getLastDayOfMonth(todayDate.getMonth() - 1, yearNumSetting, 0);
    }
    var monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth(), getDaysInMonth(todayDate.getMonth() + 1, todayDate.getFullYear()));
    if (monthEnd.getDay() != 6) {
        monthEnd = getFirstDayOfMonth(todayDate.getMonth() + 1, yearNumSetting, 6);
    }

    console.log("Month:" + monthNum + "Year:" + yearNumSetting);

    //console.log(todayDate.getMonth()+1+", " + getDaysInMonth(todayDate.getMonth()+1, todayDate.getFullYear())+", " + todayDate.getFullYear());
    var monthTime = "<h2 data-animation='animated bounceInLeft'>" + todayDate.getMonthName().toUpperCase() + ", " + todayDate.getFullYear() + "<h3>";
    monthTime += "<table style='width:100%' border='0' id='settingbody' summary='Time Setting'><thead><tr class='month-time-th'>";
    //monthTime +="<th  style='font-size:18px; text-align:left' colspan='4'>"+todayDate.getMonthName()+", "+todayDate.getFullYear()+"</th><th  scope='col'></th><th  scope='col' style='font-size:22px'><a href='#' onclick='closesetting();return false;''>x</a></th></tr></thead><tbody>";
    monthTime += "<th  scope='col'>DATES</th><th  scope='col'>FAJR</th><th  scope='col'>DHUHR</th><th  scope='col'>ASR</th><th  scope='col'>MAGHRIB</th><th  scope='col'>ISHA</th></tr></thead><tbody>";

    //"IMASK &nbsp; FAJR &nbsp; Sunrise &nbsp; Dhuhr &nbsp; Asr &nbsp; Sunset &nbsp; Maghrib &nbsp; Isha &nbsp; Midnight </br>";
    var startDay; //monthBegin;
    var endDay; // = monthBegin;

    var daytime = "";
    var daytimeFriday = "";
    var daytimeSunday = "";
    var weekperiod = "";
    var index = 0;
    var rowNumber = 1;

    while (monthBegin <= monthEnd) {



        if (timeObject == null || timeObject == 'undefined') {
            if (monthBegin.getDate() == 29 && monthBegin.getMonth() == 1) {
                monthBegin.setDate(monthBegin.getDate() - 1);
                timeObject = prayerClocks.getPrayerClockForDay(monthBegin);
                monthBegin.setDate(monthBegin.getDate() + 1);
            }
        }



        /*
        if(getDDMMMFromDate(monthBegin)== getDDMMMFromDate(crdate)){
            var daytime = "<tr style='font-size:18px;font-weight:bold;background:#FF9933;'>";
            //daytime += "<td style='font-size:18px;font-weight:bold'> &#8594; "+getDDMMMFromDate(monthBegin).substring(0,2)+"</td>";
        }else if(monthBegin.getDay()== 5 ){
            var daytime = "<tr style='background-color: rgb(114, 212, 117);'>";
        }else if(monthBegin.getDay()== 6 || monthBegin.getDay()== 0 ){
            var daytime = "<tr style='background:rgba(211, 211, 211, 0.54)'>";
        }else{
            var daytime = "<tr>";
        }
        */
        //console.log(monthBegin);
        if (monthBegin.getDay() == 0) {
            weekperiod += getDDMMMFromDate(monthBegin);

        }

        if (monthBegin.getDay() == 5) {
            timeObject = prayerClocks.getPrayerClockForDay(monthBegin);
            index = 0;
            for (var i in timeObject) {
                if (index == 1 || index == 3) {
                    var tempDate = convertToDateObject(timeObject[i].time, 'FLOAT', monthBegin);
                    daytimeFriday += "<td>" + formDateToStringHMM(tempDate) + "</td>";
                }
                index++;
            }
        }

        if (monthBegin.getDay() == 6) {
            weekperiod += " - " + getDDMMMFromDate(monthBegin);
            timeObject = prayerClocks.getPrayerClockForDay(monthBegin);
            index = 0;
            for (var i in timeObject) {
                if (index == 4 || index == 6 || index == 7) {
                    var tempDate = convertToDateObject(timeObject[i].time, 'FLOAT', monthBegin);
                    daytimeSunday += "<td>" + formDateToStringHMM(tempDate) + "</td>";
                }
                index++;
            }


            var background = "";


            // Convert both dates to milliseconds
            var date1_ms = monthBegin.getTime();
            var date2_ms = crdate.getTime();

            // Calculate the difference in milliseconds
            var difference_ms = date1_ms - date2_ms;

            // Convert back to days and return
            var nofd = Math.round(difference_ms / one_day);
            var arrow = "";

            if (nofd >= 0 && nofd <= 6) {
                background = "background:rgba(0,172,193,0.3)";
                arrow = "&#8594;";
            } else {

                if (rowNumber % 2 == 0) {
                    background = "background:rgba(9, 70, 73, 0.20)";
                } else {
                    background = "background:rgba(121, 120, 120, 0.20)";
                }
            }

            daytime += "<tr class='month-time-tr' style='" + background + "'><td><b>" + arrow + "</b>&nbsp;&nbsp;" + weekperiod + "</td>";
            daytime += daytimeFriday + "" + daytimeSunday;
            //+daytime;
            monthTime += daytime + "</tr>";
            rowNumber++;
            daytimeFriday = daytimeSunday = weekperiod = daytime = "";
        }

        /*

            if(monthBegin.getDay() == 0 || monthBegin.getDay() == 6){
                daytime += "<tr><td style='font-size:18px;''>"+getDDMMMFromDate(monthBegin)+"</td>";                
            
            for (var i in timeObject){
            if(index == 1 || index == 3 || index == 4 || index == 6|| index == 7){
                //table += times[timeNames[i].toLowerCase()]+ '\t'; 
                var next='NA';
                var praTimeDate = new Date(monthBegin.getDate() + 1)
                timeObject = prayerClocks.getPrayerClockForDay(monthBegin);
                var tempDate = convertToDateObject(timeObject[i].time, 'FLOAT', monthBegin);
                //daytime+="<td>"+timeObject[i].name+"::"+formDateToStringHMM(date)+"&nbsp;";
                daytime+="<td>"+formDateToStringHMM(tempDate)+"</td>";
                //console.log(formDateToStringHMM(tempDate));
            }
            index++;
                //console.log(daytime+"::"+timeObject[i].time);
            }
            }
             +daytime;
            monthTime += daytime+"</tr>";
            */

        //sunrise = convertToDateObject(prayerClockIns[SUNRISE].time,'FLOAT');

        monthBegin.setDate(monthBegin.getDate() + 1);
    }
    //console.log(monthTime);
    monthTime += "</tbody></table>";
    //document.getElementById("clockBody").style.display="none";
    document.getElementById("week-time").style.display = "block";

    document.getElementById("week-time").innerHTML = monthTime;
    //settingmode = true;
}

function getLastDayOfMonth(month, year, dayNum) {
    //monthNum = monthNumSetting;
    //yearNumSetting = _yearNumSetting;
    var todayDate = new Date();
    //var crdate = new Date();

    //todayDate.setDate(1);
    todayDate.setMonth(month);
    todayDate.setYear(year);

    var monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth(), getDaysInMonth(todayDate.getMonth() + 1, todayDate.getFullYear()));

    while (monthEnd.getDay() != dayNum) {
        monthEnd = new Date(monthEnd.setDate(monthEnd.getDate() - 1));

    }

    return monthEnd;
}

function getFirstDayOfMonth(month, year, dayNum) {
    var todayDate = new Date();
    //var crdate = new Date();

    todayDate.setDate(1);
    todayDate.setMonth(month);
    todayDate.setYear(year);

    var monthBegin = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);

    while (monthBegin.getDay() != dayNum) {
        monthBegin = new Date(monthBegin.setDate(monthBegin.getDate() + 1));
    }
    return monthBegin;

}

function reloadClockWithTodayDate() {

    var date = new Date();
    currentDate.setTime(date.getTime());
    reloadClockWithDate(currentDate, 15);
}

function reloadClockWithLeft() {

    if (settingmode == false) {
        var nextMs = currentDate.getTime() - 1000 * 60 * 60 * 24 * 1;
        currentDate.setTime(nextMs);
        reloadClockWithDate(currentDate, 5);
    } else {
        if (monthNum == 0) {
            //monthNum = 12;
            //yearNumSetting = yearNumSetting - 1;
        }
        monthNum = monthNum - 1;
        loadSetting(monthNum, yearNumSetting);
    }

    //testFloatTime();
}

function testFloatTime() {
    //var floattime = fromHMMtoFloat("05:30");
    //console.log("floattime" + floattime);
    var date = new Date();
    var floattime = convertToDateObject("4:59", 'HH_MM_A', date);
    var floatT = fromTimeToFloat(floattime);
    var dateN = convertToDateObject(floatT, 'FLOAT', date);
    console.log("4:59" + " - Float:" + floatT + "-->" + dateN);

}

function reloadClockWithRight() {

    if (settingmode == false) {
        var nextMs = currentDate.getTime() + 1000 * 60 * 60 * 24 * 1;
        currentDate.setTime(nextMs);
        reloadClockWithDate(currentDate, 5);

    } else {
        if (monthNum == 12) {
            //monthNum = 0;


        }

        monthNum = monthNum + 1;
        if (monthNum == 12) {
            //yearNumSetting = yearNumSetting + 1;
        }
        loadSetting(monthNum, yearNumSetting);
    }
}

function reloadClockWithDate(currentDate, nofiteration) {


    var canvasIndex = 7;
    var context, canvas;
    for (var index in clocksArray[0]) {
        if (clocksArray[0].CURRENT.name == clocksArray[0][index].name) {
            canvas = document.getElementById('currentclockcanvas');
            context = canvas.getContext("2d");

        } else {
            var canvasName = 'lowerbase' + canvasIndex + 'canvas';
            canvas = document.getElementById(canvasName);
            context = canvas.getContext("2d");
            canvasIndex++;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    console.log("currentDate" + currentDate);
    prayerClockIns = prayerClocks.getPrayerClockForDay(currentDate);
    // next logic can go up here

    //console.log(prayerClockIns);
    //sunrise = convertToDateObject(prayerClockIns[SUNRISE].time,'FLOAT', currentDate);
    //createSunIcon(sunrise,leftcontext);
    //createDummyMoonIcon(leftcontext1, leftcanvas1, GregToIsl(currentDate, currCountry));
    //createNavigationIcon(leftcontext2, leftcanvas2);
    //createSettingIcon(leftcontext3, leftcanvas3);
    reloadClockWithAnimation(currentDate, nofiteration);
}

function reloadClockWithAnimation(date, nofiteration) {
    currentDate = date;
    //console.log(clocksArray[0].CURRENT.name+"-->"+getCurrentPrayerTime().name);
    fillUpClocksArray(clocksArray[0].CURRENT, getCurrentPrayerTime(), nofiteration);
    var clockCounter = 0;
    for (var pClkInsind in prayerClockIns) {
        prayerName = prayerClockIns[pClkInsind].name.toUpperCase();
        if (prayerName == 'FAJR' || prayerName == 'DHUHR' || prayerName == 'ASR' || prayerName == 'MAGHRIB' || prayerName == 'ISHA') {
            if (clocksArray[0]['CURRENT'].name != prayerClockIns[pClkInsind].name) {
                fillUpClocksArray(clocksArray[0][clockSequence[clockCounter]], prayerClockIns[pClkInsind], nofiteration);
                //console.log(clockCounter+"ELSE:"+clocksArray[0][clockSequence[clockCounter]].name);
                clockCounter = clockCounter + 1;
            }
        }
    }
    refreshClock(7);

}

function createUtilityIcon() {

    console.log("inside createUtilityIcon");
    sunrise = convertToDateObject(prayerClockIns[SUNRISE].time, 'FLOAT', currentDate);
    //createSunIcon(sunrise);
    //createSettingIcon(leftcontext1, leftcanvas1);
    var moveLeftCanavas = document.getElementById('lowerbase1canvas');
    var moveLeftContext = moveLeftCanavas.getContext('2d');

    createSunIcon(sunrise, moveLeftContext, moveLeftCanavas);

    //writeAMPMfterTimeVertical(moveLeftContext,sunrise, 0);  

    var lowerbase2canvas = document.getElementById('lowerbase2canvas');
    //lowerbase2canvas.width = "200px";
    var lowerbase2context = lowerbase2canvas.getContext('2d');
    $('#lowerbase2canvas').attr('width', 250); //max width

    createDummyMoonIcon(lowerbase2context, lowerbase2canvas, GregToIsl(currentDate, 'US', clockSetting.getHijriAdjustmentDay()));

    /*
        var iqamatimeCanavas = document.getElementById('iqamatime');
        var iqamatimeContext = moveLeftCanavas.getContext('2d');

     iqamatimeContext.save();
     $("#iqamatime").css("background","rgba(41, 100, 41, 0.33)");
     iqamatimeContext.translate(iqamatimeContext.width/2, iqamatimeContext.height/2);
     iqamatimeContext.rotate(-Math.PI/2);
     iqamatimeContext.textAlign = "center";
     iqamatimeContext.fillText("Your Label Here", 10, 0);
     iqamatimeContext.restore();
     
     */



    //createNavigationIcon(lowerbase3context,lowerbase3canvas, '19.9 N US', 'US')



    //var radius1 = lowerbase4canvas.width/2 - lowerbase4canvas.width/3; var lineWidth = 2; var isSmallClock = true;

    // createClock(lowerbase4canvas, new Date(), new Date(), new Date(),  
    //             "Juma", 'DOWN', lineWidth, radius1, isSmallClock);


}

function createFixedUtilityIcon() {

    console.log("Inside createUtilityIcon");
    var lowerbase3canvas = document.getElementById('lowerbase3canvas');
    var lowerbase3context = lowerbase3canvas.getContext('2d');

    var zawalTime = convertToDateObject(todayAutoPrayertimes['dhuhr'], 'FLOAT', currentDate);
    zawalTime = new Date(zawalTime - 1 * 60000);
    createZawalTime(zawalTime, lowerbase3context, lowerbase3canvas);

    var lowerbase6canvas = document.getElementById('lowerbase6canvas');
    var lowerbase6context = lowerbase6canvas.getContext('2d');

    //createZawalTime("12:10", lowerbase6context, lowerbase6canvas);

    //var radius = lowerbase6canvas.width * 0.10;
    //writeAMPMfterTime(lowerbase6context,"12:10", radius, -1);

    $('#lowerbase6canvas').attr('width', 250);

    createJumaIcon(lowerbase6context, lowerbase6canvas, clockSetting.getFirstJumaTime(), clockSetting.getSecondJumaTime());

    var lowerbase4canvas = document.getElementById('lowerbase4canvas');
    var lowerbase4context = lowerbase4canvas.getContext('2d');
    //$('#lowerbase4canvas').attr('width',  200);

    //createJumaIcon("JUMA - 2", "1:30", lowerbase4context, lowerbase4canvas);
    var MS_PER_MINUTE = 60000;
    //var sunsettime = new Date(prayerClockIns[MAGHRIB].time - durationInMinutes * MS_PER_MINUTE);
    var sunsettime = convertToDateObject(parseFloat(prayerClockIns[MAGHRIB].time), 'FLOAT', currentDate);
    sunsettime = new Date(sunsettime - 5 * MS_PER_MINUTE);

    //var sunset = convertToDateObject(todayAutoPrayertimes['maghrib'],'FLOAT', currentDate);
    createSunsetIcon(sunsettime, lowerbase4context, lowerbase4canvas);

    //createSunIcon(new Date(),lowerbase4context, lowerbase4canvas);  
    /*
    createLeftArrow(lowerbase4context, lowerbase4canvas, 'white');
    drawHomeIcon(refreshClockContext, refreshClockCanavas);
    //createHelpIcon(helpContext, helpCanavas);


    var lowerbase5canvas = document.getElementById('lowerbase5canvas');
    var lowerbase5context = lowerbase5canvas.getContext('2d');
    createRightArrow(lowerbase5context, lowerbase5canvas, 'white');
    */

}

function fillClockArray() {
    var clockCounter = 0;
    for (var pClkInsind in prayerClockIns) {
        prayerName = prayerClockIns[pClkInsind].name.toUpperCase();
        if (prayerName == 'FAJR' || prayerName == 'DHUHR' || prayerName == 'ASR' || prayerName == 'MAGHRIB' || prayerName == 'ISHA') {
            //if(clocksArray[0]['CURRENT'].name != prayerClockIns[pClkInsind].name){
            fillUpClocksArray(clocksArray[0][clockSequence[clockCounter]], prayerClockIns[pClkInsind], 15);
            //console.log(clockCounter+"ELSE:"+clocksArray[0][clockSequence[clockCounter]].name);
            clockCounter = clockCounter + 1;
            //}
        }
    }
}

function updatePrayerClockTime() {
    if (clocksArray[0].CURRENT.name != getCurrentPrayerTime().name) {
        //console.log(clocksArray[0].CURRENT.name + "-->" + getCurrentPrayerTime().name);
        //fillUpClocksArray(clocksArray[0].CURRENT, getCurrentPrayerTime(),15);
        fillClockArray();
        return true;
    } else {
        return false;
    }
}


function getCurrentPrayerTime() {
    var datenow = new Date()
    var date = fromTimeToFloat(datenow);

    var fajr = parseFloat(prayerClockIns[FAJR].time);
    zuhar = parseFloat(prayerClockIns[DHUHR].time);
    asr = parseFloat(prayerClockIns[ASR].time);
    maghrib = parseFloat(prayerClockIns[MAGHRIB].time);
    isha = parseFloat(prayerClockIns[ISHA].time);

    //console.log("Current Date:"+date);
    //console.log("Fajr"+fajr+"Dhuhar"+zuhar+"Asr"+asr+"Maghrib"+maghrib+"Isha"+isha )
    //console.log("passedPrayerName"+passedPrayerName+"-->prayerName"+prayerName);
    if (getDDMMMFromDate(datenow) == getDDMMMFromDate(currentDate)) {
        if (date <= fajr) {
            return prayerClockIns[FAJR];
        } else if (date > fajr && date <= zuhar) {
            return prayerClockIns[DHUHR];
        } else if (date > zuhar && date <= asr) {
            return prayerClockIns[ASR];
        } else if (date > asr && date <= maghrib) {
            return prayerClockIns[MAGHRIB];
        } else if (date > maghrib && date <= isha) {
            return prayerClockIns[ISHA];
        } else {

            var nextMs = currentDate.getTime() + 1000 * 60 * 60 * 24 * 1;
            currentDate.setTime(nextMs);
            prayerClockIns = prayerClocks.getPrayerClockForDay(currentDate);
            return prayerClockIns[FAJR];

        }
    } else {
        return prayerClockIns[FAJR];
    }

}

function fillUpClocksArray(clocksArray, prayerClockIns, nofiteration) {
    var timeVariationForClock = prayerClocks.getPrayerTimeVariation(prayerClockIns.name.toUpperCase());
    // console.log(prayerClockIns.name.toUpperCase()+":"+formDateToString(fromFloatTimeToDateObject(timeVariationForClock.maxTime))+"-->"+formDateToString(
    //  fromFloatTimeToDateObject(timeVariationForClock.minTime))+"-->next"+ prayerClockIns.next);
    var date = new Date();
    date.setDate(currentDate.getDate());
    clocksArray.name = prayerClockIns.name;
    clocksArray.time = fromFloatTimeToDateObject(prayerClockIns.time, date);
    clocksArray.steps = getAnimationSteps(clocksArray.time, nofiteration);
    var maxDay = timeVariationForClock.maxDate;
    var minDay = timeVariationForClock.minDate;
    clocksArray.maxtime = fromFloatTimeToDateObject(timeVariationForClock.maxTime, getDateFromDDMMM(maxDay, date.getFullYear()));
    clocksArray.mintime = fromFloatTimeToDateObject(timeVariationForClock.minTime, getDateFromDDMMM(minDay, date.getFullYear()));
    clocksArray.next = prayerClockIns.next;

    //console.log("Name:"+clocksArray.name+"clocksArray.next"+clocksArray.next);

}

function updateTimeWidget() {
        var sdate = new Date();
        var crTime = formDateToStringHMM(sdate);
        var timecanvas = document.getElementById('timecanvas');
        var timecontext = timecanvas.getContext('2d');

        timecontext.beginPath();
        //timecontext.strokeStyle = 'white';
        //context.font="lighter 30px Source Sans Pro";//Sans Pro, Source Sans Pro, Open Sans
        timecontext.font = "50px " + appfont;
        //context.fillStyle = "white";

        hour = sdate.getHours(),
            am = "AM";

        if (hour > 12) {
            hour = hour - 12;
            am = "PM";
        } else if (hour == 0) {
            hour = 12;
        }

        //var width = timecontext.measureText(crTime).width;
        //var height = timecontext.measureText(crTime).height;

        //context.beginPath();
        //context.fillText(hour,dim[0],dim[1]);
        //Sans Pro, Source Sans Pro
        //context.fillText(crTime,10 , 20);
        //context.stroke();
        $('#timecanvas').attr('height', (window.innerHeight / 10) * 1.7);

        createCurrTimeBlock(timecontext, timecanvas);


        //$("#currtime").text(crTime);
    }
    //context.font = font + 'px Source Sans Pro';
function initApp() {

        var path = $(location).attr('href').substring(7);
        var timefolder = path.split('.')[0];
        console.log(path + "-->" + timefolder);

        //var timefolder="http://localcaravan.com/prayertime/devon/";
        //$.getScript(timefolder+"/time.json", function(){
        setupApp();
        loop = setInterval(refreshClock, 1000 * 1);
        // loop = setInterval(refreshClockTab, 1000*1);
        animateloop = setInterval(createClockAnimation, 15);
        //});

        //setupApp();
        //animateloop = setInterval(createClockAnimation(5), 15);
        //refreshClock(7);
        //loop = setInterval(refreshClock, 1000);
        //loop = setInterval(refreshClock, 1000*1);
        //createClockAnimation();
        //animateloop = setInterval(createClockAnimation, 15);

    }
    //loop = setInterval(refreshClock, 1000*60);
    //animateloop = setInterval(createClockAnimation, 15);