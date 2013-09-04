/**************************************
 * Manages views for the All Electorates results tab
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.views.Electorates = function($domId,$electorate) {
	this.domId = $domId;
	this.build();
	
	
}
ndm.australian.qldlive.views.Electorates.prototype = new ndm.australian.qldlive.views.View();


/**
 * Called when the view is added to the page
 */
ndm.australian.qldlive.views.Electorates.prototype.openView = function($electorate) {
	if ($electorate!=null){
		this.selectElectorate($electorate)
	} else {
		this.selectElectorate(this.model.electorates[0].name)
	}
}
/**
 * Called when the view is remove from the page
 */
ndm.australian.qldlive.views.Electorates.prototype.closeView = function() {

}
/**
 * Build
 * The required data has been loaded build the app structure
 */
ndm.australian.qldlive.views.Electorates.prototype.build = function() {
	var output = '<div class="topRow"><div class="list"></div><div class="seatDetails"></div><div class="clear"></div></div>';
	output += '<div class="bottomRow"><div class="atAGlance"></div></div>';
	$(this.domId).html(output);
	this.list = this.addView(new ndm.australian.qldlive.displays.ElectoratesTable('.list'));
	this.seatDetails = this.addView(new ndm.australian.qldlive.displays.SeatDetails('.seatDetails'));
	this.addView(new ndm.australian.qldlive.displays.ResultsBar('.atAGlance'));
	//
	var selfRef = this;
	$(this.list).bind(this.list.ELECTORATE_SELECTED,function($evnet,$electorate){
		selfRef.selectElectorate($electorate);
	})
}
/**
 * Build
 * The required data has been loaded build the app structure
 */
ndm.australian.qldlive.views.Electorates.prototype.selectElectorate = function($electorate) {
	
	this.list.selectElectorate($electorate)
	this.seatDetails.showElectorate($electorate)
}

