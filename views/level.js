define([
	'underscore',
	'backbone',
	'zepto',
	'views/board'
], function(_, Backbone, $, BoardView) {
	return Backbone.View.extend({
		tagName: 'div',

		className: 'level',

		// events: {
		// 	"click":                           "toggleExpanded",
		// 	"click > .list-item button:eq(0)": "promptUpdateTicket",
		// 	"click > .list-item button:eq(1)": "promptCreateTicketUpdate"
		// },

		initialize: function() {
			this.model.getBoard(function(board) {
				this.listenTo(this.model, "change", this.render);
				this.board = new BoardView({
					model: board,
					container: this.$el
				});
				this.$el.append(this.board.render().el);
			}, this);
		},

		render: function() {
			// update timer, score, move count, etc.
			return this;
		}
	});
});
