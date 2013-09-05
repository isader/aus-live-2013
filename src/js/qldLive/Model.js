/**************************************
 * The Live Results Model
 * Manages the data
 ************************************/
ndm.australian.qldlive.Model = function() {
	// variables
	this.dataAPIURL = 'http://api.news.com.au/mm/dataset/'
	this.assetsURL = ''
	this.settings
	this.settingsLoading = false;
	this.settings
	this.settingsLoading = false;
	this.electorates
	this.electoratesLoading = false;
	this.results
	this.resultsLoading = false;
	this.lastResults
	this.lastResultsLoading = false;
	this.calledCount = {};
	this.partiesList
	this.partiesLoading = false;
	this.districts
	this.districtsLoading = false;
	// update times
	this.reloadNewsFeedIn = 1000 * 60 * 3;
	this.reloadSettingsIn = 1000 * 60 * 5;
	this.reloadElectoratesIn = 1000 * 60 * 5;
	this.reloadResultsIn = 1000 * 60 * 5;
	this.searchList = [];
	// events
	this.ERROR = 'error';
	this.NEWS_FEED_LOADED = 'newsFeedLoaded';
	this.SETTINGS_LOADED = 'settingsLoaded';
	this.ELECTORATES_LOADED = 'electoratesLoaded'
	this.LAST_ELECTION_RESULTS_LOADED = 'lastResultsLoaded'
	this.ELECTION_RESULTS_LOADED = 'resultsLoaded'
	this.PARTIES_LOADED = 'partiesLoaded'
	this.DISTRICTS_LOADED = 'districtsLoaded'

	this.electionUpdated = "";
	this.electionVotePercentage = 0;
	// parties
	this.parties = {}
	this.parties['ALP'] = {
		name : 'Australian Labor Party',
		colour : '#ef5b46',
		percentage : 0,
		swing : 0,
		lastPercentage : 0,
		lastCount : 0,
		declaredFor : 0,
		won2012 : 0
	};
	this.parties['LP'] = {
		name : 'Liberal Party',
		colour : '#277e9c',
		percentage : 0,
		swing : 0,
		lastPercentage : 0,
		lastCount : 0,
		declaredFor : 0,
		won2012 : 0
	};
	this.parties['LNQ'] = {
		name : 'Liberal National Party of Queensland',
		colour : '#277e9c',
		percentage : 0,
		swing : 0,
		lastPercentage : 0,
		lastCount : 0,
		declaredFor : 0,
		won2012 : 0
	};
	this.parties['GRN'] = {
		name : "The Greens",
		colour : '#8da13e',
		percentage : 0,
		swing : 0,
		lastPercentage : 0,
		lastCount : 0,
		declaredFor : 0,
		won2012 : 0
	};
	this.parties['NP'] = {
		name : 'The Nationals',
		colour : '#277e9c',
		percentage : 0,
		swing : 0,
		lastPercentage : 0,
		lastCount : 0,
		declaredFor : 0,
		won2012 : 0
	};
	this.parties['ZZZ'] = {
		name : 'Other',
		colour : '#999999',
		percentage : 0,
		swing : 0,
		lastPercentage : 0,
		lastCount : 0,
		declaredFor : 0,
		won2012 : 0
	};
	this.parties['IND'] = {
		name : 'Independents',
		colour : '#999999',
		percentage : 0,
		swing : 0,
		lastPercentage : 0,
		lastCount : 0,
		declaredFor : 0,
		won2012 : 0
	};

	// make singleton
	if(arguments.callee._singletonInstance)
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;
}
/**************************************
 * Their has been a error loading the data
 ************************************/
ndm.australian.qldlive.Model.prototype.loadError = function($message) {
	console.log('loadError: ' + $message)
	$(this).triggerHandler(this.ERROR, [$message]);
}
/**************************************
 * Load App Settings
 ************************************/
