var InventoryTab;

function fillPage(){
	requestTemp();
	requestHumidity();
	requestGet();
}

function requestTemp(){
	
}

function requestHumidity(){
	
}

function requestGetSearch(){
		document.getElementById("bottleInventory").innerHTML = "";
		var display = document.getElementById("bottleInventory");
		var p = document.createElement('p');
		p.innerHTML = " Bouteille(s) trouvée(s) : <br>";
		var tabIdTypeDeVin;
		var tabIdDomaine;
		var tabIdAnnee;
		var idTypeDeVin,idDomaine,idAnnee=0;
		for(i=0;i<InventoryTab.length;i++){
			if (InventoryTab[i].typeDeVin == $("#typeDeVin").val()){
				tabIdTypeDeVin[idTypeDeVin] = InventoryTab[i];
				 idTypeDeVin++;
			}		 
		}	
		for(i=0;i<InventoryTab.length;i++){
			if (InventoryTab[i].annee == $("#annee").val()){
				tabIdAnnee[idAnnee] = InventoryTab[i];
				 idAnnee++;
			}
		}
		for(i=0;i<InventoryTab.length;i++){
			if (InventoryTab[i].domaine == $("#domaine").val()){
				tabIdDomaine[idDomaine] = InventoryTab[i];
				 idDomaine++;
			}
		}
		for(i=0;i<tabIdAnnee.length;i++){
			for(j=0;j<tabIdTypeDeVin.length;j++){
				for(k=0;k<tabIdDomaine.length;k++){
					if ( (tabIdDomaine[k]._id.$oid == tabIdAnnee[i]._id.$oid) && (tabIdDomaine[k]._id.$oid == tabIdTypeDeVin[j]._id.$oid) ){
						p.innerHTML += "Type de vin : " + tabIdDomaine[k].typeDeVin  + "<br> annee :" + tabIdDomaine[k].annee + "<br> domaine : " + tabIdDomaine[k].domaine+"<br><br>"; 
					}
				}			
			}			
		}	
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
