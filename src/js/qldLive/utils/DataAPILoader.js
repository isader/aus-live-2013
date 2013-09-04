
var ndm = ndm || {};
ndm.australian = ndm.australian || {};
/******************************************************************************
 * ndm.australian.DataAPILoader
 *******************************************************************************/
ndm.australian.DataAPILoader = function($useAPI, $dataAPIURL) {
	this.useAPI = $useAPI;
	this.dataAPIURL = $dataAPIURL;
	this.datasets = {};
	//Events
	this.DATA_LOADED = 'data_loaded_';
	this.LOAD_ERROR = 'load_error';
	this.INSERT_COMPLETE = 'insert_loaded_';
	this.INSERT_ERROR = 'insert_error';
};
ndm.australian.DataAPILoader.prototype.selectCompete = function($loadKey) {
	this.datasets[$loadKey].complete = true;
	this.datasets[$loadKey].loading = false;
	$(this).trigger(this.DATA_LOADED + $loadKey, [this.datasets[$loadKey].data]);
};

ndm.australian.DataAPILoader.prototype.selectError = function($loadKey, $error) {
	$(this).trigger(this.LOAD_ERROR, $error);
};

ndm.australian.DataAPILoader.prototype.insertCompete = function($loadKey, $results) {
	$(this).trigger(this.INSERT_COMPLETE + $loadKey, $results);
};
ndm.australian.DataAPILoader.prototype.insertError = function($loadKey, $error) {
	$(this).trigger(this.INSERT_ERROR, $error);
};
/**
 * Loads a results set, from the DATA API or a static JSONP file
 * @loadKey : a key of load type you are requesting, used to track loads and create unique events
 * @options : data you are passing for the AJAX load. it should include the DATA API select args and a staticURL
 * @offset : Start offset in the collection. Offsets start at 1. Used to for multiple request to the DATA API to get results set with more than 100 results
 * @refresh : Force
 */
ndm.australian.DataAPILoader.prototype.select = function($loadKey, $options, $offset, $refresh) {
	
	var selfRef = this;
	// create a dataset if it does not exist
	if(this.datasets[$loadKey] == null || $refresh) {
		this.datasets[$loadKey] = {
			complete : false,
			data : [],
			loading : false
		};
	}
	

	if(this.datasets[$loadKey].complete && !$refresh) {
		// the data you are after has already been loaded
		selfRef.selectCompete($loadKey)
	} else if(!this.datasets[$loadKey].loading || $offset > 0 || !this.useAPI) {
		// the dataset has not been loaded and is not in the process of loading
		this.datasets[$loadKey].loading = true;
		var startOffset = ($offset == null) ? 1 : $offset;

		var url = this.dataAPIURL + $options.selectString;
		var dataType = "jsonp";
		var data = $options.data;
		// don't use data api load a static file
		if(!this.useAPI) {
			url = $options.staticURL;
			dataType = "jsonp";
			data = {};
		}
		if(this.useAPI) {
			data.args.offset = startOffset;
		};
		// load the data via jquery ajax call
		
		$.ajax({
			url : url,
			dataType : dataType,
			data : data,
			success : function(data) {
				
				if(data.error != null) {
					selfRef.selectError($loadKey, data)
				} else {
					// Add the result into the array
					console.log(Number(data.total))
					selfRef.datasets[$loadKey].data = selfRef.datasets[$loadKey].data.concat(data.items);
					if(selfRef.useAPI == false) {
						selfRef.selectCompete($loadKey)
						//
					} else if(selfRef.datasets[$loadKey].data.length >= Number(data.total) || (startOffset + 100)> Number(data.total) ) {
						//All the election data
						selfRef.selectCompete($loadKey)
					} else {
						// Request more rows
						// The data API only returns 100 results at a time
						selfRef.select($loadKey, $options, startOffset + 100);
					}
				}
			},
			error : function(data) {
				console.log('error')
			}
		});

	}
	;
};
/**
 * Insert
 */
ndm.australian.DataAPILoader.prototype.insert = function($loadKey, $options) {
	var url = this.dataAPIURL + $options.selectString;
	var dataType = "jsonp";
	var data = $options.data;
	var selfRef = this;
	$.ajax({
		url : url,
		dataType : dataType,
		data : data,
		success : function(data) {
			
			if(data.error != null) {
				selfRef.insertError($loadKey, data)
			} else {
				selfRef.insertCompete($loadKey, data)
			}
		}
	});

}