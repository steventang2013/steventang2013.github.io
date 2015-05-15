function TicTacToe() {

	this.board = new Array();

	for (var i = 0; i < 3; i++) {
		this.board[i] = new Array();
		for (var j = 0; j < 3; j++) {
			this.board[i][j] = '';
		}
	}

};

TicTacToe.prototype.get_board = function() {
	return this.board;
};

TicTacToe.prototype.reset_board = function() {
	for (var i = 0; i < 3; i++){
		for (var j = 0; j < 3; j++){
			this.board[i][j] = '';
		}
	}
}

TicTacToe.prototype.make_player_move = function(i,j) {
	//invalid move (off grid or symbol already on grid)
	if (!(i >= 0 && i <= 2 && j >= 0 && j <= 2) ||
		this.board[i][j] != '') {
		return false;
	}

	this.board[i][j] = 'x';
	return true;
};

TicTacToe.prototype.make_ai_move = function() {
	//finds best move using alpha_beta pruning
	var best_move = alpha_beta(this);
	this.board[best_move[0]][best_move[1]] = 'o';
};

TicTacToe.prototype.get_moves = function(player) {

	var moves = new Array();

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if(this.board[i][j] == '') {
				moves.push([i,j]);
			}
		}
	}

	return moves;

};

TicTacToe.prototype.is_terminal = function() {
	var no_spaces = true;
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if(this.board[i][j] == '') {
				no_spaces = false;
			}
		}
	}
	//return draw or someone wins (ai wins, you can't beat this)
	return (no_spaces || this.get_score() != 0);
};

TicTacToe.prototype.get_score = function() {
	var scoreBoard = new Array();
	var board = this.board;
	//first, second, third row
	scoreBoard.push(board[0]);
	scoreBoard.push(board[1]);
	scoreBoard.push(board[2]);
	//first, second, third column
	scoreBoard.push([board[0][0],board[1][0],board[2][0]]);
	scoreBoard.push([board[0][1],board[1][1],board[2][1]]);
	scoreBoard.push([board[0][2],board[1][2],board[2][2]]);
	//diagonals
	scoreBoard.push([board[0][0],board[1][1],board[2][2]]);
	scoreBoard.push([board[2][0],board[1][1],board[0][2]]);
	
	if (scoreBoard[0][0] == scoreBoard[1][1] &&
		scoreBoard[1][1] == scoreBoard[2][2] &&
		scoreBoard[0][0] == 'x'){
			return 1;
		}

	if (scoreBoard[0][0] == scoreBoard[1][1] &&
		scoreBoard[1][1] == scoreBoard[2][2] &&
		scoreBoard[0][0] == 'o'){
			return -1;
		}
		
	for (var i = 0; i < scoreBoard.length; i++) {
		//you win
		if (scoreBoard[i][0] == scoreBoard[i][1] &&
			scoreBoard[i][1] == scoreBoard[i][2] &&
			scoreBoard[i][0] == 'x') {
			return 1;
		}
		//ai wins
		if (scoreBoard[i][0] == scoreBoard[i][1] &&
			scoreBoard[i][1] == scoreBoard[i][2] &&
			scoreBoard[i][0] == 'o') {
			return -1;
		}
	}

	return 0;
};

TicTacToe.prototype.get_next = function(move,player) {
	if (player == "max") {
		player = 'x';
	} else {
		player = 'o';
	}

	var next_state = new TicTacToe();
	next_state.board = copy_board(this.board);
	next_state.board[move[0]][move[1]] = player;

	return next_state;
};

function alpha_beta(state) {
	//worst case for alpha -100000, worst case for beta 100000
	return min_value(state,-100000,100000,true);

};

function max_value(state,alpha,beta,is_first) {

	var is_first = is_first || false;

	if (state.is_terminal()) {
		return state.get_score();
	}

	var value = -100000;
	var moves = state.get_moves("max");
	var min;
	//randomly select
	var best_move = moves[0];

	//returns a copy of the board with player (for all possible player moves) and calls min_value for it
	for (var i = 0; i < moves.length; i++) {
		min = min_value(state.get_next(moves[i],"max"),alpha,beta,false);
		
		//since this is max node, see if min is greater than the current value. Replace if it is.
		if (min > value){ 
			value = min; 
			best_move = moves[i];
		}
		//prune
		if (value >= beta) {
			return value;
		}
		//pass up value to alpha in tree
		if (value > alpha)
			alpha = value;
	}
	return value;
};

function min_value(state,alpha,beta,is_first) {

	var is_first = is_first || false;

	if (state.is_terminal()) {
		return state.get_score();
	}

	var value = 100000;
	var moves = state.get_moves("min");
	var max;
	//set best_move to random for now
	var best_move = moves[0];

	//returns a copy of the board with ai (for all possible ai moves) and calls max_value for it
	for (var i = 0; i < moves.length; i++) {
		max = max_value(state.get_next(moves[i],"min"),alpha,beta,false);
		
		//since this is min node, check to see if max is less than value
		if (max < value){
			value = max;
			best_move = moves[i];
		}
		//prune
		if (value <= alpha) {
			if (is_first) return moves[i];
			return value;
		}
		//pass up value to beta in tree
		if (value < beta)
			beta = value;
	}
	//is_first will ultimately return the move
	if (is_first) {
		return best_move;
	} else {
		return value;
	}

};

function copy_board(board) {
	var new_board = Array();
	for (var i = 0; i < board.length; i++) {
		new_board[i] = board[i].slice(0);
	}
	return new_board;
};
