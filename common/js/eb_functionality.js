// NAV_FUNCTIONALITY SCRIPT STARTS HERE

//    MODIFICATION HISTORY
//    
//    02-21-04 DC Pulled global text into a GLOBAL TEXT section and added 
//                functions to display text with and without tags based on flag
//    02-22-04 DC Added folio suffix handling
//    04-12-04 DC Updates to handle viewer with frames
// - ###############################################################################
//    GLOBAL CONSTANTS
// -

// DEBUGGING Setting
//
// uncomment the appropriate line for debugging mode:
//   DEGUGGING when true will display alerts for page URLs and popup URLs
//
//DEBUGGING = true;
DEBUGGING = false;

BUTTONSDRAGABLE = false;

STATE_ABBR_COOKIE_NAME = 'eBookStateAbbr';

DEFAULT_STATE_ABBR = 'CA';

// page size info
DEFAULT_PAGE_SIZE = 2; 
PAGE_SIZE_MINIMUM = 1;
PAGE_SIZE_MAXIMUM = 3;


// GLOBAL TEXT / GUI TEXT constants moved to client_functionality.js

// + ###############################################################################
//     eBook Objects


// + ==============================================
//     Folio Class
//       Properties:
//         prefix : string
//         number : integer
//         suffix : string
//
//       Methods:
//         Folio(folioStr : string) : Folio
//         toString() : string
//         isFolioEmpty() : boolean
//         isFolioOdd() : boolean
//         getNextOrPrevFolio(direction : DIRECTION) : string
//         isInFolioRange(startFolio : string, endFolio : string) : boolean
//
//       Class Methods:
//         translateRomanNumberFolio(folio : string) : string
//         newFolioFromParts(folioPrefix : string, folioNumber : integer, folioSuffix : string) : string
//         toStringFromParts(folioPrefix : string, folioNumber : integer, folioSuffix : string) : string
// + ==============================================

function Folio(folioStr) {

	this.prefix = '';
	this.number = -1;
	this.suffix = '';
		
	// allow an empty folio
	if (folioStr == '') {
		return;
	}
	
	// cleans the folio of anything but letters and digits
	var regex = /\W|\_/g;
	folioStr = folioStr.replace(regex, '');

	// if we've cleared the string, return null
	if (!folioStr) {
		return null;
	}
	
	// uppercase any letters
	folioStr = folioStr.toUpperCase();
	
	// substitute front matter folios for roman numerals
	var regex = /^[ivx]+$/i;
	if (folioStr.search(regex) != -1) {
		folioStr = Folio.translateRomanNumberFolio(folioStr);
	}
	
	// 7/25/06 substitute HMSS CA, grade 5, 'Life in the West' folios (e.g. 407-W1)
	var regex = /^\d\d\dW\w$/i;
	if (folioStr.search(regex) != -1) {
		folioStr = Folio.translateDashWFolio(folioStr);
	}

	
	// add zero before single letter folios A,B,C,D,E,F,G,H
	var regex = /^([abcdefgh])$/i;
	var regexResults = folioStr.match(regex);
	if (folioStr.match(regex)) {
		folioStr = '0' + regexResults[1];
	}
	
	// add zero after unit if an a,b suffix follows (science-specific)
	var regex = /^([abcdefs])([ab]+)$/i;
	var regexResults = folioStr.match(regex);
	if (folioStr.match(regex)) {
		folioStr = regexResults[1] + '0' + regexResults[2];
	}
	
	// test for standard optional prefix, digits, optional suffix (FM001, 001, 001a etc.)
	var regex = /^(\D*)(\d+)([a-z]*)$/i;
	var regexResults = folioStr.match(regex);
	if (regexResults) {
		this.prefix = regexResults[1];
		this.number = parseInt(regexResults[2], 10);
		this.suffix = regexResults[3];
		return;
	}

	// test for kindergarten pull outs (01p1)
	var regex = /^(\d+)(p\d+)$/i;
	var regexResults = folioStr.match(regex);
	if (folioStr.match(regex)) {
		this.prefix = '';
		this.number = parseInt(regexResults[1], 10);
		this.suffix = regexResults[2];
		
		return;
	}

	// invalid folio string, return null
	return null;
			
} // Folio constuctor


Folio.prototype.toString = function() {

	// kindergarten pull-out numbers have 2 digits, others 3
	var folioNumberString = '';

	// test for kindergarten pullout suffix
	var regex = /^p\d+$/i;
	if (this.suffix && (this.suffix.search(regex) != -1)) {

		// we are working with kindergarten pullout
		// get a 2-digit number string
		folioNumberString = String (100 + this.number);
    	folioNumberString = folioNumberString.substring(1);

	} else if (!this.isFolioEmpty()) {
	
		// non-empty folio, get a 3-digit number string
		folioNumberString = String (1000 + this.number);
    	folioNumberString = folioNumberString.substring(1);
 
	} else {
	
		// empty folio => empty folioNumberString (as initialized)
		
	}

	// assemble string from parts   
	return this.prefix + folioNumberString + this.suffix.toString();

} // Folio.prototype.toString


Folio.prototype.isFolioEmpty = function() {

	if ((this.number == -1) && (this.prefix == '')  && (this.suffix == '')) {
		return true;
	} else {
		return false;
	}
	
} // Folio.prototype.isFolioEmpty


Folio.prototype.isFolioOdd = function (folio) {

	if (this.suffix) {
		// folio has suffix, test oddness of suffix
		var regex = /^p(\d+)$/i;
		var regexResults = this.suffix.match(regex);
		if (regexResults) {
			// kindergarten pullout
			if (regexResults[1] % 2 == 1) {
				return true;
			} else {
				return false;
			}    
		} else if (this.suffix.length > 1) {
			// card stock pages
			var folioGrade = eBookViewer.getEBookGrade();;
			// AAA is odd, AA is even
			if (this.suffix == 'AAA') {
				return true;
			} else if (this.suffix == 'AA') {
				return false;
			} else if (this.suffix.indexOf('W' == 0)) {
				if (Folio.ODD_ALPHA_SUFFIXES.indexOf(this.suffix.charAt(1)) != -1) {	
					return true;
				}
				else {
					return false;
				} 
			} else {
				// should throw an error
				//alert("Unrecognized multi-character folio suffix:" + this.toString() + ".");
				return false;
			}
		} else {
			// single alphanumeric character suffix
			if (Folio.ODD_ALPHA_SUFFIXES.indexOf(this.suffix) != -1) {
				// found suffix in odd suffixes
				return true;
			} else {
				return false;
			}
		}
	} else {
		// folio doesn't have a suffix, return oddness of number
		if (this.number % 2 == 1) {
			return true;
		} else {
			return false;
		}
	}   
	
} // Folio.prototype.isFolioOdd


