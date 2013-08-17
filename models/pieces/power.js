define([
	'underscore',
	'backbone',
	'models/pieces/piece'
], function(_, Backbone, PieceModel) {
	/* Additional Attributes
	=============================
	{
		power: Int,
		requiredPower: Int
	}
	*/

	var PowerPieceModel = PieceModel.extend({
		defaults: {
			power: 0
		},

		hit: function() {
			if (this.get('power') < this.get('requiredPower')) {
				this.set('power', this.get('power') + 1);
			}
		}
	});

	_.defaults(PowerPieceModel.prototype.defaults, PieceModel.prototype.defaults);

	return PowerPieceModel;
});
