define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var Colors = {
			NONE: 0,
			ALL: 1,
			A: 2,
			B: 3,
			C: 4,
			D: 5,
			E: 6,
			F: 7,
			G: 8
		},
		StdColorList = _.without(_.keys(Colors), 'NONE', 'ALL');

	// just in case
	StdColorList.sort();

	/* Attributes
	=============================
	{
		type: Int,
		color: Enum,
		className: String,
		x: Int,
		y: Int,
		fixed: Boolean,
		deleted: Boolean
	}
	*/

	var PieceModel = Backbone.Model.extend({
		defaults: {
			type: 0,
			className: 'piece',
			fixed: false,
			deleted: false
		},

		initialize: function(attr, options) {
			this.board = options.board;
		},

		hit: function() {
			this.set('deleted', true);
		},

		canMove: function() {
			return this.get('fixed');
		}
	}, {
		Colors: Colors,
		getRandomColor: function(colorCount) {
			colorCount = Math.min(colorCount, StdColorList.length);
			return PieceModel.Colors[StdColorList[Math.floor(Math.random()*colorCount)]];
		}
	});

	return PieceModel;
});
