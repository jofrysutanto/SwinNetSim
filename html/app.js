jQuery(document).ready(function($) {

	//var SERVER = 'http://ec2-54-196-212-34.compute-1.amazonaws.com/'; // N Virginia
	var SERVER = 'http://ec2-54-206-57-21.ap-southeast-2.compute.amazonaws.com/'; // Sydney

	var REPEAT = 30;
	var $result = $('#result');

	var smallStartTime, mediumStartTime, largeStartTime, xlargeStartTime;
	var $smallDef, $medDef, $largeDef, $xlargeDef;

	console.log('Profiler set the server:  ' + SERVER);

	$('.select-server').click(function() {
		SERVER = $(this).data('url');
		$('.current-server > strong').text($(this).text());
	});

	$('.btn-holder').on('click', '.clear-btn', function(e) {
		$self = $(this);
		$self.removeClass('clear-btn');
		$self.removeClass('btn-warning').addClass('btn-primary');
		$self.text('Start');

		$result.empty();
	});

	/**
	 * Generate an alert box based on bootstrap
	 * @param  {[string]} type ['success', 'warning', 'danger', 'info']
	 * @param  {[string]} msg  [message to be shown]
	 * @return {[string]}      [generated alert div]
	 */
	function makeAlert(type, msg, ID) {
		return '<div id="' + ID + '" class="alert alert-' + type + '">' + msg + '</div>';
	}

	/**
	 * Create progress bar to track the total progress
	 * @return {integer} Newly created ID that identifies the progress bar
	 */
	function makeProgressBar() {
		var newID = $.now();
		var el = '<div class="progress">' +
				  '<div class="progress-bar" id="' + newID + '" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
				  '</div>' +
				'</div>';
		$result.append(el);
		return newID;
	}

	function getResource(url, count, $update, $promise) {
		$.get(url, function (data) {
			count++;
			var currentProgress = (count / REPEAT) * 100;
			$update.css('width', (currentProgress) + '%');

			if (count < REPEAT)
				getResource(url, count, $update, $promise);
			else {
				$promise.resolve();
			}
		});
	}

	$('a#startProfile').click(function() {
		$startButton = $(this);

		// Do nothing when it says 'Clear'
		if ($startButton.hasClass('clear-btn'))
		{
			return;
		}

		// Disable button temporarily
		$startButton.attr('disabled', 'disabled');
		$startButton.text('Running...');

		$result.append(makeAlert('info', 'Profiler is running...'));
		$result.append(makeAlert('info', 'Running on small files'));
		var progressBarID = makeProgressBar();

		///////
		// Running for small files
		///////
		var smallStartTime = $.now();
		$smallDef = ($.Deferred());
		var $smallPromise = $smallDef.promise();
		getResource(SERVER + 'texter/small', 0, $('#' + progressBarID), $smallDef);

		
		///////
		// Running medium when small is done
		///////
		$.when($smallPromise).done(function() {
			var smallElapsed = $.now() - smallStartTime;
			var avg = smallElapsed / REPEAT;
			$result.append(makeAlert('success', 'Done! Total time: ' + smallElapsed + 'ms, Averaging: ' + avg + 'ms'));
			$result.append('<hr>');

			mediumStartTime = $.now();
			var progressBarID = makeProgressBar();
			$result.append(makeAlert('info', 'Running on medium files...'));

			$medDef = ($.Deferred());
			var $medPromise = $medDef.promise();
			getResource(SERVER + 'texter/medium', 0, $('#' + progressBarID), $medDef);



			///////
			// Running medium when small is done
			///////
			$.when($medPromise).done(function() {
				var mediumElapsed = $.now() - mediumStartTime;
				var avg = mediumElapsed / REPEAT;
				$result.append(makeAlert('success', 'Done! Total time: ' + mediumElapsed + 'ms, Averaging: ' + avg + 'ms'));
				$result.append('<hr>');

				largeStartTime = $.now();
				var progressBarID = makeProgressBar();
				$result.append(makeAlert('info', 'Running on large files...'));

				var $largeDef = ($.Deferred());
				var $largePromise = $largeDef.promise();
				getResource(SERVER + 'texter/xlarge', 0, $('#' + progressBarID), $largeDef);



				///////
				// Results on large
				///////
				$.when($largePromise).done(function() {
					var largeElapsed = $.now() - largeStartTime;
					var avg = largeElapsed / REPEAT;
					$result.append(makeAlert('success', 'Done! Total time: ' + largeElapsed + 'ms, Averaging: ' + avg + 'ms'));
					$result.append('<hr>');

					xlargeStartTime = $.now();
					var progressBarID = makeProgressBar();
					$result.append(makeAlert('info', 'Running on x-large files...'));

					var $xlargeDef = ($.Deferred());
					var $xlargePromise = $xlargeDef.promise();
					getResource(SERVER + 'texter/xxlarge', 0, $('#' + progressBarID), $xlargeDef);

					///////
					// Results on large
					///////
					$.when($xlargePromise).done(function() {
						var xlargeElapsed = $.now() - largeStartTime;
						var avg = xlargeElapsed / REPEAT;
						$result.append(makeAlert('success', 'Done! Total time: ' + xlargeElapsed + 'ms, Averaging: ' + avg + 'ms'));
						$result.append('<hr>');

						// End of profiler
						$startButton.text('Clear');
						$startButton.removeAttr('disabled');
						$startButton.removeClass('btn-primary').addClass('btn-warning').addClass('clear-btn');
					});

					
				});
			});
		});
	});
});