'use strict';

/* Filters */

angular.module('netStatsApp.filters', [])
.filter('nodesActiveClass', function() {
	return function(active, total) {
		var ratio = active/total;

		if(ratio >= 0.9)
			return 'text-success';

		if(ratio >= 0.75)
			return 'text-info';

		if(ratio >= 0.5)
			return 'text-warning';

		return 'text-danger';
	};
})
.filter('mainClass', function() {
	return function(node, bestBlock) {
	  	return mainClass(node, bestBlock);
	};
})
.filter('peerClass', function() {
	return function(peers, active) {
		return peerClass(peers, active);
	};
})
.filter('miningClass', function() {
	return function(mining, active) {
		if(! active)
			return 'text-gray';

		return (! mining ? 'text-danger' : 'text-success');
	};
})
.filter('miningIconClass', function() {
	return function(mining) {
		return (! mining ? 'icon-cancel' : 'icon-check');
	};
})
.filter('hashpowerClass', function() {
	return function(mining) {
		if(! mining)
			return 'text-gray';

		return 'text-success';
	};
})
.filter('hashrateFilter', function() {
	return function(hashrate) {
		if(typeof hashrate === 'undefined' || !hashrate)
			return 0;

		return hashrate/1000;
	}
})
.filter('nodeVersion', function($sce) {
	return function(version) {
		if(typeof version !== 'undefined')
		{
			var tmp = version.split('/');

			tmp[0] = tmp[0].replace('Ethereum(++)', 'Eth');

			if(tmp[0].indexOf('pyethapp') === 0)
			{
				tmp[0] = 'pyeth';
			}

			if(tmp[1][0] !== 'v' && tmp[1][2] !== '.')
			{
				tmp.splice(1,1);
			}

			if(tmp[2] === 'Release'){
				tmp.splice(2,1);
			}

			if(tmp[2].indexOf('Linux') === 0)
				tmp[2] = 'linux';

			if(tmp[2].indexOf('Darwin') === 0)
				tmp[2] = 'darwin';

			return $sce.trustAsHtml(tmp.join('/'));
		}

		return '';
	};
})
.filter('blockClass', function() {
	return function(current, best) {
		if( ! current.active)
			return 'text-gray';

		return (best - current.block.number <= 1 ? 'text-success' : (best - current.block.number > 1 && best - current.block.number < 4 ? 'text-warning' : 'text-danger'));
	};
})
.filter('gasFilter', function() {
	return function(gas) {
		return (typeof gas !== 'undefined' ? parseInt(gas) : '?');
	}
})
.filter('hashFilter', function() {
	return function(hash) {
		if(hash.substr(0,2) === '0x')
			hash = hash.substr(2,64);

		return hash.substr(0, 8) + '...' + hash.substr(56, 8);
	}
})
.filter('timeClass', function() {
	return function(timestamp, active) {
		if( ! active)
			return 'text-gray';

		return timeClass(timestamp);
	};
})
.filter('propagationTimeClass', function() {
	return function(stats, bestBlock) {
		if( ! stats.active)
			return 'text-gray';

		if(stats.block.number < bestBlock)
			return 'text-gray';

		if(stats.block.propagation == 0)
			return 'text-info';

		if(stats.block.propagation < 1000)
			return 'text-success';

		if(stats.block.propagation < 3000)
			return 'text-warning';

		if(stats.block.propagation < 7000)
			return 'text-orange';

		return 'text-danger'
	};
})
.filter('latencyFilter', function() {
	return function(stats) {
		if(stats.active === false)
			return 'offline';
		else
			return stats.latency + ' ms';
	}
})
.filter('latencyClass', function() {
	return function(stats) {
		if(stats.active === false)
			return 'text-danger';

		if(stats.latency <= 100)
			return 'text-success';

		if(stats.latency <= 1000)
			return 'text-warning';

		return 'text-danger'
	};
})
.filter('blockTimeFilter', function() {
	return function(timestamp) {
		if(timestamp === 0)
			return '∞';

		// var time = Math.floor((new Date()).getTime() / 1000);
		var time = (new Date()).getTime();
		var diff = Math.floor((time - timestamp)/1000);

		if(diff < 60)
			return Math.round(diff) + ' s ago';

		return moment.duration(Math.round(diff), 's').humanize() + ' ago';
	};
})
.filter('blockPropagationFilter', function() {
	return function(ms) {
		var result = 0;

		if(ms < 1000) {
			return (ms === 0 ? "" : "+") + ms + " ms";
		}

		if(ms < 1000*60) {
			result = ms/1000;
			return "+" + result.toFixed(1) + " s";
		}

		if(ms < 1000*60*60) {
			result = ms/1000/60;
			return "+" + Math.round(result) + " min";
		}

		if(ms < 1000*60*60*24) {
			result = ms/1000/60/60;
			return "+" + Math.round(result) + " h";
		}

		result = ms/1000/60/60/24;
		return "+" + Math.round(result) + " days";
	};
})
.filter('avgTimeFilter', function() {
	return function(time) {
		if(time < 60)
			return Math.round(time) + ' s';

		return moment.duration(Math.round(time), 's').humanize();
	};
})
.filter('avgTimeClass', function() {
	return function(time) {
		return blockTimeClass(time);
	}
})
.filter('upTimeFilter', function() {
	return function(uptime) {
		return Math.round(uptime) + '%';
	};
})
.filter('upTimeClass', function() {
	return function(uptime, active) {
		if( ! active )
			return 'text-gray';

		if(uptime >= 90)
			return 'text-success';

		if(uptime >= 75)
			return 'text-warning';

		return 'text-danger';
	};
})
.filter('geoTooltip', function() {
	return function(node) {
		var tooltip = [];
		var string = '';

		if(node.info.node !== '') {
			var eth_version = node.info.node.split('/');

			if(eth_version[1][0] !== 'v' && eth_version[1][2] !== '.')
			{
				eth_version.splice(1,1);
			}

			string = "<b>" + node.info.node + "</b>";
			tooltip.push(string);

			string = "Version: <b>" + (eth_version[1]) + "</b>";
			tooltip.push(string);
		}

		if(node.info.net !== '') {
			string = "Network: <b>" + (typeof node.info.net !== 'undefined' ? node.info.net : '-') + "</b>";

			tooltip.push(string);
		}

		if(node.info.protocol !== '') {
			string = "Protocol: <b>" + (typeof node.info.protocol !== 'undefined' ? node.info.protocol : '-') + "</b>";

			tooltip.push(string);
		}

		if(node.info.port !== '') {
			string = "Port: <b>" + (typeof node.info.port !== 'undefined' ? node.info.port : '30303') + "</b>";

			tooltip.push(string);
		}

		if(node.info.api !== '') {
			string = "Web3: <b>" + node.info.api + "</b>";

			tooltip.push(string);
		}

		if(node.info.client !== '') {
			string = "API: <b>" + (typeof node.info.client !== 'undefined' ? node.info.client : '<= 0.0.3') + "</b>";

			tooltip.push(string);
		}

		if(node.info.os !== '') {
			string = "OS: <b>" + (typeof node.info.os !== 'undefined' ? node.info.os + ' ' + node.info.os_v : '?') + "</b>";

			tooltip.push(string);
		}

		if(node.geo !== null)
		{
			string = "Location: <b>";

			if(node.geo.city !== '')
				string += node.geo.city + ", ";
			string += node.geo.country + "</b>";

			tooltip.push(string);
		}

		if(node.info.contact !== '') {
			string = "Contact: <b>" + (typeof node.info.contact !== 'undefined' ? node.info.contact : '-') + "</b>";

			tooltip.push(string);
		}

		return tooltip.join("<br>");
	};
})
.filter('bubbleClass', function() {
	return function(node, bestBlock) {
		return mainClass(node, bestBlock).replace('text-', '');
	};
})
.filter('minerNameFilter', function() {
	return function(address, name) {
		if(typeof name !== 'undefined' && name !== false && name.length > 0)
			return name;

		return address.replace('0x', '');
	};
})
.filter('minerBlocksClass', function() {
	return function(blocks, prefix) {
		if(typeof prefix === 'undefined')
			prefix = 'bg-';
		if(blocks <= 6)
			return prefix + 'success';

		if(blocks <= 12)
			return prefix + 'info';

		if(blocks <= 18)
			return prefix + 'warning';

		return prefix + 'danger';
	};
});

function mainClass(node, bestBlock)
{
	if( ! node.active)
		return 'text-gray';

	if(node.peers === 0)
		return 'text-danger';

	return peerClass(node.peers, node.active);
}

function peerClass(peers, active)
{
	if( ! active)
		return 'text-gray';

	return (peers <= 1 ? 'text-danger' : (peers > 1 && peers < 4 ? 'text-warning' : 'text-success'));
}

function timeClass(timestamp)
{
	var diff = ((new Date()).getTime() - timestamp)/1000;

	return blockTimeClass(diff);
}

function blockTimeClass(diff)
{
	if(diff <= 12)
		return 'text-success';

	if(diff <= 20)
		return 'text-warning';

	if(diff <= 30)
		return 'text-orange';

	return 'text-danger'
}