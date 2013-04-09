//Le vin qui a été lu en format json
var vin;
//Le vin de la base de donnée sous format json
var vinBD;

function read() {
    document.addEventListener("deviceready", readyRead, false);
};

function clearScreen() {
	//document.getElementById("tagContents").innerHTML = "";
};

function template(record) {
    var recordType = nfc.bytesToString(record.type), payload;
    // attempt display as a string
    payload = nfc.bytesToString(record.payload);
    return payload;
};

function displayBottle(bottle) {
    var text = nfc.bytesToString(records[0].payload);
    text = text.substring(3, text.length);
	var vin = jQuery.parseJSON(text);
    document.bottle.output.value = vin;
};

function parseTag(nfcEvent) {
    //clearScreen();
    var tag = nfcEvent.tag;
    var records = tag.ndefMessage;
    var head = document.getElementById("header");
    head.innerHTML = "<h3><center>This is your bottle</center></h3>";
    // On change le header
    // Display Record Info
    var text = nfc.bytesToString(records[0].payload);
    //suppression des 3 premiers caractères (caractèreInconnu+e+n)
    text = text.substring(3, text.length);
    vin = jQuery.parseJSON(text);
    existTag();
   }; 
    
    
function printInfo(){
   	//si la bouteille n'existe pas dans la bd 
    if (vinBD.length == 0 ) {
    $('div.tagContents').html("Type de vin : " + vin.typeDeVin  + "<br> annee :" + vin.annee + "<br> domaine : " + vin.domaine+
			      "<br> date d'entrée de la(les) bouteilles : " + vin.dateInput+"<br> date de sortie : " + vin.dateOutput+
			      "<br> Nombre de bouteille(s) : " + 0 +"<br><br>" );
	$('div.readWrite').html("<form method='get' action=\"javascript: addToTheDataBase()\"><input type='submit' value='Add the bottle to your database'></form>");
	}
	//si le stocke de bouteille est nulle
	else if( vinBD[0].stocked == 0 ){
	$('div.tagContents').html("Type de vin : " + vin.typeDeVin  + "<br> annee :" + vin.annee + "<br> domaine : " + vin.domaine+
			      "<br> date d'entrée de la(les) bouteilles : " + vin.dateInput+"<br> date de sortie : " + vin.dateOutput+
			      "<br> Nombre de bouteille(s) : " + 0 +"<br><br>" );
	$('div.readWrite').html("<form action='add.html?typeDeVin=" + vin.typeDeVin + "&annee=" + vin.annee + "&domaine=" + vin.domaine + "' method='get'><input type='submit' value='write a tag'></form>");
	}
	 //Si la bouteille existe dans la bd l'utilisateur peut alors la supprimer
    else if (vinBD[0].stocked > 0){
    $('div.tagContents').html("Type de vin : " + vin.typeDeVin  + "<br> annee :" + vin.annee + "<br> domaine : " + vin.domaine+
			"<br> date d'entrée de la(les) bouteilles : " + vin.dateInput+"<br> date de sortie : " + vinBD[0].dateOutput+
			"<br> Nombre de bouteille(s) : " + vinBD[0].stocked +"<br><br>" );
	$('div.readWrite').html("<form action='add.html?typeDeVin=" + vin.typeDeVin + "&annee=" + vin.annee + "&domaine=" + vin.domaine + "' method='get'><input type='submit' value='write a tag'></form>" +
				"<form action=\"javascript: verifDelete()\" method='get'><input type='submit' value='remove the bottle'></form> <div data-role=\"fieldcontain\">"+
          		"<fieldset data-role=\"controlgroup\">"+
            	"<label for=\"quantity\">Quantity of Bottle to delete:</label>"+
            	"<input type=\"number\" data-mini=\"true\" name=\"toDelete\" id=\"toDelete\" value=\"\">"+
	  			"</fieldset>"+
				"</div>");
    }
    navigator.notification.vibrate(100);
};


