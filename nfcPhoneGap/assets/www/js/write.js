function write() {
	document.addEventListener("deviceready", readyWrite, false);
	document.addEventListener("backbutton", yourCallbackFunction, false);
};

function yourCallbackFunction(){
	nfc.removeNdefListener(writeTag,console.log("back"),false);
	document.removeEventListener("backbutton",yourCallbackFunction,false);
	$.mobile.changePage("mainPage.html");
}

function writeTag(nfcEvent) {
	var typeDeVin = $("#typeDeVin").val(), annee= $("#annee").val(), domaine = $("#domaine").val();
	var textVin = JSON.stringify ({"typeDeVin": typeDeVin ,"annee":annee,"domaine":domaine});
	//Enregistrement de la bouteille dans la base de donnée
	$.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK",
          data: JSON.stringify( {"typeDeVin": typeDeVin ,"annee": annee ,"domaine": domaine } ),
          type: "POST",
          contentType: "application/json" } )
          .fail(function(){alert("Attention vous n'êtes pas connecté à Internet, la bouteille ne sera pas ajouté à votre base de donnée'");});
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
