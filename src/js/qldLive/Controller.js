var ndm = ndm || {};
ndm.australian = ndm.australian || {};
ndm.australian.qldlive = ndm.australian.qldlive || {};
ndm.australian.qldlive.views = ndm.australian.qldlive.views || {};
ndm.australian.qldlive.displays = ndm.australian.qldlive.displays || {};
/**************************************
 * The Quiz Admin Controller
 * Manages views for the app
 @param $domId the html element to create the appliction in
 ************************************/
ndm.australian.qldlive.Controller = function($domId) {
	this.domId = $domId;
	this.built = false;
	this.currentView
	this.LATEST = 'latest';
	this.ELECTORATES = 'electorates';
	this.LIVEVIDEO = 'liveVideo';
	this.SWITCH_VIEW = 'switchView';
	this.model = new ndm.australian.qldlive.Model();
	// Listen
	var selfRef = this;
	// settings Loaded
	$(this.model).unbind(this.model.SETTINGS_LOADED, true);
	$(this.model).bind(this.model.SETTINGS_LOADED, function($event, $data) {
		$(selfRef.model).unbind(selfRef.model.SETTINGS_LOADED, true);
		if(!selfRef.built) {
			selfRef.model.requestElectorates();
		}
	});
	// Electorates Loaded
	$(this.model).unbind(this.model.ELECTORATES_LOADED, true);
	$(this.model).bind(this.model.ELECTORATES_LOADED, function($event, $data) {
		$(selfRef.model).unbind(selfRef.model.ELECTORATES_LOADED, true);
		if(!selfRef.built) {
			selfRef.build();
		}
		/*
		if(!selfRef.built) {
			if(selfRef.model.settings.enableLiveFeed) {
				selfRef.model.requestLastElectionResults();
			} else {
				selfRef.build();
			}
		}
		*/
	});
	// Last Electorates Loaded
	$(this.model).unbind(this.model.LAST_ELECTION_RESULTS_LOADED, true);
	$(this.model).bind(this.model.LAST_ELECTION_RESULTS_LOADED, function($event, $data) {
		$(selfRef.model).unbind(selfRef.model.LAST_ELECTION_RESULTS_LOADED, true);
		if(!selfRef.built) {
			selfRef.build();
		}
	});
	// Request
	this.model.requestSettings();
}
/**
 * Build
 * The required data has been loaded build the app structure
 */
ndm.australian.qldlive.Controller.prototype.build = function() {
	if(!this.built) {
		// the controller has not been built before
		this.built = true
		$(this.domId + ' .loader').hide();
		var output = '<ul class="nav"><li id="' + this.LATEST + '">Latest Results</li>';

		if(this.model.settings.enableLiveFeed) {
			// add a menu link if the live feed is enabled
			output += '<li id="' + this.ELECTORATES + '">All Electorates</li>'
		}

		if(this.model.settings.enableSkyVideo) {
			// add a menu link if the video is enabled
			output += '<li id="' + this.LIVEVIDEO + '"><b>Sky News</b>Live</li>';
		}
		output += '</ul><div class="share"></div><div class="contents"><div class="latestView"></div><div class="electoratesView"></div><div class="videoView"></div></div>';
		$(this.domId).append(output);
		// Add Share Btns
		/**
		 $(this.domId + " .share").socialisev2({
		 items : [{
		 widget : "sharethis.facebook", // sharethis facebook button
		 settings : {
		 classSuffix : "hcount" // button will render with vertical counter
		 }
		 }, {
		 widget : "sharethis.linkedin" // sharethis linkedin button
		 }, {
		 widget : "sharethis.twitter", // sharethis twitter button
		 settings : {
		 classSuffix : "hcount" // button will render with vertical counter
		 }
		 }]
		 });
		 */

		// Events
		var selfRef = this;
		$(this.domId + ' ul.nav li').each(function() {
			$(this).click(function() {
				var view = $(this).attr('id');
				selfRef.switchView(view)

			})
		})
		// create views
		this.latestView = new ndm.australian.qldlive.views.Latest('.latestView');
		this.latestView.close()
		if(this.model.settings.enableLiveFeed) {
			this.electoratesView = new ndm.australian.qldlive.views.Electorates('.electoratesView');
			this.electoratesView.close()
		}
		if(this.model.settings.enableSkyVideo) {
			this.videoView = new ndm.australian.qldlive.views.LiveVideo('.videoView');
			this.videoView.close()
		}
		this.switchView(this.LATEST);

	}

}
/**
 * Switches Between views
 */
ndm.australian.qldlive.Controller.prototype.switchView = function($view, $data) {
	if(this.currentView != $view && $view != '') {
		var selfRef = this;
		try {
			this.currentPageView.close();
		} catch (e) {

		}
		if(this.currentView) {
			$('.contents').removeClass(this.currentView);
			$(this.domId + ' ul.nav li#' + this.currentView).removeClass('selected');
		}
		delete this.currentPageView;

		this.currentView = $view;
		$('.contents').addClass(this.currentView);
		$(this.domId + ' ul.nav li#' + $view).addClass('selected');
		switch($view) {
			case this.LATEST :
				this.currentPageView = this.latestView

				break;
			case this.ELECTORATES :
				this.currentPageView = this.electoratesView;
				break;
			case this.LIVEVIDEO :
				this.currentPageView = this.videoView;
				break;
		}
		this.currentPageView.open($data);
		$(this.currentPageView).unbind(this.SWITCH_VIEW, true);
		$(this.currentPageView).bind(this.SWITCH_VIEW, function($event, $view, $data) {

			selfRef.switchView($view, $data);
		});
	}

}