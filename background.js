/*global chrome: false, localStorage: false, console: false,*/
//Detta är kod som körs hela tiden. Sätt loop för notifikationer och
//också en listener för att ta emot meddelanden från content.js 

chrome.extension.onRequest.addListener(function (data, sender, sendResponse) {
	'use strict';
	if (data.method === "getSettings") {
		sendResponse(localStorage);
	} 
	if (data.method === "addHighlight") {
		console.log('addHighlight');
		var storage = JSON.parse(localStorage.getItem('highlightWords'));
		storage.push({'word': data.word,'color': data.color});
		storage = JSON.stringify(storage);
		localStorage.setItem('highlightWords', storage);
	}
	if (data.method === "removeHighlight") {
		console.log('removeHighlight');
		var storage = JSON.parse(localStorage.getItem('highlightWords'));

		for (var i = 0; i < storage.length; i++) {
			if(data.word === storage[i].word) {
				console.log(data.word + ' === ' + storage[i].word);
				console.log('Detta vill du ta bort: ' + data.word + i);
				storage.splice(i, 3);
			} else {
				console.log(data.word + ' !=== ' + storage[i].word);
				console.log('Detta vill du inte ta bort: ' + data.word + i);
			}
			
		};

		storage = JSON.stringify(storage);
		localStorage.setItem('highlightWords', storage);
	}
	if (data.method === "saveSetting") {
		localStorage.setItem(data.data.id, data.data.value);
		console.log(data.data.id + ' = ' + data.data.value);
	}
});

// TODO Lägga till funktioner för att kolla efter och lägga till notifikationer
