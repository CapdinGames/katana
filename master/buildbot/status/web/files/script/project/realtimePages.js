define(['jquery', 'helpers'], function ($, helpers) {
	 "use strict";
    var realtimePages;
    
    realtimePages = {
        buildDetail: function (m, stepList) {

        	var stopRunning = $('body').hasClass('stopRunning-js');
                  
              if (stopRunning) {
              		// close the websocket connection
              		sock.close();
              		// reload the page to get all results
              		if(!window.location.hash) {
				        window.location = window.location + '#finished';
				        window.location.reload();
					}
              		
              }
        	   else  { 
            	try {
            	
                  var obj = JSON.parse(m);
                  
                 $.each(obj, function (key, value) {
                  	
                  	// update timing table
                  	var startTime = value.times[0];
                  	var endTime = value.times[1];
 
                  	var resultTxt = value.text;

		                    // timetable
		                    $('#elapsedTimeJs').text(helpers.getTime(startTime, endTime));
		                   
		                    var i = 0;
		                    
		                  	$.each(value.steps, function (key, value) {
		                  		
		                  		 var isStarted = value.isStarted;
		                  		 var isFinished = value.isFinished;
		                  		 var isRunning = isStarted && !isFinished;
		                  		 var startTime = value.times[0];
		                  		 var endTime = value.times[1];
		                  		 var resultsClass = helpers.getResult(value.results[0]);
		                  		 var isHidden = value.hidden;
		              			
		                  		 if (!isHidden) {
		                  			i = ++i;
		                  			 
		                  			// update step list if it's not finished
		                  			if (!$(stepList).eq(i-1).hasClass('finished')) {

		                  				if (isRunning) {
		                  					
		                  					// loop through the logs
		                  					if (value.logs) {
		                  						var logList = '';  
		                  						$('.logs-txt',stepList).eq(i-1).text('Logs');
					                  			$.each(value.logs, function (key, value) {
					                  				var logText = value[0];
					                  				var logUrl = value[1];
					                  				logList += '<li class="s-logs-js"><a href='+ logUrl +'>'+ logText +'</a></li>';	
					                  			});
					                  			$('.log-list-js',stepList).eq(i-1).html(logList);
				                  			}
											// loop through urls
											if (value.urls) {
					                  			var urlList = '';  
												$.each(value.urls, function (key, value) {
													 urlList += '<li class="urls-mod log-list-'+ helpers.getResult(value.results) +'"><a href="'+ value.url +'">'+ key +'</a></li>'; 
												});				                  			
					                  			$('.log-list-js',stepList).eq(i-1).append(urlList);
				                  			}

				                  			//update elapsed or end time
			                  				$('.update-time-js',stepList).eq(i-1).html(helpers.getTime(startTime, endTime));
			                  				// update build text
		          							$('.s-text-js',stepList).eq(i-1).html(value.text.join(' '));
		          							// update result class
			          						$('.s-result-js',stepList).eq(i-1).removeClass().addClass('running result s-result-js');	
			          						
			              				} else if (isFinished) {
			              					// Apply the updates from the finished state before applying finished class
			              					$('.s-result-js',stepList).eq(i-1).removeClass().addClass(resultsClass + ' result s-result-js');					              				
			              					$(stepList).eq(i-1).addClass('finished');
			              					
			              				}
			              				
		              				}
		              			}
		              			
		                  	});
							if (endTime) { 
								// If the build is finished
								$('body').addClass('stopRunning-js');
							}
						
	                });
				
          		}
             
	            catch(err) {
	            	//console.log(err);
	            }
		    }        
        },
        frontPage: function(m){
        	function sumVal(arr) {
	          var sum = 0;
	          $.each(arr,function(){
	            sum+=parseFloat(this) || 0;
	          });
	          return sum;
			};
        	try {
            	
	          var obj = JSON.parse(m);
	          
	          var arrayPending = [];
	            
	          $.each(obj.builders, function (key, value) {
	          	console.log(m)
	          	arrayPending.push(value.pendingBuilds);
	          });
	          
	          $('#pendingBuilds').html(sumVal(arrayPending));

	          var arraySlaves = [];
	          
	          $.each(obj.slaves, function (key) {
	            arraySlaves.push(key);
	          });

	          $('#slavesNr').html(arraySlaves.length);
          		
            }
            catch(err) {
            }
        }
    }
    return realtimePages
});