// - ###############################################################################
//    GLOBAL TEXT AND FUNCTIONS FOR PROMPTS, ALERTS, and CONFIRMS
// -

//uncomment appropriate line (true include ID, false do not include id)
//GLOBAL_TEXT_INCLUDE_ID = true;
GLOBAL_TEXT_INCLUDE_ID = false;

GLOBAL_TEXT = new Array();

GLOBAL_TEXT['GT005'] = "The requested page is not included in this demo.";
GLOBAL_TEXT['GT006'] = "Page not found";
GLOBAL_TEXT['GT007'] = "Please enter the page number.";
GLOBAL_TEXT['GT008'] = "Are you sure you want to close this book?";
GLOBAL_TEXT['GT009'] = "This page cannot be printed.";
GLOBAL_TEXT['GT010'] = "This is no homework for this page.";

GLOBAL_TEXT['GT012'] = "This page does not have a associated resource on Education Place.";
GLOBAL_TEXT['GT013'] = "This is the first page.";
GLOBAL_TEXT['GT014'] = "This is the last page.";

GLOBAL_TEXT['GT015'] = "This is the first page of the resource.";
GLOBAL_TEXT['GT016'] = "This is the last page of the resource.";
GLOBAL_TEXT['GT017'] = "This resource has only one page.";

GLOBAL_TEXT['GT021'] = "The page cannot be made larger.";
GLOBAL_TEXT['GT022'] = "The page cannot be made smaller.";

GLOBAL_TEXT['GT025'] = "Both pages cannot be displayed.";

GLOBAL_TEXT['GT050'] = "There is no Read Aloud audio for this page.";
GLOBAL_TEXT['GT051'] = "This is the first track.";
GLOBAL_TEXT['GT052'] = "This is the last track.";
GLOBAL_TEXT['GT053'] = "The track is already rewound.";
GLOBAL_TEXT['GT054'] = "There is no audio to read aloud on this page.";
GLOBAL_TEXT['GT055'] = "The audio is stopped.";

// -
//    GLOBAL CONSTANTS
// - ###############################################################################

// getGlobalText
// getGlobalText(globalTextID : string) : string

function getGlobalText(globalTextID) {

	var globalText = GLOBAL_TEXT[globalTextID];
	
	if (GLOBAL_TEXT_INCLUDE_ID) {
		globalText += ' [' + globalTextID + ']';
	}

	return globalText;
	
} // getGlobalText

// -
//    END GLOBAL TEXT AND FUNCTIONS FOR PROMPTS, ALERTS, and CONFIRMS
// - ###############################################################################


// - ###############################################################################
//    GLOBAL CONSTANTS AND FUNCTIONS FOR POPUPS
// -

// pop-up location
POPUP_LOCATION_OPENER = true;
POPUP_LOCATION_SCREEN = false;

POPUP_LEFT_OFFSET = 50;
POPUP_TOP_OFFSET = 50;
POPUP_LEFT_OFFSET_MINIMUM = 10;
POPUP_TOP_OFFSET_MINIMUM = 10;

POPUP_MINIMUM_WIDTH = 500;
POPUP_MINIMUM_HEIGHT = 350;

SCREEN_MARGIN = 5;//25
SCREEN_MIN_MARGIN = 5;

