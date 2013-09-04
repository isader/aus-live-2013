/**************************************
 * Manages views for the Latest results tab
 @param $domId the html element to create the appliction in
 ************************************/
ndm.australian.qldlive.views.Latest = function($domId) {
	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	this.build();
}
ndm.australian.qldlive.views.Latest.prototype = new ndm.australian.qldlive.views.View();


/**
 * Called when the view is added to the page
 */
ndm.australian.qldlive.views.Latest.prototype.openView = function() {

}
/**
 * Called when the view is remove from the page
 */
ndm.australian.qldlive.views.Latest.prototype.closeView = function() {

}
/**
 * Build
 * The required data has been loaded build the app structure
 */
ndm.australian.qldlive.views.Latest.prototype.build = function() {
	var selfRef = this;
	this.displays = [];
	var output = '<div class="topRow"><div class="overview"></div>'
	if(this.model.settings.enableTwitter) {
		output += '<div class="liveUpdates"></div>';

	}
	output += '<div class="clear"></div></div>';
	if(this.model.settings.enableLiveFeed) {
		output += '<div class="bottomRow"><div class="details"></div><div class="yourseat"></div><div class="clear"></div></div>';
	}
	$(this.domId).html(output);
		this.addView(new ndm.australian.qldlive.displays.Overview('.overview'))
	if(this.model.settings.enableTwitter) {
		this.addView(new ndm.australian.qldlive.displays.LiveUpdates(this.domId + ' .liveUpdates'));
	}
	if(this.model.settings.enableLiveFeed) {
		this.addView(new ndm.australian.qldlive.displays.Details('.details'));
		this.addView(new ndm.australian.qldlive.displays.YourSeat('.yourseat'));
		
	}
}
