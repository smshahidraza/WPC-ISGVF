FIRST_QUARTER = 1;
SECOND_QUARTER = 2;
THIRD_QUARTER = 3;
FOURTH_QUARTER = 4;

var IMASK = 0;
    FAJR = 1,
    SUNRISE = 2,
    DHUHR = 3,
    ASR = 4,
    SUNSET = 5;
    MAGHRIB = 6,
    ISHA = 7;
    MIDNIGHT = 8;


var months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12',
}
//var isgvffont = "isgvf-font";
//var isgvffont = "Calibri";
var isgvffont = "Helvetica Neue,Helvetica,Arial,sans-serif";

var HijriNames = [
  "Muharram", "Safar", "Rabi Al-Awwal", "Rabi Al-Thani", 
  " Jumada Al-Awwal ", "Jumada Al-Thani", "Rajab", "Sha'ban", 
  "Ramadan", "Shawwal", "Dhul Qa'idah", "Dhul Hijjah"
];

var HijriNamesArabic = [
    "محرم","صفر","ربيع الأول","ربيع الثاني",
    "جمادى الأول","جمادى الآخر","رجب ","شعبان",
    "رمضان", "شوال" ,"ذو القعدة" ,"ذو الحجة"
];

Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};

Date.prototype.dayNames = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday",
    "Saturday"
];

Date.prototype.getDayName = function() {
    return this.dayNames[this.getDay()];
};

Date.prototype.getShortDayName = function () {
    return this.getDayName().substring(0, 3);
};


var drawArcedArrow=function(ctx,x,y,r,startangle,endangle,anticlockwise,style,which,angle,d)
{
    'use strict';
    style=typeof(style)!='undefined'? style:3;
    which=typeof(which)!='undefined'? which:1; // end point gets arrow
    angle=typeof(angle)!='undefined'? angle:Math.PI/8;
    d    =typeof(d)    !='undefined'? d    :10;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x,y,r,startangle,endangle,anticlockwise);
    ctx.stroke();
    var sx,sy,lineangle,destx,desty;
    ctx.strokeStyle='rgba(0,0,0,0)';	// don't show the shaft
    if(which&1){	    // draw the destination end
	sx=Math.cos(startangle)*r+x;
	sy=Math.sin(startangle)*r+y;
	lineangle=Math.atan2(x-sx,sy-y);
	if(anticlockwise){
	    destx=sx+10*Math.cos(lineangle);
	    desty=sy+10*Math.sin(lineangle);
	}else{
	    destx=sx-10*Math.cos(lineangle);
	    desty=sy-10*Math.sin(lineangle);
	}
	drawArrow(ctx,sx,sy,destx,desty,style,2,angle,d);
    }
    if(which&2){	    // draw the origination end
	sx=Math.cos(endangle)*r+x;
	sy=Math.sin(endangle)*r+y;
	lineangle=Math.atan2(x-sx,sy-y);
	if(anticlockwise){
	    destx=sx-10*Math.cos(lineangle);
	    desty=sy-10*Math.sin(lineangle);
	}else{
	    destx=sx+10*Math.cos(lineangle);
	    desty=sy+10*Math.sin(lineangle);
	}
	drawArrow(ctx,sx,sy,destx,desty,style,2,angle,d);
    }
    ctx.restore();
}

var drawArrow=function(ctx,x1,y1,x2,y2,style,which,angle,d)
{
  'use strict';
  // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
  // would happen instead of addition
  if(typeof(x1)=='string') x1=parseInt(x1);
  if(typeof(y1)=='string') y1=parseInt(y1);
  if(typeof(x2)=='string') x2=parseInt(x2);
  if(typeof(y2)=='string') y2=parseInt(y2);
  style=typeof(style)!='undefined'? style:3;
  which=typeof(which)!='undefined'? which:1; // end point gets arrow
  angle=typeof(angle)!='undefined'? angle:Math.PI/8;
  d    =typeof(d)    !='undefined'? d    :10;
  // default to using drawHead to draw the head, but if the style
  // argument is a function, use it instead
  var toDrawHead=typeof(style)!='function'?drawHead:style;

  // For ends with arrow we actually want to stop before we get to the arrow
  // so that wide lines won't put a flat end on the arrow.
  //
  var dist=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  var ratio=(dist-d/3)/dist;
  var tox, toy,fromx,fromy;
  if(which&1){
    tox=Math.round(x1+(x2-x1)*ratio);
    toy=Math.round(y1+(y2-y1)*ratio);
  }else{
    tox=x2;
    toy=y2;
  }
  if(which&2){
    fromx=x1+(x2-x1)*(1-ratio);
    fromy=y1+(y2-y1)*(1-ratio);
  }else{
    fromx=x1;
    fromy=y1;
  }

  // Draw the shaft of the arrow
  ctx.beginPath();
  ctx.moveTo(fromx,fromy);
  ctx.lineTo(tox,toy);
  ctx.stroke();

  // calculate the angle of the line
  var lineangle=Math.atan2(y2-y1,x2-x1);
  // h is the line length of a side of the arrow head
  var h=Math.abs(d/Math.cos(angle));
  h = h -2;
  if(which&1){	// handle far end arrow head
    var angle1=lineangle+Math.PI+angle;
    var topx=x2+Math.cos(angle1)*h;
    var topy=y2+Math.sin(angle1)*h;
    var angle2=lineangle+Math.PI-angle;
    var botx=x2+Math.cos(angle2)*h;
    var boty=y2+Math.sin(angle2)*h;
    toDrawHead(ctx,topx,topy,x2,y2,botx,boty,style);
  }
  if(which&2){ // handle near end arrow head
    var angle1=lineangle+angle;
    var topx=x1+Math.cos(angle1)*h;
    var topy=y1+Math.sin(angle1)*h;
    var angle2=lineangle-angle;
    var botx=x1+Math.cos(angle2)*h;
    var boty=y1+Math.sin(angle2)*h;
    toDrawHead(ctx,topx,topy,x1,y1,botx,boty,style);
  }
}

