/**************************************
 * Displays and show the details view
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.displays.SeatDetails = function($domId) {
	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	this.build();
}
ndm.australian.qldlive.displays.SeatDetails.prototype.open = function() {
}
ndm.australian.qldlive.displays.SeatDetails.prototype.close = function() {
}
/**
 * Build
 */
ndm.australian.qldlive.displays.SeatDetails.prototype.build = function() {
	$(this.domId).addClass('setInfo');
	
}



ndm.australian.qldlive.displays.SeatDetails.prototype.showElectorate = function($electorate) {
	$(this.domId).removeClass('add');
	// electorate
	
	var electorateData = this.model.findElectorateByName($electorate);

	if(!electorateData) {
		if(!isNaN($electorate)) {
			electorateData = this.model.findElectorateByPostCode($electorate)
		} else {
			electorateData = this.model.findElectorateBySuburb($electorate)
		}
	}
	
	if(electorateData) {
		//
		var heldByParty = this.model.parties[electorateData.held_by.toUpperCase()]

		var output = '<h2>' + electorateData.name + '</h2><h4>Held by : <span style="color:' + heldByParty.colour + '">' + electorateData.held_by + '</span></h4>';
		var calledFor = electorateData.called_for.toUpperCase();
		if(calledFor != 'NA' && calledFor != '' && calledFor != null && calledFor.length == 3) {
			var calledForParty = this.model.parties[calledFor]
			output += '<h3 class="called">Called for  : <span style="color:' + calledForParty.colour + '">' + calledFor + '</span></h3>';
		}
		output += '<table><thead><tr><th class="candidate_th">Candidate</th><th class="votes_th">% Votes</th><th class="highlight swing_th">Swing</th></tr></thead><tbody>';
		if (electorateData.candidates){
			for(var i = 0; i < electorateData.candidates.length; i++) {
			var candidate = electorateData.candidates[i];
			var rowClass = '';
			if(i == electorateData.candidates.length - 1) {
				rowClass = 'last'
			}
			var colour = this.model.parties[candidate.party].colour
			var partyCode = (candidate.party.toUpperCase()=='ZZZ') ? 'IND' : candidate.party;
			output += '<tr class="' + rowClass + '"><td>' + candidate.ballotName + ' (' + partyCode + ')</td><td class="vote"><div class="votePercent" style="width:' + (candidate.primaryVotes.percentage * 50 / 100)  + 'px; background:' + colour + ';"></div> ' + candidate.primaryVotes.percentage + '%</td><td class="highlight">' + candidate.primaryVotes.percentage + '% </td><tr>';
			//output += '<tr class="' + rowClass + '"><td>' + candidate.ballotName + '</td><td><b style="color:' + colour + ';">' + partyCode + '</b></td><td class="vote"><div class="votePercent" style="width:' + candidate.primaryVotes.percentage + 'px; background:' + colour + ';"></div></td><td class="highlight">' + candidate.primaryVotes.percentage + '% </td><tr>';
		};
		}
		
		output += '</tbody></table><h3>Votes Counted: '+electorateData.percentage+'%</h3>';
		$(this.domId).html(output);
	}

}