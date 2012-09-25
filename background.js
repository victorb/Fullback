//Detta är kod som körs hela tiden. Sätt loop för notifikationer och
//också en listener för att ta emot meddelanden från content.js 

chrome.extension.onRequest.addListener(function(data, sender, sendResponse){
	if (data.method == "getStatus") {
		sendResponse(localStorage);
	} else {
		localStorage.setItem(data.id, data.value);
		console.log(data.id+' = '+data.value);
	}
});