var drawHead=function(ctx,x0,y0,x1,y1,x2,y2,style)
{
  'use strict';
  if(typeof(x0)=='string') x0=parseInt(x0);
  if(typeof(y0)=='string') y0=parseInt(y0);
  if(typeof(x1)=='string') x1=parseInt(x1);
  if(typeof(y1)=='string') y1=parseInt(y1);
  if(typeof(x2)=='string') x2=parseInt(x2);
  if(typeof(y2)=='string') y2=parseInt(y2);
  var radius=3;
  var twoPI=2*Math.PI;

  // all cases do this.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0,y0);
  ctx.lineTo(x1,y1);
  ctx.lineTo(x2,y2);
  switch(style){
    case 0:
      // curved filled, add the bottom as an arcTo curve and fill
      var backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
      ctx.arcTo(x1,y1,x0,y0,.55*backdist);
      ctx.fill();
      break;
    case 1:
      // straight filled, add the bottom as a line and fill.
      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.lineTo(x0,y0);
      ctx.fill();
      break;
    case 2:
      // unfilled head, just stroke.
      ctx.stroke();
      break;
    case 3:
      //filled head, add the bottom as a quadraticCurveTo curve and fill
      var cpx=(x0+x1+x2)/3;
      var cpy=(y0+y1+y2)/3;
      ctx.quadraticCurveTo(cpx,cpy,x0,y0);
      ctx.fill();
      break;
    case 4:
      //filled head, add the bottom as a bezierCurveTo curve and fill
      var cp1x, cp1y, cp2x, cp2y,backdist;
      var shiftamt=5;
      if(x2==x0){
	// Avoid a divide by zero if x2==x0
	backdist=y2-y0;
	cp1x=(x1+x0)/2;
	cp2x=(x1+x0)/2;
	cp1y=y1+backdist/shiftamt;
	cp2y=y1-backdist/shiftamt;
      }else{
	backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
	var xback=(x0+x2)/2;
	var yback=(y0+y2)/2;
	var xmid=(xback+x1)/2;
	var ymid=(yback+y1)/2;

	var m=(y2-y0)/(x2-x0);
	var dx=(backdist/(2*Math.sqrt(m*m+1)))/shiftamt;
	var dy=m*dx;
	cp1x=xmid-dx;
	cp1y=ymid-dy;
	cp2x=xmid+dx;
	cp2y=ymid+dy;
      }

      ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x0,y0);
      ctx.fill();
      break;
  }
  ctx.restore();
};

function fromStringTimeToDateObject(namazTime, date){
  /**
    * Convert a string time into a javascript date object
    * example: 3:40 PM will be converted into today's date
    * object with the given time.
    */
  //console.log("fromStringTimeToDateObject-"+namazTime);
  var hourmin = namazTime.split(":"),
  temp_hour = parseInt( hourmin[0] ),
  ampm =  hourmin[1].substring(2,4),
  namazMinute = Math.floor( hourmin[1].substring(0,2) );
  
  if(ampm == 'pm' && temp_hour != 12){
    temp_hour += 12;
  }
  var tempDate =  new Date();
  tempDate.setTime(date.getTime());
  tempDate.setDate(date.getDate());
  tempDate.setHours(temp_hour,namazMinute);
  //console.log(tempDate);
  return tempDate;
}

function fromFloatTimeToDateObject(namazHour, date){
  /**
    * Convert a float time into a javascript date object
    * given time
    */
 // Get the hour integer part
 var temp_hour = Math.floor( namazHour );
 namazHour -= temp_hour;
 
  // Get minutes
  namazHour *= 60;
  var namazMinute = Math.round( namazHour );
  
  var tempDate =  new Date();
  tempDate.setTime(date.getTime());
  tempDate.setDate(date.getDate());
  tempDate.setHours(temp_hour,namazMinute);
  return tempDate;
}


function convertToDateObject1(namazHour,sourceType){
  /**
    * Delegate the date convertor based on the
    * type of date passed
    */
   if(sourceType == 'FLOAT'){
      return fromFloatTimeToDateObject(namazHour);
   }else if(sourceType == 'HH_MM_A'){
      return fromStringTimeToDateObject(namazHour);
   } else if(sourceType == 'HH_MM_AA'){
      //return fromStringTimeAMPMToDateObject(namazHour);
    }

}

function convertToDateObject(namazHour,sourceType, date){
  /**
    * Delegate the date convertor based on the
    * type of date passed
    */
   if(sourceType == 'FLOAT'){
      return fromFloatTimeToDateObject(namazHour, date);
   }else if(sourceType == 'HH_MM_A'){
      return fromStringTimeToDateObject(namazHour, date);
   }
}

function fromTimeToFloat(time){
    // Number of decimal places to round to
    var decimal_places = 2,
    hours = parseInt(time.getHours()),
    minutes = parseFloat(time.getMinutes()/60);
    hourMin = hours+minutes;
    return parseFloat(hourMin).toFixed(decimal_places);

}

function formDateToString( time )
{
  // Get the hour integer part
  hour = time.getHours();
  minute = time.getMinutes();
 
  var ap = "am";
  if( hour   > 11 ) { ap = "pm";             }
  if( hour   > 12 ) { hour = hour - 12;      }
  if( hour   == 0 ) { hour = 12;             }
  if( hour   < 10 ) { hour   = "0" + hour;   }
  if( minute < 10 ) { minute = "0" + minute; }
 
  timeString = hour + ":" + minute + ap;
  return timeString;
}

function formDateToStringHMMA( time )
{
  // Get the hour integer part
  hour = time.getHours();
  minute = time.getMinutes();
 
  var ap = "AM";
  if( hour   > 11 ) { ap = "PM";             }
  if( hour   > 12 ) { hour = hour - 12;      }
  if( hour   == 0 ) { hour = 12;             }  
  if( minute < 10 ) { minute = "0" + minute; }
 
  timeString = hour + ":" + minute + ap;
  return timeString;
}

function formDateToStringHMM( time )
{
  // Get the hour integer part
  hour = time.getHours();
  minute = time.getMinutes();
 
  if( hour   > 12 ) { hour = hour - 12;      }
  if( hour   == 0 ) { hour = 12;             }
  if( minute < 10 ) { minute = "0" + minute; }
 
  timeString = hour + ":" + minute;
  return timeString;
}


function dateToDDMMMyyString(date){
  return date.getShortDayName()+", "+date.getShortMonthName()+" "+date.getDate();
}

function dateToDDDMMMyyyyString(date){
  return date.getDayName()+", "+date.getShortMonthName()+" "+date.getDate(); //+ " "+ date.getFullYear();
}

function getDateFromDDMMM(dateString, year){
  var day = parseInt( dateString.substring(0,2)),
  month = dateString.substring(2,5);
  var monthint = parseInt(months[camelCase(month)]) - 1;
  //console.log(month +" "+day+"--"+monthint); //parseInt(months[
  var tempDate =  new Date(year, monthint,day);
  //console.log(tempDate);
  return tempDate;
}

function camelCase(s) {
  return (s||'').toLowerCase().replace(/(\b|-)\w/g, function(m) {
    return m.toUpperCase().replace(/-/,'');
  });
}

function searchEmptyQuarterOfClock(date){

    var hoursHand = (date.getHours() < 12)? date.getHours(): date.getHours() - 12;
    hrdegree = hoursHand * 360/12 + (date.getMinutes()/60) * 360/12;
    mndeg = date.getMinutes() * 360/60;

    //console.log(date.getHours()+"hrdegree:"+ hrdegree+","+date.getMinutes()+"::mndeg"+mndeg);
    if(!(hrdegree > 45 && hrdegree < 135) && !(mndeg > 45 && mndeg < 135)){
        return FIRST_QUARTER;
    }else if(!(hrdegree > 135 && hrdegree < 225) && !(mndeg > 135 && mndeg < 225)){
        return SECOND_QUARTER;
    }else if(!(hrdegree > 225 && hrdegree < 315) || !(mndeg > 225 && mndeg < 315)){
        return THIRD_QUARTER;
    }else {
        return FOURTH_QUARTER;
    }
}

