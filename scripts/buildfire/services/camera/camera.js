/**
 * Created by aymanhabeb on 16/4/17.
 */


if (typeof (buildfire) == 'undefined') throw ('please add buildfire.js first to use BuildFire services');

if (typeof (buildfire.services) == 'undefined') buildfire.services = {};

if (typeof (buildfire.services.camera) == 'undefined') buildfire.services.camera = {};

buildfire.services.camera.getPicture = function (options, callback) {
	if (!options) options = {};
	var onFrameUpdate = options.onFrameUpdate;
	delete options.onFrameUpdate;

	var frameListener;
	if (onFrameUpdate) {
		options.frameCaptureId = new Date().toISOString() + Math.random();
		frameListener = buildfire.eventManager.add('cameraFrameUpdate', function (data) {
			if (data && data.frameCaptureId === options.frameCaptureId) {
				onFrameUpdate(null, data.frame);
			}
		}, true);
	}

	if (options.overlayImageUrl || options.frameCaptureId) {
		options.forceCustomCamera = true;
	}

	if (options.forceCustomCamera) {
		var unsupportedKeys = ['sourceType', 'upload'];
		var invalidKeys = Object.keys(options).filter(function(key) { return unsupportedKeys.indexOf(key) > -1; });
		if (invalidKeys.length) {
			if (callback) return callback('Invalid options for custom camera: ' + invalidKeys.join(', ') + '. Only quality and destinationType are supported.');
			return;
		}
	}


	buildfire._sendPacket(new Packet(null, 'camera.getPicture', options), function(err, result) {
		if (frameListener) frameListener.clear();
		if (callback) callback(err, result);
	});
};

buildfire.services.camera.getVideo = function (options, callback) {
	if (!options) options = {};
	buildfire._sendPacket(new Packet(null, 'camera.getVideo', options), callback);
};

buildfire.services.camera.requestAuthorization = function (options, callback) {
	if (!callback) {
		throw 'callback function is mandatory';
	}
	buildfire._sendPacket(new Packet(null, 'camera.requestAuthorization', {}), callback);
};

buildfire.services.camera.isAuthorized = function (options, callback) {
	if (!callback) {
		throw 'callback function is mandatory';
	}
	buildfire._sendPacket(new Packet(null, 'camera.isAuthorized', {}), callback);
};

buildfire.services.camera.stopCustomCamera = function (options, callback) {
	if (!options) options = {};
	buildfire._sendPacket(new Packet(null, 'camera.stopCustomCamera', options), callback);
};

buildfire.services.camera.sendFrameFeedback = function (data) {
	buildfire._sendPacket(new Packet(null, 'camera.sendFrameFeedback', data));
};

buildfire.services.camera.triggerOnPictureFrame = function (data) {
	buildfire.eventManager.trigger('cameraFrameUpdate', data);
};
