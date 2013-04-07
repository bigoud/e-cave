

function request() {
	var Inventory;
	href = 'https://api.mongolab.com/api/1/databases/heroku_app14597085/collections/winedatabases?apiKey=kP7a0LRQmPijRkR9AV580c33FRq4kvfK';
	$.get(href, function(Inventory) {
			var InventoryTab = jQuery.makeArray(Inventory);
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
