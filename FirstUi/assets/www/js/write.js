function write() {
	document.addEventListener("deviceready", readyWrite, false);
	document.addEventListener("backbutton", yourCallbackFunction, false);
};

function yourCallbackFunction(){
	nfc.removeNdefListener(writeTag,console.log("back"),false);
	document.removeEventListener("backbutton",yourCallbackFunction,false);
	$.mobile.changePage("mainPage.html");
}
var InventoryTab2;
function writeTag(nfcEvent) {
    var typeDeVin = $("#typeDeVin").val(), annee= $("#annee").val(), domaine = $("#domaine").val(), stocked = $("#stocked").val(), dateInput = new Date();
//TODO stocked doit etre obligatoire

//On va recuperer la bouteille de la base de donnee si elle existe

    href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    if ($("#typeDeVin").val() != "" &&  $("#annee").val()== "" &&  $("#domaine").val() == "" ){
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"typeDeVin":\"'+$("#typeDeVin").val()+'\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    }
    if ($("#typeDeVin").val() == "" && $("#annee").val()!= "" &&  $("#domaine").val() == "" ){
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":\"'+$("#annee").val()+'\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    }
    if ($("#typeDeVin").val() == "" &&  $("#annee").val()== "" &&  $("#domaine").val() != "" ){
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"domaine":\"'+$("#domaine").val()+'\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    }
    if ($("#typeDeVin").val() != "" &&  $("#annee").val()!= "" &&  $("#domaine").val() == "" ){
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"typeDeVin":\"'+$("#typeDeVin").val()+'\","annee":\"'+$("#annee").val()+'\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    }
    if ($("#typeDeVin").val() != "" &&  $("#annee").val()== "" && $("#domaine").val() != "" ){
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"typeDeVin":\"'+$("#typeDeVin").val()+'\","domaine":\"'+$("#domaine").val()+'\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    }
    if ($("#typeDeVin").val() == "" &&  $("#annee").val()!= "" && $("#domaine").val() != "" ){
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":\"'+$("#annee").val()+'\","domaine":\"'+$("#domaine").val()+'\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    }
    if ($("#typeDeVin").val() != "" &&  $("#annee").val()!= "" && $("#domaine").val() != "" ){
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":\"'+$("#annee").val()+'\","typeDeVin":\"'+$("#typeDeVin").val()+'\","domaine":\"'+$("#domaine").val()+
	    '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    }
    $.get(href, function(Inventory) {
	InventoryTab2 = jQuery.makeArray(Inventory);
    },
	  "json")
	.fail(function(){ alert (" Attention Vous n'êtes pas connecté à Internet ");});
//    alert(InventoryTab2.length);
    var i = InventoryTab2.length;    
    switch(i){
    case 0 :
//	alert('pas present ds la base');
	var textVin = JSON.stringify ({"typeDeVin": typeDeVin ,"annee":annee,"domaine":domaine,"dateInput": dateInput, "dateOutput": "", "stocked": stocked});

//TODO $.ajax avec textVin url: "https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK", textVin,  type: "POST" 

	$.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK",
		  data: textVin,
		  type: "POST",
		  contentType: "application/json" } )
            .fail(function(){alert("Attention vous n'êtes pas connecté à Internet, la bouteille ne sera pas ajouté à votre base de donnée'");});
	
	break;
    case 1 :
//	alert('present ds la base');
	var textVin = JSON.stringify ({"typeDeVin": typeDeVin ,"annee":annee,"domaine":domaine,"dateInput": dateInput, "dateOutput": "", "stocked": stocked});
	
	var stockedDB = parseInt(InventoryTab2[0].stocked) + parseInt(stocked);
//TODO mettre a jour stocked ds la base de donnée : data: JSON.stringify( { "$set" : { "x" : 3 } } )
//TODO $.ajax avec url : href, textVin, type: "PUT"

	$.ajax( { url: href,
		  data: JSON.stringify ({"$set" : {"stocked": stockedDB}});,
		  type: "PUT",
		  contentType: "application/json" } )
            .fail(function(){alert("Attention vous n'êtes pas connecté à Internet, la bouteille ne sera pas ajouté à votre base de donnée'");});

	break;
    default :
	alert('should never happenned write.js:writeTag() InventoryTag.length != {0,1}');
	break;
    }

    var ndefRecord = ndef.textRecord(textVin);
    var ndefMessage = ndef.encodeMessage([ndefRecord]);
    nfc.write([ndefRecord], function() {
	navigator.notification.vibrate(100);
    }, function(reason) {
	navigator.notification.alert(reason, function() {
	}, "There was a problem");
    });
}
/*
    var textVin = JSON.stringify ({"typeDeVin": typeDeVin ,"annee":annee,"domaine":domaine,"dateInput": mettre une date, "dateOutput": rien, "stocked": stocked});


	//Enregistrement de la bouteille dans la base de donnée
	$.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK",
		  textVin,
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
*/
function readyWrite() {

	function win() {
		console.log("Listening for NDEF tags");
	}

	function fail() {
		conole.log('Failed to register NFC Listener');
	}	
	nfc.addNdefListener(writeTag, win, fail);

};
