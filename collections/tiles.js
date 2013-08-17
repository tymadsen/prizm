define([
	'underscore',
	'backbone',
	'models/tiles/tile',
	'models/tiles/finish',
	'models/tiles/portal'
], function(_, Backbone, Tile, FinishTile, PortalTile) {
	var tileModels = [
			Tile,
			FinishTile,
			PortalTile
		],
		defaultTile = tileModels[0];

	return Backbone.Collection.extend({
		model: function(attrs, options) {
			var ret = tileModels[attrs.type] || defaultTile;
			return new ret(attrs, options);
		}
	});
});
