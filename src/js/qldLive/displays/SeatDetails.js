/**************************************
 * Displays and show the details view
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.displays.SeatDetails = function($domId) {
	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	//this.build();
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
		cookieExt.createCookie('yourElectorate',electorateData.name,500);
		
		var heldByParty = this.model.parties[electorateData.held_by.toUpperCase()]

		var output = '<h2>' + electorateData.name + '</h2>';
		output += '<h4>Held by : <span style="color:' + heldByParty.colour + '">' + electorateData.held_by + '</span></h4>';
		//output += '<h4>' + electorateData.percentage + '% counted';
		//output += ' | Last update: ' + dateExt.formatDateToHours(electorateData.updated) + '</h4>';
		
		var calledFor = electorateData.called_for.toUpperCase();
		if(calledFor != 'NA' && calledFor != '' && calledFor != null) {
			var calledForParty = (this.model.parties[calledFor] === undefined) ? this.model.parties["ZZZ"] : this.model.parties[calledFor];
			output += '<h3 class="called">Called for : <span style="color:' + calledForParty.colour + '">' + calledFor + '</span></h3>';
		}
		output += '<table><thead><tr><th class="candidate_th">Candidate</th><th class="votes_th">% Votes</th><th class="highlight swing_th">Swing</th></tr></thead><tbody>';

		var orderedCandidates = {
			"ALP": {},
			"LP": {},
			"LNQ": {},
			"NP": {},
			"GRN": {},
			"IND": [],
			"ZZZ": []
		};

		for(var i = 0; i < electorateData.candidates.length; i++) {
			var candidate = electorateData.candidates[i],
				shortCode = partyShortCode(candidate.party);

			candidate.partyCode = shortCode;

			if (shortCode === "IND") {
				orderedCandidates['IND'].push(candidate);
			}
			else if (shortCode === "ZZZ") {
				orderedCandidates['ZZZ'].push(candidate);
			}
			else if (orderedCandidates[shortCode] !== undefined) {
				orderedCandidates[shortCode] = candidate;
			}
			else {
				
			}
		}

		for (var i in orderedCandidates) {
			var candidate = orderedCandidates[i];

			if (i !== "IND" && i !== "ZZZ" && candidate.hasOwnProperty('name')) {
				var colour = this.model.parties[partyShortCode(candidate.party)].colour;
				var partyCode = (candidate.partyCode.toUpperCase()=='ZZZ') ? 'IND' : candidate.party;

				output += '<tr><td><span class="candidatename">' + candidate.name + '</span>';
				output += (partyCode !== '') ? '<span class="partycode">(' + partyCode + ')</span>' : '';
				output += '</td><td class="vote"><div class="votePercent" style="width:' + (candidate.percentage * 50 / 100)  + 'px; background:' + colour + ';"></div> ' + formatNumber(candidate.percentage) + '%</td><td class="highlight">' + formatNumber(candidate.swing) + '% </td>';
				output += '</tr>';
			}
			else {
				if (candidate.hasOwnProperty('name')) {
					candidate = [candidate];
				}

				if (candidate.length > 0) {
					var percentage = 0;
					var swing = 0;

					for (var j = 0; j < candidate.length; j++) {
						percentage += candidate[j].percentage;
						swing += candidate[j].swing;
					}

					output += '<tr><td>';
					output += (i === "IND") ? "Independents" : "Other";
					output += '</td><td class="vote"><div class="votePercent" style="width:' + (percentage * 50 / 100)  + 'px; background:#999;"></div> ' + formatNumber(percentage) + '%</td><td class="highlight">' + formatNumber(swing) + '% </td>';
					output += '</tr>';
				}
			}
		};
		//output += '</tbody></table><h3>Votes Counted: '+electorateData.percentage+'%</h3>';
		output += '</tbody></table><h3>' + electorateData.percentage + '% counted';
		output += ' | Last update: ' + dateExt.formatDateToHours(electorateData.updated) + '</h3>';
		$(this.domId).html(output);
		// events
		var selfRef = this;
	}
}