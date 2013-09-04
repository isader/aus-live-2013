/**************************************
 * The base view class which other views should prototype
 @param $domId the HTML element to create the application in
 ************************************/
ndm.australian.qldlive.views.View = function() {
	this.displays = [];
	this.model = new ndm.australian.qldlive.Model();
}

ndm.australian.qldlive.views.View.prototype = {
	addView : function($view) {
		this.displays.push($view);
		var selfRef = this;
		$($view).bind('switchView', function($event, $viewId, $data) {
			
			$(selfRef).trigger('switchView', [$viewId, $data]);
		});
		return $view;
	},
	destroy : function() {
		for(var i = 0; i < this.displays.length; i++) {
			try {
				this.displays[i].destroy();
				delete this.displays[i];
			} catch (e) {

			}
		};
		delete this;
	},
	open : function($data) {
		
		$(this.domId).show();
		for(var i = 0; i < this.displays.length; i++) {
			try {
				this.displays[i].open();
			} catch (e) {

			}
		}
		this.openView($data);
		

	},
	close : function() {

		for(var i = 0; i < this.displays.length; i++) {
			try {
				this.displays[i].close();
			} catch (e) {

			}
		}
		this.closeView()
		$(this.domId).hide();

	}
}