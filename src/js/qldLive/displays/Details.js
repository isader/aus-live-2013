/**************************************
 * Displays and show the details view
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.displays.Details = function($domId) {

	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	// Add Loading
	$(this.domId).html('<img src="'+this.model.assetsURL+'img/ajax-loader.gif"  class="loadingAni"/>');
	
	// Listen
	var selfRef = this;
	$(this.model).bind(this.model.PARTIES_LOADED, function($event, $data) {
		selfRef.build();
	});
}

ndm.australian.qldlive.displays.Details.prototype.open = function() {
}
ndm.australian.qldlive.displays.Details.prototype.close = function() {
}

ndm.australian.qldlive.displays.Details.prototype.destroy = function() {
	$(this.model).unbind(this.model.ELECTION_RESULTS_LOADED, function($event, $data) {
		//selfRef.build();
	});
}
/**
 * Build
 */
ndm.australian.qldlive.displays.Details.prototype.build = function() {
	//var updatedDateStr = this.model.results.generationDateTime;
	//var date = updatedDateStr.split('T')[0].split('-');
	//var time = updatedDateStr.split('T')[1].split(':');;
	//var updatedDate = new Date(date[0],date[1],date[2],time[0],time[1],time[2])
	//var dateDifference = dateExt.dateDiiference(updatedDate, new Date());
	var timestamp = new Date(this.model.electionUpdated),
		hours = timestamp.getHours() + 1,
		minutes = timestamp.getMinutes(),
		ampm = (hours > 12) ? "PM" : "AM";

	hours = (hours > 12) ? hours - 12 : hours;
	
	var output = '<h2>DETAILS</h2><h3>' + this.model.electionVotePercentage + '% counted | Last update ' + hours + ':' + minutes + ampm + '</h3>';
	output += '<a href="javascript:" class="btn" id="allLink">View seat by seat results</a>';
	output += '<table><thead><tr><th>Party</th><th style="width:50px">% Vote</th><th colspan="2" class="highlight" style="width:170px">Swing</th><th>Gained</th><th>Lost</th><th>Held</th><th class="highlight">Total</th></tr></thead>';
 	var parties = this.model.parties;
 	var seatsAllocation = this.model.seatsAllocation;
	for(var i in parties) {
		var rowClass = '';
		if(i == parties.length-1) {
			rowClass = 'last'
		}
		var party = parties[i];
		var width = Math.abs(party.swing) * 60 / 15;
		var minusWidth = false;
		var swingBar = '<div class="swingbar" style="background:'+party.colour+'; width:'+width+'px;"></div>';

		if (party.swing < 0) {
			minusWidth = true;
		}
		
		output += '<tr class="' + rowClass + '"><td><b>' + party.name + '</b></td><td><b>'+ Math.round( party.percentage * 10 ) / 10+'%</b></td>';
		output += '<td class="highlight swing-first">';
		output += (minusWidth) ? swingBar : '';
		output += '</td>';
		output += '<td class="highlight swing-second">';
		output += (minusWidth) ? '' : swingBar;
		output += ' <span class="swing-value">' + formatNumber(party.swing) + '%</span></td><td>'+seatsAllocation[i].gained.length+'</td><td>'+seatsAllocation[i].lost.length+'</td><td>'+seatsAllocation[i].kept.length+'</td><td  class="highlight"><b>'+(seatsAllocation[i].called.length)+'</b></td></tr>';
	};
	output += '</table>';
	$(this.domId).html(output);
	// events
	var selfRef = this;
	$(this.domId + ' #allLink').click(function(){
		$(selfRef).trigger('switchView','electorates');
	});
}