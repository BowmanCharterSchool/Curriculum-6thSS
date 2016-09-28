var stopAudioURL = '../../html/audio/audio_blank.html';
var playAudioURL = '../../html/audio/audio_controller.html';

function PlayAudioTrack (pageAudioTrack) {

	audioTrack = pageAudioTrack;
	audiocontroller.location = playAudioURL;

} // PlayAudioTrack


function StopAudioTrack (audioTrack) {

	audiocontroller.location = stopAudioURL;

} // StopPageTrack


function AudioStopped() {

	StopAudioButton();

} // AudioStopped

function StopAudioButton() {

	document['audio' + audioTrack].src = "../../graphics/audio/audioicon.gif";

} // StopAudioButton

function ToggleAudioTrack(audioTrack) {

	if (document['audio' + audioTrack].src.indexOf("-active") == -1)  {
		for (otherAudioTrack=1; otherAudioTrack<=numTracks; otherAudioTrack++) {
			document['audio' + otherAudioTrack].src = "../../graphics/audio/audioicon.gif";
		}
		PlayAudioTrack(audioTrack);
		document['audio' + audioTrack].src = "../../graphics/audio/audioicon-active.gif";
	} else {
		StopAudioTrack(audioTrack);
		document['audio' + audioTrack].src = "../../graphics/audio/audioicon.gif";
	}

} // ToggleAudioTrack


function LightAudioButton(ImageObject) {

	if (ImageObject.src.indexOf("-active") < 0) {
		document[ImageObject.name].src = "../../graphics/audio/audioicon-lit.gif";
	} else {
		document[ImageObject.name].src = "../../graphics/audio/audioicon-active-lit.gif";
	}

} // LightAudioButton

function UnlightAudioButton(ImageObject) {

	if (ImageObject.src.indexOf("-active") < 0) {
		document[ImageObject.name].src = "../../graphics/audio/audioicon.gif";
	} else {
		document[ImageObject.name].src = "../../graphics/audio/audioicon-active.gif";
	}

} // UnlightAudioButton


function revealAnswers() {

	document.getElementById("answers").style.display="block";
	document.getElementById("reveallink").style.display="none";
	window.scrollTo(0,document.getElementById("reveallink").offsetTop);

}  // revealAnswers
