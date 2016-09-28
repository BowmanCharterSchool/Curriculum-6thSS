var d,n,nav,nan,nua,mac,op,saf,cam,omni,konq,moz,ie,str_pos,nu;
var osx=false;
d=document;
n=navigator;
nav=n.appVersion.toLowerCase();
nan=n.appName.toLowerCase();
nua=n.userAgent.toLowerCase();
mac=(nav.indexOf('mac')!=-1);
if(mac){
	op=(nua.indexOf('opera')!=-1);
	saf=(nua.indexOf('safari')!=-1);
	cam =(nua.indexOf('camino')!=-1);
	omni = (nua.indexOf('omniweb')!=-1);
	konq=(!saf && (nua.indexOf('konqueror')!=-1) ) ? true : false;
	moz=( (!saf && !konq && !omni) && ( nua.indexOf('gecko')!=-1 ) ) ? true : false;
	ie=((nua.indexOf('msie')!=-1)&&!op);
	if (op){
		str_pos=nua.indexOf('opera');
		nu=nua.substr((str_pos+6),4);
	} else if (saf){
		str_pos=nua.indexOf('safari');
		nu=nua.substr((str_pos+7),5);
	} else if (ie){
		str_pos=nua.indexOf('msie');
		nu=nua.substr((str_pos+5),3);
	} else if (moz){
		var pattern = /[(); \n]/;
		// moz type array, add to this if you need to
		var moz_types = new Array( 'firebird', 'phoenix', 'firefox', 'galeon', 'k-meleon', 'camino', 'epiphany', 'netscape6', 'netscape', 'multizilla', 'gecko debian', 'rv' );
		var rv_pos = nua.indexOf( 'rv' );// find 'rv' position in nua string
		var rv_full = nua.substr( rv_pos + 3, 6 );// cut out maximum size it can be, eg: 1.8a2, 1.0.0 etc
		// search for occurance of any of characters in pattern, if found get position of that character
		var rv_slice = ( rv_full.search( pattern ) != -1 ) ? rv_full.search( pattern ) : '';
		//check to make sure there was a result, if not do  nothing
		// otherwise slice out the part that you want if there is a slice position
		( rv_slice ) ? rv_full = rv_full.substr( 0, rv_slice ) : '';
		// this is the working id number, 3 digits, you'd use this for 
		// number comparison, like if nu >= 1.3 do something
		nu = rv_full.substr(0, 3);
	} else {
		nu = nav.substring(0,1);
	}
	
	if ( saf || omni || cam || (moz && (nu >= 1.3)) || (ie && (nu >= 5.2)) ){
		osx = true;
	}
}
