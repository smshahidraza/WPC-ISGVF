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
var timeLimitArcColorRGB = "rgba(255,69,0,1)";
// FF4500
var clockColorCurrent = "#333";
var clockColor = "white";
var handColorTransparent = "rgba(245,245,245,0.7)";
var clockHandColor = "rgba(245,245,245,0.6)";

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

function createCircle(mycanvas, lineWidth, radius, color) {
    mycontext = mycanvas.getContext("2d");
    mycontext.beginPath();
    mycontext.arc(mycanvas.width / 2, mycanvas.height / 2, radius, 0, Math.PI * 2, true);
    //mycontext.fillStyle = '#212124';
    // mycontext.fill();
    mycontext.lineWidth = lineWidth;
    mycontext.strokeStyle =  color;
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

function createTimeLimitArc(givenTime, startTime, endTime, next, radius, lineWidth, context, darwArrow, clockColor) {
    context.beginPath();
    context.strokeStyle = clockColor;
    var stAngle = convertTimeToRadianAngle(startTime),
        enAngle = convertTimeToRadianAngle(endTime);

    // size of the arrow
    sdate1 = new Date(givenTime.getTime() - 8 * 60 * 1000),
        sdate3 = new Date(givenTime.getTime() + 8 * 60 * 1000),

        stAngle1 = convertTimeToRadianAngle(sdate1), //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
        enAngle2 = convertTimeToRadianAngle(sdate3); //(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;

    // context.fillSyle = 'blue';
    context.lineWidth = 3;

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
    context.lineWidth = 5;
    context.strokeStyle = clockColor;

    /**
     *  Below four line to create a shadow effect. Save the previous setting
     *  of context here to restore it after drawing arc. This will help us
     *  to limit shadow effect only for the arc.
     */
    // context.save();
    // context.shadowColor = 'white';
    // context.shadowBlur = 40;
    // context.shadowOffsetX = 0;
    // context.shadowOffsetY = 0;

    context.arc(canvas.width / 2, canvas.height / 2, radius, stAngle, enAngle, true);
    context.stroke();
    // context.strokeStyle = clockColor;
    // context.stroke();
    // context.restore();
}

function createClockAnimation(canvasIndexPassed) {

   // console.log("Is it running..");
   //  return false;
    var canvasIndex = 7;
    var color;
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

            if (getCurrentPrayerTime().name == clocksArray[0][index].name) {
                //$("#clock"+canvasIndex).css("padding-top","10px");
                //$("#" + canvasName).css("background", "rgba(255,207,0,0.6)");
                //$("#" + canvasName).css("border-bottom", "3px solid white");
                color = clockColorCurrent;
                //currentPrayerIndex = index;
                //currentCanvasName = canvasName;

            } else {
                //$("#" + canvasName).css("background", "none");
                ///$("#" + canvasName).css("border-bottom", "");
                color = clockColor;
            }

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
                clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock, color);
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
    var currentPrayerTime = false;
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
        if (formDateToStringHMMA(clocksArray[0][currentPrayerIndex].time) === formDateToStringHMMA(todayDate) ) {
            //currentPrayerTime = true;
            //        color="red";

            /**
                Stop sliding if it is the time of prayer and fixed the slide on
                prayer time page.
            */
            if (clockSetting.isSlidingOn()) {
                $('#myCarousel').carousel({
                    interval: false
                });
                $('#myCarousel').carousel(0);
                
            }


            var currentClockPrayerBlink =$("#" + currentCanvasName)[0].getContext('2d');

            //currentClockPrayerBlink.clearRect(0, 0, currentClockPrayerBlink.canvas.width, currentClockPrayerBlink.canvas.height);
            if(fadeInClock){

                $("#"+currentCanvasName).css("background", "none");
                    fadeInClock = false;
                    currentClockPrayerBlink.strokeStyle = "white";
                    currentClockPrayerBlink.fillStyle = "white";

            }else{
                $("#"+currentCanvasName).css("background", "rgba(255,207,0,0.6)");
            //$("#" + currentCanvasName).css("color", "rgba(100,207,0,0.6)");
                currentClockPrayerBlink.strokeStyle = "black";
                currentClockPrayerBlink.fillStyle = "black";
           

            fadeInClock = true;
            }
             currentClockPrayerBlink.save();
             currentClockPrayerBlink.globalCompositeOperation = 'source-atop';
            currentClockPrayerBlink.fillRect(0, 0, currentClockPrayerBlink.canvas.width, currentClockPrayerBlink.canvas.height);
    //ctx.restore();
            currentClockPrayerBlink.fill();
            currentClockPrayerBlink.stroke();
            currentClockPrayerBlink.restore();
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
           // setupSlider();
            $('#myCarousel').carousel('cycle');
        }
    }

    var currentTimeChanged = updatePrayerClockTime();

   
    
    updateTimeWidget();
    
         var currTimeForDiff = new Date();
        if (currentPrayerIndex != -1) {
        currTimeForDiff.setHours(clocksArray[0][currentPrayerIndex].time.getHours());
        currTimeForDiff.setMinutes(clocksArray[0][currentPrayerIndex].time.getMinutes());
        currTimeForDiff.setSeconds(0);
        }

    var currentPrayerName  = getCurrentPrayerTime().name;
    // var time = formDateToStringHMMA(fromFloatTimeToDateObject(getCurrentPrayerTime().time, todayDate));
    // var upcomingTime = new Date();
    // upcomingTime.setTime(fromFloatTimeToDateObject(getCurrentPrayerTime().time, todayDate).getTime() - todayDate.getTime());

    if (currTimeForDiff < todayDate ) {
        currTimeForDiff.setDate(todayDate.getDate() + 1);
    }


    var diff = currTimeForDiff - todayDate;

    if(Math.floor(diff/ 1000 / 60 / 60) > 12) {
        diff = 0;
    }

    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
   if (hh < 10 ) {
        hh="0"+hh;
    }
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    if (mm < 10 ) {
        mm="0"+mm;
    }
    var ss = Math.floor(msec / 1000);
    if(ss < 10 ) {
        ss="0"+ss;
    }




//    $('#upcoming-time').text("Upcoming Prayer: "+ currentPrayerName+ ":"+time+":"+formDateToStringHMMA(todayDate)+"-" + formDateToStringHMMA(upcomingTime));
    $('#upcoming-time').html("<font size='3'>UPCOMING PRAYER&nbsp;</font>"+ currentPrayerName.toUpperCase()+"-" + hh+":"+mm+":"+ss);

