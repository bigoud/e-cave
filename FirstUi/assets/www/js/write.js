function write() {
	document.addEventListener("deviceready", readyWrite, false);
//	document.addEventListener("backbutton", yourCallbackFunction, false);
};

function yourCallbackFunction(){
	nfc.removeNdefListener(writeTag,console.log("back"),false);
	document.removeEventListener("backbutton",yourCallbackFunction,false);
	$.mobile.changePage("mainPage.html");
}

function writeTag(nfcEvent) {
	var typeDeVin = $("#typeDeVin").val(), annee= $("#annee").val(), domaine = $("#domaine").val();
	var textVin = JSON.stringify ({"typeDeVin": typeDeVin ,"annee":annee,"domaine":domaine});
	var ndefRecord = ndef.textRecord(textVin);
	var ndefMessage = ndef.encodeMessage([ndefRecord]);
	nfc.write([ndefRecord], function() {
		navigator.notification.vibrate(100);
	}, function(reason) {
		navigator.notification.alert(reason, function() {
		}, "There was a problem");
	});

}

function readyWrite() {

	function win() {
		console.log("Listening for NDEF tags");
	}

	function fail() {
		conole.log('Failed to register NFC Listener');
	}	
	nfc.addNdefListener(writeTag, win, fail);

};