ndm.australian.qldlive.Model.prototype.requestSettings = function($refresh) {
	if(this.settingsLoading) {
		// the settings are in the process of loading do nothing
	} else if(this.settings != null && $refresh != true) {
		// the settings HAVE been loaded and we do NOT wish to refresh them
		$(this).triggerHandler(this.SETTINGS_LOADED, this.settings);
	} else {
		// the settings have NOT been loaded OR we wish to refresh them
		this.settingsLoading = true;
		var selfRef = this;
		$.ajax({
			url : this.assetsURL + 'json/election-settings.json',//this.dataAPIURL + 'TAUS_qld_election_settings/select',
			dataType : "json",
			data : {
				format : "json",
				args : {
					count : 1
				}
			},
			success : function(data) {
				selfRef.settingsLoading = false;
				selfRef.settings = {}
				selfRef.settings.title = data.items[0].title;
				selfRef.settings.labourHeading = data.items[0].labour_heading;
				selfRef.settings.liberalHeading = data.items[0].liberal_heading;
				//
				selfRef.settings.enableLiveFeed = (data.items[0].enable_live_results.toLowerCase() == 'yes') ? true : false;
				selfRef.settings.liveFeedURL = data.items[0].live_results_url
				//
				selfRef.settings.twitterAccount = data.items[0].twitter_account
				selfRef.settings.enableTwitter = (data.items[0].enable_twitter.toLowerCase() == 'yes') ? true : false;
				//

				selfRef.settings.fullCoverageUrl = data.items[0].full_coverage_url
				//
				selfRef.settings.skyVideoUrl = data.items[0].sky_video_url
				selfRef.settings.enableSkyVideo = (data.items[0].enable_sky_video.toLowerCase() == 'yes') ? true : false;
				//
				$(selfRef).triggerHandler(selfRef.SETTINGS_LOADED, selfRef.settings);
				// will reload the news feed in a set amount of time
				selfRef.reloadSettings = setTimeout(function() {
					selfRef.requestSettings(true)
				}, selfRef.reloadSettingsIn);
			},
			error : function(data) {
				selfRef.loadError('The settings feed failed to load')
			}
		});
	}
}
/**************************************
 * Load Electorates Settings
 ************************************/