function verifDelete() 
{ 
    toDelete = $("#toDelete").val();
    toDeleteInt = parseInt(toDelete);
    stock = parseInt(vinBD[0].stocked);
    
    if(toDelete == "")
    {
	alert ('How many bottle you want to delete ?');
	$("#toDelete").focus();
	return false;
    }
    if(toDeleteInt <= 0)
    {
	alert ('quantity must be a positive integer');
	$("#toDelete").focus();
	return false;
    }
    if(stock < toDeleteInt)
    {
	alert ('not enough bottle in your cave');
	$("#toDelete").focus();
	return false;
    }

    else{
	deleteTag();
	return true;
    }
}


function addToTheDataBase(){
    var textVin = JSON.stringify ({"typeDeVin": vin.typeDeVin ,"annee":vin.annee,"domaine":vin.domaine,"dateInput": vin.dateInput, "dateOutput": "", "stocked": 0});
    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK",
	      data: textVin,
	      type: "POST",
	      contentType: "application/json" } )
	.fail(function(){alert("Attention vous n'êtes pas connecté à Internet, la bouteille ne sera pas ajouté à votre base de donnée'");})
	.done(function() {
	    alert("Succes, The information has been added to your database");
	    $.mobile.changePage("mainPage.html");	 
	});
}

function deleteTag() {
    if (vinBD.length > 1){alert("Erreur dans la base de donnée");}
    // S'il existe plus d'une bouteille on décrémente le nombre de bouteilles stockées
    var stocked = vinBD[0].stocked-$("#toDelete").val(); 
    $.ajax({
	url : 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases/' + vinBD[0]._id.$oid + '?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK',
	data : JSON.stringify({
	    "typeDeVin" : vinBD[0].typeDeVin,
	    "annee" : vinBD[0].annee,
	    "domaine" : vinBD[0].domaine,
	    "dateInput" : vinBD[0].dateInput,
	    "dateOutput" : createDate(),
	    "stocked" : stocked
	}),
	type : "PUT",
	contentType : "application/json"
    })
    .fail(function() {alert(" Attention Vous n'êtes pas connecté à Internet ");})
    .done(function() { 
    	alert("The bottle(s) has been deleted with success");
    	$.mobile.changePage("mainPage.html");});   
}

function createDate(){
    d = new Date();
    date = d.getDay()+"/"+d.getMonth()+"/"+d.getFullYear();
	return date;
}

function existTag() {
    href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":\"' + vin.annee + '\","typeDeVin":\"' + vin.typeDeVin + '\","domaine":\"' + vin.domaine + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    $.get(href, function(Inventory) {
	vinBD= jQuery.makeArray(Inventory);
    }, "json")
	.fail(function() {alert(" Attention Vous n'êtes pas connecté à Internet ");})
	.done(function() { printInfo();});
}

var readyRead = function() {
    function failure(reason) {
	navigator.notification.alert(reason, function() {}, "There was a problem");
	}
	nfc.removeNdefListener(verifAdd,console.log("kill listener writeTag"),false);
    nfc.addNdefListener(parseTag, function() {
	console.log("Success.");
    }, function() {
	console.log("Fail.");
	});
};

function getUrlVars() {
    var vars = [], hash;
    var hashes = location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
	    hash = hashes[i].split('=');
	    vars.push(hash[0]);
	    vars[hash[0]] = hash[1];
	}
	return vars;
};

function setFields(){
    var type = getUrlVars()["typeDeVin"];
    $("input[name='typeDeVin']").val(type);
    var annee = getUrlVars()["annee"];
    $("input[name='annee']").val(annee);
    var domaine = getUrlVars()["domaine"];
    $("input[name='domaine']").val(domaine);
};


function preFillDataBase() {
    href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
    $.get(href, function(Inventory) {
	InventoryTab = jQuery.makeArray(Inventory);
	for ( i = 0; i < InventoryTab.length; i++) {
	    var bottle = "<li data-theme='c'><a href='add.html?typeDeVin=" + InventoryTab[i].typeDeVin + "&annee=" + InventoryTab[i].annee + "&domaine=" + InventoryTab[i].domaine + "' data-transition='slide'>Type de vin : " + InventoryTab[i].typeDeVin + "<br> annee :" + InventoryTab[i].annee + "<br> domaine : " + InventoryTab[i].domaine + "<br> stocked : " + InventoryTab[i].stocked + "<br><br></a></li>";
	    $('#listeBottle').append(bottle);
	}
    }, "json").fail(function() {
	alert(" Attention Vous n'êtes pas connecté à Internet ");
    });
};