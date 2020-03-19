// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}

var apList = null;
var selectedSSID = '';
var refreshAPInterval = null;
var checkStatusInterval = null;

function stopCheckStatusInterval() {
	if (checkStatusInterval != null) {
		clearInterval(checkStatusInterval);
		checkStatusInterval = null;
	}
}

function stopRefreshAPInterval() {
	if (refreshAPInterval != null) {
		clearInterval(refreshAPInterval);
		refreshAPInterval = null;
	}
}

function startCheckStatusInterval() {
	checkStatusInterval = setInterval(checkStatus, 950);
}

function startRefreshAPInterval() {
	refreshAPInterval = setInterval(refreshAP, 2800);
}

$(document).ready(function() {
	$('#wifi-status').hide();
	$('#wifi-status').on('click', '.ape', function() {
		$('#connect-details').slideDown('fast', function() {});
	});

	$('#manual_add').on('click', '.ape', function() {
		selectedSSID = $(this).text();
		$('#ssid-pwd').text(selectedSSID);

		$('#connect_manual').slideDown('fast', () => {});
	});

	$('#wifi-list').on('click', '.ape', function() {
		selectedSSID = $(this).text();
		$('#ssid-pwd').text(selectedSSID);

		$('#connect').slideDown('fast', function() {});
	});

	$('#cancel').on('click', function() {
		selectedSSID = '';
		$('#connect').slideUp('fast', function() {});
		$('#connect_manual').slideUp('fast', function() {});
	});

	$('#manual_cancel').on('click', function() {
		selectedSSID = '';
		$('#connect').slideUp('fast', function() {});
		$('#connect_manual').slideUp('fast', function() {});
	});

	$('#join').on('click', function() {
		$('#connect').slideUp('fast', () => {})
		performConnect();
	});

	$('#manual_join').on('click', function() {
		performConnect($(this).data('connect'));
	});

	$('#ok-details').on('click', function() {
		$('#connect-details').slideUp('fast', function() {});
	});

	$('#ok-connect').on('click', function() {
		$('#wifi').slideDown('fast', function() {});
	});

	$('#disconnect').on('click', function() {
		$('#connect-details').slideUp('fast', () => {});
		$('#diag-disconnect').slideDown('fast', function() {});
	});

	$('#no-disconnect').on('click', function() {
		$('#diag-disconnect').slideUp('fast', function() {});
		$('#connect-details').slideUp('fast', () => {});
	});

	$('#yes-disconnect').on('click', function() {
		stopCheckStatusInterval();
		selectedSSID = '';

		$('#diag-disconnect').slideUp('fast', function() {});

		$.ajax({
			url: '/connect.json',
			dataType: 'json',
			method: 'DELETE',
			cache: false,
			data: { timestamp: Date.now() }
		});

		startCheckStatusInterval();
		$('#wifi').slideDown('fast', function() {});
	});

	$('#close-fail').on('click', () => {
		$('#connect-fail').slideUp('fast', () => {})
	})

	$('#close-success').on('click', () => {
		$('#connect-success').slideUp('fast', () => {})
	})

	//first time the page loads: attempt get the connection status and start the wifi scan
	refreshAP();
	startCheckStatusInterval();
	startRefreshAPInterval();
});

function performConnect(conntype) {
	//stop the status refresh. This prevents a race condition where a status
	//request would be refreshed with wrong ip info from a previous connection
	//and the request would automatically shows as succesful.
	stopCheckStatusInterval();

	//stop refreshing wifi list
	stopRefreshAPInterval();

	var pwd;
	if (conntype == 'manual') {
		//Grab the manual SSID and PWD
		selectedSSID = $('#manual_ssid').val();
		pwd = $('#manual_pwd').val();
	} else {
		pwd = $('#pwd').val();
	}
	//reset connection
	$('#ssid-wait').text(selectedSSID);
	$('#loading').slideDown();

	$.ajax({
		url: '/connect.json',
		dataType: 'json',
		method: 'POST',
		cache: false,
		headers: { 'X-Custom-ssid': selectedSSID, 'X-Custom-pwd': pwd },
		data: { timestamp: Date.now() }
	});

	//now we can re-set the intervals regardless of result
	startCheckStatusInterval();
	startRefreshAPInterval();
}