ndm.australian.qldlive.Model.prototype.requestElectorates = function($refresh) {

	if(this.electoratesLoading) {
		// the electorates are in the process of loading do nothing
	} else if(this.electorates != null && $refresh != true) {
		// the electorates HAVE been loaded and we do NOT wish to refresh them
		$(this).triggerHandler(this.ELECTORATES_LOADED, this.electorates);
	} else {
		// the electorates have NOT been loaded OR we wish to refresh them
		this.electoratesLoading = true;
		var selfRef = this;
		var searchTerms = [];
		$.ajax({
			url : this.assetsURL + 'json/federal-electorates-live.json',//this.dataAPIURL + 'TAUS_qld_elections_electorates/select',
			dataType : "json",
			data : {
				format : "json",
				args : {
					count : 100
				}
			},
			success : function(data) {
				selfRef.electoratesLoading = false;
				// the joined data if it existeds
				if(selfRef.electorates) {
					for(var i = 0; i < data.items.length; i++) {
						var electorate = data.items[i];
						var oldElectorate = selfRef.electorates[i]
						if(oldElectorate.percentage != null) {
							electorate.percentage = oldElectorate.percentage;
							electorate.count = oldElectorate.count;
							electorate.enrolment = oldElectorate.enrolment
							electorate.percentage = oldElectorate.percentage
							electorate.candidates = oldElectorate.candidates;
						}
					};
				}
				selfRef.electorates = data.items;
				selfRef.calledCount = {}
				selfRef.calledCount['ALP'] = [];
				selfRef.calledCount['LNP'] = [];
				selfRef.calledCount['LP'] = [];
				selfRef.calledCount['NP'] = [];
				selfRef.calledCount['LNQ'] = [];
				selfRef.calledCount['GRN'] = [];
				selfRef.calledCount['ZZZ'] = [];
				selfRef.calledCount['IND'] = [];
				selfRef.calledCount['NOT'] = [];
				
				selfRef.seatsAllocation = {
					"ALP": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"LNP": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"LP": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"NP": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"NP": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"LNQ": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"GRN": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"ZZZ": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"IND": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					},
					"NOT": {
						"called":[], "held":[], "kept":[], "gained":[], "lost":[]
					}
				};

				// format results from the returned electorate data
				var i = selfRef.electorates.length - 1;
				while(i >= 0) {
					var electorate = selfRef.electorates[i];
					i--;



					var suburbs = electorate.suburbs.split(',');
					var postCodes = electorate.postcodes.split(', ');
					var state = findState(postCodes[0]);

					electorate.state = state;
					searchTerms.push({
						name: electorate.name.toProperCase(),
						state: electorate.state.toProperCase(),
						suburb: "",
						postcode: "",
						type: "Electorate"
					});

					var p = suburbs.length - 1;

					if (suburbs.length !== postCodes.length) {
						p = (suburbs.length < postCodes.length) ? suburbs.length - 1 : postCodes.length - 1;
					}
					while(p >= 0) {
						var sub = (suburbs[p] !== null) ? suburbs[p].toProperCase() : "";
						var postcode = (postCodes[p] !== null) ? postCodes[p] : "";

						searchTerms.push({
							name: electorate.name.toProperCase(),
							state: electorate.state.toProperCase(),
							suburb: sub,
							postcode: postcode,
							type: "Suburb"
						});
						p--;
					}

					// Add the seat to the party who won it last election
					// if Called add to the count for the winning party
					var calledFor = $.trim(electorate.called_for.toUpperCase());
					if(calledFor != 'NA' && calledFor != '' && calledFor != null) {
						if (calledFor === "LP" || calledFor === "NP" || calledFor === "LNQ") {
							selfRef.seatsAllocation['LNP'].called.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}

						if (selfRef.seatsAllocation[calledFor] !== undefined) {
							selfRef.seatsAllocation[calledFor].called.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}
						else {
							selfRef.seatsAllocation['ZZZ'].called.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}

					}
					else {
						selfRef.seatsAllocation['NOT'].called.push({
							id : electorate.seatCode,
							name : electorate.name
						});
					}

					var heldBy = $.trim(electorate.held_by.toUpperCase());
					if(heldBy != 'NA' && heldBy != '' && heldBy != null) {
						if (heldBy === "LP" || heldBy === "NP" || heldBy === "LNQ") {
							selfRef.seatsAllocation['LNP'].held.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}

						if (selfRef.seatsAllocation[heldBy] !== undefined) {
							selfRef.seatsAllocation[heldBy].held.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}
						else {
							selfRef.seatsAllocation['ZZZ'].held.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}
					}

					if (heldBy === calledFor) {
						if (selfRef.seatsAllocation[calledFor] !== undefined) {
							selfRef.seatsAllocation[calledFor].kept.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}
						else {
							selfRef.seatsAllocation['ZZZ'].kept.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}
					}

					if (calledFor !== '' && heldBy !== calledFor) {
						if (selfRef.seatsAllocation[heldBy] !== undefined) {
							selfRef.seatsAllocation[heldBy].lost.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}
						else {
							selfRef.seatsAllocation['ZZZ'].lost.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}

						if (selfRef.seatsAllocation[calledFor] !== undefined) {
							selfRef.seatsAllocation[calledFor].gained.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}
						else {
							selfRef.seatsAllocation['ZZZ'].gained.push({
								id : electorate.seatCode,
								name : electorate.name
							});
						}
					}
				};

				for(var c = 0; c < searchTerms.length; c++) {
					selfRef.searchList.push(searchTerms[c]);
				}

				$(selfRef).triggerHandler(selfRef.ELECTORATES_LOADED, selfRef.electorates);
				//
				// will reload the news feed in a set amount of time
				selfRef.reloadElectorates = setTimeout(function() {

					selfRef.requestElectorates(true)
				}, selfRef.reloadElectoratesIn);
			},
			error : function(data) {
				selfRef.loadError('The settings feed failed to load')
			}
		});
	}
}
/**************************************
 * Loads the news feed from a the aus_politics twitter account
 ************************************/