function getDimToWriteInsideClock(canvas, date, radius){
    var context = canvas.getContext('2d'),
    crTime = formDateToStringHMM(date),
    timeWidth = context.measureText(crTime).width,
    dim = [canvas.width/2, canvas.height/2],
    emptyQuarter = searchEmptyQuarterOfClock(date),
    x = canvas.width/2 - (radius - 10),
    height = canvas.height/2 - 20;

    //console.log("emptyQuarter"+emptyQuarter);

    switch(emptyQuarter){
        case FIRST_QUARTER:
            x = canvas.width/2 + (radius - timeWidth - 20);
            height = canvas.height/2 + 10;
            break;
        case SECOND_QUARTER:
            x = canvas.width/2 - timeWidth/2,
            height = canvas.height/2 + ( radius - radius*0.10);
            break;
        case THIRD_QUARTER:
            x = canvas.width/2- (radius - 20);
            height = canvas.height/2 + 10;
            break;
        default:
            x = canvas.width/2 - timeWidth/2,
            height = canvas.height/2 + (radius - 20);
    }        
    dim = [x, height];
    return dim;
}

function convertTimeToRadianAngle(time){
    var hour = time.getHours(),
    loc = hour * 5 + (time.getMinutes() / 60) * 5,
    angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2;
    return angle;
    // return Math.floor(((360/60) * currentTime.getMinutes()),0);
}

function createSunIcon(sunRisetime, leftcontext, leftcanvas){
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    leftcontext.beginPath();
    leftcontext.strokeStyle = 'white';
    leftcontext.beginPath();
    var radius = leftcanvas.width * 0.07;
    leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2-12, radius, 0,Math.PI*2, true); 
    leftcontext.closePath();
    leftcontext.lineWidth = 2;

    radius = leftcanvas.width * 0.10;
    var fontsize = Math.round(radius*2.5);

    leftcontext.font="500 "+fontsize+"px "+isgvffont;
   // leftcontext.font-weight=500;

    //leftcontext.font="lighter 12px Source Sans Pro "; //Georgia
    leftcontext.fillStyle = "white";
    sunrise = formDateToStringHMM(sunRisetime);

    

    timeWidth = leftcontext.measureText(sunrise).width;
    leftcontext.fillText(sunrise,leftcanvas.width/2 - timeWidth/2 -10, leftcanvas.height/2 + leftcanvas.height*0.30);
    //todayDate = sunRisetime.getTime();
    //console.log(dateToDDMMMyyString(sunRisetime));
    //dateWidth = leftcontext.measureText(dateToDDMMMyyString(sunRisetime)).width;

    //leftcontext.fillText(dateToDDMMMyyString(sunRisetime),leftcanvas.width/2 - dateWidth/2, leftcanvas.height/2 + leftcanvas.height*0.40);
    //console.log("timeWidth"+ timeWidth+ "dateWidth"+dateWidth);
    

    fontsize = Math.round(radius*2.5*0.4);
    leftcontext.font=fontsize+"px "+isgvffont;
    //var aWidth = leftcontext.measureText("A").width;    
    //leftcontext.fillText("A",leftcanvas.width/2 + timeWidth/2 + 4,leftcanvas.height/2 + leftcanvas.height*0.30 - 15 );

    var aWidth = leftcontext.measureText("AM").width;    
    leftcontext.fillText("AM",leftcanvas.width/2 + timeWidth/2 - 9, leftcanvas.height/2 + leftcanvas.height*0.30 );





     fontsize = Math.round(radius*1.7);

    leftcontext.font=fontsize+"px "+isgvffont;

    var sunriseWidth = leftcontext.measureText("Sunrise").width;
    leftcontext.fillText("Sunrise",leftcanvas.width/2 - sunriseWidth/2, leftcanvas.height/2 - leftcanvas.height*0.30);

    leftcontext.stroke();
    radius = leftcanvas.width * 0.07;
    createSunRay(leftcontext,leftcanvas, radius);

}

function createSunsetIcon(sunSettime, leftcontext, leftcanvas){
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    leftcontext.beginPath();
    leftcontext.strokeStyle = 'white';
    leftcontext.beginPath();
    var radius = leftcanvas.width * 0.10;
    leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2, radius, 0,Math.PI, true); 
    leftcontext.closePath();
    leftcontext.lineWidth = 2;
    var fontsize = Math.round(radius*2.2);

    leftcontext.font="500 "+fontsize+"px "+isgvffont;
   // leftcontext.font-weight=500;

    //leftcontext.font="lighter 12px Source Sans Pro "; //Georgia
    leftcontext.fillStyle = "white";
    sunset = formDateToStringHMM(sunSettime);

    

    timeWidth = leftcontext.measureText(sunset).width;
    leftcontext.fillText(sunset,leftcanvas.width/2 - timeWidth/2 -10, leftcanvas.height/2 + leftcanvas.height*0.30);
    //todayDate = sunRisetime.getTime();
    //console.log(dateToDDMMMyyString(sunRisetime));
    //dateWidth = leftcontext.measureText(dateToDDMMMyyString(sunRisetime)).width;

    //leftcontext.fillText(dateToDDMMMyyString(sunRisetime),leftcanvas.width/2 - dateWidth/2, leftcanvas.height/2 + leftcanvas.height*0.40);
    //console.log("timeWidth"+ timeWidth+ "dateWidth"+dateWidth);
    

    fontsize = Math.round(radius*2.5*0.4);
    leftcontext.font=fontsize+"px "+isgvffont;
    //var aWidth = leftcontext.measureText("A").width;    
    //leftcontext.fillText("A",leftcanvas.width/2 + timeWidth/2 + 4,leftcanvas.height/2 + leftcanvas.height*0.30 - 15 );

    var aWidth = leftcontext.measureText("PM").width;    
    leftcontext.fillText("PM",leftcanvas.width/2 + timeWidth/2 - 9 , leftcanvas.height/2 + leftcanvas.height*0.30 );





     fontsize = Math.round(radius*1.7);

    leftcontext.font=fontsize+"px "+isgvffont;

    var sunriseWidth = leftcontext.measureText("Sunset").width;
    leftcontext.fillText("Sunset",leftcanvas.width/2 - sunriseWidth/2, leftcanvas.height/2 - leftcanvas.height*0.30);

    leftcontext.stroke();
    //createSunRay(leftcontext,leftcanvas, radius);
    createSunSetRay(leftcontext,leftcanvas, radius);

}


