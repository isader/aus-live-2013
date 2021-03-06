/**************************************
 * Displays and show the details view
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.displays.ResultsBar = function($domId) {
	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	var selfRef = this;
	$(this.model).unbind(this.model.ELECTORATES_LOADED, true);
	$(this.model).bind(this.model.ELECTORATES_LOADED, function($event, $data) {
		selfRef.build();
	});
	
}
ndm.australian.qldlive.displays.ResultsBar.prototype.open = function() {
	
	this.build();
}
ndm.australian.qldlive.displays.ResultsBar.prototype.close = function() {
}
/**
 * Build
 */
ndm.australian.qldlive.displays.ResultsBar.prototype.build = function() {
	var output = '<h2>Results at a glance</h2>';
	var parties = [];
	parties.push({
		code : 'ALP',
		name : 'Labor',
		seatsWon : this.model.seatsAllocation['ALP'].called.length,
		image : 'keven_rudd_small.jpg'
	});
	parties.push({
		code : 'LNP',
		name : 'Coalition',
		seatsWon : this.model.seatsAllocation['LNP'].called.length,
		image : 'tony_abbott_small.jpg'
	});
	output += '<div class="parties">';
	for(var i = 0; i < parties.length; i++) {
		var party = parties[i];
		output += '<div class="' + party.code + '"><img src="'+this.model.assetsURL+'img/' + party.image + '"/><h3>' + party.name + ': ' + party.seatsWon + '</h3></div>';

	};
	output += '<div class="clear"></div>';
	var totalWidth = 985 - 220 - 130;
	var oneSeatWidth = totalWidth / this.model.electorates.length;
	
	
	for( i = 0; i < parties.length; i++) {
		var party = parties[i];
		
		
		var style = 'width:' + Math.floor(party.seatsWon * oneSeatWidth) + 'px; '
		if(i == 1) {
			var leftOverSeats = (this.model.electorates.length - party.seatsWon)
			
			if(leftOverSeats > 0) {
				//style += 'left:' + ((leftOverSeats * oneSeatWidth) + 60) + 'px; '
			}

		}
		output += '<div class="partyBar ' + party.code + '" style="' + style + '"></div>';
		
	}
		$(this.domId).html(output);
	
}