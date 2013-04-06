function read() {
	document.addEventListener("deviceready", readyRead, false);
};

function clearScreen() {
	document.getElementById("tagContents").innerHTML = "";
};

function template(record) {
	var recordType = nfc.bytesToString(record.type), payload;
	// attempt display as a string
	payload = nfc.bytesToString(record.payload);
	return payload;
};

function displayBottle(bottle){
    var text = nfc.bytesToString(records[0].payload);
    text = text.substring(3,text.length);
    var vin = jQuery.parseJSON(text);
    document.bottle.output.value=vin;
};

function parseTag(nfcEvent) {
	clearScreen();
	var tag = nfcEvent.tag;
	var records = tag.ndefMessage;
	var display = document.getElementById("header");
    display.innerHTML = "<h3><center>This is your bottle</center></h3>";
	// Display Record Info
	//var p = document.createElement('p');
	var text = nfc.bytesToString(records[0].payload);
	//suppression des 3 premiers caractères (caractèreInconnu+e+n)
	text = text.substring(3,text.length);
	var vin = jQuery.parseJSON(text);
    var data = document.createElement('data');
    data.innerHTML = "Type de vin : " + vin.typeDeVin  + "<br> annee :" + vin.annee + "<br> domaine : " + vin.domaine;
    //p.innerHTML = "<div data-theme=\"a\" data-role=\"header\"><h3>This is your bottle</h3></div>";


    display = document.getElementById("identification");
    display.appendChild(data);
//    var boutons = document.createElement('bouttons');
var button = document.createElement('button').
button.onclick = function(){
 alert('I was clicked');
};
  //  button.innerHTML = button.innerHTML + "choux-fleurs";
/*	button.innerHTML = "<div data-role='content' id='writeRemove'><a data-role='button' data-inline='true' id='writeTag' href='add.html'>to write a new tag</a><a data-role='button' data-inline='true' id='removeBottle' href='add.html'>to remove the bottle</a></div>";
*/
    display.appendChild(button);

    navigator.notification.vibrate(100);
};

var readyRead = function() {
	function failure(reason) {
		navigator.notification.alert(reason, function() {
		}, "There was a problem");
	}
	nfc.addNdefListener(parseTag, function() {
		console.log("Success.");
	}, function() {
		console.log("Fail.");
	});
};