// pop-up chrome types
POPUP_CHROME_MINIMUM = 0;
POPUP_CHROME_MINIMUM_FIXED = 1;
POPUP_CHROME_MENUBAR = 2;
POPUP_CHROME_SCROLLBARS = 3;
POPUP_CHROME_FULL = 4;
POPUP_CHROME = new Array();
POPUP_CHROME[POPUP_CHROME_MINIMUM] = 'channelmode=no,directories=no,fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no';
POPUP_CHROME[POPUP_CHROME_MINIMUM_FIXED] = 'channelmode=no,directories=no,fullscreen=no,location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no';
POPUP_CHROME[POPUP_CHROME_MENUBAR] = 'channelmode=no,directories=no,fullscreen=no,location=no,menubar=yes,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no';
POPUP_CHROME[POPUP_CHROME_SCROLLBARS] = 'channelmode=no,directories=no,fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no';
POPUP_CHROME[POPUP_CHROME_FULL] = 'channelmode=no,directories=no,fullscreen=no,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=yes';
POPUP_CHROME_HEIGHT = new Array();
POPUP_CHROME_HEIGHT[POPUP_CHROME_MINIMUM] = 25;
POPUP_CHROME_HEIGHT[POPUP_CHROME_MINIMUM_FIXED] = 25;
POPUP_CHROME_HEIGHT[POPUP_CHROME_MENUBAR] = 75;
POPUP_CHROME_HEIGHT[POPUP_CHROME_SCROLLBARS] = 25;
POPUP_CHROME_HEIGHT[POPUP_CHROME_FULL] = 150;
POPUP_CHROME_WIDTH = new Array();
POPUP_CHROME_WIDTH[POPUP_CHROME_MINIMUM] = 10; // changed from 25 to fit 800x600
POPUP_CHROME_WIDTH[POPUP_CHROME_MINIMUM_FIXED] = 25;
POPUP_CHROME_WIDTH[POPUP_CHROME_MENUBAR] = 25;
POPUP_CHROME_WIDTH[POPUP_CHROME_SCROLLBARS] = 25;
POPUP_CHROME_WIDTH[POPUP_CHROME_FULL] = 25;

// pop-up settings

//
// NOTE: Keep *_MIN_WIDTHs x *_MIN_HEIGHTs at or below 765x545
//       for 800x600 minimum resolution support
//

POPUP_EBOOK_WIDTH = 925;
POPUP_EBOOK_HEIGHT = 820;
POPUP_EBOOK_MIN_WIDTH = 760;
POPUP_EBOOK_MIN_HEIGHT = 540;
POPUP_EBOOK_NAME = 'EBook';
POPUP_EBOOK_CHROME_TYPE = POPUP_CHROME_MINIMUM;

POPUP_HELP_WIDTH = 755;
POPUP_HELP_HEIGHT = 700;
POPUP_HELP_MIN_WIDTH = 755;
POPUP_HELP_MIN_HEIGHT = 540;
POPUP_HELP_NAME = 'Help';
POPUP_HELP_CHROME_TYPE = POPUP_CHROME_MENUBAR;

POPUP_EPLINK_WIDTH = 620;
POPUP_EPLINK_HEIGHT = 660;
POPUP_EPLINK_MIN_WIDTH = 620;
POPUP_EPLINK_MIN_HEIGHT = 540;
POPUP_EPLINK_NAME = 'EPLink';
POPUP_EPLINK_CHROME_TYPE = POPUP_CHROME_FULL;

POPUP_BOTHPAGES_WIDTH = 755;
POPUP_BOTHPAGES_HEIGHT = 700;
POPUP_BOTHPAGES_MIN_WIDTH = 755;
POPUP_BOTHPAGES_MIN_HEIGHT = 540;
POPUP_BOTHPAGES_NAME = 'BothPages';
POPUP_BOTHPAGES_CHROME_TYPE = POPUP_CHROME_MINIMUM;

POPUP_HOMEWORK_WIDTH = 755; //657
POPUP_HOMEWORK_HEIGHT = 700;
POPUP_HOMEWORK_MIN_WIDTH = 755; //640
POPUP_HOMEWORK_MIN_HEIGHT = 540;
POPUP_HOMEWORK_NAME = 'Homework';
POPUP_HOMEWORK_CHROME_TYPE = POPUP_CHROME_MENUBAR;

POPUP_IMAP_WIDTH = 765;
POPUP_IMAP_HEIGHT = 700;
POPUP_IMAP_MIN_WIDTH = 765;
POPUP_IMAP_MIN_HEIGHT = 540;
POPUP_IMAP_NAME = 'InteractiveMap';
POPUP_IMAP_CHROME_TYPE = POPUP_CHROME_SCROLLBARS;

// 10/4/06 HMHSS CA grade 6 has different brand of imap, need different size window
POPUP_G6IMAP_WIDTH = 743;
POPUP_G6IMAP_HEIGHT = 546;
POPUP_G6IMAP_MIN_WIDTH = 743;
POPUP_G6IMAP_MIN_HEIGHT = 546;
POPUP_G6IMAP_NAME = 'InteractiveMap';
POPUP_G6IMAP_CHROME_TYPE = POPUP_CHROME_SCROLLBARS;

