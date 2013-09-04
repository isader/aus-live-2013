var ndm = ndm || {};
ndm.australian = ndm.australian || {};
ndm.australian.qldlive = ndm.australian.qldlive || {};
/**************************************
 * The Quiz Live App
 * Sets up and starts the application
 ************************************/
ndm.australian.qldlive.MinBar = function($domId) {
	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	// Load SETTINGS
	var selfRef = this;
	$(this.model).unbind(this.model.SETTINGS_LOADED, true);
	$(this.model).bind(this.model.SETTINGS_LOADED, function($event, $data) {
		$(selfRef.model).unbind(selfRef.model.SETTINGS_LOADED, true);
		selfRef.model.requestElectorates();
	});
	// Electorates Loaded
	$(this.model).unbind(this.model.ELECTORATES_LOADED, true);
	$(this.model).bind(this.model.ELECTORATES_LOADED, function($event, $data) {
		$(selfRef.model).unbind(selfRef.model.ELECTORATES_LOADED, true);
		selfRef.update();
	});
	// Request
	this.model.requestSettings();
}

ndm.australian.qldlive.MinBar.prototype.update = function() {
	// update title
	$(this.domId + ' .infobar h4').html(this.model.settings.title)
	//
	var parties = [];
	parties.push({
		code : 'ALP',
		name : 'Labor',
		seatsWon : this.model.calledCount['ALP'].length,
		image : 'anna_bligh_small.jpg'
	});
	parties.push({
		code : 'LNP',
		name : 'LNP',
		seatsWon : this.model.calledCount['LNP'].length,
		image : 'campbell_newman_small.jpg'
	});
	var output = '';
	for(var i = 0; i < parties.length; i++) {
		var party = parties[i];
		output += '<div class="' + party.code + '"><h3>' + party.name + ': ' + party.seatsWon + '</h3></div>';
	};
	output += '<div class="clear"></div>';
	var totalWidth = 490
	var oneSeatWidth = totalWidth / this.model.electorates.length;
	for( i = 0; i < parties.length; i++) {
		var party = parties[i];
		var style = 'width:' + Math.floor(party.seatsWon * oneSeatWidth) + 'px; '
		if(i == 1) {
			var leftOverSeats = (this.model.electorates.length - party.seatsWon)
			if(leftOverSeats > 0) {
				style += 'left:' + ((leftOverSeats * oneSeatWidth) + 80) + 'px; '
			}
		}
		output += '<div class="partyBar ' + party.code + '" style="' + style + '"></div>';

	}
	$(this.domId + ' .parties').html(output);

}