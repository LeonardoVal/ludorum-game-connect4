(function (init) { "use strict";
			if (typeof define === 'function' && define.amd) {
				define(["creatartis-base","sermat","ludorum"], init); // AMD module.
			} else if (typeof exports === 'object' && module.exports) {
				module.exports = init(require("creatartis-base"),require("sermat"),require("ludorum")); // CommonJS module.
			} else {
				this.Sermat = init(this.base,this.Sermat,this.ludorum); // Browser.
			}
		}).call(this,/** Package wrapper and layout.
*/
function __init__(base, Sermat, ludorum) { "use strict";
// Import synonyms. ////////////////////////////////////////////////////////////////////////////////
	var declare = base.declare,
		//obj = base.obj,
		//copy = base.copy,
		raise = base.raise,
		raiseIf = base.raiseIf,
		Iterable = base.Iterable,
		iterable = base.iterable,
		Game = ludorum.Game,
		UserInterface = ludorum.players.UserInterface;

// Library layout. /////////////////////////////////////////////////////////////////////////////////
	var exports = {
		__package__: 'ludorum-game-connect4',
		__name__: 'ludorum_game_connect4',
		__init__: __init__,
		__dependencies__: [base, Sermat, ludorum],
		__SERMAT__: { include: [base, ludorum] }
	};


/** # ConnectFour.

Implementation of the [Connect Four game](http://en.wikipedia.org/wiki/Connect_Four), based on
Ludorum's `ConnectionGame`.
*/
var ConnectFour = exports.ConnectFour = declare(ludorum.games.ConnectionGame, {
	name: 'ConnectFour',

	/** The default `height` of the board is 6 ...
	*/
	height: 6,

	/** ... and the default `width` of the board is 7.
	*/
	width: 7,

	/** The default `lineLength` to win the game is 4.
	*/
	lineLength: 4,

	/** The game's players are Yellow and Red, since these are the classic colours of the pieces.
	*/
	players: ['Yellow', 'Red'],

	/** The active players `moves()` are the indexes of every column that has not reached the top
	height.
	*/
	moves: function moves() {
		var result = null;
		if (!this.result()) {
			var ms = [],
				board = this.board.string,
				offset = (this.height - 1) * this.width;
			for (var i = 0; i < board.length; ++i) {
				if (board.charAt(offset + i) === '.') {
					ms.push(i);
				}
			}
			if (ms.length > 0) {
				result = {};
				result[this.activePlayer()] = ms;
			}
		}
		return result;
	},

	/** The `next(moves)` game state drops a piece at the column with the index of the active
	player's move.
	*/
	next: function next(moves, haps, update) {
		raiseIf(haps, 'Haps are not required (given ', haps, ')!');
		var activePlayer = this.activePlayer(),
			board = this.board.string,
			column = +moves[activePlayer],
			height = this.height,
			width = this.width;
		for (var row = 0; row < height; ++row) {
			if (board.charAt(row * width + column) === '.') {
				var v = activePlayer === this.players[0] ? '0' : '1';
				if (update) {
					this.activatePlayers(this.opponent());
					this.board.__place__([row, column], v);
					delete this.__moves__; // Invalidate cached values.
					delete this.__result__;
					return this;
				} else {
					return new this.constructor(this.opponent(),
						this.board.place([row, column], v));
				}
			}
		}
		throw new Error('Invalid move '+ JSON.stringify(moves) +'!');
	},

	result: function result() { //FIXME Workaround for bugs in Ludorum v0.2.0.
		var lineLength = this.lineLength,
			lines = this.board.asStrings(this.__lines__(this.height, this.width, lineLength)).join(' ');
		for (var i = 0; i < this.players.length; ++i) {
			if (lines.indexOf(i.toString(36).repeat(lineLength)) >= 0) {
				return this.victory([this.players[i]]);
			}
		}
		if (lines.indexOf('.') < 0) { // No empty squares means a tie.
			return this.tied();
		}
		return null; // The game continues.
	},

	// ## Utility methods ##########################################################################

	/** Serialization is delegated to the serializer of the parent class.
	*/
	'static __SERMAT__': {
		identifier: 'ConnectFour',
		serializer: function serialize_ConnectFour(obj) {
			return ludorum.games.ConnectionGame.__SERMAT__.serializer(obj);
		}
	},
}); // declare ConnectFour.

/** Adding Mancala to `ludorum.games`.
*/
ludorum.games.ConnectFour = ConnectFour;

/** Sermat serialization.
*/
ConnectFour.__SERMAT__.identifier = exports.__package__ +'.'+ ConnectFour.__SERMAT__.identifier;
exports.__SERMAT__.include.push(ConnectFour);
Sermat.include(exports);


// See __prologue__.js
	return exports;
}
);
//# sourceMappingURL=ludorum-game-connect4.js.map