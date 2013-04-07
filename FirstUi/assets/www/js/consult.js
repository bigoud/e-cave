var InventoryTab;

function fillPage(){
	requestTemp();
	requestHumidity();
	requestGet();
}

function requestTemp(){
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/tempDatabase?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	$.get(href, function(Temp) {
			TempTab = jQuery.makeArray(Temp);
			 document.getElementById("temp").innerHTML = "T° :"+ TempTab[TempTab.length-1].temp; 
		},
		"json")
		.fail(function(){ alert (" Attention Vous n'êtes pas connecté à Internet ");});	
}

function requestHumidity(){
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/humiditydatabase?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
		$.get(href, function(Humidity) {
			HumidityTab = jQuery.makeArray(Humidity);
			 document.getElementById("humidite").innerHTML = "H20 :" +HumidityTab[HumidityTab.length-1].humidity; 
		},
		"json")
		.fail(function(){ alert (" Attention Vous n'êtes pas connecté à Internet ");});	
	
}

function requestGetSearch(){
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
			InventoryTab = jQuery.makeArray(Inventory);
			document.getElementById("bottleInventory").innerHTML = "";
			var display = document.getElementById("bottleInventory");
			var p = document.createElement('p');
			p.innerHTML = " Bouteille trouvée : <br>";
			for (i =0 ; i<InventoryTab.length;i++){
				p.innerHTML += "Type de vin : " + InventoryTab[i].typeDeVin  + "<br> annee :" + InventoryTab[i].annee + "<br> domaine : " + InventoryTab[i].domaine+"<br><br>"; 
			}
			display.appendChild(p);
		},
		"json")
		.fail(function(){ alert (" Attention Vous n'êtes pas connecté à Internet ");});

	
}

function requestGet() {
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
		$.get(href, function(Inventory) {
			InventoryTab = jQuery.makeArray(Inventory);
			document.getElementById("bottleInventory").innerHTML = "";
			var display = document.getElementById("bottleInventory");
			var p = document.createElement('p');
			for (i =0 ; i<InventoryTab.length;i++){
				p.innerHTML += "Type de vin : " + InventoryTab[i].typeDeVin  + "<br> annee :" + InventoryTab[i].annee + "<br> domaine : " + InventoryTab[i].domaine+"<br><br>"; 
			}
			display.appendChild(p);	
		},
		"json")
		.fail(function(){ alert (" Attention Vous n'êtes pas connecté à Internet ");});	
};