Folio.prototype.isInFolioRange = function(startFolioStr, endFolioStr, pageTrap) {

	// if folio invalid or empty, not in range
	if (this.isFolioEmpty()) return false;
	
	// if no end folio then one page in range, folios must match
	if (!endFolioStr) {
		if (this.toString() == startFolioStr) {
			return true;
		} else {
			return false;
		}
	}
	
	// if start or end folios invalid, not in range (might want to flag data file problem)
	var startFolio = new Folio(startFolioStr);
	var endFolio = new Folio(endFolioStr);
	if (!startFolio || !endFolio) return false;
	
	// if prefixes don't match, not in range	
	if (this.prefix != startFolio.prefix) {
		// folio prefixes don't match, not in range
		return false;
	}
	
	// if range is a pageTrap then Folio's number must be between start and end folio numbers
	if (pageTrap) {

		// folio is outside or range if folio number is less than start or greater than end numbers
		if (	(this.number < startFolio.number)
			||	(this.number > endFolio.number)
		   )
		{
			return false;
		}

		
		// folio is in range if number if greater than start and less than end numbers
		if (	(this.number > startFolio.number)
			&&	(this.number < endFolio.number)
		   )
		{
			return true;
		}
		
		if (this.number == startFolio.number) {
			if (!startFolio.suffix) {
				return true;
			} else if (this.suffix >= startFolio.suffix) {
				return true;
			} else {
				return false;
			}
		} 
		
		if (this.number == endFolio.number) {
			if (!endFolio.suffix) {
				return false;
			} else if (this.suffix <= endFolio.suffix) {
				return true;
			} else {
				return false;
			}
		}
		
	}
	
	// if neither folio nor range folios have suffixes then folio number needs to be in number range
	if (!this.suffix && !startFolio.suffix) {
		// check that folio number is in range
		if (	(this.number >= startFolio.number)
			&&	(this.number <= endFolio.number)
		   )
		{
			return true;
		} else {
			return false;
		}
	}

	// if both folio and range folios have suffixes then the numbers and suffixes must be the same to be in range
	if (this.suffix && startFolio.suffix) {

		if (	(this.number == startFolio.number)
			&&	(this.suffix == startFolio.suffix)
		   )
		{
			return true;
		} else {
			return false;
		}
	}
	
	// only one of folio and folio range has a suffix, not in range
	return false;
		
} // Folio.prototype.isFolioInFolioRange


Folio.prototype.getNextOrPrevFolio = function (nextOrPrev) {

	if (this.suffix) {
		// punt if there is a suffix
		return null;
	} else {
	
		var nextOrPrevNumber = this.number;
	
		nextOrPrevNumber += nextOrPrev;			
		if (	(nextOrPrevNumber < 0) 
			||	(nextOrPrevNumber >= 1000) 
		   )
		{
			// number out of range
			return null;
		} else {
			// assemble new folio from folio and new number
			return Folio.newFolioFromParts(this.prefix, nextOrPrevNumber, '');
			
		}
	}

} // Folio.prototype.getNextOrPrevFolio


// CLASS PROPERTY
//Folio.ODD_ALPHA_SUFFIXES = 'a c e g i k m o q s u w y A C E G I K M O Q S U W Y';
Folio.ODD_ALPHA_SUFFIXES = 'b d f h j l n p r t v x z B D F H J L N P R T V X Z';

// CLASS METHOD
Folio.newFolioFromParts = function (folioPrefix, folioNumber, folioSuffix) {

	var folio = new Folio('');

    folio.prefix = folioPrefix;
    folio.number = folioNumber;
    folio.suffix = folioSuffix;
    
    return folio;
	
} // Folio.newFolioFromParts


// CLASS METHOD
Folio.toStringFromParts = function (folioPrefix, folioNumber, folioSuffix) {

    var folio = Folio.newFolioFromParts(folioPrefix, folioNumber, folioSuffix);
    return folio.toString();
	
} // Folio.toStringFromParts


// CLASS METHOD
Folio.translateRomanNumberFolio = function ( folioStr )
{
    var UCFolio = folioStr.toUpperCase();

    if ( UCFolio == "I" ) folioStr = "FM001" ;
    else if ( UCFolio == "II" ) folioStr = "FM002" ;
    else if ( UCFolio == "III" ) folioStr = "FM003" ;
    else if ( UCFolio == "IV" ) folioStr = "FM004" ;
    else if ( UCFolio == "V" ) folioStr = "FM005" ;
    else if ( UCFolio == "VI" ) folioStr = "FM006" ;
    else if ( UCFolio == "VII" ) folioStr = "FM007" ;
    else if ( UCFolio == "VIII" ) folioStr = "FM008" ;
    else if ( UCFolio == "IX" ) folioStr = "FM009" ;
    else if ( UCFolio == "X" ) folioStr = "FM010" ;
    else if ( UCFolio == "XI" ) folioStr = "FM011" ;
    else if ( UCFolio == "XII" ) folioStr = "FM012" ;
    else if ( UCFolio == "XIII" ) folioStr = "FM013" ;
    else if ( UCFolio == "XIV" ) folioStr = "FM014" ;
    else if ( UCFolio == "XV" ) folioStr = "FM015" ;
    else if ( UCFolio == "XVI" ) folioStr = "FM016" ;
    else if ( UCFolio == "XVII" ) folioStr = "FM017" ;
    else if ( UCFolio == "XVIII" ) folioStr = "FM018" ;
    else if ( UCFolio == "XIX" ) folioStr = "FM019" ;
    else if ( UCFolio == "XX" ) folioStr = "FM020" ;
    else if ( UCFolio == "XXI" ) folioStr = "FM021" ;
    else if ( UCFolio == "XXII" ) folioStr = "FM022" ;
    else if ( UCFolio == "XXIII" ) folioStr = "FM023" ;
    else if ( UCFolio == "XXIV" ) folioStr = "FM024" ;
    else if ( UCFolio == "XXV" ) folioStr = "FM025" ;
    else if ( UCFolio == "XXVI" ) folioStr = "FM026" ;
    else if ( UCFolio == "XXVII" ) folioStr = "FM027" ;
    else if ( UCFolio == "XXVIII" ) folioStr = "FM028" ;
    else if ( UCFolio == "XXIX" ) folioStr = "FM029" ;
    else if ( UCFolio == "XXX" ) folioStr = "FM030" ;
    
    return folioStr ;

} // translateRomanNumberFolio


