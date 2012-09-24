//Här är Javascript till popup.html
var id,checked,idName;
var data = [];

$('input').each(function(index){
	$this = $(this)
	var idName = $this.attr('id');
	var value = chrome.extension.getBackgroundPage().localStorage[idName];
	console.log(idName + ' = ' + value);
	if(value === 'true') {
		$this.attr('checked','checked');
	} else {
		$this.removeProp('checked');
	}
});

$('input').change( function(){
	$this = $(this);
	id = $this.attr('id');

	if($this.is(':checked')) {
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
	chrome.extension.sendRequest(data);
});