function createJumaIcon(leftcontext, leftcanvas, juma1, juma2){
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    leftcontext.beginPath();
    leftcontext.fillStyle = 'white';
    leftcontext.beginPath();
    var radius = leftcanvas.width * 0.10;
    //leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2, radius, 0,Math.PI, true); 
    leftcontext.closePath();
    leftcontext.lineWidth = 2;
    var fontsize = Math.round(radius*1.5);

    leftcontext.font="500 "+fontsize+"px "+isgvffont;
   // leftcontext.font-weight=500;

    //leftcontext.font="lighter 12px Source Sans Pro "; //Georgia
    //leftcontext.fillStyle = "white";
    //sunrise = formDateToStringHMM(sunRisetime);

    

    timeWidth = leftcontext.measureText("1. "+juma1).width;
    leftcontext.fillText("1  "+juma1,70, leftcanvas.height/2 + leftcanvas.height*0.05);
 
    var timeWidth1 = leftcontext.measureText("2. "+juma2).width;
    leftcontext.fillText("2  "+juma2,70, leftcanvas.height/2 + leftcanvas.height*0.35);
 

    //todayDate = sunRisetime.getTime();
    //console.log(dateToDDMMMyyString(sunRisetime));
    //dateWidth = leftcontext.measureText(dateToDDMMMyyString(sunRisetime)).width;

    //leftcontext.fillText(dateToDDMMMyyString(sunRisetime),leftcanvas.width/2 - dateWidth/2, leftcanvas.height/2 + leftcanvas.height*0.40);
    //console.log("timeWidth"+ timeWidth+ "dateWidth"+dateWidth);
    

    fontsize = Math.round(radius*2.5*0.2);
    leftcontext.font=fontsize+"px "+isgvffont;
  
    var aWidth = leftcontext.measureText("PM").width;    
    leftcontext.fillText("PM",50 + timeWidth1 + 20, leftcanvas.height/2 + leftcanvas.height*0.35 );
    leftcontext.fillText("nd",93 , leftcanvas.height/2 + leftcanvas.height*0.23 );

  
    var aWidth = leftcontext.measureText("PM").width;    
    leftcontext.fillText("PM",50 + timeWidth + 20, leftcanvas.height/2 + leftcanvas.height*0.05 );
    leftcontext.fillText("st",90 , leftcanvas.height/2 - leftcanvas.height*0.07);




    fontsize = Math.round(radius*1.2);

    leftcontext.font=fontsize+"px "+isgvffont;

    var sunriseWidth = leftcontext.measureText("JUMA").width;
    leftcontext.fillText("JUMA",leftcanvas.width/2 - 20, leftcanvas.height/2 - leftcanvas.height*0.30);

    leftcontext.stroke();
    //createSunRay(leftcontext,leftcanvas, radius);

}

/*
function createJumaIcon(name, time, leftcontext, leftcanvas){
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    leftcontext.beginPath();
    leftcontext.fillStyle = 'white';//#484646';
    leftcontext.beginPath();
    var radius = leftcanvas.width * 0.10;
    //leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2, radius, 0,Math.PI, true); 
    leftcontext.closePath();
    leftcontext.lineWidth = 2;
    var fontsize = Math.round(radius*2);

    leftcontext.font="500 "+fontsize+"px "+isgvffont;

    timeWidth = leftcontext.measureText(time).width;
    leftcontext.fillText(time,leftcanvas.width/2 - timeWidth/2, leftcanvas.height/2 + leftcanvas.height*0.3);
 
    
    fontsize = Math.round(radius*2.5*0.3);
    leftcontext.font=fontsize+"px "+isgvffont;
    
    var aWidth = leftcontext.measureText("PM").width;    
    leftcontext.fillText("PM", (leftcanvas.width/2 - timeWidth/2 + timeWidth) + 1 , leftcanvas.height/2 + leftcanvas.height*0.3 );


    fontsize = Math.round(radius*1.1);

    leftcontext.font=fontsize+"px "+isgvffont;

    var sunriseWidth = leftcontext.measureText(name).width;
    leftcontext.fillText(name,leftcanvas.width/2 - sunriseWidth/2 + 15, leftcanvas.height/2 - leftcanvas.height*0.20);

    leftcontext.stroke();
    //createSunRay(leftcontext,leftcanvas, radius);

}
*/


function createZawalTime(zawaltime, leftcontext, leftcanvas){
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    leftcontext.beginPath();
    leftcontext.strokeStyle = 'white';
    leftcontext.beginPath();
    var radius = leftcanvas.width * 0.10;
    leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2 - 10, radius, 0,2* Math.PI, true); 
    leftcontext.closePath();

    
    var angle = (Math.PI * 2) * (52 / 60) - Math.PI / 2;

    leftcontext.moveTo(leftcanvas.width/2 + radius*0.8, leftcanvas.height/2);
    leftcontext.lineTo(leftcanvas.width / 2 + Math.cos(angle) * radius *1.1, leftcanvas.height / 2 + Math.sin(angle) * radius*2);

    //leftcontext.lineTo(leftcanvas.width/2+radius+Math.cos(Math.PI/4) , leftcanvas.height/2- 10+Math.sin(Math.PI/4));
    //leftcontext.rotate(-Math.PI/4);
    leftcontext.stroke();



    leftcontext.lineWidth = 2;
    var fontsize = Math.round(radius*2.5);

    leftcontext.font="500 "+fontsize+"px "+isgvffont;
   // leftcontext.font-weight=500;

    //leftcontext.font="lighter 12px Source Sans Pro "; //Georgia
    leftcontext.fillStyle = "white";
    zawal = formDateToStringHMM(zawaltime);

    var zawalam = formDateToStringHMMA(zawaltime);

    timeWidth = leftcontext.measureText(zawal).width;
    leftcontext.fillText(zawal,leftcanvas.width/2 - timeWidth/2-10, leftcanvas.height/2 + leftcanvas.height*0.30);
    fontsize = Math.round(radius*1.7);

    leftcontext.font=fontsize+"px "+isgvffont;

    var sunriseWidth = leftcontext.measureText("Zawal").width;
    leftcontext.fillText("Zawal",leftcanvas.width/2 - sunriseWidth/2, leftcanvas.height/2 - leftcanvas.height*0.30);

    fontsize = Math.round(radius*2.5*0.4);
    leftcontext.font=fontsize+"px "+isgvffont;
  
    var amapm= "AM";
    if(zawalam.indexOf("AM") == -1){
      amapm= "PM";
    }
    var aWidth = leftcontext.measureText(amapm).width;    
    leftcontext.fillText(amapm,leftcanvas.width/2 + timeWidth/2 -9, leftcanvas.height/2 + leftcanvas.height*0.30 );


    leftcontext.stroke();



}
function createQiblaIcon(qiblaDirection, leftcontext, leftcanvas){
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    leftcontext.beginPath();
    //leftcontext.strokeStyle = '#484646';
    leftcontext.strokeStyle = 'white';
    leftcontext.beginPath();
    var radius = leftcanvas.width * 0.20;
    //$("#lowerbase3canvas").css("background","rgba(255, 255, 255, 0.65)");
    
    leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2, radius - 5, 0,2* Math.PI, true); 
    leftcontext.closePath();
    
    /* Logic for creating Navigation icon */

    var width = leftcanvas.width;
    var height = leftcanvas.height;
    var gap = 50;

    leftcontext.moveTo(60, height - 60);
    leftcontext.lineTo(10+width/2, gap);
    leftcontext.lineTo(width - 70, height - 50);
    leftcontext.lineTo(width/2-1, height/2 + 5);
    leftcontext.closePath();
    leftcontext.stroke();



    /* End of Navigation */

    leftcontext.lineWidth = 2;
    var fontsize = Math.round(radius*0.8);

    leftcontext.font="500 "+fontsize+"px "+isgvffont;
   // leftcontext.font-weight=500;

    //leftcontext.font="lighter 12px Source Sans Pro "; //Georgia
    //leftcontext.fillStyle = "#484646";
    leftcontext.fillStyle = 'white';
    //sunrise = formDateToStringHMM(sunRisetime);

    sunrise = "06:45am"

    timeWidth = leftcontext.measureText(qiblaDirection).width;
    leftcontext.fillText(qiblaDirection,leftcanvas.width/2 - timeWidth/2, leftcanvas.height/2 + leftcanvas.height*0.40);
    //todayDate = sunRisetime.getTime();
    //console.log(dateToDDMMMyyString(sunRisetime));
    //dateWidth = leftcontext.measureText(dateToDDMMMyyString(sunRisetime)).width;

    //leftcontext.fillText(dateToDDMMMyyString(sunRisetime),leftcanvas.width/2 - dateWidth/2, leftcanvas.height/2 + leftcanvas.height*0.40);
    //console.log("timeWidth"+ timeWidth+ "dateWidth"+dateWidth);
    
     fontsize = Math.round(radius*0.8);

    leftcontext.font=fontsize+"px "+isgvffont;

    var sunriseWidth = leftcontext.measureText("Qibla").width;
    leftcontext.fillText("Qibla",leftcanvas.width/2 - sunriseWidth/2, leftcanvas.height/2 - leftcanvas.height*0.30);

    leftcontext.stroke();

}

