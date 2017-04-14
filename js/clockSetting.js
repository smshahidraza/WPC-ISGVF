function ClockSetting(method) {

	var dailytime =  false;
	var monthtime = false;
	return {
	

		getPrayerClockSetting: function(){
			var settingObject = prayerTimeAppSetting['SETTING'];					
			return settingObject ;
		},

		getName: function(){
			return this.getPrayerClockSetting()[0].name;
		},

		getWebsite: function(){
			return this.getPrayerClockSetting()[3].website;
		},

		getHijriAdjustmentDay: function(){
			return this.getPrayerClockSetting()[7].hijriAdjustDay;
		},

		getMessagseparator: function(arrayLength){
			if(arrayLength > 1){
				return this.getPrayerClockSetting()[8].messageseparator;			
			}else{
				return "";
			}
		},

		isTimeLimitArcOn(){
			return this.getPrayerClockSetting()[9].timelimitArc === "on";						
		},

		getPrayerClockMessage: function(){
			var messageObject = prayerTimeMessage;
			return messageObject;
		},

		getEventMessage: function(){
			var eventObject = eventMessage;
			return eventObject;
		},


		getFirstJumaTime: function(){
			var currDate = new Date();
			if(currDate.dst()){
				return this.getPrayerClockSetting()[4].juma1;
			}else {
				return this.getPrayerClockSetting()[6].juma1DST;				
			}
		},

		getSecondJumaTime: function(){
			var currDate = new Date();
			if(currDate.dst()){			
				return this.getPrayerClockSetting()[5].juma2;
			}else{
				return this.getPrayerClockSetting()[7].juma2DST;				
			}
		},

		getAllActiveMessage: function(){
			var prayerTimeMessage = this.getPrayerClockMessage();
			var arrayLength = prayerTimeMessage.length;
			var stringMesage = "";
			for (var i = 0; i < arrayLength; i++) {
				var msgarray = prayerTimeMessage[i].message;

				if(msgarray.show === 'yes'){
					stringMesage = stringMesage + msgarray.text+" "+this.getMessagseparator(arrayLength);
				}
			}
			return stringMesage;
		},

		getDefaultMessage: function(){
			var prayerTimeMessage = this.getPrayerClockMessage();
			var arrayLength = prayerTimeMessage.length;
			var stringMesage = "";
			for (var i = 0; i < arrayLength; i++) {
				if(prayerTimeMessage[i].date == 'DEFAULT'){

				var msgarray = prayerTimeMessage[i].message;
				for (var j = 0; j < msgarray.length; j++) {
					var msg = msgarray[j];
					if(msg.show === 'yes'){
						stringMesage = stringMesage + msg.text+" "+this.getMessagseparator(arrayLength);
					}
				}
				break;
				}
			}
			return stringMesage;
		},

		getAllActiveDateMessage: function(){
			var prayerTimeMessage = this.getPrayerClockMessage();
			var arrayLength = prayerTimeMessage.length;
			var stringMesage = "";
			var currDate = new Date();
			stringMesage = this.getDefaultMessage();
			for (var i = 0; i < arrayLength; i++) {
				var msgarray = prayerTimeMessage[i].message;
				var day = prayerTimeMessage[i].date;
				if(day == currDate.getDayName()){
					var time = prayerTimeMessage[i].time;
					if(msgarray.show == "yes"){
						if(time != null){
							stringMesage = stringMesage + msgarray.text+" "+this.getMessagseparator(arrayLength);	
						}else{
							stringMesage = stringMesage + msgarray.text+" "+this.getMessagseparator(arrayLength);	
						}
					}
				}
				if(day == getDDMMMFromDate(currDate)){
					var time = prayerTimeMessage[i].time;
					if(msgarray.show == "yes"){
						if(time != null){
							stringMesage = stringMesage + msgarray.text+" "+this.getMessagseparator(arrayLength);	
						}else{
							stringMesage = stringMesage + msgarray.text+" "+this.getMessagseparator(arrayLength);	
						}
					}
					
				}
			}
			return stringMesage;
		},

        getAllActiveEvents: function(numberCounter){
            var events = this.getEventMessage();
            var activeEvents = [];
            var arrayLength = events.length;
            var currDate = new Date();

            var messageCounter = 0;
            var currDate = new Date();
             currDate.setHours(0);
  			
  			currDate.setMinutes(0);

            for (var i = 0; i < arrayLength && messageCounter < numberCounter ; i++) {

                var msgarray = events[i].message;
                var day = events[i].date;

                if(currDate < getDateFromDDMMMYY(day)){
                    if(msgarray.show == "yes") {
                        activeEvents[messageCounter] = events[i];
                        messageCounter++;
                    }                   
                }
            }
            return activeEvents;
        },


		/*
		Slider related method
		*/
		getPrayerClockSlider: function(){
			var slidingObject = prayerTimeAppSetting['SLIDER'];					
			return slidingObject ;
		},

		isSlidingOn: function(){
			return this.getPrayerClockSetting()[6].slider === "on";			
		},

		getAllActiveSlides: function(){
			var prayerClockSlider = this.getPrayerClockSlider();
			var arrayLength = prayerClockSlider.length;
			var activeSlides = [];
			for (var i = 0; i < arrayLength; i++) {
				var show = prayerClockSlider[i].show;
				var type = prayerClockSlider[i].type;
				if(type == 'events' ){
					if(show === 'yes' && this.isActiveEventsAvailable()){
						activeSlides.push(prayerClockSlider[i]);
					}
				}else {
					if(show === 'yes'){
						activeSlides.push(prayerClockSlider[i]);
					}

				}
			}
			return activeSlides;
		},

		isDailyTimeOn: function(){
			return dailytime;
		},

		isMonthTimeOn: function(){
			return monthtime;
		},
		isActiveEventsAvailable: function() {
    		return this.getAllActiveEvents(1).length > 0 ;
		}


	}


}



//---------------------- Init Object -----------------------


var clockSetting = new ClockSetting();