//frames: [{}]
var Whammy = (function(){
	function toWebM(){

	}

	// here is something else taken from weppy more or less unharmed

	function generateEBML(json){
		var ebml = '';
		for(var i = 0; i < json.length; i++){
			var data = json[i].data;

			if(typeof data == 'object') data = generateEBML(data);

			var len = data.length;
			var zeroes = Math.ceil(Math.ceil(Math.log(len)/Math.log(2))/8);
			var size_str = len.toString(2);
			var padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join('0') + size_str;
			var size = (new Array(zeroes)).join('0') + '1' + padded;

			var element = '';
			element += toBinStr(parseInt(json[i].hex, 16).toString(2));
			element += toBinStr(size);

			element += data;
			ebml += element;

		}
		return ebml;
	}
	//woot, a function that's actually written for this project!
	//this parses some json markup and makes it into that binary magic
	//which can then get shoved into the matroska comtainer (peaceably)

	function makeSimpleBlock(data){
		var flags = 0;
		if (data.keyframe) flags |= 128;
		if (data.invisible) flags |= 8;
		if (data.lacing) flags |= (data.lacing << 1);
		if (data.discardable) flags |= 1;
		if (data.trackNum > 127) {
			throw "TrackNumber > 127 not supported";
		}
		var out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(function(e){
			return String.fromCharCode(e)
		}).join('') + data.frame;

		return out;
	}

	// here's something else taken verbatim from weppy, awesome rite?

	function parseWebP(riff){
		var VP8 = riff.RIFF[0].WEBP[0];
		
		var frame_start = VP8.indexOf('\x9d\x01\x2a'); //A VP8 keyframe starts with the 0x9d012a header
		for(var i = 0, c = []; i < 4; i++) c[i] = VP8.charCodeAt(frame_start + 3 + i);
		
		var width, horizontal_scale, height, vertical_scale, tmp;
		
		//the code below is literally copied verbatim from the bitstream spec
		tmp = (c[1] << 8) | c[0];
		width = tmp & 0x3FFF;
		horizontal_scale = tmp >> 14;
		tmp = (c[3] << 8) | c[2];
		height = tmp & 0x3FFF;
		vertical_scale = tmp >> 14;
		return {
			width: width,
			height: height,
			data: VP8,
			riff: riff
		}
	}

	// i think i'm going off on a riff by pretending this is some known
	// idiom which i'm making a casual and brilliant pun about, but since
	// i can't find anything on google which conforms to this idiomatic
	// usage, I'm assuming this is just a consequence of some psychotic
	// break which makes me make up puns. well, enough riff-raff (aha a
	// rescue of sorts), this function was ripped wholesale from weppy

	function parseRIFF(string){
		var offset = 0;
		var chunks = {};
		
		while (offset < string.length) {
			var id = string.substr(offset, 4);
			var len = parseInt(string.substr(offset + 4, 4).split('').map(function(i){
				var unpadded = i.charCodeAt(0).toString(2);
				return (new Array(8 - unpadded.length + 1)).join('0') + unpadded
			}).join(''),2);
			var data = string.substr(offset + 4 + 4, len);
			offset += 4 + 4 + len;
			chunks[id] = chunks[id] || [];
			
			if (id == 'RIFF' || id == 'LIST') {
				chunks[id].push(parseRIFF(data));
			} else {
				chunks[id].push(data);
			}
		}
		return chunks;
	}

	// here's a little utility function that acts as a utility for other functions
	// basically, the only purpose is for encoding "Duration", which is encoded as
	// a double (considerably more difficult to encode than an integer)
	function doubleToString(num){
		return [].slice.call(
			new Uint8Array(
				(
					new Float64Array([num]) //create a float64 array
				).buffer) //extract the array buffer
			, 0) // convert the Uint8Array into a regular array
			.map(function(e){ //since it's a regular array, we can now use map
				return String.fromCharCode(e) // encode all the bytes individually
			})
			.reverse() //correct the byte endianness (assume it's little endian for now)
			.join('') // join the bytes in holy matrimony as a string
	}

	function WhammyVideo(){ // a more abstract-ish API
		this.frames = [];
	}

	return {
		Video: WhammyVideo
		// expose methods of madness
	}
})()

/*
	var vid = new Whammy.Video();
	vid.add(canvas or data url)
	vid.compile()
*/