// 7/25/06 added below for HMSS CA, grade 5, 'Life In The West' section
Folio.translateDashWFolio = function ( folioStr) 
{

	var UCFolio = folioStr.toUpperCase();
	
	if ( UCFolio == '407W1' ) folioStr = '407WA' ;
    else if ( UCFolio == '407W2' ) folioStr = '407WB' ;
    else if ( UCFolio == '407W3' ) folioStr = '407WC' ;
    else if ( UCFolio == '407W4' ) folioStr = '407WD' ;
    else if ( UCFolio == '407W5' ) folioStr = '407WE' ;
    else if ( UCFolio == '407W6' ) folioStr = '407WF' ;
    else if ( UCFolio == '407W7' ) folioStr = '407WG' ;
    else if ( UCFolio == '407W8' ) folioStr = '407WH' ;

	return folioStr ;
	    
} // translateDashWFolio


//     End of Folio object
// - ==============================================


// + ==============================================
//     Page object
//       Properties:
//         folio : folio
//         pageRange : PageRange
//
//       Class Properties:
//         CURRENT_PAGE : 'CURRENT_PAGE'
//
//       Methods:
//         Page(folioStr : string) : Page
//         toPageCode() : string
//         toURL() : string
//
//       Class Methods:
//         getFolioFromPageCode(pageCode : string) : string
// + ==============================================

function Page(folio, pageRange) {

	this.folio = folio;
	this.pageRange = pageRange;
	
} // Page constructor


Page.prototype.toPageCode = function () {

	if (this.pageRange.pageTrap) {
		return PageRange.getPagePrefix(this.pageRange.pagePrefix);
	} else {
		return PageRange.getPagePrefix(this.pageRange.pagePrefix) + this.folio.toString();
	}
	
} // Page.prototype.toPageCode


Page.prototype.toURL = function () {

	var pageCode = this.toPageCode();
	if (this.pageRange.pageTrap) {
		// page trap
		return requestInfo.ftURL + '/' + pageCode + '.html';
	} else {
		// normal page
		return requestInfo.pagesURL + '/' + pageCode + '.html';
	}
	
} // Page.prototype.toURL


// CLASS METHOD
Page.getFolioFromPageCode = function (pageCode) {

	var regex = /([^\-]+)$/;
	var regexResults = pageCode.match(regex);
	if (regexResults) {
		return new Folio(regexResults[1]);
	} else {
		return null;
	}
	
} // Page.getFolioStrFromPageCode


//     End of Page object
// - ==============================================



// + ==============================================
//     PageRange object
//       Properties:
//         startFolioStr : string
//         endFolioStr : string
//         pagePrefix : string
//         rangeInfo : boolean
//         pageTrap : boolean
//         pageRangeIndex : integer
//
//       Methods:
//         PageRange(pageRangeString: string, pageRangeIndex : integer) : PageRange
//         isFolioInPageRange(folio : Folio) : boolean
// + ==============================================

function PageRange(pageRangeString, pageRangeIndex) {

	// parse pageRangeString to get properties
	var pageRangeFields = pageRangeString.split('\t');
	this.startFolioStr = pageRangeFields[0];
	this.endFolioStr = pageRangeFields[1];
	this.pagePrefix = pageRangeFields[2];
	this.rangeInfo = pageRangeFields[3];
	if (this.pagePrefix.substr(0,3) == 'FT_') {
		this.pageTrap = true;
	} else {
		this.pageTrap = false;
	}
	
	// index into pageRanges array
	this.pageRangeIndex = pageRangeIndex;
	
} // PageRange constructor


PageRange.prototype.isFolioInPageRange = function(folio) {

	return folio.isInFolioRange(this.startFolioStr, this.endFolioStr, this.pageTrap);
		
} // PageRange.prototype.isFolioInPageRange


//  CLASS METHODS
PageRange.setPagePrefixes = function (pagePrefixes) {

	this.pagePrefixes = pagePrefixes;

} // EBook.prototype.setPagePrefixes

PageRange.getPagePrefix = function (pagePrefixID) {

	if (this.pagePrefixes[pagePrefixID]) {
		return this.pagePrefixes[pagePrefixID];
	} else {
		return pagePrefixID;
	}

} // EBook.prototype.getPagePrefix




//     End of PageRange object
// - ==============================================



// + ==============================================
//     EBook object
//       Properties:
//         pageRanges : Array of PageRange
//         pagePrefixes: Associative Array of prefixes used in pageRanges
//         TOCFirstFolio : folio
//         TOCLastFolio : folio
//         stateSpecificAudio : boolean
//         stateSpecificGlossary : boolean
//         stateSpecificIMaps : boolean
//
//       Methods:
//         EBook(pageRangeString : string, TOCFirstFolioStr : string) : EBook
//         getNextOrPrevPage(page : Page, direction : DIRECTION) : Page
//         getNextOrPrevPageRange(pageRange : PageRange, direction : DIRECTION) : PageRange
//         getPageRangeFromFolio(folio : Folio) : PageRange
//         getBothPageCodes(page : Page) : Array[1] of strings 
// + ==============================================

function EBook(pageRangesString, pagePrefixes, TOCFirstFolioStr, TOCLastFolioStr, stateSpecificGlossary, stateSpecificIMaps) {

	this.pageRanges = new Array();
	PageRange.setPagePrefixes(pagePrefixes);
	var pageRangeStringArray = pageRangesString.split('\n');
	for (var r=0; r<pageRangeStringArray.length; r++) {

		// create new pageRange from string and append to pageRanges array
		this.pageRanges[r] = new PageRange(pageRangeStringArray[r], r);		

	}
	
	this.TOCFirstFolio = new Folio(TOCFirstFolioStr);	
	this.TOCButtonFolio = new Folio(TOCFirstFolioStr);	
	this.TOCLastFolio = new Folio(TOCLastFolioStr);
	
	this.stateSpecificAudio = false;
	this.stateSpecificGlossary = stateSpecificGlossary;
	this.stateSpecificIMaps = stateSpecificIMaps;

} // EBook constructor


