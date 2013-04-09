var typeDeVin,annee,domaine,stocked;

function write() {
	document.addEventListener("deviceready", readyWrite, false);
	document.addEventListener("backbutton", yourCallbackFunction, false);
};

function yourCallbackFunction(){
	nfc.removeNdefListener(verif,console.log("back"),false);
	document.removeEventListener("backbutton",yourCallbackFunction,false);
	$.mobile.changePage("mainPage.html");
}

var InventoryTab2;

function writeTag(nfcEvent) {

	var dateInput = createDate();
	//On va recuperer la bouteille de la base de donnee si elle existe
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":\"' + annee + '\","typeDeVin":\"' + typeDeVin + '\","domaine":\"' + domaine + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	$.get(href, function(Inventory) {
	    InventoryTab2= jQuery.makeArray(Inventory);
	}, "json")
	    .fail(function() {
		alert(" Attention Vous n'êtes pas connecté à Internet ");
	    })
	    .done(function() {
	    ecritBD(InventoryTab2,dateInput);
	    });
}
	    
function ecritBD(InventoryTab2,dateInput){	    

	switch(InventoryTab2.length){//case 0 : la bouteille n'existe pas, case 1 : elle existe et c'est InventoryTab[0]
	case 0 :
	    var textVin = JSON.stringify ({"typeDeVin": typeDeVin ,"annee":annee,"domaine":domaine,"dateInput": dateInput, "dateOutput": "", "stocked": stocked});

	    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK",
		      data: textVin,
		      type: "POST",
		      contentType: "application/json" } )
		.fail(function(){alert("Attention vous n'êtes pas connecté à Internet, la bouteille ne sera pas ajouté à votre base de donnée'");})
		.done(function() {});
	    
	    break;
	case 1 :
	    var textVin = JSON.stringify ({"typeDeVin": typeDeVin ,"annee":annee,"domaine":domaine,"dateInput": dateInput, "dateOutput": "", "stocked": stocked});
	    
	var stockedDB = parseInt(InventoryTab2[0].stocked) + parseInt(stocked);
	    $.ajax({
		url : 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases/' + InventoryTab2[0]._id.$oid + '?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK',
		data : JSON.stringify({
		    "typeDeVin" : InventoryTab2[0].typeDeVin,
		    "annee" : InventoryTab2[0].annee,
		    "domaine" : InventoryTab2[0].domaine,
		    "dateInput" : InventoryTab2[0].dateInput,
		"dateOutput" : InventoryTab2[0].dateOutput,
		    "stocked" : stockedDB
		}),
		type : "PUT",
		contentType : "application/json"})
		.fail(function() {alert(" Attention Vous n'êtes pas connecté à Internet ");})
		.done(function() {});
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

function readyWrite() {

	function win() {
		console.log("Listening for NDEF tags");
	}

	function fail() {
		conole.log('Failed to register NFC Listener');
	}
	nfc.removeNdefListener(parseTag,console.log("kill listener parseTag"),false);	
	nfc.addNdefListener(verif, win, fail);

};


function verif() 
{ 
    typeDeVin = $("#typeDeVin").val();
    annee= $("#annee").val();
    domaine = $("#domaine").val();
    stocked = $("#stocked").val();

    if (typeDeVin == "" && annee == "" && domaine == "")
    {
	alert ('Please fill at least one of the following field : Wine type, annee or domaine');
	return false;
    }
    if(stocked == "")
    {
	alert ('How many bottle you want to add ?');
	$("#stocked").focus();
	return false;
    }
    if(typeDeVin != "" || annee != "" || domaine != "" && stocked != "") {
	writeTag();
	return true;
    }
}