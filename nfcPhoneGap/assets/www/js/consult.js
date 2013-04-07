
function fillPage(){
	requestTemp();
	requestHumidity();
	requestGet();
}

function requestTemp(){
	
}

function requestHumidity(){
	
}

function requestGet() {
	var search = $("#searchinput2").val();
	var InventoryTab;
	if (search == ""){
		href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
		$.get(href, function(Inventory) {
			InventoryTab = jQuery.makeArray(Inventory);
			var display = document.getElementById("bottleInventory");
			var p = document.createElement('p');
			for (i =0 ; i<InventoryTab.length;i++){
				p.innerHTML += "Type de vin : " + InventoryTab[i].typeDeVin  + "<br> annee :" + InventoryTab[i].annee + "<br> domaine : " + InventoryTab[i].domaine+"<br><br>"; 
			}
			display.appendChild(p);	
	},
	"json")
	.fail(function(){ alert (" Attention Vous n'êtes pas connecté à Internet ");});
	}
	else {
		document.getElementById("bottleInventory").innerHTML = "";
		var display = document.getElementById("bottleInventory");
		var p = document.createElement('p');
		p.innerHTML = "";
		p.innerHTML = " Bouteille trouvée : <br>";
				href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"typeDeVin":\"'+search+'\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
				alert (search);
		$.get(href, function(Inventory) {
			InventoryTab = jQuery.makeArray(Inventory);
			for (i =0 ; i<InventoryTab.length;i++){
				p.innerHTML += "Type de vin : " + InventoryTab[i].typeDeVin  + "<br> annee :" + InventoryTab[i].annee + "<br> domaine : " + InventoryTab[i].domaine+"<br><br>"; 
			}
	},
	"json").fail(function(){ alert (" Attention Vous n'êtes pas connecté à Internet ");});
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"annee":'+search+'}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
		$.get(href, function(Inventory) {
			InventoryTab = jQuery.makeArray(Inventory);
			for (i =0 ; i<InventoryTab.length;i++){
				p.innerHTML += "Type de vin : " + InventoryTab[i].typeDeVin  + "<br> annee :" + InventoryTab[i].annee + "<br> domaine : " + InventoryTab[i].domaine+"<br><br>"; 
			}
	},
	"json")
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?q={"domaine":\"'+search+'\"}&apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
		$.get(href, function(Inventory) {
			InventoryTab = jQuery.makeArray(Inventory);
			for (i =0 ; i<InventoryTab.length;i++){
				p.innerHTML += "Type de vin : " + InventoryTab[i].typeDeVin  + "<br> annee :" + InventoryTab[i].annee + "<br> domaine : " + InventoryTab[i].domaine+"<br><br>"; 
			}
	},
	"json")
	display.appendChild(p);	
	}
	
};
