define([
	'underscore',
	'backbone',
	'models/pieces/piece'
], function(_, Backbone, PieceModel) {
	var WallPieceModel = PieceModel.extend({
		defaults: {
			fixed: true
		},

		hit: function() {
			// do nothing
		}
	});

	_.defaults(WallPieceModel.prototype.defaults, PieceModel.prototype.defaults);

	return WallPieceModel;
});
