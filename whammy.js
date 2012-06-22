/*
	This is an ostensibly simple API for a sort of video encoder.
	Essentially the usage is this:

	var ponies = new VideoEncoder(12) //the argument is the framerate
	ponies.addFrame(rainbowDash);
	ponies.addFrame(rarity);
	ponies.addFrame(flutterShy);
	ponies.addFrame(pinkiePie);
	ponies.addFrame(appleJack);
	showAndTell.src = ponies.encode('bloburl'); //acceptable arguments include bloburl, dataurl, blob and string
	showAndTell.play();
*/


function VideoEncoder(rate /*Framerate*/){
	this.rate = rate;
}

VideoEncoder.prototype.addFrame = function(frame){

}

VideoEncoder.prototype.encode = function(){

}


/webp/.test(document.createElement('canvas').toDataURL('image/webp')) //test to see if exporting a canvas as webp works