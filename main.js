require.config({
	paths: {
		zepto: 'lib/zepto',
		underscore: 'lib/underscore',
		backbone: 'lib/backbone'
	},
	shim: {
		'zepto': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			exports: 'Backbone',
			deps: ['underscore']
		}
	}
});

require.withContext = function(modules, callback, opt_context) {
	require(modules, function() {
		callback.apply(opt_context, arguments);
	});
};

require([
	'zepto',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	var loadLevel = function(levelModelData, opt_callback) {
		require(['models/level','views/level'], function(LevelModel, LevelView) {
			var level = new LevelModel(levelModelData);
			var levelView = new LevelView({ model: level });
			$('body').empty().append(levelView.el);
			levelView.render();
		});
	};

	loadLevel({
		name: 'Test Level',
		pieces: [
			{
				type: 1,
				color: 0,
				x: 4,
				y: 3
			}
		],
		tiles: [],
		boardWidth: 9,
		boardHeight: 9,
		colorCount: 6,
		l1Time: 3000,
		l1Score: 1000,
		l1Moves: 100,
		l2Time: 2000,
		l2Score: 2000,
		l2Moves: 80,
		l3Time: 1000,
		l3Score: 3000,
		l3Moves: 50
	});
});