function createTimeLimitHelpArc(givenTime, next, radius, lineWidth, height, context, canvas, iconWidth, iconColor){
    context.beginPath();
    context.strokeStyle = iconColor;
    //var stAngle = convertTimeToRadianAngle(startTime),
    //enAngle = convertTimeToRadianAngle(endTime);

    // size of the arrow
    var sdate1 = new Date(givenTime.getTime() - iconWidth*60*1000), 
    sdate3 = new Date(givenTime.getTime() + iconWidth*60*1000),
    
    stAngle1 = convertTimeToRadianAngle(sdate1), //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
    enAngle2 = convertTimeToRadianAngle(sdate3);//(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;

    context.fillSyle = 'blue';
    context.lineWidth = 2;
    
        if(next == 'UP'){arrowType = 1;}
        else if(next == 'DOWN'){arrowType = 3;}
        else{arrowType = 0;}
        //console.log("darwArrow"+darwArrow+"next:"+next+"arrowType"+arrowType);
        drawArcedArrow(context,canvas.width / 2, height, radius,stAngle1,enAngle2,false,2,arrowType);
    context.stroke();
    

}

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function createhelpMenuIcon(leftcontext, leftcanvas){
  fitToContainer(leftcanvas);
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    leftcontext.beginPath();
    leftcontext.strokeStyle = 'white';
    leftcontext.beginPath();
    var radius = leftcanvas.width * 0.70;
    
    //leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2, radius - 5, 0,2* Math.PI, true); 
    //leftcontext.closePath();
    var noontime = new Date();
    noontime.setHours(12);
    noontime.setMinutes(0);
    var lineWidth = 2;
    var fontsize = Math.round(radius*0.20);
    leftcontext.font="500 "+fontsize+"px "+isgvffont;
    leftcontext.fillStyle = 'white';

    var textHelp = "No Change";
    createTimeLimitHelpArc(noontime, "NOCHANGE", radius, lineWidth, 100, leftcontext, leftcanvas,20,'white');
    timeWidth = leftcontext.measureText(textHelp).width;
    leftcontext.fillText(textHelp,leftcanvas.width/2 - timeWidth/2, 70);


    textHelp = "Increasing";
    createTimeLimitHelpArc(noontime, "UP", radius, lineWidth, 170, leftcontext, leftcanvas,20,'white');
    timeWidth = leftcontext.measureText(textHelp).width;
    leftcontext.fillText(textHelp,leftcanvas.width/2 - timeWidth/2, 140);
    leftcontext.stroke();


    textHelp = "Decreasing";
    createTimeLimitHelpArc(noontime, "DOWN", radius, lineWidth, 240, leftcontext, leftcanvas,20,'white');
    timeWidth = leftcontext.measureText(textHelp).width;
    leftcontext.fillText(textHelp,leftcanvas.width/2 - timeWidth/2, 210);
    leftcontext.stroke();

    textHelp = "Time Vairation";
    createTimeLimitHelpArc(noontime, "NOCHANGE", radius, lineWidth, 310, leftcontext, leftcanvas,35,'#00ACC1');
    timeWidth = leftcontext.measureText(textHelp).width;
    leftcontext.fillText(textHelp,leftcanvas.width/2 - timeWidth/2, 280);
    leftcontext.stroke();


}



function createCurrTimeBlock(leftcontext, leftcanvas){
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    //leftcontext.beginPath();
    //leftcontext.strokeStyle = 'black';
    //leftcontext.beginPath();
    var radius = leftcanvas.width * 0.10;
    //leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2, radius, 0,Math.PI, true); 
    //leftcontext.closePath();
    leftcontext.lineWidth = 1;
     $("#timecanvas").css("background","rgba(255, 255, 255, 0.65)");
      $("#timecanvas").css("border-radius","6px");
    var fontsize = Math.round(radius*2.4);

    leftcontext.font=fontsize+"px "+isgvffont;
    //leftcontext.font="lighter 12px Source Sans Pro "; //Georgia
    leftcontext.fillStyle = "#484646";
    var currdate = new Date();
    
    var currTime = formDateToStringHMM(currdate);
    var currTimeWithAP = formDateToStringHMMA(currdate);
    //var currTime = formDateToString(currdate);
    timeWidth = leftcontext.measureText(currTime).width;
    leftcontext.fillText(currTime,leftcanvas.width/2 - timeWidth/2, leftcanvas.height/2 + leftcanvas.height*0.01);
    
    //todayDate = sunRisetime.getTime();
    //console.log(dateToDDMMMyyString(sunRisetime));
    fontsize = Math.round(radius*1);
    leftcontext.font=fontsize+"px "+isgvffont;
    dateWidth = leftcontext.measureText(dateToDDDMMMyyyyString(currdate)).width;

    leftcontext.fillText(dateToDDDMMMyyyyString(currdate),leftcanvas.width/2 - dateWidth/2, leftcanvas.height/2 + leftcanvas.height*0.40);

    fontsize = Math.round(radius*0.8);
    leftcontext.font=fontsize+"px "+isgvffont;   

    fontsize = Math.round(radius*0.8);
    leftcontext.font=fontsize+"px "+isgvffont;

    var ampm = "A";
    if(currTimeWithAP.indexOf("AM") == -1){
      ampm = "P";
    }

    //aWidth = leftcontext.measureText(ampm).width;    
    leftcontext.fillText(ampm,leftcanvas.width/2 + timeWidth/2 + 4, leftcanvas.height/2 - 30);


    //aWidth = leftcontext.measureText("M").width;    
    leftcontext.fillText("M",leftcanvas.width/2 + timeWidth/2 + 1, leftcanvas.height/2 -3 );


    //console.log("timeWidth"+ timeWidth+ "dateWidth"+dateWidth);
    //var sunriseWidth = leftcontext.measureText("Sunrise").width;
    //leftcontext.fillText("Sunrise",leftcanvas.width/2 - sunriseWidth/2, leftcanvas.height/2 - leftcanvas.height*0.30);

    leftcontext.stroke();
}

