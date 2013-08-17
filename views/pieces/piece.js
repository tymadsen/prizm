define([
	'underscore',
	'backbone',
	'zepto'
], function(_, Backbone, $) {
	var colorClassMap = {
		0: 'white',
		1: 'rainbow',
		2: 'red',
		3: 'orange',
		4: 'yellow',
		5: 'green',
		6: 'blue',
		7: 'violet',
		8: 'magenta'
	};

	return Backbone.View.extend({
		tagName: 'div',

		className: 'piece',

		events: {
			"mousedown":                           "pointerDown",
			"click > .list-item button:eq(0)": "promptUpdateTicket",
			"click > .list-item button:eq(1)": "promptCreateTicketUpdate"
		},

		initialize: function(options) {
			this.board = options.board;
			this.x = _.isNumber(options.x) ? options.x : this.model.get('x');
			this.y = _.isNumber(options.y) ? options.y : this.model.get('y');

			this.$el.append('<div></div>');

			if (colorClassMap[this.model.get('color')])
				this.$el.addClass('piece-color-' + colorClassMap[this.model.get('color')]);

			if (this.model.get('className') != 'piece')
				this.$el.addClass('piece-' + this.model.get('className'));

			this.$el.css({
				'top': this.y*this.board.pieceSize + 'px',
				'left': this.x*this.board.pieceSize + 'px'
			});
		},

		render: function(instant) {
			if (this.x != this.model.get('x') || this.y != this.model.get('y')) {
				if (instant) {
					this.setPosition();
				}
				else {
					this.$el.one('webkitTransitionEnd', _.bind(this.setPosition, this)).css({
						'-webkit-transform': 'translate(' + 
							(this.model.get('x') - this.x)*this.board.pieceSize + 'px, ' + 
							(this.model.get('y') - this.y)*this.board.pieceSize + 'px)'
					});
				}
			}

			return this;
		},

		setPosition: function() {
			this.x = this.model.get('x');
			this.y = this.model.get('y');

			this.$el.addClass('static').css({
				'top': this.y*this.board.pieceSize + 'px',
				'left': this.x*this.board.pieceSize + 'px',
				'-webkit-transform': ''
			});

			setTimeout(_.bind(function() {
				this.$el.removeClass('static');
			}, this), 1);

		},

		pointerDown: function(e) {
			this.board.pointerDown(e, this);
		}
	});
});
