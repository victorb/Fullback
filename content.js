//Här ska Fullbacks funkioner köras för att fixa designen och annat.
//Kanske också notifikationer men beror på om de ska vara på sidan eller i browseraction popup

var settings, debug, currentPage, shortCurrentPage;

chrome.extension.sendRequest({method: "getStatus"}, function(response) {
	settings = response;

	currentPage = location.pathname;
	shortCurrentPage = currentPage.substring(0,2);

	//debugMode
	if(settings.debugMode == 'true') {
		debug = true;
		console.log('Debugmode on!');
	}

	//removeTop
	if(settings.removeTop == 'true'){
		if(debug)
			console.log('Ta bort toppen');
		$('#top').remove();
	}

	//TODO Highlight - Lägg till Flashback Highlight här, skapa även inställningars

	//floatingTabs
	if(settings.floatingTabs == 'true'){
		if(debug)
			console.log('floatingTabs - Huvudmenyn hänger med i scroll');

		var $topTabs = $('ul#top-tabs');
		//var topTabsWidth = $topTabs.width()
		var topMenuHeight = $topTabs.height();
		$('ul#top-tabs').css('position','fixed');
		//$('ul#top-tabs').css('width', topTabsWidth);
		$('ul#top-tabs').css('top', topMenuHeight-5);
		$topTabs.css('border-bottom', '4px solid #ccc');
		$topTabs.css('right', '0px');
		$topTabs.css('left', '0px');
		$('#site').css('padding-top', '40px');
	}

	//hetaAmnenMod
	if(settings.hetaAmnenMod == 'true'){
		if(debug) {
			console.log('Heta Ämnen-väljare');
			console.log(currentPage);
		}
		if(currentPage == "/heta-amnen"){
			var hetaAmnenModVar = 'Kryssa i de kategorier du vill visa.\
			<input type="checkbox" id="aktuellt" class="hetaAmnenMod" checked="checked"/>Aktuella händelser\
			<input type="checkbox" id="ovrigt" class="hetaAmnenMod" checked="checked"/>Övriga\
			<input type="checkbox" id="aldre" class="hetaAmnenMod" checked="checked"/>äldre än en månad\
			<hr/>';

			//TODO hetaAmnenMod - Bättre placering och design för knappar
			$('div[style="padding-top:10px"]').prepend(hetaAmnenModVar);

			if(localStorage.getItem('aktuellt') == "false") {
				$('#aktuellt').attr('checked',null);
				toggleThreadlist(1);
			}
			if(localStorage.getItem('ovrigt') == "false"){
				$('#ovrigt').attr('checked',null);
				toggleThreadlist(2);
			}
			if(localStorage.getItem('aldre') == "false"){
				$('#aldre').attr('checked',null);
				toggleThreadlist(3);
			}

			$('.hetaAmnenMod').change( function(){
				$this = $(this);
				id = $this.attr('id');
				idIndex = $this.index() + 1;
				console.log('idIndex = '+idIndex);
				if($this.is(':checked')) {
					localStorage.setItem(id, 'true');
					console.log('Du checkade precis '+ id);
				} else {
					localStorage.setItem(id, 'false');
					console.log('Du avcheckade precis '+ id);
				}
				toggleThreadlist(idIndex);
			});

			function toggleThreadlist(childNumber) {
				$('#threadslist:nth-child('+childNumber+')').toggle();
			}
		}
	}

	//myPostInThread
	if(settings.myPostInThread == 'true'){
		if((shortCurrentPage == "/p") || (shortCurrentPage == "/t")) {
			var threadId = $('.navbar strong a:first').attr('href').substring(2);
			var profileId = $('.top-menu-sub li:nth-child(2) a').attr('href').substring(2);
			if(debug) {
				console.log('Current threadId: '+threadId);
				console.log('Current profileId: '+profileId);
			}
			$('tr[valign^="bottom"]:last').prepend('<td class="alt1" style="white-space:nowrap;padding:0 !important;"><a href="https://www.flashback.org/find_posts_by_user.php?userid='+profileId+'&threadid='+threadId+'" class="doaction">Mina inlägg i denna tråd</a></td>');
		}
	}

	//Fixlinks
	function fixTheLinks() {
		$('a').each(function(index) {
			$this = $(this);
			var aLink = $this.attr('href');
			if(aLink) {
				if(aLink.indexOf("leave.php?u=") > 0) {
					aLink = aLink.substring(13);
					aLink = decodeURIComponent (aLink);
					aLink = aLink.replace (/&amp;/gi, "&");
					if(debug)
						console.log("Fixed this link: "+$this.attr('href')+" to this: "+aLink);
					$this.attr('href', aLink);
				}

			}
		});
	}

	var fixLinksPost;
	
	//fixLinks
	if(settings.fixLinks == 'true'){
		fixTheLinks();
		fixLinksPost = true;
	}


	//TODO showImages - Fixa så bilder inte syns i quote
	if(settings.showImages == 'true'){
		if(!fixLinksPost)
			fixTheLinks();

		if(debug)
			console.log('Visa bilder');

		var maxWidth = $('.post-right').width() - 20;
		$('a[href$="jpg"], a[href$="jpeg"], a[href$="png"], a[href$="gif"], a[href$="JPG"]').each(function() {
			$this = $(this);
			if($this.css('color') == 'rgb(102, 102, 102)') {
			} else {
				$this.html('<br/><a href="'+$this.attr('href')+'" target="_blank"><img src="'+$this.attr('href')+'" style="max-width: '+maxWidth+'px;"/></a>'); 
			}
		});
	}

	if(settings.goToTop == 'true'){
		if(debug)
			console.log('Aktivera "Gå till toppen"-länk vid inlägg');
		
		if(shortCurrentPage == "/t") {
			$('table[id^="post"]').hover(function(){
				//TODO goToTop - Bättre design
				$('<a href="#top" class="topLink" style="position: absolute; margin-top: -17px; margin-left: 4px;">Gå till toppen</a>').hide().appendTo(this).delay(100).fadeIn();
			}, function(){
				$('.topLink').delay(400).fadeOut();
			});
		}
	}
});