function createSunRay(mycontext, mycanvas, radius){

    for (i=1;i<=13;i++) {
        var ang=Math.PI/4*i; // (180/6 * 7 = 210) 
        sang=Math.sin(ang);
        cang=Math.cos(ang);
        //console.log("Cos angle:"+cang+"Sin Angle:"+sang);
        mycontext.beginPath();
        mycontext.lineTo(mycanvas.width/2+cang*radius,mycanvas.height/2-12+sang*radius);
        mycontext.lineTo(mycanvas.width/2+cang*radius*1.8,mycanvas.height/2-12+sang*radius*1.8);
        mycontext.stroke();
    }
}

function createSunSetRay(mycontext, mycanvas, radius){

    for (i=6;i<=12;i++) {
        var ang=Math.PI/6*i; // (180/6 * 7 = 210) 
        sang=Math.sin(ang);
        cang=Math.cos(ang);
        //console.log("Cos angle:"+cang+"Sin Angle:"+sang);
        mycontext.beginPath();
        mycontext.lineTo(mycanvas.width/2+cang*radius,mycanvas.height/2+sang*radius);
        mycontext.lineTo(mycanvas.width/2+cang*radius*1.8,mycanvas.height/2+sang*radius*1.8);
        mycontext.stroke();
    }
}

function GregToIsl(date, currCountry, adjustmentDay) {


  d= date.getDate();
  m= date.getMonth();
  y= date.getFullYear();
  delta=adjustmentDay ;

          if ((y>1582)||((y==1582)&&(m>10))||((y==1582)&&(m==10)&&(d>14)))
            {
//added +delta=1 on jd to comply isna rulling 2007
            jd=intPart((1461*(y+4800+intPart((m-14)/12)))/4)+intPart((367*(m-2-12*(intPart((m-14)/12))))/12)-
  intPart( (3* (intPart(  (y+4900+    intPart( (m-14)/12)     )/100)    )   ) /4)+d-32075+delta
            }
            else
            {
//added +1 on jd to comply isna rulling
            jd = 367*y-intPart((7*(y+5001+intPart((m-9)/7)))/4)+intPart((275*m)/9)+d+1729777+delta
            }
          //arg.JD.value=jd
//added -1 on jd1 to comply isna rulling
          jd1=jd-delta
          //arg.wd.value=weekDay(jd1%7)
          l=jd-1948440+10632
          n=intPart((l-1)/10631)
          l=l-10631*n+354
          j=(intPart((10985-l)/5316))*(intPart((50*l)/17719))+(intPart(l/5670))*(intPart((43*l)/15238))
          l=l-(intPart((30-j)/15))*(intPart((17719*j)/50))-(intPart(j/16))*(intPart((15238*j)/43))+29
          m=intPart((24*l)/709)
          d=l-intPart((709*m)/24)
          y=30*n+j-30


        if(currCountry == 'SA'){
          hijriDate = d + "::"+HijriNamesArabic[m]+"::"+y;

        }else{
          hijriDate = d + "::"+HijriNames[m]+"::"+y;

        }

        //console.log(hijriDate+"-->"+currCountry+" " +d + "::"+m+"::"+y);
        return hijriDate;

  // arg.HDay.value=d
  // arg.HMonth.value=m
  // arg.HYear.value=y
}

function intPart(floatNum){
if (floatNum< -0.0000001){
   return Math.ceil(floatNum-0.0000001)
  }
return Math.floor(floatNum+0.0000001)
}

function createNavigationIcon(mycontext,mycanvas, qiblaDirection, currCountry){
    mycontext.beginPath();
    mycontext.lineWidth = 1;
    mycontext.strokeStyle = 'white';
    mycontext.beginPath();
    mycontext.arc(mycanvas.width/2, mycanvas.height/2-10, 3, 0,Math.PI * 2, true); 
    mycontext.closePath();
    mycontext.stroke();
    mycontext.beginPath();
    mycontext.arc(mycanvas.width/2, mycanvas.height/2-10, 10, 0,Math.PI * 2, true); 
    //mycontext.stroke();
    mycontext.closePath();

    mycontext.font="20px "+isgvffont; //Georgia
    mycontext.fillStyle = "white";
    
    if(currCountry == 'SA'){
      timeWidth = mycontext.measureText(qiblaNameInArabic).width;

      mycontext.fillText(qiblaNameInArabic,mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + 20);
    }else{
      timeWidth = mycontext.measureText("Qibla").width;
      mycontext.fillText("Qibla",mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + 20);
    }
    timeWidth = mycontext.measureText(qiblaDirection).width; // 18.91 N CW
    mycontext.fillText(qiblaDirection,mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + 40);
    mycontext.stroke();
    mycontext.closePath();

    var x = 8;

    // mycontext.moveTo(mycanvas.width/2-10,15);
    // mycontext.lineTo(mycanvas.width/2-4,17);
    // mycontext.stroke();
    // mycontext.moveTo(mycanvas.width/2-10,15);
    // mycontext.lineTo(mycanvas.width/2+9,mycanvas.height/2 + 3);
    // mycontext.stroke();
    // mycontext.moveTo(mycanvas.width/2-10,15);
    // mycontext.lineTo(mycanvas.width/2-11,21);
    // mycontext.stroke();

    mycontext.stroke();

}

function load() {

    var mydata = data['01JAN'];
    alert(mydata[0].name);
    alert(mydata[0].time);
}

 // function loadJSON(callback) {   

 //    var xobj = new XMLHttpRequest();
 //        xobj.overrideMimeType("application/json");
 //  xobj.open('GET', 'data3.json', true); // Replace 'my_data' with the path to your file
 //  xobj.onreadystatechange = function () {
 //          if (xobj.readyState == 4 && xobj.status == "200") {
 //            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
 //            callback(xobj.responseText);
 //          }
 //    };
 //    xobj.send(null);  
 // }

