/*global chrome: false, localStorage: false, console: false, location: false, $: false,*/
//Här ska Fullbacks funkioner köras för att fixa designen och annat.
//Kanske också notif ikationer men beror på om de ska vara på sidan eller i browseraction popup

var settings, debug, currentPage, shortCurrentPage, hetaAmnenModVar, $this,
	id, idIndex, threadId, profileId, aLink, fixLinksPost, maxWidth;

function toggleThreadlist(childNumber) {
	'use strict';
	$('#threadslist:nth-child(' + childNumber + ')').toggle();
}

//TODO Fixlinks - https://www.flashback.org/p39560803#p39560803 tar inte bort länkar
function fixTheLinks() {
	'use strict';
	$('a').each(function (index) {
		$this = $(this);
		aLink = $this.attr('href');
		if (aLink) {
			if (aLink.indexOf("leave.php?u=") > 0) {
				aLink = aLink.substring(13);
				aLink = decodeURIComponent(aLink);
				aLink = aLink.replace(/&amp;/gi, "&");
				if (debug) {
					console.log("Fixed this link: " + $this.attr('href') + " to this: " + aLink);
				}

				$this.attr('href', aLink);
			}

		}
	});
}

function is_gif_image(i) {
	'use strict';
	return /^(?!data:).*\.jpg/i.test(i.src);
}

function freeze_gif(i) {
	var c = document.createElement('canvas');
	var w = c.width = i.width;
	var h = c.height = i.height;
	c.getContext('2d').drawImage(i, 0, 0, w, h);

	try {
		i.src = c.toDataURL("image/gif"); // if possible, retain all css aspects
	} catch(e) { // cross-domain -- mimic original with all its tag attributes
	
	for (var j = 0, a; a = i.attributes[j]; j++)
		c.setAttribute(a.name, a.value);
	
	i.parentNode.replaceChild(c, i);
	}
}

chrome.extension.sendRequest({method: "getStatus"}, function (response) {
	'use strict';
	settings = response;

	currentPage = location.pathname;
	shortCurrentPage = currentPage.substring(0, 2);

	//debugMode
	if (settings.debugMode === 'true') {
		debug = true;
		console.log('Debugmode on!');
	}

	//removeTop
	if (settings.removeTop === 'true') {
		if (debug) {
			console.log('Ta bort toppen');
		}
		$('#top').remove();
	}

	//TODO Highlight - Lägg till Flashback Highlight här, skapa även inställningars

	//TODO content.js - göra om if-satser till funktioner istället

	//floatingTabs
	if (settings.floatingTabs === 'true') {
		if (debug) {
			console.log('floatingTabs - Huvudmenyn hänger med i scroll');
		}

		var $topTabs = $('ul#top-tabs'), topMenuHeight = $topTabs.height();

		$('ul#top-tabs').css('position', 'fixed');
		//$('ul#top-tabs').css('width', topTabsWidth);
		$('ul#top-tabs').css('top', topMenuHeight - 5);
		$topTabs.css('border-bottom', '4px solid #ccc');
		$topTabs.css('right', '0px');
		$topTabs.css('left', '0px');
		$('#site').css('padding-top', '40px');
	}

	//hetaAmnenMod
	if (settings.hetaAmnenMod === 'true') {
		if (debug) {
			console.log('Heta Ämnen-väljare');
			console.log(currentPage);
		}
		if (currentPage === "/heta-amnen") {
			hetaAmnenModVar = 'Kryssa i de kategorier du vill visa. <input type="checkbox" id="aktuellt" class="hetaAmnenMod" checked="checked"/>Aktuella händelser<input type="checkbox" id="ovrigt" class="hetaAmnenMod" checked="checked"/>Övriga<input type="checkbox" id="aldre" class="hetaAmnenMod" checked="checked"/>äldre än en månad<hr/>';

			//TODO hetaAmnenMod - Bättre placering och design för knappar
			$('div[style="padding-top:10px"]').prepend(hetaAmnenModVar);

			if (localStorage.getItem('aktuellt') === "false") {
				$('#aktuellt').attr('checked', null);
				toggleThreadlist(1);
			}
			if (localStorage.getItem('ovrigt') === "false") {
				$('#ovrigt').attr('checked', null);
				toggleThreadlist(2);
			}
			if (localStorage.getItem('aldre') === "false") {
				$('#aldre').attr('checked', null);
				toggleThreadlist(3);
			}

			$('.hetaAmnenMod').change(function () {
				$this = $(this);
				id = $this.attr('id');
				idIndex = $this.index() + 1;
				console.log('idIndex = ' + idIndex);
				if ($this.is(':checked')) {
					localStorage.setItem(id, 'true');
					console.log('Du checkade precis ' + id);
				} else {
					localStorage.setItem(id, 'false');
					console.log('Du avcheckade precis ' + id);
				}
				toggleThreadlist(idIndex);
			});
		}
	}

	//stopGif
	if (settings.stopGif === 'true') {
		[].slice.apply(document.images).filter(is_gif_image).map(freeze_gif);
	}

	//myPostInThread
	if (settings.myPostInThread === 'true') {
		if ((shortCurrentPage === "/p") || (shortCurrentPage === "/t")) {
			threadId = $('.navbar strong a:first').attr('href').substring(2);
			profileId = $('.top-menu-sub li:nth-child(2) a').attr('href').substring(2);
			if (debug) {
				console.log('Current threadId: ' + threadId);
				console.log('Current profileId: ' + profileId);
			}
			$('tr[valign^="bottom"]:last').prepend('<td class="alt1" style="white-space:nowrap;padding:0 !important;"><a href="https://www.flashback.org/find_posts_by_user.php?userid=' + profileId + '&threadid=' + threadId + '" class="doaction">Mina inlägg i denna tråd</a></td>');
		}
	}

	//fixLinks
	if (settings.fixLinks === 'true') {
		fixTheLinks();
		fixLinksPost = true;
	}


	//TODO showImages - Fixa så bilder inte syns i quote
	if (settings.showImages === 'true') {
		if (!fixLinksPost) {
			fixTheLinks();
		}

		if (debug) {
			console.log('Visa bilder');
		}

		maxWidth = $('.post-right').width() - 20;
		$('a[href$="jpg"], a[href$="jpeg"], a[href$="png"], a[href$="gif"], a[href$="JPG"]').each(function () {
			$this = $(this);
			if ($this.css('color') !== 'rgb(102, 102, 102)') {
				$this.html('<br/><a href="' + $this.attr('href') + '" target="_blank"><img src="' + $this.attr('href') + '" style="max-width: ' + maxWidth + 'px;"/></a>');
			}
		});
	}

	if (settings.goToTop === 'true') {
		if (debug) {
			console.log('Aktivera "Gå till toppen"-länk vid inlägg');
		}

		if (shortCurrentPage === "/t") {
			$('table[id^="post"]').hover(function () {
				//TODO goToTop - Bättre design
				$('<a href="#top" class="topLink" style="position: absolute; margin-top: -17px; margin-left: 4px;">Gå till toppen</a>').hide().appendTo(this).delay(100).fadeIn();
			}, function () {
				$('.topLink').delay(400).fadeOut();
			});
		}
	}
});