EBook.prototype.getNextOrPrevPage = function (page, nextOrPrev) {

	// get next/prev numeric folio if page is not in a trapped range or a rangePage
	var nextOrPrevFolio = '';
	if (	!page.pageRange.pageTrap 
	   && 	(page.pageRange.rangeInfo != 'LeftRangePage') 
	   && 	(page.pageRange.rangeInfo != 'RightRangePage') 
	   )
	{
		nextOrPrevFolio = page.folio.getNextOrPrevFolio(nextOrPrev);
	}
	
	// return next/prev folio if it is in current pageRange
	if (nextOrPrevFolio) {
		if (page.pageRange.isFolioInPageRange(nextOrPrevFolio)) {
			return new Page(nextOrPrevFolio, page.pageRange);
		}
	}
	
	// next/prev out of current range, get next/prev pageRange and return start/end page

	var nextOrPrevPageRange = this.getNextOrPrevPageRange(page.pageRange, nextOrPrev);
	if (nextOrPrevPageRange) {
		if (nextOrPrev == DIRECTION_NEXT) {
			// next folio is startFolio of pageRange
			nextOrPrevFolio = new Folio(nextOrPrevPageRange.startFolioStr);
		} else {
			// prev folio is:
			//   the startFolio is the pageRange is a rangePage,
			//   the endFolio of pageRange if the pageRange has an endFolio, or
			//   the startFolio if the pageRange has only 1 page
			if (	(nextOrPrevPageRange.rangeInfo == 'LeftRangePage') 
			   || 	(nextOrPrevPageRange.rangeInfo == 'RightRangePage')
			   )
			{
				nextOrPrevFolio = new Folio(nextOrPrevPageRange.startFolioStr);
			} else if (nextOrPrevPageRange.endFolioStr) {
				nextOrPrevFolio = new Folio(nextOrPrevPageRange.endFolioStr);
			} else {
				nextOrPrevFolio = new Folio(nextOrPrevPageRange.startFolioStr);
			}
		}
		return new Page(nextOrPrevFolio, nextOrPrevPageRange);
	} else {
		// couldn't find a next/prev pageRange
		return null;
	}
		
} // EBook.prototype.getNextOrPrevPage


EBook.prototype.getNextOrPrevPageRange = function (pageRange, nextOrPrev) {

	var nextOrPrevPageRangeIndex = pageRange.pageRangeIndex + nextOrPrev;
	
	if (	(nextOrPrevPageRangeIndex < 0) 
		||	(nextOrPrevPageRangeIndex >= this.pageRanges.length)
	   )
	{
		// no next/prev pageRange, out of bounds
		return null;
	}
	
	// return the next/prev pageRange
	return this.pageRanges[nextOrPrevPageRangeIndex];
	
} // EBook.prototype.getNextOrPrevPageRange


EBook.prototype.getPageRangeFromFolio = function (folio) {

	// loop through pageRanges looking for a pageRange that contains the folio
	for (var r=0; r<this.pageRanges.length; r++) {
		if (this.pageRanges[r].isFolioInPageRange(folio)) {
			return this.pageRanges[r];
		}
	}
	
	return null;
	
} // EBook.prototype.getPageRangeFromFolio


EBook.prototype.getBothPageCodes = function (page) {

	var bothPageCodes = Array();
	
	var pageIsOdd = page.folio.isFolioOdd();
	
	if (	(pageIsOdd && page.pageRange.oddLeftPage)
		||	(!pageIsOdd && !page.pageRange.oddLeftPage)
	   )
	{

		// current page is left page
		bothPageCodes[0] = page.toPageCode();
		
		// right page is next page
		var nextPage = this.getNextOrPrevPage(page, DIRECTION_NEXT);
		if (nextPage) {
			bothPageCodes[1] = nextPage.toPageCode();
		} else {
			bothPageCodes[1] = 'blank';
		}
		
	} else {

		// current page is right page
		bothPageCodes[1] = page.toPageCode();
		
		// left page is prev page
		var prevPage = this.getNextOrPrevPage(page, DIRECTION_PREV);
		if (prevPage) {
			bothPageCodes[0] = prevPage.toPageCode();
		} else {
			bothPageCodes[0] = 'blank';
		}
		
	}

	return bothPageCodes;
	
} // EBook.prototype.getBothPageCodes


EBook.prototype.getAudioPageCode = function (page) {

	var pageIsOdd = page.folio.isFolioOdd();
	var leftPageCode = '';
		
	if (	(pageIsOdd && page.pageRange.oddLeftPage)
		||	(!pageIsOdd && !page.pageRange.oddLeftPage)
	   )
	{

		// current page is left page
		leftPageCode = page.toPageCode();
				
	} else {

		// left page is prev page
		var prevPage = this.getNextOrPrevPage(page, DIRECTION_PREV);
		if (prevPage) {
			leftPageCode = prevPage.toPageCode();
		} else {
			leftPageCode = '';
		}
		
	}
	
	// change page code to audio code (SP5S => SA5S, remove NHN-)
	var regex = /^SP/;
	// 4/21/06 removed, audio now can be named 'SP'
	var audioPageCode = leftPageCode;//.replace(regex, 'SA');
	var regex = /NHN\-/;
	audioPageCode = audioPageCode.replace(regex, '');

	// if stateSpecificAudio is false then make page code national 
	if (this.stateSpecificAudio == false) {
		// make page code national (Just works for Florida for now)
		var regex = /FL5B/;
		audioPageCode = audioPageCode.replace(regex, 'NA5B');	
	} else {
		// make sure page code is state-specific when left-land page is national (Just works for Florida for now)
		var regex = /NA5B/;
		audioPageCode = audioPageCode.replace(regex, 'FL5B');	
	}
	
	return audioPageCode;
	
} // EBook.prototype.getAudioPageCode


//     End of EBook object
// - ==============================================


// + ==============================================
//     EBookViewer object
//       Properties:
//         eBook : EBook
//         currentPage : Page
//         pageSize : int
//         pageAudioTracks : string (comma-delimited ints mapping pageTrack to spreadTrack)
//         pageAudioTrack : int
//         userState : string
//         userStateName : string
//         popupWindows : Array of window references
//       Methods:
//         gotoPage(page : Page) : 0 if fails
//         gotoFolioStr(folio : string) : 0 if fails
//         gotoNextOrPrevPage(direction : DIRECTION) : 0 if fails
//         gotoTOC() : 0 if fails
//         popupResource(URL : string, width : integer, height : integer, name : string) : Window
//         popupBothPages() : Window
//         popupEPLink(pageSpecificLink : boolean) : Window
//         popupPrintPage() : Window
//         popupInteractiveMap(mapID : string) : Window
//         popupGlossary(glossaryTerm : string) : Window
//         setPageSize(pageSize : integer)
//         getEBookGrade() : character
// + ==============================================