//     console.log("Upcoming prayer :"+currentPrayerName+ ":"+time+" -- currentTimeChanged  :::" + getCurrentPrayerTime().time);
    if (settingmode == false) {
        if (currentTimeChanged) {
            clocksArray[0].CURRENT.name =  currentPrayerName;
            createUtilityIcon();
            createFixedUtilityIcon();
            /* Load below three slides if time changes.. */
            var m = clockSetting.getAllActiveSlides();
            for (var i = 0; i < m.length; i++) {
                var type = m[i].type;
                if (type === 'monthtime') {
                    loadSetting(currentDate.getMonth(),currentDate.getFullYear());
                }else if (type === 'ramadantime') {
                    loadRamadanCalendar(currentDate, getDateFromDDMMMYY(m[i].begindate), getDateFromDDMMMYY(m[i].enddate));
                } else if (type === 'events') {
                    loadEvents();
                }
            }

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
                    //var color = "white";
                    var canvasName = 'lowerbase' + canvasIndex + 'canvas';
                    if (getCurrentPrayerTime().name == clocksArray[0][index].name) {
                        //$("#clock"+canvasIndex).css("padding-top","10px");
                        $("#" + canvasName).css("background", "rgba(255,207,0,0.6)");
                        $("#" + canvasName).css("border-bottom", "3px solid white");

                        color = clockColorCurrent;
                        currentPrayerIndex = index;
                        currentCanvasName = canvasName;

                    } else {
                        $("#" + canvasName).css("background", "none");
                        $("#" + canvasName).css("border-bottom", "");
                        color = clockColor;
                    }

                    canvas = document.getElementById(canvasName);
                    radius = canvas.width / 2 - canvas.width / 12;
                    lineWidth = 3;
                    isSmallClock = true;
                    //console.log(canvas.width+"radius" + radius+"-->"+isSmallClock+"canvasName"+canvasName);
                    //console.log(canvas.width+"radius" + radius+"-->"+isSmallClock+"canvasName"+canvasName);

                    createClock(canvas, clocksArray[0][index].time, clocksArray[0][index].maxtime, clocksArray[0][index].mintime,
                        clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock, color);


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
    mycontext.lineWidth = 11;
    mycontext.strokeStyle = color;
    mycontext.globalAlpha=0.7;

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

function createHands(mycanvas, date, radius, lineWidth, clockHandColor) {

    hour = date.getHours();
    hour = hour > 12 ? hour - 12 : hour;
    var minLineWidth = (lineWidth > 3) ? lineWidth - 2 : lineWidth;
    //console.log(minLineWidth+"--->lineWidth"+lineWidth);
    createHand(mycanvas, hour * 5 + (date.getMinutes() / 60) * 5, true, lineWidth, radius, clockHandColor);
    createHand(mycanvas, date.getMinutes(), false, minLineWidth, radius, clockHandColor);
    //createSechand(date.getSeconds(), false, 0.2);
}

function createClock(canvas, animateDate, sdate, edate, name, next, lineWidth, radius, isSmallClock, clockColor) {

    //console.log("Inside CLock createClock::");
    var minLineWidth = (lineWidth > 3) ? lineWidth - 2 : lineWidth;
    var context = canvas.getContext("2d");
    //console.log(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    var todayDate = new Date();
    var currentTime = formDateToString(todayDate);
    //radius = canvas.width - padding;
    //console.log(canvas.width+":"+canvas.height+","+radius);
    if (!isSmallClock) {
        createCircle(canvas, minLineWidth - 1, radius, color);
        createTimeLimitArc(animateDate, sdate, edate, next, radius + 2, minLineWidth, context, true, timeLimitArcColorRGB);
        writeTimeInClock(animateDate, context, canvas, radius, clockColor);

        context.font = "lighter 20px Source Sans Pro";
        writeInfoInClock(context, clockTitle + " - " + currentTime, radius + 15, 'UP', 'BIG',clockColor);
        //writeInfoInClock(context,"Prayer time is not updated.", radius+15,'UP', 'BIG');
        writeInfoInClock(context, name, radius + 15, 'DOWN', 'BIG',clockColor);
        createCenter(canvas, lineWidth, lineWidth, clockColor); //2,3        
    } else {
        createCircle(canvas, lineWidth, radius + 5, clockColor);

        if(clockSetting.isTimeLimitArcOn()){
        		createTimeLimitArc(animateDate, sdate, edate, next, radius+5, minLineWidth, context, true, timeLimitArcColorRGB);
        }
        createCenter(canvas, lineWidth, lineWidth + 1, clockColor); //2,3
        //context.font="lighter 12px Source Sans Pro";
        var ampm = formDateToStringHMMA(animateDate).indexOf("AM");
        var info = formDateToStringHMM(animateDate);
        //console.log(formDateToStringHMMA(animateDate)+"pppp"+ampm);
        writeInfoInClock(context, info, radius, 'DOWN', 'SMALL', clockColor);
        writeAMPMfterTime(context, info, radius, ampm, clockColor);

        writeInfoInClock(context, name, radius, 'UP', 'SMALL', clockColor);

    }

    var hour = animateDate.getHours();
    //console.log(formDateToStringHMM(animateDate)+"-->"+formDateToStringHMM(todayDate)+","+fadeIn);
    // if (formDateToStringHMMA(animateDate) == formDateToStringHMMA(todayDate)) {
    //     reloadClockAnimation = true;
    //     if (isSmallClock) {
    //         if (fadeIn) {
    //             //canvas.style.display="none";
    //             //document.getElementById('currentclockcanvas').style.display="none";
    //             createCenter(canvas, lineWidth, lineWidth + 1, clockColorCurrent);
    //             createHand(canvas, hour * 5 + (animateDate.getMinutes() / 60) * 5, true, lineWidth, radius, clockColorCurrent);
    //             createHand(canvas, animateDate.getMinutes(), false, minLineWidth, radius, clockColorCurrent);

    //             fadeIn = false;

    //         } else {
    //             //canvas.style.display="block";
    //             createCenter(canvas, lineWidth, lineWidth + 1, "white");
    //             createHand(canvas, hour * 5 + (animateDate.getMinutes() / 60) * 5, true, lineWidth, radius, "white");
    //             createHand(canvas, animateDate.getMinutes(), false, minLineWidth, radius, "white");

    //             //document.getElementById('currentclockcanvas').style.display="block";
    //             fadeIn = true;
    //         }
    //     }
    // } else {
        createCenter(canvas, lineWidth, lineWidth + 1, clockColor);
        createHand(canvas, hour * 5 + (animateDate.getMinutes() / 60) * 5, true, lineWidth, radius, clockColor);
        createHand(canvas, animateDate.getMinutes(), false, minLineWidth, radius, clockColor);
        //writeHourNumberInClock(context, canvas, "232",radius,"IP", 12);
        //writeRomanHourNumberInClock(context, canvas, radius);
        drawHourMarkInClock(context, canvas, radius);
    //}

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




function writeTimeInClock(sdate, context, canvas, radius, clockColor) {

    context.beginPath();
    context.fillStyle = clockColor;
    //context.font="lighter 30px Source Sans Pro";//Sans Pro, Source Sans Pro, Open Sans
    context.font = Math.round(radius / 4.5) + "px " + appfont;
    //context.fillStyle = clockColor;
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

function writeInfoInClock(context, info, radius, where, size, color) {

    context.beginPath();
    context.fillStyle=color;
    //context.fillColor = color;

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

    // To put shadow for clock circle, hour hand and time.

    // context.shadowColor = '#333';
    // context.shadowBlur = 10;
    // context.shadowOffsetX = 5;
    // context.shadowOffsetY = 5;

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
    $('#leftPanel').text(clockSetting.getName());
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
        }else if (type === 'monthtime') {
                $('<div class="item" id="weekprayertime" data-interval="' + delay * 1000 + '">'+
                        '<div class="container"><div class="row">'+
                              '<div id="month-time" style="padding-top:30px" class="col-lg-12 col-sm-12">'+
                                 '<div id="week-time"></div></div>'+
                              '</div></div></div>'
                     ).appendTo('.carousel-inner');

            //$('#myCarousel').find('#weekprayertime').attr('data-interval', delay * 1000);
            //.appendTo('.carousel-inner');
            loadSetting(currentDate.getMonth(),currentDate.getFullYear());
         }else if (type === 'ramadantime') {
                $('<div class="item" id="ramadanprayertime" data-interval="' + delay * 1000 + '">'+
                        '<div class="container"><div class="row">'+
                              '<div id="ramadan-time" class="col-lg-12 col-sm-12">'+
                                 '<div id="ramadan-time"></div></div>'+
                              '</div></div></div>'
                     ).appendTo('.carousel-inner');

            loadRamadanCalendar(currentDate, getDateFromDDMMMYY(m[i].begindate), getDateFromDDMMMYY(m[i].enddate));
        }else if (type === 'allmonthtime') {
                $('<div class="item" id="weekprayertime" data-interval="' + delay * 1000 + '">'+
                        '<div class="container"><div class="row">'+
                              '<div id="all-month-time" style="padding-top:30px" class="col-lg-12 col-sm-12">'+
                                 '<div id="week-time"></div></div>'+
                              '</div></div></div>'
                     ).appendTo('.carousel-inner');

            loadFullMonthCalendar(currentDate.getMonth());
        } else if (type === 'events') {
			$('<div class="item" id="eventblock" data-interval="' + delay * 1000 + '">'+
	            '<div class="container"><div class="row">'+
		                  '<div id="event-div" class="col-lg-12 col-sm-12">'+
	                     '<div id="event-block"></div></div>'+
	                  '</div></div></div>'
	         ).appendTo('.carousel-inner');
			 loadEvents();
        } else if (type == 'slides'){
            $('<div class="item" style="height:auto" data-interval="' + delay * 1000 + '"><div class="container">' +
                '<img src="' + m[i].source + '" style="padding-top:20px;width:1100px;height:600px">' +
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
        // console.log("currentIndex:" + currentIndex);
        if (currentIndex == 1) {
 			
 			fillClockArray(10);
        	animateloop = setInterval(createClockAnimation, 25);

            $("#utilityfooter").fadeIn("slow");
            // $("#utilityfooter").show();
            $("#iqama-time").show();
            $("#header-nav").show();
            $("#horiz-time").hide();
            $("#leftPanel").hide();

        } else {
            $("#utilityfooter").fadeOut("slow");
            // $("#utilityfooter").hide();  
            $("#iqama-time").hide();
            $("#header-nav").hide();
            $("#horiz-time").show();
            $("#leftPanel").show();


        }

    });



}

function setupApp() {

    var date = new Date(); // today
    currentDate = date;

    setupPrayerTimeSetting();


    mode = 'auto'; // manual
    dayLightSaving = 'auto',
        method = 'ISNA';
    if (mode == 'auto') {
        prayerClocks.initClock(date.getFullYear(), method, [40.07, -75.43], -5, dayLightSaving);
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
    // loadSetting(currentDate.getMonth(),currentDate.getFullYear());

    //prayTime.midDay();

    //console.log(prayerClockIns);

    //refreshClockCanavas.addEventListener('click', function(event) {
    //    reloadClockWithTodayDate();
    //}, false);

    // lowerbase4canvas.addEventListener('click', function(event) {
    //     reloadClockWithLeft();
    // }, false);

    // lowerbase5canvas.addEventListener('click', function(event) {
    //     reloadClockWithRight();
    // }, false);

    // lowerbase3canvas.addEventListener('click', function(event) {
    //     loadSetting(currentDate.getMonth(), currentDate.getFullYear());
    // }, false);

    // currentclockcanvas.addEventListener('click', function(event) {
    //     showMaxMinTime();
    // }, false);

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
    setupSlider();


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
        if(monthBegin > todayDate){
            monthBegin = getLastDayOfMonth(todayDate.getMonth() - 1, yearNumSetting - 1, 0);
         }        
    }
    var monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth(), getDaysInMonth(todayDate.getMonth() + 1, todayDate.getFullYear()));
    if (monthEnd.getDay() != 6) {

        monthEnd = getFirstDayOfMonth(todayDate.getMonth() + 1, yearNumSetting, 6);
        if(monthBegin > monthEnd){
            yearNumSetting = yearNumSetting + 1;
            monthEnd = getFirstDayOfMonth(todayDate.getMonth() + 1, yearNumSetting, 6);
        }
    }

    console.log("Month:" + monthNum + "Year:" + yearNumSetting);

    var doubleStrisk="";
 	if(!currentDate.dst()){
 		doubleStrisk = "<sup>**</sup>";
 	}

    //console.log(todayDate.getMonth()+1+", " + getDaysInMonth(todayDate.getMonth()+1, todayDate.getFullYear())+", " + todayDate.getFullYear());
    var monthTime = "<span style='font-size:30px; float:left;padding-bottom:30px'><i class='glyphicon glyphicon-time'></i> IQAMAH TIMES - " + todayDate.getMonthName().toUpperCase() + ", " + todayDate.getFullYear() + "</span>";
    monthTime += "<table style='font-size:25px; width:100%' border='0' class='weektime' id='settingbody' summary='Time Setting'><thead><tr class='monthprayer-time-th clock-div'>";
    //monthTime +="<th  style='font-size:18px; text-align:left' colspan='4'>"+todayDate.getMonthName()+", "+todayDate.getFullYear()+"</th><th  scope='col'></th><th  scope='col' style='font-size:22px'><a href='#' onclick='closesetting();return false;''>x</a></th></tr></thead><tbody>";
    monthTime += "<th  scope='col'></th><th  scope='col'>DATE</th><th  scope='col'>FAJR<sup>*</sup><span style='font-size:12px'>&nbsp; ( AM )<span></th>"+
                 "<th  scope='col'>DHUHR"+doubleStrisk+"<span style='font-size:12px'>&nbsp; ( PM )<span></th><th  scope='col'>ASR<span style='font-size:12px'>&nbsp; ( PM )<span></th>"+
                 "<th  scope='col'>MAGHRIB<span style='font-size:12px'>&nbsp; ( PM )<span></th>"+
                 "<th  scope='col'>ISHA<span style='font-size:12px'>&nbsp; ( PM )<span></th></tr></thead><tbody>";

    //"IMASK &nbsp; FAJR &nbsp; Sunrise &nbsp; Dhuhr &nbsp; Asr &nbsp; Sunset &nbsp; Maghrib &nbsp; Isha &nbsp; Midnight </br>";
    var startDay; //monthBegin'text-align: left;' 
    var endDay; // = monthBegin;

    var daytime = "";
    var daytimeFriday = "";
    var daytimeSunday = "";
    var weekperiod = "";
    var maghribTIme= "";
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
            
            timeObject = prayerClocks.getPrayerClockForDay(monthBegin);
            index = 0;
            for (var i in timeObject) {
                if (index == 6) {
                    var tempDate = convertToDateObject(timeObject[i].time, 'FLOAT', monthBegin);
                    maghribTIme += formDateToStringHMM(tempDate);
                }
                index++;
            }

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
                var tempDate = convertToDateObject(timeObject[i].time, 'FLOAT', monthBegin);
                if (index == 4 || index == 7) {                   
                    daytimeSunday += "<td>" + formDateToStringHMM(tempDate) + "</td>";
                }else if(index == 6 ){
                    daytimeSunday += "<td>" + maghribTIme+" - " +formDateToStringHMM(tempDate) + "</td>";                    
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
                //background = "background:rgba(0,172,193,0.3)";
                 background = "background:rgba(255, 207, 0, 0.6);color:rgb(46, 49, 46);text-shadow:none";
                
                 //arrow = "&#8594;";
                 arrow = "class='glyphicon glyphicon-arrow-right'";
            } else {

                if (rowNumber % 2 == 0) {
                    //background = "background:rgba(9, 70, 73, 0.20)";
                    background = "background:rgba(0,172,193,0.3)";
                } else {
                    background = "background:rgba(255, 255, 255, 0.80); color:rgb(71, 133, 81);text-shadow:none";
                }
            }

            daytime += "<tr class='monthprayer-time-tr' style='" + background + "'><td><span " + arrow + "></span></td><td></b>&nbsp;&nbsp;" + weekperiod + "</td>";
            daytime += daytimeFriday + "" + daytimeSunday;
            //+daytime;
            monthTime += daytime + "</tr>";
            rowNumber++;
            daytimeFriday = daytimeSunday = weekperiod = daytime =maghribTIme= "";
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
    var dhuharWeekendTime = "";

    if(!currentDate.dst()){
        var dhuharWeekendTime = "</br><span> **  Dhuhr Iqamah on Weekends – 1:30 PM</span>";
    }
    // monthTime += "<tr class='monthprayer-time-tr' style='background:rgb(12, 151, 191)'><td></td><td colspan='3' style='padding:10px;text-align:left;font-size:20px'><span>* Fajr Iqamah on Weekend –30  Min. before Sunrise </span><br> </td>"+
    monthTime += "<tr class='monthprayer-time-tr' style='background:rgb(12, 151, 191)'><td></td><td colspan='3' style='padding:10px;text-align:left;font-size:20px'>";
    monthTime += "<span>* Fajr Iqamah on Weekend –30  Min. before Sunrise </span><br>"+dhuharWeekendTime+"</td>";
    monthTime += "<td>Jumma Salah</td><td>1<sup>st</sup></br> "+clockSetting.getFirstJumaTime();
    if(clockSetting.getSecondJumaTime() == ""){
        monthTime += "PM</td><td> </br> "+clockSetting.getSecondJumaTime()+"</td></tr>";
    }else{
        monthTime += "PM</td><td>2<sup>nd</sup> </br> "+clockSetting.getSecondJumaTime()+"PM </td></tr>";
    }
	var backgroundimagesrc = "http://placesunderthesun.com/wp-content/uploads/2014/06/Stargazing-in-Cherry-Spring-State-Park-Pennsylvania-2.jpg";
    monthTime += "</tbody></table><div style='text-align:right'><span style='font-size:12px'><a href='http://www.freepik.com'>Background image: "+backgroundimagesrc+"</a></span></div>";
    //document.getElementById("clockBody").style.display="none";
    document.getElementById("week-time").style.display = "block";

    document.getElementById("week-time").innerHTML = monthTime;
    //settingmode = true;
}


function loadRamadanCalendar(currentDateForRamadan, beginRamdan, endRamadan) {
    //monthNum = 0;
    // monthNum = monthNumSetting;
    // yearNumSetting = _yearNumSetting;
    if(!clockSetting.isRamadanActive(beginRamdan, endRamadan)){
        return false;
    }

    var todayDate = new Date();
    var crdate = currentDateForRamadan;
    var one_day = 1000 * 60 * 60 * 24;

    // todayDate.setDate(crdate.getDay());
    // todayDate.setMonth(crdate.getMonth());
    // todayDate.setYear(crdate.getFullYear());
    todayDate = new Date(crdate.getFullYear(), crdate.getMonth(), crdate.getDate());
    //if(yearNumSetting != 'undefined'){
    //     todayDate.setYear(yearNumSetting);
    //}
    var diffDays = 0;
    var numberofDaysRemaining = 0;

    var monthBegin = beginRamdan; // Ramadan in 2017 starting May 26
    var ramadanBegin = beginRamdan;
    var ramadanEnd = endRamadan;

//    if (monthBegin.getDay() < todayDate.getDay() && monthBegin.getMonth() < todayDate.getMonth()) {
    
    var ramdaEndDiffWithToday = Math.abs(ramadanEnd.getTime() - todayDate.getTime());
    var ramdaEndDiffInDays = Math.ceil(ramdaEndDiffWithToday / (1000 * 3600 * 24))        
    

    if (monthBegin < todayDate ) {
        var timeDiff = Math.abs(todayDate.getTime() - monthBegin.getTime());
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        monthBegin = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    } else {
        var timeDiff = Math.abs(monthBegin.getTime() - todayDate.getTime());
        numberofDaysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))        
    }
	
	var monthEnd = new Date(monthBegin.getFullYear(), monthBegin.getMonth(), monthBegin.getDate());
    
    if(ramdaEndDiffInDays >= 8 ){
		monthEnd.setDate(monthBegin.getDate() + 7);
	}else {
		monthBegin.setDate(ramadanEnd.getDate() - 7);
		timeDiff = Math.abs(ramadanBegin.getTime() - ramadanEnd.getTime());
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)  - 8);
		monthEnd = new Date(ramadanEnd.getFullYear(), ramadanEnd.getMonth(), ramadanEnd.getDate());
 	}
    

    // var monthEnd = new Date();
    // monthEnd = monthEnd.setDate(monthBegin.getDate() + 7);

    console.log("Month:" + monthNum + "Year:" + yearNumSetting);

    //console.log(todayDate.getMonth()+1+", " + getDaysInMonth(todayDate.getMonth()+1, todayDate.getFullYear())+", " + todayDate.getFullYear());
    var monthTime = "<span style='font-size:30px; float:left;padding-bottom:20px'><i class='glyphicon glyphicon-time'></i> RAMADAN - " + todayDate.getFullYear() + "</span>";
    if(numberofDaysRemaining > 0 ){
         monthTime += "<span style='font-size:30px; float:right;padding-bottom:20px'> "+numberofDaysRemaining + " DAYS TO GO ...</span>";
    }
    
    monthTime += "<table style='font-size:25px; width:100%' border='0' class='weektime' id='settingbody' summary='Time Setting'><thead><tr class='monthprayer-time-th clock-div'>";
    //monthTime +="<th  style='font-size:18px; text-align:left' colspan='4'>"+todayDate.getMonthName()+", "+todayDate.getFullYear()+"</th><th  scope='col'></th><th  scope='col' style='font-size:22px'><a href='#' onclick='closesetting();return false;''>x</a></th></tr></thead><tbody>";
    monthTime += "<th  scope='col'></th><th  scope='col'>RAMADAN</th>"+
                 "<th  scope='col'>DATE</th><th  scope='col'>DAY</th>"+
                 "<th  scope='col'>FAST BEGIN</th>"+
                 "<th  scope='col'>FAST END</th><th  scope='col' >EVENT</th></tr></thead><tbody>";

    //"IMASK &nbsp; FAJR &nbsp; Sunrise &nbsp; Dhuhr &nbsp; Asr &nbsp; Sunset &nbsp; Maghrib &nbsp; Isha &nbsp; Midnight </br>";
    var startDay; //monthBegin'text-align: left;' 
    var endDay; // = monthBegin;

    var daytime = "";
    var daytimeFriday = "";
    var daytimeSunday = "";
    var weekperiod = "";
    var maghribTIme= "";
    var index = 0;
    var rowNumber = 1;

    var fastingDay = 1;

    var iftarEvents = clockSetting.getAllIftarEvents();
    

    while (monthBegin <= monthEnd) {

            weekperiod += "<td style='width:20px'>"+(fastingDay+diffDays)+"</td>";    
            weekperiod += "<td>"+getDDMMMFromDate(monthBegin)+"</td>";
            weekperiod += "<td>"+monthBegin.getShortDayName()+"</td>";
            timeObject = prayerClocks.getPrayerClockForDay(monthBegin);
            index = 0;
            fastingDay = fastingDay + 1;
            for (var i in timeObject) {
                if (index == 0 || index == 5) {
                    var tempDate = convertToDateObject(timeObject[i].time, 'FLOAT', monthBegin);
                    daytimeSunday += "<td>" + formDateToStringHMM_A(tempDate) + "</td>";
                }
                index++;
            }
            var iftarFoundDay = false;
            var iftarEventCounter = 0;
            var iftarEvent;

            while ( iftarEventCounter < iftarEvents.length){
                var iftarDay = getDateFromDDMMMYY(iftarEvents[iftarEventCounter].date);
                if(monthBegin.getDate() == iftarDay.getDate() && monthBegin.getMonth() == iftarDay.getMonth()){
                    iftarFoundDay = true;
                    iftarEvent = iftarEvents[iftarEventCounter];

                        break;
                }
                iftarEventCounter++;
            }       
            var iconClass;
            if(iftarFoundDay){
                if(iftarEvent.message.eventType == "private"){
                    iconClass = "icon-lock";
                } else if ( iftarEvent.message.eventType == "public" ){ 
                    iconClass = "icon-group";    
                }

                daytimeSunday += "<td style='text-align:right' ><span style='padding-left:10px;padding-right:10px;'>";
                daytimeSunday += iftarEvent.message.detail+"<i class='glyphicon glyphicon-cutlery' style='padding-left:10px;padding-right:10px'></i></span> </td>";                    
            }else{
                daytimeSunday += "<td style='text-align:right' ></td>";                                    
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

            
            if (monthBegin.getTime() == todayDate.getTime()) {
                //background = "background:rgba(0,172,193,0.3)";
                 background = "background:rgba(255, 207, 0, 0.6);color:rgb(46, 49, 46);text-shadow:none";
                
                 //arrow = "&#8594;";
                 arrow = "class='glyphicon glyphicon-arrow-right'";
            // }else  if (monthBegin.getDay() == 6 || monthBegin.getDay() == 0) {

                 // background = "background:rgb(53, 143, 210);text-shadow:none;";

            } else {

                if (rowNumber % 2 == 0) {   
                    //background = "background:rgba(9, 70, 73, 0.20)";
                    background = "background:rgba(0,172,193,0.3)";
                } else {
                    background = "background:rgba(255, 255, 255, 0.80); color:rgb(71, 133, 81);text-shadow:none";
                }
            }

            daytime += "<tr class='ramdan-small-time-th' style='" + background + "'><td><span " + arrow + "></span></td>" + weekperiod;
            daytime += daytimeFriday + "" + daytimeSunday;
            // daytime += "<span " + arrow + ">ISGVF</span>";
            //+daytime;
            monthTime += daytime + "</tr>";
            rowNumber++;
            daytimeFriday = daytimeSunday = weekperiod = daytime = "";
        


            monthBegin.setDate(monthBegin.getDate() + 1);

    }

    // monthTime += "<tr class='ramdan-small-time-th' style='background:rgb(53, 143, 210);text-shadow:none;height:70px'>";
    // monthTime += "<td colspan='7'><i class='glyphicon glyphicon-cutlery' style='padding-right:10px'></i>Aftar at ISGVF";
    // monthTime += "<i class='icon-lock' style='padding-left:30px;padding-right:10px' ></i>Private event<i class='icon-group' style='padding-left:30px;padding-right:10px'></i>Public event</td></tr>";
    monthTime += "</tbody></table>";
    document.getElementById("ramadan-time").style.display = "block";

    document.getElementById("ramadan-time").innerHTML = monthTime;
}