function createDummyMoonIcon(mycontext,mycanvas,lunarDate){
   
   mycontext.clearRect(0,0,mycanvas.width, mycanvas.height); 
    //mycontext.fillStyle = '#9933FF';//'#837E7C';background-color:#000066
    //mycontext.fillStyle = 'blue';
    mycontext.strokeStyle = 'white';
   var radius = mycanvas.width * 0.06;

    var fontsize = Math.round(radius*2);

    mycontext.lineWidth = 2;
    mycontext.save();
    mycontext.beginPath();
    mycontext.arc(80, mycanvas.height/2 - mycanvas.height*0.26, radius, 1.7*Math.PI,Math.PI* 0.8);
    //mycontext.clip();
    mycontext.strokeStyle = 'white';
    mycontext.stroke();
    //mycontext.fillRect(0, 0, mycanvas.width, mycanvas.height);
    mycontext.restore();

    mycontext.beginPath();
    mycontext.arc(75, mycanvas.height/2-mycanvas.height*0.30 , radius, 1.8*Math.PI,Math.PI* 0.7);
   
    mycontext.stroke();
    
    mycontext.closePath();
    fontsize = Math.round(radius*2.8);
    mycontext.font=fontsize+"px "+isgvffont; //Georgia
    mycontext.fillStyle = "white";
  

    var lunarDateArr = lunarDate.split("::");
    var moonDay = lunarDateArr[0];
    timeWidth = mycontext.measureText(moonDay).width;
    mycontext.fillText(moonDay,120, mycanvas.height/2 - mycanvas.height*0.17);

    fontsize = Math.round(radius*1.5);
    mycontext.font=fontsize+"px "+isgvffont; //Georgia
    var ddMM = lunarDateArr[1];
    timeWidth = mycontext.measureText(ddMM).width;
    mycontext.fillText(ddMM,mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + mycanvas.height*0.09);
    // //todayDate = sunRisetime.getTime();
    dateWidth = mycontext.measureText(lunarDateArr[2]+" A.H").width;
    mycontext.fillText(lunarDateArr[2]+" A.H",mycanvas.width/2 - dateWidth/2, mycanvas.height/2 + mycanvas.height*0.28);
    //console.log("timeWidth"+ timeWidth+ "dateWidth"+dateWidth);
    //mycontext.stroke();
    
}

function getHijriDate(currdate) {

  // var url = "http://www.islamicfinder.org/dateconvertor/convertdate?day=25&month=7&year=2016&dateType=Gregorian";
  //   $.getJSON( url, {
  //     tags: "islamic finder",
  //     tagmode: "any",
  //     format: "json"
  //   })
  //   .done(function( data ) {
  //     console.log(data.hijriDate + ":::" + data.hijriMonth);
  //   });


    // Using YQL and JSONP
    $.ajax({
        url: "http://www.islamicfinder.org/dateconvertor/convertdate?day=25&month=7&year=2016&dateType=Gregorian",
     
        // The name of the callback parameter, as specified by the YQL service
        jsonp: "callback",
     
        // Tell jQuery we're expecting JSONP
        dataType: "json",
     
        // Tell YQL what we want and that we want JSON
        data: {            
            format: "json"
        },
     
        // Work with the response
        success: function( response ) {
            conosle.log("URL:" + url);
            console.log(JSON.stringify(response)); // server response
        }
    });

}

function createRightArrow(mycontext, mycanvas, colorName){

  mycontext.clearRect(0, 0, mycanvas.width, mycanvas.height);
  mycontext.beginPath();
  mycontext.lineWidth = mycanvas.width*0.08;
  mycontext.strokeStyle = colorName;
  mycontext.moveTo(mycanvas.width*0.25,(mycanvas.height/2 - mycanvas.height*0.20));
  mycontext.lineTo(mycanvas.width-mycanvas.height*0.25,mycanvas.height/2);
  mycontext.stroke();
  mycontext.moveTo(mycanvas.width-mycanvas.height*0.25,mycanvas.height/2-2);
  mycontext.lineTo(mycanvas.width*0.25,(mycanvas.height/2 + mycanvas.height*0.20));
  mycontext.stroke();

}


function createLeftArrow(mycontext, mycanvas, colorName){
  mycontext.clearRect(0, 0, mycanvas.width, mycanvas.height);
  mycontext.beginPath();
  mycontext.lineWidth = mycanvas.width*0.08;
  mycontext.strokeStyle = colorName;
  mycontext.moveTo(mycanvas.width-mycanvas.height*0.25,(mycanvas.height/2 - mycanvas.height*0.20));
  mycontext.lineTo(mycanvas.width*0.25,mycanvas.height/2);
  mycontext.stroke();
  mycontext.moveTo(mycanvas.width*0.25,mycanvas.height/2-2);
  mycontext.lineTo(mycanvas.width-mycanvas.height*0.25,(mycanvas.height/2 + mycanvas.height*0.20));
  mycontext.stroke();

}


function createRefreshIcon(context, canvas){
 
    var startTime = new Date();
    startTime.setHours(9);
    var endTime = new Date();
    endTime.setHours(12);

    context.beginPath();
    context.strokeStyle = 'white';
    //context.fill = 'white';
    var stAngle = convertTimeToRadianAngle(startTime),
    enAngle = convertTimeToRadianAngle(endTime);

    // size of the arrow
    // sdate1 = new Date(startTime.getTime() - 35*60*1000), 
    // sdate3 = new Date(startTime.getTime() + 35*60*1000),
    
    // stAngle1 = convertTimeToRadianAngle(sdate1), //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
    // enAngle2 = convertTimeToRadianAngle(sdate3);//(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;



    sdate1 = new Date(startTime.getTime()), 
    sdate3 = new Date(endTime.getTime()),
    
    stAngle1 = convertTimeToRadianAngle(sdate1), //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
    enAngle2 = convertTimeToRadianAngle(sdate3);//(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;

    // stAngle1 = Math.PI* 11/6, //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
    // enAngle2 = Math.PI /2;//(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;

    arrowType = 2;
    drawArcedArrow(context,canvas.width/2, canvas.height / 2   , canvas.width/2 - 5,stAngle1,enAngle2,true,2,arrowType);
    
    context.moveTo(canvas.width/2 +  2, (canvas.height/2 - 20));
  // context.lineTo(4,canvas.height/2);
  // context.stroke();
  // context.moveTo(4,canvas.height/2-2);
  // context.lineTo(canvas.width,(canvas.height/2 + 20));

     context.stroke();


}

