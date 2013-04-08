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
	$('div.tagContents').html("Type de vin : " + vin.typeDeVin + "<br> annee : " + vin.annee + "<br> domaine : " + vin.domaine);
	vinBD = ExistTag();
	//Si la bouteille existe dans la bd l'utilisateur peut alors la supprimer
	if (vinBD.length > 0) {
		$('div.readWrite').html("<form action='add.html?typeDeVin=" + vin.typeDeVin + "&annee=" + vin.annee + "&domaine=" + vin.domaine + "' method='get'><input type='submit' value='write a tag'></form>" +
		 "<form action=\"javascript: deleteTag()\" method='get'><input type='submit' value='remove the bottle'></form>");
	//sinon non... ^^
	} else {
		$('div.readWrite').html("<form action='add.html?typeDeVin=" + vin.typeDeVin + "&annee=" + vin.annee + "&domaine=" + vin.domaine + "' method='get'><input type='submit' value='write a tag'></form>");
	}
	navigator.notification.vibrate(100);
};

function deleteTag() {
	if (vinBD.length > 1){alert("Erreur dans la base de donnée")};
	stocked = vinBD[0].stocked; 
	// S'il existe plus d'une bouteille on décrémente le nombre de bouteilles stockées
	if (vinBD[0].recorded > 1) {
		$.ajax({
			url : 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases/' + vinBD[0]._id + '?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK',
			data : JSON.stringify({
				"$set" : {
					"stocked" : stocked
				}
			}),
			type : "PUT",
			contentType : "application/json"
		});
		//Sinon on la supprime de la base de donnée
	} else {
		$.ajax({
			url : 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases/' + vinBD[0]._id + '?apiKey=myAPIKey',
			type : "DELETE",
			async : true,
			timeout : 300000,
			success : function(data) {
			},
			error : function(xhr, status, err) {
			}
		});
	}
}

function ExistTag() {
	var InventoryTab;
	alert(vin.typeDeVin + " " + vin.annee + " " + vin.domaine);
	if (vin.typeDeVin != "" && vin.annee == "" && vin.domaine == "") {
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"typeDeVin":\"' + vin.typeDeVin + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	}
	if (vin.typeDeVin == "" && vin.annee != "" && vin.domaine == "") {
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":\"' + vin.annee + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	}
	if (vin.typeDeVin == "" && vin.annee == "" && vin.domaine != "") {
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"domaine":\"' + vin.domaine + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	}
	if (vin.typeDeVin != "" && vin.annee != "" && vin.domaine == "") {
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"typeDeVin":\"' + vin.typeDeVin + '\","annee":\"' + vin.annee + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	}
	if (vin.typeDeVin != "" && vin.annee == "" && vin.domaine != "") {
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"typeDeVin":\"' + vin.typeDeVin + '\","domaine":\"' + vin.domaine + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	}
	if (vin.typeDeVin == "" && vin.annee != "" && vin.domaine != "") {
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":\"' + vin.annee + '\","domaine":\"' + vin.domaine + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	}
	if (vin.typeDeVin != "" && vin.annee != "" && vin.domaine != "") {
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":\"' + vin.annee + '\","typeDeVin":\"' + vin.typeDeVin + '\","domaine":\"' + vin.domaine + '\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	}
	$.get(href, function(Inventory) {
		InventoryTab = jQuery.makeArray(Inventory);
	}, "json").fail(function() {
		alert(" Attention Vous n'êtes pas connecté à Internet ");
	});
	return InventoryTab;
}

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

function setFields() {
	alert(location.href);
	var type = getUrlVars()["typeDeVin"];
	$("input[name='typeDeVin']").val(type);
	var annee = getUrlVars()["annee"];
	$("input[name='annee']").val(annee);
	var domaine = getUrlVars()["domaine"];
	$("input[name='domaine']").val(domaine);
};

/*
 <li data-theme="c">
 <a href="add.html" data-transition="slide">
 Add a bottle
 </a>
 </li>
 */

function preFillDataBase() {
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	$.get(href, function(Inventory) {
		InventoryTab = jQuery.makeArray(Inventory);
		var listeBottle = "";
		var type = "";
		var annee = "";
		var domaine = "";
		/*for (i =0 ; i<InventoryTab.length;i++){
		 listeBottle += "<div id=bottle"+i+">";
		 type = "<div id=type"+i+">Type de vin : " +  InventoryTab[i].typeDeVin + "</div>";
		 annee = "<div id=annee"+i+">annee : " +  InventoryTab[i].annee + "</div>";
		 domaine = "<div id=domaine"+i+">domaine : " +  InventoryTab[i].domaine + "</div>";
		 listeBottle += type+annee+domaine+"</div>";
		 }
		 document.getElementById("listeBottle").innerHTML = listeBottle;*/
		for ( i = 0; i < InventoryTab.length; i++) {
			var bottle = "<li data-theme='c'><a href='add.html?typeDeVin=" + InventoryTab[i].typeDeVin + "&annee=" + InventoryTab[i].annee + "&domaine=" + InventoryTab[i].domaine + "' data-transition='slide'>Type de vin : " + InventoryTab[i].typeDeVin + "<br> annee :" + InventoryTab[i].annee + "<br> domaine : " + InventoryTab[i].domaine + "<br><br></a></li>";
			$('#listeBottle').append(bottle);
		}
	}, "json").fail(function() {
		alert(" Attention Vous n'êtes pas connecté à Internet ");
	});

};