function loadFullMonthRamadanCalendar(ramdanBeginTime) {
    //monthNum = 0;
    //monthNum = monthNumSetting;
    //yearNumSetting = _yearNumSetting;
    var todayDate = new Date();
    var crdate = new Date();
    var one_day = 1000 * 60 * 60 * 24;

    //todayDate.setDate(1);
    //todayDate.setMonth(monthNum);
    //todayDate.setYear(_yearNumSetting);
    //if(yearNumSetting != 'undefined'){
    //     todayDate.setYear(yearNumSetting);
    //}

    var monthBegin = new Date(todayDate.getFullYear(), 5, 6);

    
    var monthEnd = new Date(todayDate.getFullYear(), 5, (getDaysInMonth(todayDate.getMonth() + 1, todayDate.getFullYear()))/2);
    monthEnd.setDate(monthBegin.getDate() + 29);

    //console.log("Month:" + monthNum + "Year:" + yearNumSetting);

    //console.log(todayDate.getMonth()+1+", " + getDaysInMonth(todayDate.getMonth()+1, todayDate.getFullYear())+", " + todayDate.getFullYear());
    var monthTime = "<h2 data-animation='animated bounceInLeft'> RAMADAN, "  + todayDate.getFullYear() + "<h3>";
    monthTime += "<table style='float:left;width:48%;font-size: 20px;' border='0' class='ramdantime' id='settingbody' summary='Time Setting'><thead><tr class='ramdan-time-th'>";
    monthTime += "<td  scope='col'></td><td  scope='col'>Day</td><td  scope='col'>Ramadan</td><td  scope='col'>"+monthBegin.getShortMonthName()+"-"+ monthEnd.getShortMonthName()+"</td><td  scope='col'>IMASK<span style='font-size:12px'>&nbsp; ( AM )<span></td><td  scope='col'>Iftar <span style='font-size:12px'>&nbsp; ( PM )<span></td></tr></thead><tbody>";

    //"IMASK &nbsp; FAJR &nbsp; Sunrise &nbsp; Dhuhr &nbsp; Asr &nbsp; Sunset &nbsp; Maghrib &nbsp; Isha &nbsp; Midnight </br>";
    var startDay; //monthBegin;
    var endDay; // = monthBegin;

    var daytime = "";
    var daytimeFriday = "";
    var daytimeSunday = "";
    var weekperiod = "";
    var index = 0;
    var rowNumber = 1;

    var fastingDay = 1;

    while (monthBegin <= monthEnd) {




            weekperiod += "<td>"+monthBegin.getShortDayName()+"</td>";
            weekperiod += "<td style='width:20px'>"+fastingDay+"</td>";    
            weekperiod += "<td>"+monthBegin.getDate()+"</td>";
            timeObject = prayerClocks.getPrayerClockForDay(monthBegin);
            index = 0;
            fastingDay = fastingDay + 1;
            for (var i in timeObject) {
                if (index == 0 || index == 5 ) {
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

            
            if (currentDate.getDate() == monthBegin.getDate()) {
                //background = "background:rgba(0,172,193,0.3)";
                 background = "background:rgba(255, 207, 0, 0.6);color:rgb(46, 49, 46);text-shadow:none";
                
                 //arrow = "&#8594;";
                 arrow = "class='glyphicon glyphicon-arrow-right'";
            }else  if (monthBegin.getDay() == 6 || monthBegin.getDay() == 0) {

                 background = "background:rgb(53, 143, 210);text-shadow:none;";

            } else {

                if (rowNumber % 2 == 0) {
                    //background = "background:rgba(9, 70, 73, 0.20)";
                    background = "background:rgba(0,172,193,0.3)";
                } else {
                    background = "background:rgba(255, 255, 255, 0.80); color:rgb(71, 133, 81);text-shadow:none";
                }
            }

            daytime += "<tr class='ramdan-time-th' style='" + background + "'><td><span " + arrow + "></span></td>" + weekperiod;
            daytime += daytimeFriday + "" + daytimeSunday;
            //+daytime;
            monthTime += daytime + "</tr>";
            rowNumber++;
            daytimeFriday = daytimeSunday = weekperiod = daytime = "";
        


        monthBegin.setDate(monthBegin.getDate() + 1);

            if(fastingDay === 16){
                 monthTime += "</tbody></table>";
                monthTime += "<table style='float:right;width:48%;font-size: 20px;' border='0' class='ramdantime' id='settingbody' summary='Time Setting'><thead><tr class='ramdan-time-th'>";
                monthTime += "<td  scope='col'></td><td  scope='col'>Day</td><td  scope='col'>Ramadan</td><td  scope='col'>"+monthBegin.getShortMonthName()+"-"+ monthEnd.getShortMonthName()+"</td><td  scope='col'>IMASK<span style='font-size:12px'>&nbsp; ( AM )<span></td><td  scope='col'>Iftar<span style='font-size:12px'>&nbsp; ( PM )<span></td></tr></thead><tbody>";
                rowNumber = 1;
            }
    }
    //console.log(monthTime);
    monthTime += "</tbody></table>";

    document.getElementById("all-month-time").style.display = "block";

    document.getElementById("all-month-time").innerHTML = monthTime;
    //settingmode = true;
}

function loadFullMonthCalendar (currentMonthNumber){
	    var todayDate = new Date();
    var crdate = new Date();
    var one_day = 1000 * 60 * 60 * 24;


    var monthBegin = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 1);

    
    var monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth()+1, (getDaysInMonth(todayDate.getMonth() + 2, todayDate.getFullYear()))/2);
    monthEnd.setDate(monthBegin.getDate() + 29);

    var monthTime = "<h2 data-animation='animated bounceInLeft' style='text-align:left;margin-top:5px;margin-bottom:5px'> "  + monthBegin.getShortMonthName()+ " "+ todayDate.getFullYear()  +" </h2>";
    monthTime += "<table style='float:left;width:48%;font-size:15px;margin-right: 10px;' border='0' class='allmonthtime' id='settingbody' summary='Time Setting'><thead><tr style='height:30px'>";
    monthTime += "<td  scope='col' colspan='2' class='allmonthheader'>Day</td><td  scope='col' class='allmonthheader'></td><td  class='allmonthheader'scope='col'>Fajr</td>"
    monthTime += "<td  scope='col' class='allmonthheader'>Sunrise</td><td class='allmonthheader'scope='col'>Dhuhar</td><td  class='allmonthheader' scope='col'>Asr</td><td  class='allmonthheader' scope='col'>Maghrib</td><td  class='allmonthheader' style='padding-right:5px' scope='col'>Isha</td></tr></thead><tbody>";

    //"IMASK &nbsp; FAJR &nbsp; Sunrise &nbsp; Dhuhr &nbsp; Asr &nbsp; Sunset &nbsp; Maghrib &nbsp; Isha &nbsp; Midnight </br>";
    var startDay; //monthBegin;
    var endDay; // = monthBegin;

    var daytime = "";
    var daytimeFriday = "";
    var daytimeSunday = "";
    var weekperiod = "";
    var index = 0;
    var rowNumber = 1;

    var fastingDay = 1;

    while (monthBegin <= monthEnd) {




            weekperiod += "<td style='width:20px;font-weight:normal;font-size:17px'>"+monthBegin.getDate()+"</td>";    
            weekperiod += "<td style='font-weight:normal;font-size:17px'>"+monthBegin.getShortDayName()+"</td>";
            // weekperiod += "<td>"+monthBegin.getDate()+"</td>";
            timeObject = prayerClocks.getPrayerClockForDay(monthBegin);
            index = 0;
            fastingDay = fastingDay + 1;
            for (var i in timeObject) {
                if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5 || index == 7 ) {
                    var tempDate = convertToDateObject(timeObject[i].time, 'FLOAT', monthBegin);
                    var paddingRight = "";
                    if(index == 7){
                    	paddingRight = "padding-right:5px;";
                    }
                    daytimeSunday += "<td style='font-weight:normal;font-size:17px;"+paddingRight+"'>" + formDateToStringHMM(tempDate) + "</td>";
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

            
            if (currentDate.getDate() == monthBegin.getDate()) {
                //background = "background:rgba(0,172,193,0.3)";
                 background = "background:rgba(255, 207, 0, 0.6);color:rgb(46, 49, 46);text-shadow:none";
                
                 //arrow = "&#8594;";
                 arrow = "class='glyphicon glyphicon-arrow-right'";
            }else  if (monthBegin.getDay() == 6 || monthBegin.getDay() == 0) {

                 background = "background:rgb(53, 143, 210);text-shadow:none;";

            } else {

                if (rowNumber % 2 == 0) {
                    //background = "background:rgba(9, 70, 73, 0.20)";
                    background = "background:rgba(0,172,193,0.3)";
                } else {
                    background = "background:rgba(255, 255, 255, 0.80); color:rgb(71, 133, 81);text-shadow:none";
                }
            }

            daytime += "<tr class='ramdan-time-th' style='" + background + "'><td><span " + arrow + "></span></td>" + weekperiod;
            daytime += daytimeFriday + "" + daytimeSunday;
            //+daytime;
            monthTime += daytime + "</tr>";
            rowNumber++;
            daytimeFriday = daytimeSunday = weekperiod = daytime = "";
        


        monthBegin.setDate(monthBegin.getDate() + 1);

            if(fastingDay === 16){
                 monthTime += "</tbody></table>";
                monthTime += "<table style='float:left;width:48%;font-size: 15px;' border='0' class='ramdantime' id='settingbody' summary='Time Setting'><thead><tr style='height:30px'>";
                monthTime += "<td  class='allmonthheader' scope='col' colspan='2'>Day</td><td  class='allmonthheader' scope='col'></td><td  class='allmonthheader' scope='col'>Fajr</td>"
                monthTime += "<td  class='allmonthheader' scope='col'>Sunrise</td><td  class='allmonthheader' scope='col'>Dhuhar</td><td  class='allmonthheader' scope='col'>Asr</td><td  class='allmonthheader' scope='col'>Maghrib</td><td  class='allmonthheader' scope='col'>Isha</td></tr></thead><tbody>";
                rowNumber = 1;
            }
    }
    //console.log(monthTime);
    monthTime += "</tbody></table>";

    document.getElementById("all-month-time").style.display = "block";

    document.getElementById("all-month-time").innerHTML = monthTime;

}

function loadEvents() {
    var todayDate = new Date();
    var crdate = new Date();
    var one_day = 1000 * 60 * 60 * 24;

    var monthBegin = new Date(todayDate.getFullYear(), 5, 6);

    
    var monthEnd = new Date(todayDate.getFullYear(), 5, (getDaysInMonth(todayDate.getMonth() + 1, todayDate.getFullYear()))/2);
    monthEnd.setDate(monthBegin.getDate() + 29);

    //console.log("Month:" + monthNum + "Year:" + yearNumSetting);

    //console.log(todayDate.getMonth()+1+", " + getDaysInMonth(todayDate.getMonth()+1, todayDate.getFullYear())+", " + todayDate.getFullYear());
    // var monthTime = "<h3 data-animation='animated bounceInLeft'> UPCOMING EVENTS, "  + todayDate.getFullYear() + "<h3>";
    var monthTime = "<table style='width:100%; text-align:left; float:left;font-size: 25px;' border='0'  class='eventtable' id='settingbody' summary='Time Setting'><thead><tr >";
    monthTime += "<td  colspan='4'  scope='col' style='border-bottom:0px;padding-bottom:10px'><h1 ><i class='glyphicon glyphicon-calendar'></i><span>  Upcoming Event </span></h1></td></tr></thead><tbody>";

    //"IMASK &nbsp; FAJR &nbsp; Sunrise &nbsp; Dhuhr &nbsp; Asr &nbsp; Sunset &nbsp; Maghrib &nbsp; Isha &nbsp; Midnight </br>";
    var startDay; //monthBegin;
    var endDay; // = monthBegin;

    var daytime = "";
    var daytimeFriday = "";
    var daytimeSunday = "";
    var weekperiod = "";
    var index = 0;
    var rowNumber = 1;

    var fastingDay = 1;
    var events = clockSetting.getAllActiveEvents(3);
    if(events.length == 0){
        return false;
    }

    for (var i = 0 ; i < events.length; i++) {



    	    var eventDate = getDateFromDDMMMYY(events[i].date);
            weekperiod += "<td  style='width:10%; padding-right:20px; text-align:center'><div class='scroll' style='margin:5px;padding-left:10px;padding-right:9px;padding-top:4px;padding-bottom:4px;font-weight:normal'><span style='font-size:55px;'>"+eventDate.getDate()+"</span><span style='font-size:25px'>"+eventDate.getShortMonthName()+"</span></br><span style='vertical-align:top;font-size:25px'>"+eventDate.getDayName()+"</span></div></td>";
            // weekperiod += "<td style='font-size:25px'></td>";    
            weekperiod += "<td width='30px' style='font-size:20px'><i class='glyphicon glyphicon-time'></i></td>";
            weekperiod += "<td width='120px' style='font-size:20px'>"+events[i].time+"</td>";
            weekperiod += "<td align='left' style='font-size:30px;'><div  class='clock-div' style='margin:5px;border-radius:10px;padding-left:15px;padding-right:5px;padding-top:5px;padding-bottom:5px;'>"+events[i].message.title;
            if(events[i].speaker != '') {
            	weekperiod += "<br><span style='font-size:22px;font-weight:normal'><i class='glyphicon glyphicon-user'></i>  Speaker: "+events[i].speaker+"</span>";
            }
            weekperiod += "<br><span style='font-size:20px;font-weight:normal'>"+events[i].message.detail+"</span></div></td>";

            daytime += "<tr >" + weekperiod;
            //+daytime;

            monthTime += daytime + "</tr>";

            // weekperiod = "<td style='vertical-align:top;font-size:30px'></td>";
            // weekperiod += "<td></td>";    
            // weekperiod += "<td></td>";
            // weekperiod += "<td style='vertical-align:top'>"+events[i].message.detail+"</td>";
            // daytime = "<tr ><td></td>" + weekperiod;


            // monthTime += daytime + "</tr>";

            rowNumber++;
            daytimeFriday = daytimeSunday = weekperiod = daytime = "";
        
    }

    //console.log(monthTime);
    monthTime += "</tbody></table>";

    //document.getElementById("clockBody").style.display="none";
    document.getElementById("event-div").style.display = "block";

    document.getElementById("event-div").innerHTML = monthTime;
    //settingmode = true;
}

function getLastDayOfMonth(month, year, dayNum) {
    //monthNum = monthNumSetting;
    //yearNumSetting = _yearNumSetting;
    var todayDate = new Date();
    //var crdate = new Date();

    todayDate.setDate(1);
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

    // var hijriDate = getHijriDate(currentDate);
    var cal = new UQCal(currentDate);
    var hijri = cal.convert();
    // console.log("Hijri date new "+ hijri.Hday+"::"+hijri.Hmonth+"::"+hijri.Hyear );

    // console.log("Old:" + GregToIsl(currentDate, 'US', clockSetting.getHijriAdjustmentDay()));

    createDummyMoonIcon(lowerbase2context, lowerbase2canvas,  hijri.Hday+"::"+hijri.Hmonth+"::"+hijri.Hyear);

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

function fillClockArray(numberofsteps) {
    var clockCounter = 0;
    for (var pClkInsind in prayerClockIns) {
        prayerName = prayerClockIns[pClkInsind].name.toUpperCase();
        var paryerNameSmall = prayerClockIns[pClkInsind].name;
        if (prayerName == 'FAJR' || prayerName == 'DHUHR' || prayerName == 'ASR' || prayerName == 'MAGHRIB' || prayerName == 'ISHA') {
            //if(clocksArray[0]['CURRENT'].name != prayerClockIns[pClkInsind].name){
            fillUpClocksArray(clocksArray[0][clockSequence[clockCounter]], prayerClockIns[pClkInsind], numberofsteps);
            if (getCurrentPrayerTime().name == paryerNameSmall) {
                $("#clock"+paryerNameSmall).css("background", "rgba(255,207,0,0.6)");
                $("#clock"+paryerNameSmall).css("border-bottom", "2px solid white");
                $("#clock"+paryerNameSmall).css("padding-bottom", "5px");
            }else{
                $("#clock"+paryerNameSmall).css("background", "none");
                $("#clock"+paryerNameSmall).css("border-bottom", "none");                
            }
            $("#time"+paryerNameSmall+"Span").text(formDateToStringHMM_A(fromFloatTimeToDateObject(prayerClockIns[pClkInsind].time, currentDate)));
            $("#name"+paryerNameSmall+"Span").text(paryerNameSmall);        
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
        fillClockArray(15);
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
        if(sdate.getSeconds()%2 == 0 ){
            $("#currTimeSpan").text(formDateToStringHMM(sdate));

        }else {
            $("#currTimeSpan").text(formDateToStringHMM_WithoutColon(sdate));

        }

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
        animateloop = setInterval(createClockAnimation, 15);
        loop = setInterval(refreshClock, 1000 * 1);
        // loop = setInterval(refreshClockTab, 1000*1);
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
    function loadFullScreen(){
        toggleFull();
    }