function EBookViewer(eBook, requestInfo, pageToView) {

	this.eBook = eBook;
	var pageCode = '';
	var currentFolio = eBook.TOCFirstFolio;
	if (requestInfo.pageCode) {
		currentFolio = Page.getFolioFromPageCode(requestInfo.pageCode);
	} else if (pageToView != '') {
		currentFolio = Page.getFolioFromPageCode(pageToView);
	}
	var currentPageRange = eBook.getPageRangeFromFolio(currentFolio);
	this.currentPage = new Page(currentFolio, currentPageRange);
	this.pageSize = requestInfo.pageSize;
	this.pageAudioOn = requestInfo.audioOn;
	this.pageAudioTracks = '';
	this.pageAudioTrack = 0;
	this.stateSpecificAudio = false;
	this.userState = requestInfo.userState;
	this.userStateName = requestInfo.userStateName;
	this.popupWindows = new Array();
	this.bookPageInitialized = false;
	this.navInitialized = false;

	
} // EBookViewer constructor


EBookViewer.prototype.gotoPage = function (page) {

	var newPageURL = page.toURL();
	
	if (DEBUGGING) {
		alert('gotoPage => ' + newPageURL);
	}

	bookpage.location = newPageURL;
	
	this.currentPage = page;

	return 1;
	
} // EBookViewer.prototype.gotoPage


EBookViewer.prototype.gotoFolioStr = function (folioStr) {

	if (!folioStr) return 0;
	
	var folio = new Folio(folioStr);
	if (!folio) return 0;

	var folioPageRange = eBook.getPageRangeFromFolio(folio);
	if (!folioPageRange) return 0;
	
	var folioPage = new Page(folio, folioPageRange);

	return this.gotoPage(folioPage);

} // EBookViewer.prototype.gotoFolioStr


EBookViewer.prototype.gotoNextOrPrevPage = function (nextOrPrev) {

	var nextOrPrevPage = this.eBook.getNextOrPrevPage(this.currentPage, nextOrPrev);
	
	if (nextOrPrevPage) {
		this.gotoPage(nextOrPrevPage);
		return 1;
	} else {
		return 0;
	}
	
} // EBookViewer.prototype.gotoPage


EBookViewer.prototype.gotoTOC = function () {

	var TOCPageRange = eBook.getPageRangeFromFolio(this.eBook.TOCButtonFolio);
	var TOCPage = new Page(this.eBook.TOCButtonFolio, TOCPageRange);
	
	if (TOCPage) {
		this.gotoPage(TOCPage);
	} else {
		return 0;
	}
	
} // EBookViewer.prototype.gotoTOC


EBookViewer.prototype.redisplayPage = function () {

	this.gotoPage(this.currentPage);
	return 1;
	
} // EBookViewer.prototype.gotoPage


// *** PAGE SIZE FUNCTIONS ***

EBookViewer.prototype.setPageSize = function (pageSize) {

	this.pageSize = pageSize;
	
} // EBookViewer.prototype.setPageSize

EBookViewer.prototype.smallerPage = function () {

	if (this.pageSize > PAGE_SIZE_MINIMUM) { 
		this.pageSize--;
//		var largerPageButton = 1;
//		var smallerPageButton = 1;
//		if (this.pageSize == PAGE_SIZE_MINIMUM) {
//			smallerPageButton = -1;
//		};
//		nav.UpdateNavBarButtons(0, 0, largerPageButton, smallerPageButton, 0, 0);
//		bookpage.ChangePageSize(this.pageSize);
		this.redisplayPage();
	} else {
		alert (getGlobalText("GT022"));
	}
	
} // EBookViewer.prototype.smallerPage

EBookViewer.prototype.largerPage = function () {

	if (this.pageSize < PAGE_SIZE_MAXIMUM) { 
		this.pageSize++;
//		var largerPageButton = 1;
//		var smallerPageButton = 1;
//		if (this.pageSize == PAGE_SIZE_MAXIMUM) {
//			largerPageButton = -1;
//		};
//		nav.UpdateNavBarButtons(0, 0, largerPageButton, smallerPageButton, 0, 0);
//		bookpage.ChangePageSize(this.pageSize);
		eBookViewer.redisplayPage();

	} else {
		alert (getGlobalText("GT021"));
	}

}  // EBookViewer.prototype.largerPage


// *** PAGE INFO FUNCTIONS ***

EBookViewer.prototype.setPageInfo = function (prevPage, nextPage, largerPage, smallerPage, bothPages, printPage, pageAudioTrackArray, stateSpecificAudio, leftPageType, rightPageType) {

	leftExt = leftPageType;
	rightExt = rightPageType;
	
	// handle state specific audio	
	this.eBook.stateSpecificAudio = stateSpecificAudio;
	
	// if largerPage or smallerPage are active (i.e. 1), determine button state setting based on pageSize
	if (largerPage == 1) {
		if (this.pageSize >= PAGE_SIZE_MAXIMUM) {
			largerPage = -1;
		} else {
			largerPage = 1;
		}
	}
	if (smallerPage == 1) {
		if (this.pageSize <= PAGE_SIZE_MINIMUM) {
			smallerPage = -1;
		} else {
			smallerPage = 1;
		}
	}	
	
	// set nav buttons
	nav.UpdateNavBarButtons(	prevPage, nextPage,
								largerPage, smallerPage,
								bothPages, printPage
							);

	// handle audio set up
	if (this.pageAudioOn) {
		this.pageAudioTracks = pageAudioTrackArray.join(',');
		this.pageAudioTrack = 0;
		if (this.pageAudioTracks != '') {
			var audioPageCode = this.eBook.getAudioPageCode(this.currentPage);
			nav.CueAudioTrack(audioPageCode, this.pageAudioTracks, '');
		} else {
			nav.DisableAudio();
		}
	}

} // EBookViewer.prototype.setPageInfo



// *** POP-UP FUNCTIONS ***

EBookViewer.prototype.popupResource = function (resourceURL, name, width, height, minWidth, minHeight, chromeType) {

	if (DEBUGGING) {
  		alert('popup => ' + resourceURL);
  	}
	
	// if existing popup close it
	//if (this.popupWindows[name] && !this.popupWindows[name].closed) {
	//	this.popupWindows[name].close();
	//}

	// close all popups with other names
	//for (popupWindowIndex in this.popupWindows) {
	//	if (	(popupWindowIndex != name)
	//		&&	this.popupWindows[popupWindowIndex]
	//		&& 	!this.popupWindows[popupWindowIndex].closed
	//	   )
	//	{
	//		this.popupWindows[popupWindowIndex].close();
	//	}
	//}

	// popup the resource and save reference to it
 	var resourceWindow = popupWindow(resourceURL, name, width, height, minWidth, minHeight, chromeType, POPUP_LOCATION_OPENER);
	
	this.popupWindows[name] = resourceWindow;
	
	// stop audio if it is playing
	if (this.pageAudioTrack) {	
		StopPageTrack(1);
		DeactivatePageTrack(this.pageAudioTrack);
	}
	
	return resourceWindow;
	
} // EBookViewer.prototype.popupResource


