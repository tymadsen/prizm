define([
	'underscore',
	'backbone',
	'zepto',
	'views/pieces/piece',
	'models/pieces/piece'
], function(_, Backbone, $, PieceView, PieceModel) {

	var PointerEvent = {
		DOWN: 'mousedown',
		MOVE: 'mousemove',
		UP: 'mouseup'
	};

	return Backbone.View.extend({
		tagName: 'div',

		className: 'board',

		pieceSize: 100,

		margin: 20,

		pieces: {},

		initialize: function(options) {
			this.container = options.container;
			this.calculatePieceSize();
			this.autoPosition();

			this.model.pieces.each(function(piece) {
				this.addPiece(piece);
			}, this);

			this.pointerMoveHandler = _.bind(this.pointerMove, this);
			this.pointerUpHandler = _.bind(this.pointerUp, this);
		},

		calculatePieceSize: function() {
			this.pieceSize = Math.floor(Math.min(
				(this.container.width() - 2*this.margin)/this.model.width,
				(this.container.height() - 2*this.margin)/this.model.height
			));
			return this;
		},

		autoPosition: function() {
			var boardWidth = this.pieceSize*this.model.width,
				boardHeight = this.pieceSize*this.model.height;

			this.$el.css({
				'top': Math.floor((this.container.height() - boardHeight)/2),
				'left': Math.floor((this.container.width() - boardWidth)/2),
				'width': boardWidth,
				'height': boardHeight
			});
		},

		addPiece: function(pieceModel, x, y) {
			this.pieces[pieceModel.cid] = new PieceView({
				model: pieceModel,
				board: this,
				x: x,
				y: y
			});
			this.$el.append(this.pieces[pieceModel.cid].el);
			setTimeout(_.bind(function() {
				this.pieces[pieceModel.cid].render();
			}, this), 200);
		},

		clearDeleted: function() {
			// TODO
		},

		settlePieces: function() {
			// TODO
		},

		fillEmptySpaces: function() {
			this.model.eachSpace(function(piece, x, y) {
				if (!piece) {
					var newPiece = this.model.pieces.model({
							type: 0,
							color: PieceModel.getRandomColor(this.model.level.get('colorCount')),
							x: x,
							y: y,
						});

					this.model.pieces.add(newPiece);

					this.addPiece(
						newPiece,
						x,
						-1
					);
				}
			}, this);
		},

		render: function() {
			this.clearDeleted();
			this.settlePieces();
			this.fillEmptySpaces();

			return this;
		},

		swapPieces: function(p1Model, p2Model) {
			if (!p1Model || !p2Model)
				return false;

			var p1View = this.pieces[p1Model.cid],
				p2View = this.pieces[p2Model.cid];

			if (p1View && p2View && this.model.swapPieces(p1Model, p2Model)) {
				this.selectedPiece = null;
				this.pointerUp();
				p1View.render();
				p2View.render();
				return true;
			}

			return false;
		},
		
		pointerDown: function(e, piece) {
			this.pointerUp();

			this.dragStartX = e.pageX;
			this.dragStartY = e.pageY;

			this.listenTo($(document), PointerEvent.MOVE, this.pointerMoveHandler);
			this.listenTo($(document), PointerEvent.UP, this.pointerUpHandler);

			if (this.selectedPiece) {
				if (!this.swapPieces(this.selectedPiece.model, piece.model)) {
					this.selectedPiece = piece;
				}
			}
			else {
				this.selectedPiece = piece;
			}
		},

		pointerMove: function(e) {
			var threshold = 20,
				dx = e.pageX - this.dragStartX,
				dy = e.pageY - this.dragStartY;

			if (!this.selectedPiece)
				return;

			// horizontal
			if (Math.abs(dx) > Math.abs(dy)) {
				if (Math.abs(dx) > threshold) {
					this.swapPieces(
						this.selectedPiece.model,
						this.model.getPiece(
							this.selectedPiece.model.get('x') + (dx > 0 ? 1 : -1),
							this.selectedPiece.model.get('y')
						)
					);
				}
			}
			// vertical
			else {
				if (Math.abs(dy) > threshold) {
					this.swapPieces(
						this.selectedPiece.model,
						this.model.getPiece(
							this.selectedPiece.model.get('x'),
							this.selectedPiece.model.get('y') + (dy > 0 ? 1 : -1)
						)
					);
				}
			}
		},

		pointerUp: function(e) {
			this.stopListening($(document), PointerEvent.MOVE, this.pointerMoveHandler);
			this.stopListening($(document), PointerEvent.UP, this.pointerUpHandler);
		}
	});
});
