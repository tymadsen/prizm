define([
	'underscore',
	'backbone',
	'models/pieces/std',
	'models/pieces/player',
	'models/pieces/wall',
	'models/pieces/power',
	'models/pieces/lock'
], function(_, Backbone, StdPiece, PlayerPiece, WallPiece, PowerPiece, LockPiece) {
	var pieceModels = [
			StdPiece,
			PlayerPiece,
			WallPiece,
			PowerPiece,
			LockPiece
		],
		defaultPiece = pieceModels[0];

	return Backbone.Collection.extend({
		model: function(attrs, options) {
			var ret = pieceModels[attrs.type] || defaultPiece;
			return new ret(attrs, options);
		}
	});
});
