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

			this.fillEmptySpaces();

			this.pointerMoveHandler = _.bind(this.pointerMove, this);
			this.pointerUpHandler = _.bind(this.pointerUp, this);
		},

		cleanupboard: function() {
			var change = false;
			var me = this;
			_.each(this.pieces, function(piece){
				if(me.resolve(piece))
					change = true;
			});
			if(change)
				this.render();
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
			this.model.eachSpace(function(piece, x, y) {
				if (piece && piece.get('deleted')) {
					this.model.pieces.remove(piece);
					if (this.pieces[piece.cid]) {
						this.pieces[piece.cid].remove();
						delete this.pieces[piece.cid];
					}
				}
			}, this);
			this.model.invalidate();
		},

		settlePieces: function() {
			// TODO: fix
			// this.model.eachSpace(function(piece, x, y) {
			// 	if (!piece) {
			// 		var falling = this.model.piecesAbove(x, y),
			// 			curY = y;

			// 		_.each(falling, function(piece) {
			// 			piece.set('y', curY);
			// 			curY--;

			// 			if (this.pieces[piece.cid]) {
			// 				this.pieces[piece.cid].render();
			// 			}
			// 		}, this);
			// 	}
			// }, this);
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
			this.cleanupboard();

			return this;
		},

		tryMovePiece: function(piece, x, y) {
			var otherPiece = this.model.getPiece(x, y);

			if (!piece || !otherPiece)
				return false;

			var p1View = this.pieces[piece.cid],
				p2View = this.pieces[otherPiece.cid];

			if (p1View && p2View && this.model.swapPieces(piece, otherPiece)) {

				// if nothing happened, swap them back
				if (!this.resolve(piece)) {
					this.model.swapPieces(piece, otherPiece);
					// TODO: show a switch and switch back animation
				}

				this.selectedPiece = null;
				this.pointerUp();
				p1View.render();
				p2View.render();

				this.render();
				return true;
			}

			return false;
		},

		resolve: function(movedPiece) {
			var rows,
				ret = false;

			this.model.eachSpace(function(rootPiece, x, y) {
				if (!rootPiece)
					return;

				rows = [
					[
						rootPiece,
						this.model.getPiece(x, y + 1),
						this.model.getPiece(x, y + 2)
					],[
						rootPiece,
						this.model.getPiece(x + 1, y),
						this.model.getPiece(x + 2, y)
					]
				];

				var matchedRow = _.find(rows, function(row) {
					return _.every(row, function(piece) {
						return piece && !piece.get('deleted') && piece.get('color') == rootPiece.get('color');
					});
				});

				if (matchedRow) {
					ret = true;
					_.each(matchedRow, function(piece) {
						piece.set('deleted', true);
					});
				}
			}, this);

			return ret;
		},
		
		pointerDown: function(e, piece) {
			this.pointerUp();

			this.dragStartX = e.pageX;
			this.dragStartY = e.pageY;

			this.listenTo($(document), PointerEvent.MOVE, this.pointerMoveHandler);
			this.listenTo($(document), PointerEvent.UP, this.pointerUpHandler);

			if (this.selectedPiece) {
				if (!this.tryMovePiece(this.selectedPiece.model, piece.model.get('x'), piece.model.get('y'))) {
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
					this.tryMovePiece(
						this.selectedPiece.model,
						this.selectedPiece.model.get('x') + (dx > 0 ? 1 : -1),
						this.selectedPiece.model.get('y')
					);
				}
			}
			// vertical
			else {
				if (Math.abs(dy) > threshold) {
					this.tryMovePiece(
						this.selectedPiece.model,
						this.selectedPiece.model.get('x'),
						this.selectedPiece.model.get('y') + (dy > 0 ? 1 : -1)
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