ndm.australian.qldlive.Model.prototype.requestNewsFeed = function($refresh) {
	
	if(this.liveUpdatesLoading) {
		// the live updates are in the process of loading do nothing
	} else if(this.liveUpdates != null && $refresh != true) {
		// the results HAVE been loaded and we do NOT wish to refresh them
		$(this).triggerHandler(this.NEWS_FEED_LOADED, this.liveUpdates);
	} else {
		// the results have NOT been loaded OR we wish to refresh them
		this.liveUpdatesLoading = true;
		var request = 'http://search.twitter.com/search.json?q=';
		var accounts = this.settings.twitterAccount.split(',');
		request += 'from:' + $.trim(accounts[0]);
		for(var i = 1; i < accounts.length; i++) {
			request += ' OR from:' + $.trim(accounts[i])
		};
		request += '&rpp=35';
		var selfRef = this;
		$.ajax({

			url : request, //'https://api.twitter.com/1/lists/statuses.json?slug=qld-election&owner_screen_name=thedailynadia'
			dataType : 'jsonp',
			success : function(data) {
				
				selfRef.liveUpdatesLoading = false;
				selfRef.liveUpdates = data;
				$(selfRef).triggerHandler(selfRef.NEWS_FEED_LOADED, selfRef.liveUpdates);
				// will reload the news feed in a set amount of time
				selfRef.reloadNewsFeed = setTimeout(function() {
					selfRef.requestNewsFeed(true)
				}, selfRef.reloadNewsFeedIn);
			},
			error : function(data) {
				selfRef.loadError('The news feed failed to load')
			}
		});
	}
}
/*
ndm.australian.qldlive.Model.prototype.requestParties = function($refresh) {

	if(this.partiesLoading) {
		// the live updates are in the process of loading do nothing
	} else if(this.partiesList != null && $refresh != true) {
		// the results HAVE been loaded and we do NOT wish to refresh them
		$(this).triggerHandler(this.PARTIES_LOADED, this.partiesList);
	} else {

		// the results have NOT been loaded OR we wish to refresh them
		this.partiesLoading = true
		var selfRef = this;
		var query = 'select parties, generationDateTime from xml where url="' + this.settings.liveFeedURL + '"';
		var url = this.assetsURL + 'json/parties.json';//'http://query.yahooapis.com/v1/public/yql?q=' + query + '&format=json';
		$.ajax({
			url : url,
			dataType : 'json',
			success : function(data) {
				selfRef.partiesList = data.query.results.election.parties.party;
				selfRef.partiesLoading = true
				// add party informations
				for(var i = 0; i < selfRef.partiesList.length; i++) {
					var party = selfRef.partiesList[i];
					selfRef.parties[party.code.toUpperCase()].percentage = party.formalVotes.percentage
					selfRef.parties[party.code.toUpperCase()].count = party.formalVotes.count
				}
				$(selfRef).triggerHandler(selfRef.PARTIES_LOADED, selfRef.partiesList);
				// Reload
				selfRef.reloadParties = setTimeout(function() {
					selfRef.requestParties(true)
				}, selfRef.reloadResultsIn);
			},
			error : function(data) {
				selfRef.loadError('The parties results failed to load')
			}
		});
	}
}
*/
ndm.australian.qldlive.Model.prototype.requestDistricts = function($refresh) {
	if(this.districtsLoading) {
		// the live updates are in the process of loading do nothing
	} else if(this.districts != null && $refresh != true) {
		// the results HAVE been loaded and we do NOT wish to refresh them
		$(this).triggerHandler(this.DISTRICTS_LOADED, this.districts);
	} else {
		this.districtsLoading = true;
		var selfRef = this;
		//var query = 'select districts.district.percentRollCounted,  districts.district.name, districts.district.declaredBallotName, districts.district.declaredPartyCode, districts.district.enrolment, districts.district.formalVotes, districts.district.candidates from xml where url="' + this.settings.liveFeedURL + '"';
		var url = this.assetsURL + 'json/theauselectionresults.json';//'http://media.news.com.au/nnd/data/election2013/theauselectionresults.json';//'http://query.yahooapis.com/v1/public/yql?q=' + query + '&format=json';
		$.ajax({
			url : url,
			dataType : 'jsonp',
			success : function(data) {
/*
				selfRef.districtsLoading = false;
				selfRef.districts = data.query.results.election

				var i = selfRef.electorates.length - 1;
				while(i >= 0) {
					var electorate = selfRef.electorates[i];
					i--;
					var d = selfRef.districts.length - 1;
					while(d >= 0) {
						var district = selfRef.districts[d].districts.district;

						if(district.name.toLowerCase() == electorate.name.toLowerCase()) {
							electorate.percentage = district.formalVotes.percentage;
							electorate.count = district.formalVotes.count;
							electorate.enrolment = district.enrolment
							electorate.percentage = district.formalVotes.percentage
							electorate.candidates = district.candidates.candidate;
							//electorate.declaredFor

							break;
						}
						d--;
					}
				}
				//$(selfRef).triggerHandler(selfRef.DISTRICTS_LOADED, selfRef.districts);
				// Reload
				selfRef.reloadDistricts = setTimeout(function() {
					selfRef.requestParties(true)
				}, selfRef.requestDistricts);
*/
			},
			error : function(data) {
				selfRef.loadError('The districts results failed to load')
			}
		});
	}
}
ndm.australian.qldlive.Model.prototype.theAusElectionResults = function($data) {
	var selfRef = this;

	selfRef.partiesList = $data.parties;
	selfRef.partiesLoading = true;
	selfRef.electionUpdated = $data.timestamp;
	selfRef.electionVotePercentage = $data.percentage;
	var othersPercentage = 0,
		othersSwing = 0;
	// add party informations
	for(var i = 0; i < selfRef.partiesList.length; i++) {
		var party = selfRef.partiesList[i];
		if (selfRef.parties[party.shortCode.toUpperCase()] !== undefined) {
			selfRef.parties[party.shortCode.toUpperCase()].percentage = party.percentage;
			selfRef.parties[party.shortCode.toUpperCase()].swing = party.swing;
		}
		else {
			othersPercentage += party.percentage;
			othersPercentage += party.swing;
		}
	}
	selfRef.parties['ZZZ'].percentage = othersPercentage;
	selfRef.parties['ZZZ'].swing = othersSwing;

	$(selfRef).triggerHandler(selfRef.PARTIES_LOADED, selfRef.partiesList);



	selfRef.districtsLoading = false;
	selfRef.districts = $data.seats;

	var i = selfRef.electorates.length - 1;
	while(i >= 0) {
		var electorate = selfRef.electorates[i];
		i--;

		var district = selfRef.districts[electorate.seatCode];
		if (district) {
			if(district.name.toLowerCase() == electorate.name.toLowerCase()) {
				electorate.percentage = district.percentage;
				electorate.swing = district.swing;
				electorate.updated = district.updated;
				electorate.candidates = district.candiates;
			}
		}
	}
	$(selfRef).triggerHandler(selfRef.DISTRICTS_LOADED, selfRef.districts);
}
function theAusElectionResults($data) {
	var model = new ndm.australian.qldlive.Model();
	model.theAusElectionResults($data)
}
/**************************************
 * get Electorate
 ************************************/
