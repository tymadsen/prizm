define([
	'underscore',
	'backbone',
	'models/pieces/piece'
], function(_, Backbone, PieceModel) {
	/* Additional Attributes
	=============================
	{
		locks: Int
	}
	*/

	var LockPieceModel = PieceModel.extend({
		hit: function() {
			if (this.get('locks') > 0) {
				this.set('locks', this.get('locks') - 1);
			}

			if (this.get('locks') <= 0) {
				this.set('deleted', true);
			}
		}
	});

	return LockPieceModel;
});