POPUP_GLOSSARY_WIDTH = 554;
POPUP_GLOSSARY_HEIGHT = 410;
POPUP_GLOSSARY_MIN_WIDTH = 554;
POPUP_GLOSSARY_MIN_HEIGHT = 410;
POPUP_GLOSSARY_OLDER_WIDTH = 534;
POPUP_GLOSSARY_OLDER_HEIGHT = 510;
POPUP_GLOSSARY_OLDER_MIN_WIDTH = 534;
POPUP_GLOSSARY_OLDER_MIN_HEIGHT = 510;
POPUP_GLOSSARY_NAME = 'eGlossary';
POPUP_GLOSSARY_CHROME_TYPE = POPUP_CHROME_MINIMUM_FIXED;

POPUP_PRINTABLE_WIDTH = 755;
POPUP_PRINTABLE_HEIGHT = 700;
POPUP_PRINTABLE_MIN_WIDTH = 755;
POPUP_PRINTABLE_MIN_HEIGHT = 540;
POPUP_PRINTABLE_NAME = 'Printable';
POPUP_PRINTABLE_CHROME_TYPE = POPUP_CHROME_MENUBAR;

var leftExt = '';
var rightExt = '';

// directions
DIRECTION_NEXT = 1;
DIRECTION_PREV = -1;

function popupWindow (URL, name, width, height, minWidth, minHeight, chromeType, relativeToOpener) {

	// default pop-up sizing
	if (! width) {width = 760};
	if (! height) {height = 540};

	// get browsers sizing from content + chrome
	browserWidth = width + POPUP_CHROME_WIDTH[chromeType];
	browserHeight = height + POPUP_CHROME_HEIGHT[chromeType];
	
	var clientGeometry = null;
	if (relativeToOpener) {
		clientGeometry = getClientGeometry();
	}


	// default pop-up location
	var left = SCREEN_MARGIN;
	var top = SCREEN_MARGIN;

	// if we have client geometry try to tile pop-up relative to opener, otherwise center it on screen
	if (clientGeometry) {
	
		// tile offest from opener
		left = clientGeometry.screenLeft + POPUP_LEFT_OFFSET;
		top = clientGeometry.screenTop + POPUP_TOP_OFFSET;
			
	} else {
	
		// center on screen 
				
		// reduce size of window if larger than screen
		if (browserWidth > screen.availWidth) { 
			width = screen.availWidth - 2*SCREEN_MARGIN - POPUP_CHROME_WIDTH[chromeType];
			browserWidth = width + POPUP_CHROME_WIDTH[chromeType];
		}
		if (browserHeight > screen.availHeight) {
			height = screen.availHeight - 2*SCREEN_MARGIN -  POPUP_CHROME_HEIGHT[chromeType];
			browserHeight = height + POPUP_CHROME_HEIGHT[chromeType];
		}
		
		// center window on screen, taking into account additional height for chrome
		left = Math.ceil((screen.availWidth/2) - (browserWidth/2));
		top = Math.ceil((screen.availHeight/2) - (browserHeight/2));

		// if requested location relative to opener, offset location from centered
		if (relativeToOpener) {
			left += POPUP_LEFT_OFFSET;
			top += POPUP_TOP_OFFSET;
		}
	}

	// make sure left,top and right,bottom are on screen, and that window at least minimum size	
	if (left < SCREEN_MARGIN) left = SCREEN_MARGIN;
	right = left + browserWidth;
	if (right > screen.availWidth - SCREEN_MARGIN) {
		if (relativeToOpener) { 
			left = left - POPUP_LEFT_OFFSET + POPUP_LEFT_OFFSET_MINIMUM;
			right = left + browserWidth;
			if (right > screen.availWidth - SCREEN_MARGIN) {
				width = screen.availWidth - left - POPUP_CHROME_WIDTH[chromeType] - SCREEN_MARGIN;
			}
		} else {
			width = screen.availWidth - left - POPUP_CHROME_WIDTH[chromeType] - SCREEN_MARGIN;
		}
	}
	if (width < minWidth) {
		width = minWidth;
		maxWidth = screen.availWidth - 2*SCREEN_MIN_MARGIN - POPUP_CHROME_WIDTH[chromeType];
		if (width > maxWidth) width = maxWidth;
		left = screen.availWidth - width - SCREEN_MARGIN - POPUP_CHROME_WIDTH[chromeType];
	}
	if (left < SCREEN_MARGIN) {
		left = SCREEN_MIN_MARGIN;
	}
	
	if (top < SCREEN_MARGIN) top = SCREEN_MARGIN;
	bottom = top + browserHeight;	
	if (bottom > screen.availHeight - SCREEN_MARGIN) {
		if (relativeToOpener) { 
			top = top - POPUP_TOP_OFFSET + POPUP_TOP_OFFSET_MINIMUM;
			bottom = top + browserHeight;
			if (bottom > screen.availHeight - SCREEN_MARGIN) {
				height = screen.availHeight - top - POPUP_CHROME_HEIGHT[chromeType] - SCREEN_MARGIN;
			}
		} else {
			height = screen.availHeight - top - POPUP_CHROME_HEIGHT[chromeType] - SCREEN_MARGIN;
		}
	}
	if (height < minHeight) { 
		height = minHeight;
		maxHeight = screen.availHeight - 2*SCREEN_MIN_MARGIN - POPUP_CHROME_HEIGHT[chromeType];
		if (height > maxHeight) height = maxHeight;
		top = screen.availHeight - height - SCREEN_MARGIN - POPUP_CHROME_HEIGHT[chromeType];
	}
	if (top < SCREEN_MARGIN) {
		top = SCREEN_MIN_MARGIN;
	}

	// create properties string
	var windowProperties = "width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;

	// popup chrome
	windowProperties += "," + POPUP_CHROME[chromeType];
	
	// popup the resource and save reference to it
 	return window.open(URL, name, windowProperties);
 	
} // popupWindow