ndm.australian.qldlive.Model.prototype.findElectorateByName = function($name) {
	var i = this.electorates.length - 1;
	while(i >= 0) {
		var electorate = this.electorates[i];
		if($name.toLowerCase() == electorate.name.toLowerCase()) {
			return electorate;
		}
		i--;
	}
}
/**
 * Find Electorate By PostCode
 */
ndm.australian.qldlive.Model.prototype.findElectorateByPostCode = function(postCode) {
	var e = this.electorates.length - 1
	while(e >= 0) {
		var electorate = this.electorates[e];
		var postCodes = this.electorates[e].postcodes.split(',');
		var p = postCodes.length - 1;
		while(p >= 0) {
			if(postCode == postCodes[p]) {
				return electorate;
			}
			p--;
		}
		e--;
	}
};
/**
 * Find Electorate By Suburb
 */
ndm.australian.qldlive.Model.prototype.findElectorateBySuburb = function(suburb) {
	var e = this.electorates.length - 1
	while(e >= 0) {
		var electorate = this.electorates[e];
		var suburbs = this.electorates[e].suburbs.split(',');
		var p = suburbs.length - 1;
		while(p >= 0) {
			if(suburb.toLowerCase() == suburbs[p].toLowerCase()) {
				return electorate;
			}
			p--;
		}
		e--;
	}
};