EBookViewer.prototype.popupEPLink = function (pageSpecificLink) {

//	old direct link to education place
//	var EPLinkURL = "http://www.eduplace.com/cgi-bin/jumpto/emathbook?" + this.currentPage.toPageCode();

	var EPLinkURL = "../../common/resources/eplink.html";
	
// removed logic that embedded the next line in: if (pageSpecificLink) 

	EPLinkURL += "?" + this.currentPage.toPageCode();
	if (window.location.host.indexOf('eduplace.com') != -1) {
		EPLinkURL = 'http://www.eduplace.com/cgi-bin/jumpto/esocialstudiesbook?' + this.currentPage.toPageCode();
	}
	var popupWindow = this.popupResource(	EPLinkURL, POPUP_EPLINK_NAME, 
											POPUP_EPLINK_WIDTH, POPUP_EPLINK_HEIGHT, 
											POPUP_EPLINK_MIN_WIDTH, POPUP_EPLINK_MIN_HEIGHT, 
											POPUP_EPLINK_CHROME_TYPE
										);

} // EBookViewer.prototype.popupEPLink


EBookViewer.prototype.popupBothPages = function () {

	var bothPages = this.eBook.getBothPageCodes(this.currentPage);
//	alert(bothPages[0] + "." + leftExt + "  " + bothPages[1] + "." + rightExt);
//	var bothPagesURL = "bothpages.html?lp=" + bothPages[0] + "&rp=" + bothPages[1];

	var bothPagesURL = "../resources/bothpages.html?" + bothPages[0] + "." + leftExt + "/" + bothPages[1] + "." + rightExt;

	var popupWindow = this.popupResource(	bothPagesURL, POPUP_BOTHPAGES_NAME, 
											POPUP_BOTHPAGES_WIDTH, POPUP_BOTHPAGES_HEIGHT, 
											POPUP_BOTHPAGES_MIN_WIDTH, POPUP_BOTHPAGES_MIN_HEIGHT, 
											POPUP_BOTHPAGES_CHROME_TYPE
										);

} // EBookViewer.prototype.popupBothPages


EBookViewer.prototype.popupHomework = function (homeworkCode) {

	var homeworkURL = '../../common/resources/homework.html?' + homeworkCode;
	var popupWindow = this.popupResource(	homeworkURL, POPUP_HOMEWORK_NAME, 
											POPUP_HOMEWORK_WIDTH, POPUP_HOMEWORK_HEIGHT, 
											POPUP_HOMEWORK_MIN_WIDTH, POPUP_HOMEWORK_MIN_HEIGHT, 
											POPUP_HOMEWORK_CHROME_TYPE
										);

} // EBookViewer.prototype.popupHomework


EBookViewer.prototype.popupPrintableVersion = function () {
	
	var isRightPage = this.currentPage.folio.isFolioOdd();
	var ext;
	if (isRightPage) {
		ext = rightExt; 
	}
	else {
		ext = leftExt;
	}
//	var printableVersionURL = "printable.html?p=" + this.currentPage.toPageCode();
	var printableVersionURL = "../resources/printable.html?" + this.currentPage.toPageCode() + "." + ext;

	var popupWindow = this.popupResource(	printableVersionURL, POPUP_PRINTABLE_NAME, 
											POPUP_PRINTABLE_WIDTH, POPUP_PRINTABLE_HEIGHT, 
											POPUP_PRINTABLE_MIN_WIDTH, POPUP_PRINTABLE_MIN_HEIGHT, 
											POPUP_PRINTABLE_CHROME_TYPE
										);

} // EBookViewer.prototype.popupPrintableVersion


EBookViewer.prototype.popupGlossary = function (glossaryTerm) {


	var grade = this.getEBookGrade();

	// HACK -- if stateGlossary specified, use grade 7 for now
	if (this.eBook.stateSpecificGlossary) {
		grade = 7;
	}
	
	var height = 0;
	var width = 0;
	var minHeight = 0;
	var minWidth = 0;
	var glossaryURL = '';
	if ((grade == 'K') || (grade < 3)) {
		glossaryURL = '../../common/eglossary/eg_popup.html?grade=' + grade;
		width = POPUP_GLOSSARY_WIDTH;
		height = POPUP_GLOSSARY_HEIGHT
		minWidth = POPUP_GLOSSARY_MIN_WIDTH;
		minHeight = POPUP_GLOSSARY_MIN_HEIGHT
	} else {
		glossaryURL = '../../common/eglossary/eg_popup.html?grade=' + grade;
		width = POPUP_GLOSSARY_OLDER_WIDTH;
		height = POPUP_GLOSSARY_OLDER_HEIGHT
		minWidth = POPUP_GLOSSARY_OLDER_MIN_WIDTH;
		minHeight = POPUP_GLOSSARY_OLDER_MIN_HEIGHT
	}


//	if (this.eBook.stateSpecificGlossary) {
//		glossaryURL += '&state='+escape(stateGlossary);
//	}

	if (glossaryTerm) {
		glossaryURL += '&word='+escape(glossaryTerm);
	}

//	if (glossaryTerm) {
//		// replace anything but letters and digits with '_'
//		var regex = /\W|\_/g;
//		var fileFriendlyGlossaryTerm = glossaryTerm.replace(regex, '_');
//
//		glossaryURL = '../glossary/' + fileFriendlyGlossaryTerm + '.html';
//	}
	
	var popupWindow = this.popupResource(	glossaryURL, POPUP_GLOSSARY_NAME, 
											width, height, 
											minWidth, minHeight, 
											POPUP_GLOSSARY_CHROME_TYPE
										);

} // EBookViewer.prototype.popupGlossary


EBookViewer.prototype.popupInteractiveMap = function (mapID, localRemote) {

	var grade = this.getEBookGrade();
	var mapURL = '';
	if (mapID != 'all') {
		if (localRemote.toLowerCase() == 'l') {
			// 10/4/06 HMHSS CA grade 6 has different brand of imap
			if (grade == 6) {
				mapURL = '../../book/imaps/maps/' + mapID + '/' + mapID + '.html';
			}
			else {
				mapURL = '../../book/imaps/maps/' + mapID + '/index.html';
			}
		} else {
			mapURL = 'http://www.eduplace.com/cgi-bin/jumpto/esocialstudiesbook?' + mapID;
		}
	} else {
		if (this.eBook.stateSpecificIMaps) {
			mapURL = '../../book/imaps/index_' + this.eBook.stateSpecificIMaps + '.html';
		} else {
			mapURL = '../../book/imaps/index.html';
		}
	}
	
	// 10/4/06 HMHSS CA grade 6 has different brand of imap, need different size window
	if (grade == 6) {
		var popupWindow = this.popupResource(	mapURL, POPUP_G6IMAP_NAME, 
												POPUP_G6IMAP_WIDTH, POPUP_G6IMAP_HEIGHT, 
												POPUP_G6IMAP_MIN_WIDTH, POPUP_G6IMAP_MIN_HEIGHT, 
												POPUP_G6IMAP_CHROME_TYPE
											);
	}
	else {
		var popupWindow = this.popupResource(	mapURL, POPUP_IMAP_NAME, 
												POPUP_IMAP_WIDTH, POPUP_IMAP_HEIGHT, 
												POPUP_IMAP_MIN_WIDTH, POPUP_IMAP_MIN_HEIGHT, 
												POPUP_IMAP_CHROME_TYPE
											);
	}

} // EBookViewer.prototype.popupInteractiveMap


