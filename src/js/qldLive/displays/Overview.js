/**************************************
 * Displays and show the live updates panel
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.displays.Overview = function($domId) {
	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	this.build();
	//this.update();
	//$(selfRef).triggerHandler(selfRef.ELECTORATES_LOADED, selfRef.electorates);
	var selfRef = this;
	$(this.model).unbind(this.model.SETTINGS_LOADED, true);
	$(this.model).bind(this.model.SETTINGS_LOADED, function($event, $data) {
		selfRef.build();
	});
	$(this.model).unbind(this.model.ELECTORATES_LOADED, true);
	$(this.model).bind(this.model.ELECTORATES_LOADED, function($event, $data) {
		selfRef.build();
	});
}

ndm.australian.qldlive.displays.Overview.prototype.open = function() {
}
ndm.australian.qldlive.displays.Overview.prototype.close = function() {
}
/**
 * Build the overview panel
 */
ndm.australian.qldlive.displays.Overview.prototype.build = function() {
	var output = '<div class="seatTip"></div><h2>' + this.model.settings.title + '</h2><div>';

	var parties = [];
	parties.push({
		code : 'ALP',
		name : 'Labor',
		seatsWon : this.model.seatsAllocation['ALP'].called,
		image : 'keven_rudd.jpg',
		colour: '#ef5b46',
		lastWon: ''
	});
	parties.push({
		code : 'LNP',
		name : 'Coalition',
		seatsWon : this.model.seatsAllocation['LNP'].called,
		image : 'tony_abbot.jpg',
		colour: '#146eaf',
		lastWon: ''
	});
	parties.push({
		code : 'GRN',
		name : 'Greens',
		seatsWon : this.model.seatsAllocation['GRN'].called,
		image : '',
		colour: '#a2ce4d'
	});
	parties.push({
		code : 'ZZZ',
		name : 'Other',
		seatsWon : this.model.seatsAllocation['ZZZ'].called,
		image : '',
		colour: '#676767'
	});
	output += '<div class="parties">';
	for(var i = 0; i < parties.length; i++) {
		var party = parties[i];
		output += '<div class="party ' + party.code + '"><img src="' + this.model.assetsURL + 'img/' + party.image + '"/><div class="seats"><h3>' + party.name + ': <em>' + party.seatsWon.length + '</em></h3>';
		output += (party.lastWon !== '') ? '<h4>Latest Seat Won: ' + party.lastWon + '</h4>' : '';
		var r = party.seatsWon.length - 1;
		while(r >= 0) {

			var seat = party.seatsWon[r]
			var id = seat.name.split(' ').join('-')
			output += '<div style="background-color:' + party.colour + '" class="seat" id="' + id + '"></div>'
			r--;
		};
		output += '<em class="seats-won" style="color:' + party.colour +'">' + party.seatsWon.length + '</em>';
		output += '</div></div>';
	};
	output += '</div>';

	var s = this.model.seatsAllocation['NOT'].called.length;
	output += '<div class="seats-left-container"><em>' + s + ' still to be decided</em><div class="seats-left">';
	while(s >= 0) {

		output += '<div style="background-color:#4d6f7e" class="seat"></div>';
		s--;
	};

	output += '</div></div>';

	$(this.domId).html(output);
	// events
	var selfRef = this;
	$(this.domId + ' .parties .party .seat').each(function() {
		$(this).click(function() {
			var electorateName = $(this).attr('id').split('-').join(' ')
			//$(selfRef).trigger(selfRef.ELECTORATE_SELECTED, electorateName);
			$(selfRef).trigger('switchView', ['electorates', electorateName]);
		})
		$(this).mouseover(function() {

			var electorateName = $(this).attr('id').split('-').join(' ')
			var electorateData = selfRef.model.findElectorateByName(electorateName);
			var output = '<h3>' + electorateName + '</h3>'
			$(selfRef.domId + ' .seatTip').html(output)
			var parentOffset = $('#qldElectionsLive').offset();
			var offset = $(this).offset();
			$(selfRef.domId + ' .seatTip').css('left', (offset.left - 40 - parentOffset.left) + 'px')
			$(selfRef.domId + ' .seatTip').css('top', (offset.top - 80 - parentOffset.top) + 'px')
			$(selfRef.domId + ' .seatTip').show();
		})
		$(this).mouseout(function() {
			$(selfRef.domId + ' .seatTip').hide();
		})
	})
}