function getClientGeometry() {

	var clientGeometry = new Object();
  
	if ( typeof( window.screenLeft ) == 'number' ) {
		clientGeometry.screenLeft = window.screenLeft;
		clientGeometry.screenTop = window.screenTop;
	} else if ( typeof( window.screenX ) == 'number' ) {
		clientGeometry.screenLeft = window.screenX;
		clientGeometry.screenTop = window.screenY;
	} else {
		return null;
	}

	return clientGeometry;
  
}  // getClientDimensions


// -
//    END OF GLOBAL CONSTANTS AND FUNCTIONS FOR POPUPS
// - ###############################################################################


// - ###############################################################################
//    CONSTANTS AND FUNCTIONS FOR COOKIES, ULRS AND QUERY PARAMETERS
// -


COOKIE_EBOOK_REGISTERED = 'eScBRegistered';
COOKIE_EBOOK_STATE_NAME = 'eScBookStateName';
COOKIE_EBOOK_STATE_ABBR = 'eScBookStateAbbr';

function cookieVal(cookieName)
{
	thisCookie = document.cookie.split("; ")
	for (i=0; i<thisCookie.length; i++)
		{
		if (cookieName == thisCookie[i].split("=")[0])
			{
			return thisCookie[i].split("=")[1]
			}
		}
	return 0;
}

function setCookie(name, value)
{
	// set expiration 1 year in future
	var expireDate= new Date();
	expireDate.setFullYear(expireDate.getFullYear() + 1);
	var expString = "";
	if (expireDate != null) {
		if (expireDate.toGMTString) {
			expString = "; expires=" + expireDate.toGMTString();
		} else if (expireDate.toUTCString) {
			expString = "; expires=" + expireDate.toUTCString();
		}
	}
	// set path to root
	pathStr = "; path=/";
	
	// set domain to .eduplace.com if web-based
	if (window.location.hostname.indexOf('eduplace.com') != -1) {
		domainStr = "; domain=.eduplace.com";
	} else {
		domainStr = '';
	}
	document.cookie = escape(name) + "=" + escape(value) + expString + pathStr + domainStr + "; ";
} 

// + ==============================================
//     URL object
//       Properties:
//
//       Class Methods:
//			getParent(url : string) : string
//			getFullURL(baseURL : string, relativeURL : string) : string
// + ==============================================

function URL() {
	// nothing here for now, just used for Class Methods
}

// CLASS METHOD
URL.getParent = function(url) {

	// delete everything after and including ? of query string
	url = url.replace(/\?.+$/, "");

	// delete everything after last \ or /
	return url.replace(/(\\|\/)[\w\.\-\_]+$/, '');

} // URL_getParentFolder


