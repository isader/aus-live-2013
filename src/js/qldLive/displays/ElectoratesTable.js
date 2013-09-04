/**************************************
 * Displays and show the details view
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.displays.ElectoratesTable = function($domId) {
	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	this.selectedElectorate
	this.sortOn = 'name';
	this.sortDirection = 'Down'
	this.selectedRow
	this.selectedKey
	this.ELECTORATE_SELECTED = 'electorateSelected';
	// Listen
	var selfRef = this;
	$(this.model).unbind(this.model.DISTRICTS_LOADED, true);
	$(this.model).bind(this.model.DISTRICTS_LOADED, function($event, $data) {
		selfRef.build();
	});
	this.model.requestDistricts();
}
ndm.australian.qldlive.displays.ElectoratesTable.prototype.open = function() {
	if(this.scrollAPI) {
		this.scrollAPI.reinitialise();
	} else {
		var pane = $(this.domId + ' .scrollarea')
		pane.jScrollPane();
		this.scrollAPI = pane.data('jsp');
	}

}
ndm.australian.qldlive.displays.ElectoratesTable.prototype.close = function() {
}
/**
 * Build
 */
ndm.australian.qldlive.displays.ElectoratesTable.prototype.build = function() {

	var output = '<div class="scrollarea"><table><thead><tr><th id="name" class="sort descending">Electorate<b></b></th><th id="percentage">Counted %<b></b></th><th id="enrolment">Enrolment <b></b></th><th id="held_by">Held by<b></b></th><th id="called_for" class="highlight">Called for<b></b></th></tr></thead><tbody>';
	output += '</tbody></table></div>';

	$(this.domId).html(output);
	this.buildResults();
	//
	// events
	var selfRef = this;
	$(this.domId + ' table thead tr th').each(function() {
		//var classNames
		var sortOn = $(this).attr('id')

		if(sortOn == selfRef.sortOn) {
			selfRef.selectedCol = this;
		}
		//
		$(this).click(function() {
		
			$(selfRef.domId + ' thead th#' + selfRef.sortOn).removeClass('sort')
			$(selfRef.domId + ' thead th#' + selfRef.sortOn).removeClass('ascending')
			$(selfRef.domId + ' thead th#' + selfRef.sortOn).removeClass('descending')

			if(sortOn == selfRef.sortOn) {
				// reverse the sort if col already selected
				selfRef.sortDirection = (selfRef.sortDirection == 'Down') ? 'Up' : 'Down'
			} else {
				selfRef.sortDirection = 'Down';
			}

			$(this).addClass('sort')
			if(selfRef.sortDirection == 'Down') {
				$(this).removeClass('ascending')
				$(this).addClass('descending')
			} else {
				$(this).addClass('ascending')
				$(this).removeClass('descending')
			}
			selfRef.sortOn = sortOn;
			selfRef.buildResults();

		})
	})
}

ndm.australian.qldlive.displays.ElectoratesTable.prototype.buildResults = function() {
	var output = '';
	var electorates = this.model.electorates;
	
	electorates.sort(tableExt.sortFunc(electorates, this.sortOn, this.sortDirection));
	for(var i = 0; i < electorates.length; i++) {
		var electorate = electorates[i];
		var heldByParty = this.model.parties[electorate.held_by.toUpperCase()];
		var calledForText = '';
		var calledForColor = '#fff';
		var calledFor = electorate.called_for;
		if(calledFor != 'NA' && calledFor != '' && calledFor != null && calledFor.length == 3) {
			var calledForParty = this.model.parties[calledFor];
			calledForText = (calledFor.toUpperCase()=='ZZZ') ? 'IND' : calledFor;
			calledForColor = calledForParty.colour;
		}
		var heldByPartyText = (electorate.held_by.toUpperCase()=='ZZZ') ? 'IND' : electorate.held_by.toUpperCase();
		var id = electorate.name.split(' ').join('-')
		
		output += '<tr id="' + id + '"><td>' + electorate.name + '</td><td>' + electorate.percentage + '%</td><td>' + electorate.enrolment + '</td><td><span style="color:' + heldByParty.colour + '">' +heldByPartyText + '</span></td><td><span style="color:' + calledForColor + '">' + calledForText + '</span></td></tr>';
	}
	$(this.domId + ' table tbody').html(output)
	var selfRef = this;
	$(this.domId + ' table tbody tr').each(function() {
		$(this).click(function() {
			var electorateName = $(this).attr('id').split('-').join(' ')
			$(selfRef).trigger(selfRef.ELECTORATE_SELECTED, electorateName);
		})
	})
}

ndm.australian.qldlive.displays.ElectoratesTable.prototype.selectElectorate = function($electorateName) {

	$(this.selectedElectorate).removeClass('selected');
	var id = $electorateName.split(' ').join('-')

	this.selectedElectorate = $(this.domId + ' table tbody tr#' + id)

	$(this.selectedElectorate).addClass('selected');
}