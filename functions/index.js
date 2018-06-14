const functions = require('firebase-functions');

exports.generate = functions.https.onRequest((request, response) => {
	var b = request.body;
	//first identification
	var fname = b.fName;
	var lname = b.lName;
	var age = b.age;
	var gender = b.gender;
	var pronoun = "he";
	if(gender == "female") pronoun = "she";
	
	var p1 = age+"-year-old "+ gender + " with ";
	
	var pmh = "";
	//PMH
	var arr = new Array();
	if(b.cbcad){
		arr[arr.length] = "CAD";
	}
	if(b.cbhtn){
		arr[arr.length] = "HTN";
	}
	if(b.cbdm){
		arr[arr.length] = "DM";
	}
	if(b.cbhld){
		arr[arr.length] = "HLD";
	}
	
	p1 += arrFormatter(arr);
	p1 += " presents for evaluation of ";
	
	arr = new Array();
	//CC
	if(b.cbcp){
		arr[arr.length] = "chest pain"
	}
	if(b.cbsob){
		arr[arr.length] = "shortness of breath"
	}
	if(b.cbpalp){
		arr[arr.length] = "palpitations"
	}
	if(b.cbsync){
		arr[arr.length] = "syncope"
	}
	if(b.cbabnnl){
		arr[arr.length] = "abnormal ECG"
	}
	if(b.cbdizz){
		arr[arr.length] = "dizziness"
	}
	if(b.cbmurm){
		arr[arr.length] = "murmur"
	}
	if(b.cbclear){
		arr[arr.length] = "cardiac clearance"
	}
	if(b.cbcadcc){
		arr[arr.length] = "coronary artery disease"
	}
	if(b.cbafib){
		arr[arr.length] = "atrial fibrillation"
	}
	
	p1 += arrFormatter(arr) + ".";
	
	
	//Chest Pain details
	if(b.chestpain){
		var time = "for the past ";
		var period = b.r1;	
		//calculate how many are selected
		arr = new Array();
		if(b.c0) arr[arr.length] = 0;
		if(b.c1) arr[arr.length] = 1;
		if(b.c2) arr[arr.length] = 2;
		if(b.c3) arr[arr.length] = 3;
		if(b.c4) arr[arr.length] = 4;
		if(b.c5) arr[arr.length] = 5;
		if(b.c6) arr[arr.length] = 6;
		if(b.c7) arr[arr.length] = 7;
		if(b.c8) arr[arr.length] = 8;
		if(b.c9) arr[arr.length] = 9;
		if(b.c10) arr[arr.length] = 10;
		//SINGULAR: day
		if(b.c1 && arr.length == 1){
			time+= period;
		}
		//PLURAL no numbers: few days
		else if(b.c0){
			time += "few " + period + "s ";
		}
		//PLURAL one number: 2 days
		else if(arr.length == 1){
			time += arr[0] +" "+ period + "s ";
		}
		//PLURAL range: 3-5 days
		else if(arr.length >= 2){
			time += arr[0] + "-" + arr[arr.length-1]+" "+ period + "s ";
		}
		if(b.r4) locat = b.r4;
		else locat = "";
		
		arr = new Array();
		
		if(b.r5 != "") arr[arr.length] = b.r5;
		if(b.r6 != "") arr[arr.length] = b.r6;
		if(b.r7 != "") arr[arr.length] = b.r7;
		if(b.r8 != "") arr[arr.length] = b.r8;
		if(b.r9 != "") arr[arr.length] = b.r9;
		
		p1 += " Patient reports that " + time + " " + pronoun + " has been experiencing episodes of " + locat + " chest discomfort, described as " + arrFormatter(arr);
		
		
		arr = new Array();
		var duration = b.r10;
		if(b.r10){ //not default
			var p2 = "";
			if(b.d0) arr[arr.length] = 0;
			if(b.d1) arr[arr.length] = 1;
			if(b.d2) arr[arr.length] = 2;
			if(b.d3) arr[arr.length] = 3;
			if(b.d4) arr[arr.length] = 4;
			if(b.d5) arr[arr.length] = 5;
			if(b.d6) arr[arr.length] = 6;
			if(b.d7) arr[arr.length] = 7;
			if(b.d8) arr[arr.length] = 8;
			if(b.d9) arr[arr.length] = 9;
			if(b.d10) arr[arr.length] = 10;
			//SINGULAR: second
			if(b.d1 && arr.length == 1){
				p2+= " lasting 1 " + duration;
			}
			//PLURAL no numbers: seconds
			else if(b.d0){
				p2 += " lasting " + duration + "s ";
			}
			//PLURAL one number: 2 seconds
			else if(arr.length == 1){
				p2 += " lasting " + arr[0] +" "+ duration + "s ";
			}
			//PLURAL range: 3-5 seconds
			else if(arr.length >= 2){
				p2 += " lasting " + arr[0] + "-" + arr[arr.length-1]+" "+ duration + "s ";
			}
			
			p1 += p2;
		}		
	}else{
		p1 += " Patient denies chest pain."
	}
	


	
	response.send(p1);
});

function arrFormatter(arr){
	var string = "";
	if(arr.length == 0){
		return "";
	}
	if(arr.length == 1){
		return arr[0];
	}
	for(var i = 0; i < arr.length-1; i++){
		string += arr[i] + ", ";
	}
	string+=" and "
	string+= arr[arr.length-1];
	
	return string;
}