EBookViewer.prototype.closePopups = function () {

	// close all open popups
	for (popupWindowIndex in this.popupWindows) {
		if (this.popupWindows[popupWindowIndex] && !this.popupWindows[popupWindowIndex].closed) {
			this.popupWindows[popupWindowIndex].close();
		}
	}

} // EBookViewer.prototype.close


EBookViewer.prototype.close = function () {

	// close all open popups
	this.closePopups();
	
	// close main window
	if (window.opener && !window.opener.closed) {
		if (window.location.host.indexOf('eduplace.com') != -1) {
			if (window.location.host.indexOf('dev') != -1) {
				window.opener.location.href = 'http://dev.eduplace.com/epe/hmsc/common/startup/exit.html';
			} else {
				window.opener.location.href = 'http://www.eduplace.com/epe/hmsc/common/startup/exit.html';
			}
		} else {
			// running off disk, no permissions issue
			window.opener.ExitEBook();
		}
		window.close();
	} else {
		window.location.href = URL.getFullURL(window.location.href, '../startup/exit.html');
	}
	
} // EBookViewer.prototype.close


EBookViewer.prototype.getEBookGrade = function () {

	return this.currentPage.pageRange.pagePrefix.substring(2,3);
	
} // EBookViewer.prototype.gotoTOC


//     End of EBookViewer object
// - ==============================================


// + ==============================================
//     RequestInfo object
//       Properties:
//         URL : string
//         baseURL : string
//         pageCode : string
//         userState : string
//         userStateName : string
//         audioOn : boolean
//
//       Class Methods:
//         getPageCodeFromURL(url : string) : string
// + ==============================================

function RequestInfo() {

	this.URL = window.location.href;
	this.queryParams = getQueryParams()
	this.framesURL = URL.getParent(this.URL);
	this.pagesURL = URL.getParent(URL.getParent(this.framesURL)) + '/book/html';
	this.ftURL = URL.getParent(this.framesURL) + '/ft';
	// this.pageCode = RequestInfo.getPageCodeFromURL(this.URL);
	if (this.queryParams['p']) {
		this.pageCode = this.queryParams['p'];
	}
	if (this.queryParams['ps']) {
		this.pageSize = this.queryParams['ps']
	} else {
		this.pageSize = DEFAULT_PAGE_SIZE;
	}
	if (this.queryParams['s']) {
		//this.userState = this.queryParams['s'];
		// 10/3/06 for CA7B, force CA
		this.userState = 'CA';
	} else {
		this.userState = DEFAULT_STATE_ABBR;
	}
	if (this.queryParams['a'] && (this.queryParams['a'].toLowerCase() == 'f')) {
			this.audioOn = false;
	} else {
		this.audioOn = true;
	}

} // RequestInfo constructor


//     End of EBookViewer object
// - ==============================================


//     End of eBook Objects
// - ###############################################################################


//
//functions called from eBook main page
//

function GetTOCPageCode(pageRangesString, TOCFirstFolioStr) {

	var eBook = new EBook(pageRangesString, TOCFirstFolioStr);

	var TOCPageRange = eBook.getPageRangeFromFolio(eBook.TOCFirstFolio);
	var TOCPage = new Page(eBook.TOCFirstFolio, TOCPageRange);
	
	if (TOCPage) {
		return(TOCPage.toPageCode());
	} else {
		return 0;
	}

} // GetTOCPageCode


//
//functions called from eBook pages
//

function createEBookViewer(pageRangesStrings, pagePrefixes, TOCFirstFolioStr, TOCLastFolioStr, pageToView, stateSpecificGlossary, stateSpecificIMaps) {
	
	requestInfo = new RequestInfo();
	eBook = new EBook(pageRangesStrings[requestInfo.userState], pagePrefixes, TOCFirstFolioStr, TOCLastFolioStr, stateSpecificGlossary, stateSpecificIMaps);
	eBookViewer = new EBookViewer(eBook, requestInfo, pageToView);

} // createEBook

function LoadBookPage() {

	eBookViewer.bookPageInitialized = true;
	if (eBookViewer.navInitialized) {
		eBookViewer.gotoPage(eBookViewer.currentPage);
	}
	
} // LoadBookPage

function NavInitialized() {

	eBookViewer.navInitialized = true;
	if (eBookViewer.bookPageInitialized) {
		eBookViewer.gotoPage(eBookViewer.currentPage);
	}

} // NavInitialized


function JumpTOC() {
	eBookViewer.gotoTOC();
} // JumpTOC


function JumpPage(folioStr) {	
	return eBookViewer.gotoFolioStr(folioStr);
} // JumpPage


function ButtonJumpPage() {

	// prompt for page (folio)
    var folioStr  = prompt( getGlobalText("GT007"), "");
    
    if (folioStr == 'hmco') {BUTTONSDRAGABLE = 10; parent.frames[1].location.reload(); return;}
    
    if (	(folioStr == "") 
    	|| 	(folioStr == null)
    	||  (typeof(folioStr) == "undefined")
       )
	{
	
    	// do nothing

    } else {
    
		// goto page (folio)
    	var status = JumpPage(folioStr);
    	if (status != 1) {
			alert( getGlobalText("GT006") );
		}
	
	}

} // ButtonJumpPage


// 2/23/04 DC - added disabled button handling for prev/next

function PrevPage() {

	//this has to come first so it captures the current page
	//if (BUTTONSDRAGABLE)
	//	{
	//	updateLocationsText();
	//	}
		
	var success = eBookViewer.gotoNextOrPrevPage(DIRECTION_PREV);
	
	if (!success) {
		alert( getGlobalText("GT013") );
	}

} // PrevPage


