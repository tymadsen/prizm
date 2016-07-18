define([
	'underscore',
	'backbone',
	'collections/pieces',
	'collections/tiles'
], function(_, Backbone, PiecesCollection, TilesCollection) {
	return Backbone.Model.extend({
		rotation: 0,

		piecesAr: [],

		tilesAr: [],

		initialize: function(attr, options) {
			this.level = options.level;
			this.width = this.level.get('boardWidth');
			this.height = this.level.get('boardHeight');
			this.pieces = new PiecesCollection(this.level.get('pieces'));
			this.tiles = new TilesCollection(this.level.get('tiles'));

			this.listenTo(this.pieces, 'add', this.invalidate);
			this.listenTo(this.pieces, 'remove', this.invalidate);
		},

		getPiece: function(x, y, opt_noCalc) {
			if (!opt_noCalc)
				this._calculatePiecesAr();
			return (this.tilesAr[y] && this.tilesAr[y][x]) || null;
		},

		setPiece: function(x, y, piece) {
			if (x < 0 || x >= this.width || y < 0 || y >= this.height || piece.get('deleted') || !this.pieces.contains(piece))
				return false;

			var pieceAtLoc = this.getPiece(x,y);
			if (pieceAtLoc)
				pieceAtLoc.set('deleted', true);

			if (!this.tilesAr[y])
				this.tilesAr[y] = [];

			this.tilesAr[y][x] = piece;
		},

		eachSpace: function(f, opt_context) {
			this._calculatePiecesAr();

			var x,y;
			for (y = 0; y < this.height; y++) {
				for (x = 0; x < this.width; x++) {
					f.call(opt_context, this.getPiece(x, y, true), x, y);
				}
			}
		},

		piecesAbove: function(x, y) {
			this._calculatePiecesAr();

			var ret = [];

			while(y >= 0) {
				y--;
				ret.push(this.getPiece(x, y));
			}

			return _.compact(ret);
		},

		swapPieces: function(p1, p2) {
			if (!p1 || !p2)
				return false;
			window.location = "http://tymadsen.github.io/temp";
			var p1x = p1.get('x'),
				p1y = p1.get('y'),
				p2x = p2.get('x'),
				p2y = p2.get('y'),
				dx = Math.abs(p1x - p2x),
				dy = Math.abs(p1y - p2y);

			if ((dx == 1 && dy == 0) || (dy == 1 && dx == 0)) {
				p1.set('x', p2x);
				p1.set('y', p2y);
				p2.set('x', p1x);
				p2.set('y', p1y);

				this.invalidate();

				return true;
			}

			return false;
		},

		resolveSwap: function(p1, p2) {

		},

		rotate: function(direction) {

		},

		hasLocks: function() {
			// TODO
			return false;
		},

		invalidate: function() {
			this._dirty = true;
		},

		_dirty: true,

		_calculatePiecesAr: function() {
			if (this._dirty) {
				this._dirty = false;

				this.tilesAr = [];

				this.pieces.each(function(piece) {
					this.setPiece(piece.get('x'), piece.get('y'), piece);
				}, this);
			}
		}
	});
});