function createHelpIcon(mycontext, mycanvas){
      mycontext.clearRect(0,0,mycanvas.width, mycanvas.height)

    mycontext.beginPath();
    mycontext.lineWidth = 1;
    mycontext.strokeStyle = 'white';
    mycontext.arc(mycanvas.width/2, mycanvas.height/2 - 4, 8, 0,Math.PI * 2, true); 
    mycontext.closePath();
    mycontext.stroke();
    mycontext.font="lighter 12px Source Sans Pro"; //Georgia
    mycontext.fillStyle = "white";
    timeWidth = mycontext.measureText("?").width;
    mycontext.fillText("?",mycanvas.width/2 - timeWidth/2, mycanvas.height/2);
    mycontext.stroke();

}


function drawHomeIcon(mycontext, mycanvas){
  mycontext.clearRect(0,0,mycanvas.width, mycanvas.height)
  
  var x = 8;
  mycontext.lineWidth = 1;
  mycontext.strokeStyle = 'white';
  mycontext.moveTo(mycanvas.width/2,5);
  mycontext.lineTo(x-2,10+2);
  mycontext.stroke();
  mycontext.moveTo(x,10);
  mycontext.lineTo(x,(mycanvas.height - 10));
  mycontext.stroke();
  mycontext.moveTo(x,(mycanvas.height - 10));
  mycontext.lineTo(22, (mycanvas.height - 10));
  mycontext.stroke();
  mycontext.moveTo(22, (mycanvas.height - 10));
  mycontext.lineTo(22, 10);
  mycontext.stroke();
  mycontext.moveTo(22+2, 10+2);
  mycontext.lineTo(mycanvas.width/2,5);
  mycontext.stroke();
  
  mycontext.lineWidth = 2;
  //mycontext.strokeStyle = '#000066';
  mycontext.rect(13,(mycanvas.height - 16),4,6);
  mycontext.stroke();
  mycontext.fillStyle = '#9933FF';
  //mycontext.rect(13,(mycanvas.height - 16),4,7);
  
  mycontext.fill();
  
}


function createSettingIcon(mycontext,mycanvas){
    mycontext.clearRect(0,0,mycanvas.width, mycanvas.height)
    mycontext.beginPath();
    mycontext.lineWidth = mycanvas.width*0.06;
    //mycontext.lineWidth = 2;
    mycontext.strokeStyle = 'white';
    mycontext.beginPath();
    var radius1 = mycanvas.width * 0.10;
    var radius2 = mycanvas.width * 0.20;
    
    mycontext.arc(mycanvas.width/2, mycanvas.height/2, radius1, 0,Math.PI * 2, true); 
    mycontext.closePath();
    mycontext.stroke();
    mycontext.beginPath();
    mycontext.arc(mycanvas.width/2, mycanvas.height/2, radius2, 0,Math.PI * 2, true); 
    mycontext.stroke();
    mycontext.closePath();
    //mycontext.font="20px "+isgvffont; //Georgia

    //mycontext.font="lighter 12px Georgia"; //Georgia
    mycontext.fillStyle = "white";
    //timeWidth = mycontext.measureText("Setting").width;
    //mycontext.fillText("Setting",mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + 35);
    mycontext.stroke();
    
    for (i=1;i<=8;i++) {
        var ang=Math.PI/4*i; // (180/6 * 7 = 210) 
        sang=Math.sin(ang);
        cang=Math.cos(ang);
        //console.log("Cos angle:"+cang+"Sin Angle:"+sang);
        mycontext.beginPath();
        mycontext.lineWidth = 3;
        mycontext.lineTo(mycanvas.width/2+cang*radius2,mycanvas.height/2+sang*radius2);
        mycontext.lineTo(mycanvas.width/2+cang*(radius2+radius1),mycanvas.height/2+sang*(radius2+radius1));
        mycontext.stroke();
    }
}


function createnos() {
    var nos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
angle = 0,
nowidth = 0;
    nos.forEach(function (numeral) {
        angle = Math.PI / 6 * (numeral - 3);
        nowidth = context.measureText(numeral).width;
        context.fillText(numeral,canvas.width / 2 + Math.cos(angle) * (Hr) -nowidth / 2,canvas.height / 2 + Math.sin(angle) * (Hr) + font / 3);
    });
}

//---------------------- Misc Functions -----------------------

// convert given string into a number
function eval(str){
    return 1* (str+ '').split(/[^0-9.+-]/)[0]; 
}

// detect if input contains 'min'
function isMin(arg){
    return (arg+ '').indexOf('min') != -1;
}

// compute the difference between two times 
function timeDiff(time1, time2) {
    return DMath.fixHour(time2- time1);
}

// add a leading 0 if necessary
function twoDigitsFormat(num) {
    return (num <10) ? '0'+ num : num;
}

function getDDMMMFromDate(date){
      var day = date.getDate();
      day = (day <10) ? '0'+ day : day;
      DMMM = day+date.getShortMonthName().toUpperCase(); 
      return DMMM;
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function subMinutes(date, minutes) {
    return new Date(date.getTime() - minutes*60000);
}

function fromHMMtoFloat(hhMM){
  

  var hourmin = hhMM.split(":"),
  temp_hour = parseInt( hourmin[0] ),
  namazMinute = Math.floor( hourmin[1]  );
  var floatMin = namazMinute/60;
  var flaotTime = temp_hour+"."+floatMin;
  floatTime = parseFloat(flaotTime);
  return floatTime;
}

function getDaysInMonth(m, y)
{
    // months in JavaScript start at 0 so decrement by 1 e.g. 11 = Dec
    --m;

    // if month is Sept, Apr, Jun, Nov return 30 days
    if( /8|3|5|10/.test( m ) ) return 30;

    // if month is not Feb return 31 days
    if( m != 1 ) return 31;

    // To get this far month must be Feb ( 1 )
    // if the year is a leap year then Feb has 29 days
    if( ( y % 4 == 0 && y % 100 != 0 ) || y % 400 == 0 ) return 29;

    // Not a leap year. Feb has 28 days.
    return 28;
}

function writeAMPMfterTime(context, info,radius,ampm){
        context.beginPath();
        var gap = radius*0.50;
        var height = canvas.height/2 + radius + gap;
        var infoWidth = context.measureText(info).width;
        var fontsize = Math.round(radius/3*0.4);
        context.font=fontsize+"px "+isgvffont;
        var achar="AM";
        var aWidth=context.measureText(achar).width;
        
        if(ampm == -1){
            achar="PM";    
            aWidth = context.measureText(achar).width;                
        }

        //context.fillText(achar, canvas.width/2 + infoWidth/2 + 6, height - 10);

        aWidth = context.measureText(achar).width;    
        context.fillText(achar, canvas.width/2 + infoWidth/2 + 4, height);
        context.stroke();

}

function cancelFullScreen(el) {
    var requestMethod = el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function requestFullScreen(el) {
    // Supports most browsers and their versions.
    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
    return false
}

function toggleFull() {
    var elem = document.body; // Make the body go full screen.
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);

    if (isInFullScreen) {
        cancelFullScreen(document);
    } else {
        requestFullScreen(elem);
    }
    return false;
}