function NextPage() {

	//this has to come first so it captures the current page
	if ((BUTTONSDRAGABLE) && (!parent.frames[1].tocPage)) {
		updateLocationsText();
	}

	var success = eBookViewer.gotoNextOrPrevPage(DIRECTION_NEXT);
	
	if (!success) {
		alert( getGlobalText("GT014") );
	}
	
} // NextPage

//4/21/04
//bandage; added this from drag_script.js because it's called in NextPage() and PrevPage()

function updateLocationsText() {
	for (var i=1; i<=parent.frames[1].yarray.length; i++) {
		//var x = eval('parent.frames[1].document.all.audio' + i + '.style.left');
		var x = eval('parent.frames[1].document.getElementById("audio' + i + '").style.left');
		//var y = eval('parent.frames[1].document.all.audio' + i + '.style.top');
		var y = eval('parent.frames[1].document.getElementById("audio' + i + '").style.top');
		var xmod = parseInt(x) + ((i-1) * 38);
		if (parseInt(y) < -10) {
			var code = top.eBookViewer.currentPage.toPageCode();
			top.buttonPositionText += "["+code+"|audio" + i + "|" + x + "|" + y + "|" + xmod + "]\n";
		}
	}
}

function BothPages() {

	eBookViewer.popupBothPages();

}

// 2/18/04 TS - Edited this to add back the disabled issue

function PrintPage() {

	eBookViewer.popupPrintableVersion();

} // PrintPage


function HomeworkPage(hwcode) {

	eBookViewer.popupHomework(hwcode);

}


function Simulations(unit) {

	eBookViewer.popupSimulation(unit);

}


function InteractiveMap(mapID, localRemote) {

	eBookViewer.popupInteractiveMap(mapID, localRemote);

}

// pass glossaryTerm = '' to pop-up glossary
function Glossary(glossaryTerm) {

	eBookViewer.popupGlossary(glossaryTerm);

}

function EPLink(pageSpecificLink) {

	eBookViewer.popupEPLink(pageSpecificLink);
	
} // EPLink


helpPopupWindow = null;
function Help() {

	var HelpURL = '';
	if (eBookViewer.getEBookGrade() == 'K') {
		HelpURL = '../../common/resources/help_k.html';
	} else {
		HelpURL = '../../common/resources/help.html';
	}
	
	//helpPopupWindow = popupWindow(	HelpURL, POPUP_HELP_NAME, 
	//								POPUP_HELP_WIDTH, POPUP_HELP_HEIGHT, 
	//								POPUP_HELP_MIN_WIDTH, POPUP_HELP_MIN_HEIGHT, 
	//								POPUP_HELP_CHROME_TYPE, POPUP_LOCATION_OPENER);
									
	helpPopupWindow = eBookViewer.popupResource(	HelpURL, POPUP_HELP_NAME, 
											POPUP_HELP_WIDTH, POPUP_HELP_HEIGHT, 
											POPUP_HELP_MIN_WIDTH, POPUP_HELP_MIN_HEIGHT, 
											POPUP_HELP_CHROME_TYPE
										);

} // Help


function CloseHelp() {
	if (helpPopupWindow && !helpPopupWindow.closed) {
		helpPopupWindow.close();
	}
}


function ClosePopups() {

	// close all open popups
    eBookViewer.closePopups();

} // ClosePopups


function CloseBook() {

	eBookViewer.close();

} // CloseBook


//  *** PAGE SIZE FUNCTIONS ***

function SetPageSize(pageSize) {

	eBookViewer.setPageSize(pageSize);

} // SetPageSize


function GetPageSize() {

	return eBookViewer.pageSize;

} // GetPageSize


function GetAudioOn() {

	return eBookViewer.pageAudioOn;

}


function GetCurrentFolio() {

	return eBookViewer.currentPage.folio.toString();

} // GetCurrentFolio

function GetUserState() {

	return eBookViewer.userState;

} // GetUserState


function GetCurrentPageCode() {

	return eBookViewer.currentPage.toPageCode();

} // GetCurrentPageCode


function GetBookStateAbbr() {
	return eBookViewer.userState;
} // GetBookStateAbbr


function SmallerPage() {

	eBookViewer.smallerPage();

}  // SmallerPage


function LargerPage() {

	eBookViewer.largerPage();

}  // LargerPage


function SetPageInfo(prevPage, nextPage, largerPage, smallerPage, bothPages, printPage, pageAudioTracks, stateSpecificAudio, leftPageType, rightPageType) {

	eBookViewer.setPageInfo(prevPage, nextPage, largerPage, smallerPage, bothPages, printPage, pageAudioTracks, stateSpecificAudio, leftPageType, rightPageType);
					
} // SetPageInfo


// *** AUDIO FUNCTIONS ***

function PlayPageTrack (pageTrack) {

	var audioPageCode = eBookViewer.eBook.getAudioPageCode(eBookViewer.currentPage);
	
	nav.PlayAudioTrack(audioPageCode, eBookViewer.pageAudioTracks, pageTrack);

} // PlayPageTrack


function StopPageTrack (pageTrack) {

	var audioPageCode = eBookViewer.eBook.getAudioPageCode(eBookViewer.currentPage);
	
	if (eBookViewer.pageAudioTracks != '') nav.CueAudioTrack(audioPageCode, eBookViewer.pageAudioTracks, pageTrack);

} // StopPageTrack


function ActivatePageTrack(pageTrack) {
	
	eBookViewer.pageAudioTrack = pageTrack;
	
	bookpage.ActivatePageTrack(pageTrack);
	
} // ActivatePageTrack


function DeactivatePageTrack(pageTrack) {

	eBookViewer.pageAudioTrack = 0;

	bookpage.DeactivatePageTrack(pageTrack);

} // DeactivatePageTrack


function FocusBeforeReadAloud() {
	if (nav.focus_before_read_aloud) {
		nav.focus_before_read_aloud.focus();
	} else if (nav.document.anchors["focus_before_read_aloud"]) {
		nav.document.anchors["focus_before_read_aloud"].focus();
	}
	
} // FocusBeforeReadAloud


function FocusAfterReadAloud() {
	if (bookpage.focus_after_read_aloud) {
		bookpage.focus_after_read_aloud.focus();
	} else if (bookpage.document.anchors["focus_after_read_aloud"]) {
		bookpage.document.anchors["focus_after_read_aloud"].focus();
	}
}


function CheckNavFrame() {

	// check that nav frame is loaded correctly (work around for Navigator reload)
	var regex = /audio_/;
	if (top.frames[0].location.href.search(regex) != -1) {
		top.frames[0].location.href = URL.getFullURL(window.location.href , "nav.html");
		top.frames[1].location.reload();
	}

}  // CheckNavFrame


// NAV_FUNCTIONALITY SCRIPT ENDS HERE