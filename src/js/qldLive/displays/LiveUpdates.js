/**************************************
 * Displays and show the live updates panel
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.displays.LiveUpdates = function($domId,$disableTwitterBtn) {
	this.domId = $domId;
	this.model = new ndm.australian.qldlive.Model();
	this.isBuilt = false;
	this.disableTwitterBtn = $disableTwitterBtn;
	// Set Up

	// Listen
	var selfRef = this;
	$(this.model).unbind(this.model.NEWS_FEED_LOADED, true);
	$(this.model).bind(this.model.NEWS_FEED_LOADED, function($event, $data) {
		selfRef.update($data.results);
	});
}

ndm.australian.qldlive.displays.LiveUpdates.prototype.open = function() {
	if(!this.isBuilt) {
		this.build();
	}
	if(this.scrollAPI) {
		this.scrollAPI.reinitialise();
	} else {
		var pane = $(this.domId + ' .feed')
		pane.jScrollPane();
		this.scrollAPI = pane.data('jsp');
	}
	//this.model.requestNewsFeed();

}
ndm.australian.qldlive.displays.LiveUpdates.prototype.close = function() {
}
/**
 * Build
 */
ndm.australian.qldlive.displays.LiveUpdates.prototype.build = function() {
	this.isBuilt = true;
	var output = '<h3>TWEETS</h3>';
	if (!this.disableTwitterBtn){
		output += '<a href="https://twitter.com/aus_politics" class="twitter-follow-button" data-show-count="false">Follow @aus_politics</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>';
	}
	
	//output += '<div class="feed"><img src="' + this.model.assetsURL + 'img/ajax-loader.gif"/ class="loadingAni"></div>';

	output += '<div class="module twitter-module two-tweets"><a class="twitter-timeline"  href="https://twitter.com/australian/politics-2013"  data-widget-id="296468219340931072">Tweets from @australian/politics-2013</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script></div>';
	
	output += '<a class="btn" href="' + this.model.settings.fullCoverageUrl + '">View all updates on the blog</a>'
	$(this.domId).html(output);

}
/**
 * Update
 */
ndm.australian.qldlive.displays.LiveUpdates.prototype.update = function($results) {
	if(this.isBuilt) {
		var output = '<ul>';
		for(var r = 0; r < $results.length; r++) {
			var result = $results[r];
			var text = String(result.text).addLinks();
			var date = new Date(result.created_at);
			var timePeriod = (date.getHours() >= 12) ? 'pm' : 'am';
			var hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
			output += '<li><img src="'+result.profile_image_url+'" style="width:40px;"/><span><h4>'+result.from_user_name+' @'+result.from_user+'</h4><p>' + text + '</p><h5>' + hours + ':' + Number(date.getMinutes()).padZero() + timePeriod + ' ' + date.getDate() + '/' + date.getMonth() + '</h5></span></li>';
		}
		output += '</ul>';
		this.scrollAPI.getContentPane().html(output);
		this.scrollAPI.reinitialise();
	}

}