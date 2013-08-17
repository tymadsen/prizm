define([
	'underscore',
	'backbone',
	'models/pieces/piece'
], function(_, Backbone, PieceModel) {
	var PlayerPieceModel = PieceModel.extend({
		defaults: {
			className: 'player'
		},

		hit: function() {
			// do nothing on a hit
		},

		canMove: function() {
			return this.board.hasLocks();
		}
	});

	_.defaults(PlayerPieceModel.prototype.defaults, PieceModel.prototype.defaults);

	return PlayerPieceModel;
});
