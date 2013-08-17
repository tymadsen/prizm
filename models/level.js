define([
	'underscore',
	'backbone'
], function(_, Backbone) {

	/* Attributes
	=============================
	{
		// level info (read-only)
		name: String,
		pieces: Array[Object],
		tiles: Array[Object],
		boardWidth: Int,
		boardHeight: Int,
		colorCount: Int,
		l1Time: Int,
		l1Score: Int,
		l1Moves: Int,
		l2Time: Int,
		l2Score: Int,
		l2Moves: Int,
		l3Time: Int,
		l3Score: Int,
		l3Moves: Int,

		// player info
		bestTime: Int,
		bestScore: Int,
		bestMoves: Int,
		attempts: Int,
		completions: Int
	}
	*/

	return Backbone.Model.extend({
		defaults: {
			bestTime: -1,
			bestScore: 0,
			bestMoves: -1,
			attempts: 0,
			completions: 0
		},

		/** @type {BoardModel} */
		board: null,

		totalTime: 0,

		start: function() {
			this.resume();
		},

		pause: function() {
			this.paused = true;
			this.existingTime = this.totalTime;
			if (this.timeInterval)
				clearInterval(this.timeInterval);
		},

		resume: function() {
			this.paused = false;
			this.startTime = new Date();
			this.timeInterval = setInterval(_.bind(function() {
				this.totalTime = this.existingTime + (new Date()).getTime() - this.startTime.getTime();
			}, this), 500);
		},

		/** @return {Int} time in seconds */
		ellapsedTime: function() {
			return Math.floor(this.totalTime/1000);
		},

		getBoard: function(callback, opt_context) {
			if (this.board) {
				callback.call(opt_context, this.board);
				return;
			}

			require.withContext(['models/board'], function(BoardModel) {
				this.board = new BoardModel({}, {
					level: this
				});
				callback.call(opt_context, this.board);
			}, this);
		}
	});
});
