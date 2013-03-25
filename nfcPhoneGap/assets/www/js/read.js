function read() {
	document.addEventListener("deviceready", readyRead, false);
};

function clearScreen() {
	document.getElementById("tagContents").innerHTML = "";
};

function showInstructions(p) {
	document.getElementById("tagContents").innerHTML = " scan a tag";
};

function template(record) {
	var recordType = nfc.bytesToString(record.type), payload;
	// attempt display as a string
	payload = nfc.bytesToString(record.payload);
	return payload;
};

function parseTag(nfcEvent) {
	clearScreen();
	var tag = nfcEvent.tag;
	var records = tag.ndefMessage;
	var display = document.getElementById("tagContents");
	// Display Record Info
	var p = document.createElement('p');
	var text = nfc.bytesToString(records[0].payload);
	//suppression des 3 premiers caractères (caractèreInconnu+e+n)
	text = text.substring(3,text.length);
	var vin = jQuery.parseJSON(text);
	p.innerHTML = "Type de vin : " + vin.typeDeVin  + "<br> annee :" + vin.annee + "<br> domaine : " + vin.domaine;
	display.appendChild(p);
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
	showInstructions();
};
