/*global $: false, chrome: false, console: false, window: false*/
//Här är Javascript till popup.html
var id, checked, idName, value, $this;
var data = [];

function populateNotifications() {
	chrome.extension.sendRequest({method: "getNotifications"}, function (response) {
		'use strict';
		var notifications = [];
	});
}

$('input').each(function (index) {
	'use strict';
	$this = $(this);
	idName = $this.attr('id');
	value = chrome.extension.getBackgroundPage().localStorage[idName];
	console.log(idName + ' = ' + value);
	if (value === 'true') {
		$this.attr('checked', 'checked');
	} else {
		$this.removeProp('checked');
	}
});

$('input').change(function () {
	'use strict';
	$this = $(this);
	id = $this.attr('id');

	if ($this.is(':checked')) {
		data = {
			'id': id,
			'value': 'true'
		};
	} else {
		data = {
			'id': id,
			'value': 'false'
		};
	}
	chrome.extension.sendRequest({method: "saveSetting", data: data});
});

$('#settingsToggle').click(function () {
	'use strict';
	$('#settings').fadeToggle(10);
});

$('#reload').click(function () {
	'use strict';
	chrome.tabs.reload();
	window.close();
});

//$('#notifications').empty();
populateNotifications();
//$('#notifications').prepend('<div class="notification">Du har blivit citerad i tråden "Negerkukar"<br/><span class="time">17:32</span></div>');