// CLASS METHOD
URL.getFullURL = function(baseURL, relativeURL) {

	var fullURLParent = URL.getParent(baseURL);
	while (relativeURL.indexOf('../') != -1) {
		relativeURL = relativeURL.substr(3);
		fullURLParent = URL.getParent(fullURLParent);
	}
	return fullURLParent + '/' + relativeURL;

} // URL_getFullURL


function getQueryParams() {
  
	var queryString = window.location.search.substring(1); 

	// Array to store parameters
	var queryParams = new Array();
 
 	// save full query string as parameter
 	queryParams['QUERY_STRING'] = queryString;
 	
	// multi-value separator
	multivalueSeparator = ', ';
	
	if (queryString.length < 1) { return queryParams; }

	var params = queryString.split('&');
	
	for (p in params) {
		var curParam = params[p];

		var paramParts = curParam.split('=');

		// if param missing 
		if (paramParts.length == 1) {
			paramParts[1] = '';
		}
		
		// unencode value
		paramParts[1] = paramParts[1].replace('+', ' ');
		paramParts[1] = unescape(paramParts[1]);
		
		if (queryParams[paramParts[0]]) {
			// parameter already exits, append additional value
			queryParams[paramParts[0]] += multivalueSeparator + paramParts[1];
		} else {
			// create new parameter in array
			queryParams[paramParts[0]] = paramParts[1];
		}
	}
	
	return queryParams;
  
} // getQueryParams


// -
//    CONSTANTS AND FUNCTIONS FOR COOKIES, ULRS AND QUERY PARAMETERS
// - ###############################################################################



function calltip(whereto,width,height)
{
//if (! height) {height = 650};

var height = screen.width-50;

if (navigator.userAgent.match(/Mac/))
	{if (! width) {width = 751};}
else
	{if (! width) {width = 768};}

var wheretostring = "(" + whereto + ")";
var left = (screen.width/2) - (width/2);
var top = (screen.height/2) - (height/2);

var left = 5;
var top = 5;

var boilerplate = " channelmode = no, directories = no, fullscreen = no, location = no, menubar = no, resizable = yes, scrollbars = yes, status = no, titlebar = no, toolbar = no";
var w = window.open(whereto,"popup",'width=' + width + ', height=' + height + ' top=' + top + ' left=' + left + boilerplate);

return w;
//window.open(whereto,"_blank",'width=' + width + ', height=' + height + ' top=' + top + ' left=' + left + boilerplate);
}

function LightButton(ImageObject)
{
if (ImageObject.src.indexOf("-disabled") < 0) 
	{
	document[ImageObject.name].src = "../../common/graphics/nav/buttons/" + ImageObject.name + "-lit.gif";
	}
}

function UnlightButton(ImageObject)
{
if (ImageObject.src.indexOf("-disabled") < 0) 
	{
	document[ImageObject.name].src = "../../common/graphics/nav/buttons/" + ImageObject.name + ".gif";
	}
}

function LightActiveButton(ImageObject) {
	if (ImageObject.src.indexOf("-disabled") < 0) {
		if (ImageObject.src.indexOf("-active") < 0) {
			document[ImageObject.name].src = "../../common/graphics/nav/buttons/" + ImageObject.name + "-lit.gif";
		} else {
			document[ImageObject.name].src = "../../common/graphics/nav/buttons/" + ImageObject.name + "-active-lit.gif";
		}
	}
}

function UnlightActiveButton(ImageObject) {
	if (ImageObject.src.indexOf("-disabled") < 0) {
		if (ImageObject.src.indexOf("-active") < 0) {
			document[ImageObject.name].src = "../../common/graphics/nav/buttons/" + ImageObject.name + ".gif";
		} else {
			document[ImageObject.name].src = "../../common/graphics/nav/buttons/" + ImageObject.name + "-active.gif";
		}
	}
}

function DisableButton(ButtonName)
{
document[ButtonName].src = "../../common/graphics/nav/buttons/" + ButtonName + "-disabled.gif";
//alert("Disabled "+document[ButtonName].src);
}

function EnableButton(ButtonName)
{
document[ButtonName].src = "../../common/graphics/nav/buttons/" + ButtonName + ".gif";
//alert("Enabled "+document[ButtonName].src);
}

function ActivateButton(ButtonName)
{
document[ButtonName].src = "../../common/graphics/nav/buttons/" + ButtonName + "-active.gif";
//alert("Activated "+document[ButtonName].src);
}


