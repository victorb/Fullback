/*global chrome: false, localStorage: false, console: false,*/
//Detta är kod som körs hela tiden. Sätt loop för notifikationer och
//också en listener för att ta emot meddelanden från content.js 

chrome.extension.onRequest.addListener(function (data, sender, sendResponse) {
	'use strict';
	if (data.method === "getStatus") {
		sendResponse(localStorage);
	} else {
		localStorage.setItem(data.id, data.value);
		console.log(data.id + ' = ' + data.value);
	}
});

// TODO Lägga till funktioner för att kolla efter och lägga till notifikationer
