//TODO Här ska Fullbacks funkioner köras för att fixa designen och annat.
//Kanske också notifikationer men beror på om de ska vara på sidan eller i browseraction popup
var settings, debug;
chrome.extension.sendRequest({method: "getStatus"}, function(response) {
	settings = response;

	//TODO debugMode
	if(settings.debugMode == 'true') {
		console.log('Debugmode on!');
	}

	//TODO removeTop
	if(settings.removeTop == 'true'){
		console.log('Ta bort toppen');
		$('#top').remove();
	}

	//TODO Highlight

	//TODO floatingTabs - Fixa snyggare ruta för tabsen
	if(settings.floatingTabs == 'true'){
		var topTabsWidth = $('ul#top-tabs').width()
		var topMenuHeight = $('#top-menu').height();
		$('ul#top-tabs').css('position','fixed');
		$('ul#top-tabs').css('width', topTabsWidth);
		$('ul#top-tabs').css('top', topMenuHeight+5);
		$('#site').css('padding-top', '40px');
	}

	//TODO hetaAmnenMod
	if(settings.hetaAmnenMod == 'true'){
		console.log('Heta Ämnen-väljare');
		//
		//Old code:
		//
		/*var currentPage = location.pathname;
		if(currentPage == "/heta-amnen"){
			var hetaAmnenModVar = 'Kryssa i de kategorier du vill visa.\
			<input type="checkbox" id="aktuellt" class="hetaAmnenMod" checked="checked"/>Aktuella händelser\
			<input type="checkbox" id="ovrigt" class="hetaAmnenMod" checked="checked"/>Övriga\
			<input type="checkbox" id="aldre" class="hetaAmnenMod" checked="checked"/>äldre än en månad\
			<hr/>';

			$('div[style="padding-top:10px"]').prepend(hetaAmnenModVar);

			if($.cookie('aktuellt') == "false") {
				$('#aktuellt').attr('checked',null);
				$('#threadslist:nth-child(1)').hide();
			}
			if($.cookie('ovrigt') == "false"){
				$('#ovrigt').attr('checked',null);
				$('#threadslist:nth-child(2)').hide();
			}
			if($.cookie('aldre') == "false"){
				$('#aldre').attr('checked',null);
				$('#threadslist:nth-child(3)').hide();
			}
		}*/
	}

	//TODO fixLinks
	if(settings.fixLinks == 'true'){
		$('a').each(function(index) {
			var aLink = $(this).attr('href');
			if(aLink) {
				if(aLink.indexOf("leave.php?u=") > 0) {
					aLink = aLink.substring(13);
					aLink = decodeURIComponent (aLink);
					aLink = aLink.replace (/&amp;/gi, "&");
					$(this).attr('href', aLink);
					if(debug)
						console.log("Fixed this link: "+$(this).attr('href')+" to this: "+aLink);
				}

			}
		});
	}

	//TODO myPostInThread
	if(settings.myPostInThread == 'true'){
		var currentPage = location.pathname;
		currentPage = currentPage.substring(0,2);
		if((currentPage == "/p") || (currentPage == "/t")) {
			var threadId = $('.navbar strong a:first').attr('href').substring(2);
			var profileId = $('.top-menu-sub li:nth-child(2) a').attr('href').substring(2);
			if(debug) {
				console.log('Current threadId: '+threadId);
				console.log('Current profileId: '+profileId);
			}
			$('tr[valign^="bottom"]:last').prepend('<td class="alt1" style="white-space:nowrap;padding:0 !important;"><a href="https://www.flashback.org/find_posts_by_user.php?userid='+profileId+'&threadid='+threadId+'" class="doaction">Mina inlägg i denna tråd</a></td>');
		}
	}

	//TODO showImages
	if(settings.showImages == 'true'){
		console.log('Visa bilder');
		var maxWidth = $('.post-right').width() - 20;
		$('a[href$="jpg"], a[href$="jpeg"], a[href$="png"], a[href$="gif"], a[href$="JPG"]').each(function() {
			if($(this).css('color') == 'rgb(102, 102, 102)') {
			} else {
				$(this).html('<br/><a href="'+$(this).attr('href')+'" target="_blank"><img src="'+$(this).attr('href')+'" style="max-width: '+maxWidth+'px;"/></a>'); 
			}
		});
	}

	//TODO goToTop
	if(settings.goToTop == 'true'){
		console.log('Aktivera "Gå till toppen"-länk vid inlägg');
		$('table[id^="post"]').hover(function(){
			$('<a href="#top" class="topLink" style="position: absolute; margin-top: -17px; margin-left: 4px;">Gå till toppen</a>').hide().appendTo(this).delay(100).fadeIn();
		}, function(){
			$('.topLink').delay(400).fadeOut();
		});
	}
});