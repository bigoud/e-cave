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

function displayBottle(bottle){
    var text = nfc.bytesToString(records[0].payload);
    text = text.substring(3,text.length);
    var vin = jQuery.parseJSON(text);
    document.bottle.output.value=vin;
};

function parseTag(nfcEvent) {
	//clearScreen();
	var tag = nfcEvent.tag;
	var records = tag.ndefMessage;
	var head = document.getElementById("header");
    head.innerHTML = "<h3><center>This is your bottle</center></h3>"; //On change le header
	// Display Record Info
	var text = nfc.bytesToString(records[0].payload);
	//suppression des 3 premiers caractères (caractèreInconnu+e+n)
	text = text.substring(3,text.length);
	var vin = jQuery.parseJSON(text);
    $('div.tagContents').html("Type de vin : " + vin.typeDeVin  + "<br> annee : " + vin.annee + "<br> domaine : " + vin.domaine);
    $('div.readWrite').html("<form action='add.html?typeDeVin="+vin.typeDeVin+"&annee="+vin.annee+"&domaine="+vin.domaine+"' method='get'><input type='submit' value='write a tag'></form>");

    navigator.notification.vibrate(100);
};

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

function getUrlVars(){
    var vars = [], hash;
    var hashes = location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i<hashes.length; i++){
	hash = hashes[i].split('=');
	vars.push(hash[0]);
	vars[hash[0]] = hash[1];
    }
    return vars;
}

function setFields(){
    alert(location.href);
    var type = getUrlVars()["typeDeVin"];
    $("input[name='typeDeVin']").val(type);
    var annee = getUrlVars()["annee"];
    $("input[name='annee']").val(annee);
    var domaine = getUrlVars()["domaine"];
    $("input[name='domaine']").val(domaine);

}
