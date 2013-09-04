/**************************************
 * Manages views for the All LiveVideo results tab
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.views.LiveVideo = function($domId) {
	this.domId = $domId;
	this.build();
}
ndm.australian.qldlive.views.LiveVideo.prototype = new ndm.australian.qldlive.views.View();

/**
 * Called when the view is added to the page
 */
ndm.australian.qldlive.views.LiveVideo.prototype.openView = function() {
	$(this.domId + ' .video').html('<iframe src="' + this.model.settings.skyVideoUrl + '" width="650px" height="404px" scrolling="no" border="0"></iframe>')
}
/**
 * Called when the view is remove from the page
 */
ndm.australian.qldlive.views.LiveVideo.prototype.closeView = function() {
	$(this.domId + ' .video').html('')
}
/**
 * Build
 * The required data has been loaded build the app structure
 */
ndm.australian.qldlive.views.LiveVideo.prototype.build = function() {
	var output = '<div class="topRow"><div class="video"></div>';
	if(this.model.settings.enableTwitter) {
		output += '<div class="liveUpdates videoUpdates"></div>';
	}
	output += '<div class="clear"></div></div>';
	output += '<div class="bottomRow"><div class="atAGlance"></div></div>';
	$(this.domId).html(output);
	if(this.model.settings.enableTwitter) {
		this.addView(new ndm.australian.qldlive.displays.LiveUpdates(this.domId + ' .videoUpdates',true));
	}
	this.addView(new ndm.australian.qldlive.displays.ResultsBar(this.domId + ' .atAGlance'));
}