function rssiToIcon(rssi) {
	if (rssi >= -60) {
		return 'w0';
	} else if (rssi >= -67) {
		return 'w1';
	} else if (rssi >= -75) {
		return 'w2';
	} else {
		return 'w3';
	}
}

function refreshAP() {
	$.getJSON('/ap.json', function(data) {
		if (data.length > 0) {
			//sort by signal strength
			data.sort(function(a, b) {
				var x = a['rssi'];
				var y = b['rssi'];
				return x < y ? 1 : x > y ? -1 : 0;
			});
			apList = data;
			refreshAPHTML(apList);
		}
	});
}

function refreshAPHTML(data) {
	var h = '';
	data.forEach(function(e, idx, array) {
		h += `
			<div class="ape{0} list-item">
				<div class="{1}">
					<p class="{2} m0">{3}</p>
				</div>
			</div>
		`.format(
				idx === array.length - 1 ? '' : ' brdb',
				rssiToIcon(e.rssi),
				e.auth == 0 ? '' : 'pw',
				e.ssid
			);
		h += '\n';
	});

	$('#wifi-list').html(h);
}

function checkStatus() {
	$.getJSON('/status.json', function(data) {
		console.log('trying out')
		if (data.hasOwnProperty('ssid') && data['ssid'] != '') {
			if (data['ssid'] === selectedSSID.trim()) {
				//that's a connection attempt
				if (data['urc'] === 0) {
					//got connection
					console.log('Connection success.')
					$('#connected-to span').text(data['ssid']);
					$('#connect-details h1').text(data['ssid']);
					$('#ip').text(data['ip']);
					$('#netmask').text(data['netmask']);
					$('#gw').text(data['gw']);
					$('#wifi-status').show();

					//unlock the wait screen if needed
					$('#ok-connect').prop('disabled', false);

					//update wait screen
					$('#loading').slideUp('fast', () => {});
					$('#connect-success').slideDown('fast', () => {});
					$('#connect-fail').slideUp('fast', () => {});
				} else if (data['urc'] === 1) {
					console.log('Failed connection.')
					//failed attempt
					$('#connected-to span').text('');
					$('#connect-details h1').text('');
					$('#ip').text('0.0.0.0');
					$('#netmask').text('0.0.0.0');
					$('#gw').text('0.0.0.0');

					//don't show any connection
					$('#wifi-status').slideUp('fast', function() {});

					//update wait screen
					$('#loading').slideUp('fast', () => {});
					$('#connect-success').slideUp('fast', () => {});
					$('#connect-fail').slideDown('fast', () => {});
					selectedSSID = ''
				}
			} else if (data.hasOwnProperty('urc') && data['urc'] === 0) {
				console.log('not same ssid')
				//ESP32 is already connected to a wifi without having the user do anything
				if (!$('#wifi-status').is(':visible')) {
					$('#connected-to span').text(data['ssid']);
					$('#connect-details h1').text(data['ssid']);
					$('#ip').text(data['ip']);
					$('#netmask').text(data['netmask']);
					$('#gw').text(data['gw']);

					$('#loading').slideUp('fast', () => {});
					$('#connect-success').slideUp('fast', () => {});
					$('#connect-fail').slideUp('fast', () => {});
				}
				
			}
		} else if (data.hasOwnProperty('urc') && data['urc'] === 2) {
			//that's a manual disconnect
			$('#loading').slideUp('fast', () => {});
			$('#connect-success').slideUp('fast', () => {});
			$('#connect-fail').slideUp('fast', () => {});

			if ($('#wifi-status').is(':visible')) {
				$('#wifi-status').slideUp('fast', function() {});
			}
		}
	}).fail(function(e) {
		// console.log('Could not find path...')
		// don't do anything, the server might be down while esp32 recalibrates radio
	});
}
