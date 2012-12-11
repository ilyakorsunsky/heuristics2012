var chessBoard = InitBoard();
var boardIds = InitBoardIds();

var whiteKingHasMoved = false;
var blackKingHasMoved = false;

//var blackHasChecked = false;
var whiteCanCheck = false;


var whiteKingPosition = [0, 5]; //shortcut to prevent searching entire board for king
var blackKingPosition = [3, 5];

var specWhiteKingPosition = null;
var specBlackKingPosition = null;

var currentMove = 'white';

var piecesCheckingWlocs = []; // locations of pieces that put white king into check
var piecesCheckingBlocs = []; // locations of pieces that put black king into check


var nPlyW = 0;
var nPlyB = 0;

var gameOver = false;
var winner = 'not set';

function getWinner() {
	return winner; 
}



$(document).ready(function(){
   
	if (!gameOver) {

	   $('.piece').draggable({
			revert: 'invalid'
	   });
	   $('.bl').draggable("disable");
	   
	   $('.space').droppable({
				hoverClass: 'piece-hover',
				drop: function(event, ui) {
					performMove(ui.draggable, $(this));
					switchTurn();
				},
				accept: function(droppedPiece) {
					return isMoveLegal(droppedPiece, $(this));
				}
	   });
	};
});
   

function InitBoardIds()
{
	var res = [];
	for (var i=0; i < 4; i++) 
		res[i] = [];
	res[0][0] = 'a1';
	res[0][1] = 'b1';
	res[0][2] = 'c1';
	res[0][3] = 'd1';

	res[1][0] = 'a2';
	res[1][1] = 'b2';
	res[1][2] = 'c2';
	res[1][3] = 'd2';

	res[2][0] = 'a3';
	res[2][1] = 'b3';
	res[2][2] = 'c3';
	res[2][3] = 'd3';

	res[3][0] = 'a4';
	res[3][1] = 'b4';
	res[3][2] = 'c4';
	res[3][3] = 'd4';

	return res;

}

function InitBoard()
{
	// init pieces to start
	var king = {};
	king['white'] = {type: 'king', color: 'white', value: 100};
	king['black'] = {type: 'king', color: 'black', value: 100};
	
	var queen = {};
	queen['white'] = {type: 'queen', color: 'white', value: 9};
	queen['black'] = {type: 'queen', color: 'black', value: 9};
	
	var rook = {};
	rook['white1'] = {type: 'rook', color: 'white', value: 5};
	rook['white2'] = {type: 'rook', color: 'white', value: 5};
	rook['black1'] = {type: 'rook', color: 'black', value: 5};
	rook['black2'] = {type: 'rook', color: 'black', value: 5};
	
	var knight = {};
	knight['white1'] = {type: 'knight', color: 'white', value: 3};
	knight['white2'] = {type: 'knight', color: 'white', value: 3};
	knight['black1'] = {type: 'knight', color: 'black', value: 3};
	knight['black2'] = {type: 'knight', color: 'black', value: 3};
	
	
	var bishop = {};
	bishop['white1'] = {type: 'bishop', color: 'white', value: 3};
	bishop['white2'] = {type: 'bishop', color: 'white', value: 3};
	bishop['black1'] = {type: 'bishop', color: 'black', value: 3};
	bishop['black2'] = {type: 'bishop', color: 'black', value: 3};

	var newBoard = [];
	
	// initiate multi-dimensional array for newBoard
	for (var i=0; i<4; i++)
	{
		newBoard[i] = [];
		for (var j=0; j<8;j++){
			newBoard[i][j] = null;
		}
	}

	newBoard[0][4] = rook['white1'];
	newBoard[0][7] = rook['white2'];
	newBoard[3][4] = rook['black1'];
	newBoard[3][7] = rook['black2'];
				
	newBoard[1][4] = knight['white1'];
	newBoard[1][6] = knight['white2'];
	newBoard[2][4] = knight['black1'];
	newBoard[2][6] = knight['black2'];
				
	newBoard[1][5] = bishop['white1'];
	newBoard[1][7] = bishop['white2'];
	newBoard[2][5] = bishop['black1'];
	newBoard[2][7] = bishop['black2'];
				
	newBoard[0][6] = queen['white'];
	newBoard[3][6] = queen['black'];
				
	newBoard[0][5] = king['white'];
	newBoard[3][5] = king['black'];

	return newBoard;
}

function isOccupied(row, column)
{
	var targetPiece = chessBoard[row][column];
	if (targetPiece == null)
		return 'empty';
	else {
		if (targetPiece.color == 'white')
			return 'white';
		else
			return 'black';
	}
}

function isOnBoard(row, column)
{
	if (row < 0 || row > 3 || column < 0 || column > 3)
		return false;
	else
		return true;
}



function convertSpaceModelToDom(spaces)
{
	/* takes array of spaces and returns string that represents
	 * multiple selectors which can be used by jQuery
	 */
	var domSelectors = [];
	
	for (var i=0; i<spaces.length; i++)
	{
		domSelectors.push(".row" + spaces[i][0] + ".col" + spaces[i][1]);
	}
	return domSelectors.join(", ");
}

function convertSpaceDomToModel(selector)
{
	/* takes jQuery selector string, splits into
	 * array of locations
	 */
	var locations = [];
	var selectors = selector.split(' ');
	for (var i=0; i<selectors.length; i++)
	{
		var curSelector = [];
		curSelector[0] = parseInt(selectors[i].substr(4,1));
		curSelector[1] = parseInt(selectors[i].substr(9,1));
		locations.push(curSelector);
	}
	return locations;	
}

function switchTurn()
{

	// special rule: white cannot check the black king until either 
	// (1) black checked white king, or
	// (2) white has made 10 moves (after moving king)
	specBlackKingPosition = blackKingPosition;
	specWhiteKingPosition = whiteKingPosition;
	var checkResult = performCheckTest(chessBoard);
	if (!whiteCanCheck) {
		if (currentMove == 'black' && checkResult == 'white')
			whiteCanCheck = true;
		if (nPlyW >= 10)						
			whiteCanCheck = true;
	}
	

	// if not first turn and will return true, then count # of plies
	if (!blackKingHasMoved) {
		if (currentMove == "white") { 
			whiteKingHasMoved = true; 
		}
		else { 
			blackKingHasMoved = true;
		}
	}
	else {
		if (currentMove == "white") nPlyW = nPlyW+1;
		else nPlyB = nPlyB+1;
	}

	// the actual switch routine
	if (currentMove == "white")
	{
		currentMove = "black";
		if (!gameOver) {
			specBlackKingPosition = blackKingPosition;
			specWhiteKingPosition = whiteKingPosition;
			var checkStatus = performCheckTest(chessBoard);

/*
			// if king is in check, color the king position
			if (checkStatus == 'black' || checkStatus == 'both') {
				document.getElementsByClassName(boardIds[blackKingPosition[0]][blackKingPosition[1]])[0].style.backgroundColor = '#FF0000';				
				document.getElementsByClassName(boardIds[piecesCheckingBlocs[0][0]][piecesCheckingBlocs[0][1]])[0].style.backgroundColor = '#FF0000';					
			}
			else {
				for (var i=0; i< 4; i++) {
					for (var j=0; j< 4; j++) {
//						if ((i+j)%2 == 1)
//							document.getElementsByClassName(boardIds[i][j])[0].style.backgroundColor = '#ffffff';					
//							document.getElementsByClassName(boardIds[i][j])[0].c = ;					
//						else
//							document.getElementsByClassName(boardIds[i][j])[0].style.backgroundColor = '#99B2B7';					
//							document.getElementsByClassName(boardIds[i][j])[0].style.backgroundColor = '#99B2B7';
					}
				}
			}
*/
			document.getElementById('whose_turn').innerHTML = 'Move: Black';
			document.getElementById('ply_num').innerHTML = 'Ply: '.concat(nPlyB.toString());
		}
		$('.wh').draggable("disable");
		$('.bl').draggable("enable");
	}
	else
	{
		currentMove = "white";
		if (!gameOver) {
			specBlackKingPosition = blackKingPosition;
			specWhiteKingPosition = whiteKingPosition;
			var checkStatus = performCheckTest(chessBoard);

/*
			// if king is in check, color the king position
			if (checkStatus == 'white' || checkStatus == 'both') {
				document.getElementsByClassName(boardIds[piecesCheckingWlocs[0][0]][piecesCheckingWlocs[0][1]])[0].style.backgroundColor = '#FF0000';				
				document.getElementsByClassName(boardIds[whiteKingPosition[0]][whiteKingPosition[1]])[0].style.backgroundColor = '#FF0000';				
			}
			else {
				for (var i=0; i< 4; i++) {
					for (var j=0; j< 4; j++) {
						if ((i+j)%2 == 1)
							document.getElementsByClassName(boardIds[i][j])[0].style.backgroundColor = div.white;					
						else
							document.getElementsByClassName(boardIds[i][j])[0].style.backgroundColor = div.black;
					}
				}
			}
*/
			document.getElementById('whose_turn').innerHTML = 'Move: White';
			document.getElementById('ply_num').innerHTML = 'Ply: '.concat(nPlyW.toString());
		}
		$('.bl').draggable("disable");
		$('.wh').draggable("enable");
	}
}

function performMove(movedDomPiece, targetSpaceDom)
{
		
		// defensive coding to protecting against calls after dom has moved
		if (typeof movedDomPiece == 'undefined')
			return false;
		
		// get piece from location of dropped piece
		var pieceRow = parseInt(movedDomPiece.parent()[0].classList[3].substr(3, 1));
		var pieceCol = parseInt(movedDomPiece.parent()[0].classList[4].substr(3, 1));

		var movedPiece = chessBoard[pieceRow][pieceCol];
		
		var spaceRow = parseInt(targetSpaceDom[0].classList[3].substr(3, 1));
		var spaceCol = parseInt(targetSpaceDom[0].classList[4].substr(3, 1));
		
		// actually moved piece in model
		chessBoard[spaceRow][spaceCol] = movedPiece;
		chessBoard[pieceRow][pieceCol] = null;
		
		// need to keep track of king moves for check testing
		if (movedPiece.type == 'king')
		{
			if (movedPiece.color == 'white')
			{
				// keep track for castling
//				if (whiteKingHasMoved == false)
//					whiteKingHasMoved = true;
				whiteKingPosition = [spaceRow, spaceCol];
			}
			else
			{
//				if (blackKingHasMoved == false)
//					blackKingHasMoved = true;
				blackKingPosition = [spaceRow, spaceCol];
			}
		}		
		// empty, replace dom element
		$(targetSpaceDom).empty();
		$(targetSpaceDom).append(movedDomPiece);
		
		// reset css set by droppable since they don't expect node to be moved
		$(movedDomPiece).css('top', '0');
		$(movedDomPiece).css('left', '0');
		$(movedDomPiece).css('right', '0');
		
		pieceMoved = true;
		
		var checkResult = performCheckTest(chessBoard);

		// check for check and checkmate
		if (checkResult != "none")
		{
			if (testCheckMate()) {

				var v = document.getElementsByTagName("audio")[0];
				v.play();

				alert("Checkmate, " + currentMove + "wins!");
				document.getElementById('whose_turn').innerHTML = 'Game Over: Checkmate';
				gameOver = true;
				winner = currentMove;
			}
			else {
//				if (!blackHasChecked && currentMove == 'black')
//					blackHasChecked = true;
				alert("Check on " + checkResult + "!");
			}
		} 
		// check for stalemate
		else{
			var stalemateState = performStalemateTest();
			if (stalemateState == 'both' || (currentMove == 'white' && stalemateState == 'black') || (currentMove == 'black' && stalemateState == 'white')) {
				alert("Stalemate! " + stalemateState);
				document.getElementById('whose_turn').innerHTML = 'Game Over: Stalemate';
				gameOver = true;
				winner = 'nobody';
			}
		}
}

function isMoveLegal(movedDomPiece, targetSpaceDom)
{

		// get piece from location of dropped piece
		var pieceRow = parseInt(movedDomPiece.parent()[0].classList[3].substr(3, 1));
		var pieceCol = parseInt(movedDomPiece.parent()[0].classList[4].substr(3, 1));
		
		// for check testing
		specWhiteKingPosition = whiteKingPosition;
		specBlackKingPosition = blackKingPosition;

		// this is copying chessBoard[pieceCol] rather than chessBoard[pieceRow, pieceCol]
		var movedPiece = chessBoard[pieceRow][pieceCol];
		if (movedPiece == null)
			return false;

		
		var spaceRow = parseInt(targetSpaceDom[0].classList[3].substr(3, 1));
		var spaceCol = parseInt(targetSpaceDom[0].classList[4].substr(3, 1));
		
		if (movedPiece.type == 'king')
		{
			if (movedPiece.color == 'white')
				specWhiteKingPosition = [spaceRow, spaceCol];
			else
				specBlackKingPosition = [spaceRow, spaceCol];
		}
		
		
		var targetSpace = [spaceRow, spaceCol];
		var legalMoves = determineLegalMoves(movedPiece, pieceRow, pieceCol);
		
		for (var i=0; i<legalMoves.length; i++)
		{
			if ((targetSpace[0] == legalMoves[i][0]) && (targetSpace[1] == legalMoves[i][1]))
			{
				// finally, test if putting yourself in check, start by copying board for test case
				var specBoard = cloneObject(chessBoard);
				
				// move the piece on this spec board
				specBoard[spaceRow][spaceCol] = movedPiece;
				specBoard[pieceRow][pieceCol] = null;
				
				var checkResult = performCheckTest(specBoard);
				if (currentMove == checkResult || checkResult == "both")
					return false;

				// white cannot check before some special conditions are met (see switchTurn())
				if (currentMove == 'white' && !whiteCanCheck && checkResult != "none")
					return false;
				
				return true;
			}
		}
		return false;
}





function determineLegalMoves(piece, pieceRow, pieceCol)
{
	var legalMoves = []; // holds the return moves, a string of row, col pairs
	
	if (piece != null)
	{

		// make sure first moves are kings
		// white first move
		if (piece.color == 'white' && whiteKingHasMoved == false && piece.type != 'king') {
			return legalMoves;
		} 
		// black first move
		else if (piece.color == "black" && blackKingHasMoved == false && piece.type != "king") {
			return legalMoves;
		}
		// movement within playing board
		else if (isOnBoard(pieceRow,pieceCol)) {
			switch (piece.type)
			{
				case 'bishop':
					legalMoves = addDiagonalMoves(piece, pieceRow, pieceCol);
					break;
				case 'knight':
					legalMoves = addKnightMoves(piece, pieceRow, pieceCol);
					break;
				case 'rook':
					legalMoves = addStraightLineMoves(piece, pieceRow, pieceCol);
					break;			
				case 'queen':
					legalMoves = addDiagonalMoves(piece, pieceRow, pieceCol).concat(addStraightLineMoves(piece, pieceRow, pieceCol));
					break;
				case 'king':
					legalMoves = addKingMoves(piece, pieceRow, pieceCol);
					break;
			}
		} 
		// placement onto playing board
		else {
			for (var i=0; i < 4; i++) {
				for (var j=0; j < 4; j++) {
					var nextSpace = [i, j];
					var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
					if (spaceOccupied == "empty")
						legalMoves.push(nextSpace);
				}
			}
		}		
	}
	return legalMoves;	
		
}




function addStraightLineMoves(piece, pieceRow, pieceCol)
{
	var straightMoves = []; // holds return moves
	
	// start by going up in rows
	for (var i=pieceRow+1; i<4; i++)
	{
		var nextSpace = [i, pieceCol];
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			straightMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			straightMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// then down in rows
	for (var i=pieceRow-1; i>-1; i--)
	{
		var nextSpace = [i, pieceCol];
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			straightMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			straightMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// then up in columns
	for (var i=pieceCol+1; i<4; i++)
	{
		var nextSpace = [pieceRow, i];
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			straightMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			straightMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// finally down in columns
	for (var i=pieceCol-1; i>-1; i--)
	{
		var nextSpace = [pieceRow, i];
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			straightMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			straightMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	return straightMoves;
}

function addDiagonalMoves(piece, pieceRow, pieceCol)
{
	var diagonalMoves = [];
	
	// first determine moves going up both rows and cols
	var j = pieceCol + 1; // need to keep track of column as well
	for (var i=pieceRow+1; (i < 4 && j < 4); i++)
	{
		var nextSpace = [i, j];
		j++;
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			diagonalMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			diagonalMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// next determine moves going up rows, down cols
	j = pieceCol - 1;
	for (var i=pieceRow + 1; (i < 4 && j > -1); i++)
	{
		var nextSpace = [i, j];
		j--;
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			diagonalMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			diagonalMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// next determine moves going down rows, up cols
	j = pieceCol + 1;
	for (var i=pieceRow - 1; (i > -1 && j < 4); i--)
	{
		var nextSpace = [i, j];
		j++;
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			diagonalMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			diagonalMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// finally determine moves going down rows, down cols
	j = pieceCol - 1;
	for (var i=pieceRow-1; (i > -1 && j > -1); i--)
	{
		var nextSpace = [i, j];
		j--;
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			diagonalMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			diagonalMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	return diagonalMoves;
}

function addKnightMoves(piece, pieceRow, pieceCol)
{
	var knightMoves = [];
	// have to manually check moves here unless I figure out a shortcut later
	
	var nextSpace = [pieceRow+2, pieceCol+1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+2, pieceCol-1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-2, pieceCol+1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-2, pieceCol-1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+1, pieceCol+2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+1, pieceCol-2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-1, pieceCol+2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-1, pieceCol-2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	
	return knightMoves;
}

function addPawnMoves(piece, pieceRow, pieceCol)
{
	pawnMoves = [];
	
	if (piece.color == 'black')
	{
		// straight down one space
		if (isOccupied((pieceRow-1), pieceCol) == 'empty')
		{
			pawnMoves.push([pieceRow-1, pieceCol]);
			
			// if first space is empty, check if first move, if so, add two-space move
			if ((pieceRow == 6) && (isOccupied((pieceRow-2), pieceCol) == 'empty'))
				pawnMoves.push([pieceRow-2, pieceCol]);
			
		}
		// or capturing down diagonal spaces
		if (isOccupied((pieceRow-1), pieceCol-1) == 'white')
			pawnMoves.push([pieceRow-1, pieceCol-1]);
		if (isOccupied((pieceRow-1), pieceCol+1) == 'white')
			pawnMoves.push([pieceRow-1, pieceCol+1]);
	}
	else if (piece.color == 'white')
	{
		// straight down one space
		if (isOccupied((pieceRow+1), pieceCol) == 'empty')
		{
			pawnMoves.push([pieceRow+1, pieceCol]);
			if ((pieceRow == 1) && (isOccupied((pieceRow+2), pieceCol) == 'empty'))
				pawnMoves.push([pieceRow+2, pieceCol]);
		}
		// or capturing down diagonal spaces
		if (isOccupied((pieceRow+1), pieceCol-1) == 'black')
			pawnMoves.push([pieceRow+1, pieceCol-1]);
		if (isOccupied((pieceRow+1), pieceCol+1) == 'black')
			pawnMoves.push([pieceRow+1, pieceCol+1]);
	}
	return pawnMoves;
}

function addKingMoves(piece, pieceRow, pieceCol)
{
	kingMoves = [];
	
	// have to manually go through them as far as I know
	for (var i = -1; i < 2; i++)
	{
		for (var j = -1; j < 2; j++)
		{
			if (isOnBoard(pieceRow + i, pieceCol + j) && isOccupied(pieceRow + i, pieceCol + j) != piece.color)
				kingMoves.push([pieceRow + i, pieceCol + j]);
		}
	}
	
	return kingMoves;
}




function performCheckTest(testBoard)
{

	var realBoard = cloneObject(chessBoard);
	chessBoard = testBoard;

	piecesCheckingWlocs = [];
	piecesCheckingBlocs = [];


	var whiteKingChecked = false;
	var blackKingChecked = false;

	// remove black king hypothetically
	var rPosB = blackKingPosition[0];
	var cPosB = blackKingPosition[1];
	var kingB = testBoard[rPosB][cPosB];
	testBoard[rPosB][cPosB] = null;
	blackKingPosition = [3,5]; // initial starting position

	var targetR = specBlackKingPosition[0];
	var targetC = specBlackKingPosition[1];
	var targetPiece = testBoard[targetR][targetC];
	testBoard[targetR][targetC] = null;


	for (var x = 0; x < 4; x++)
	{
		for (var y = 0; y < 4; y++)
		{
			if (testBoard[x][y] != null)
			{
				var currentPiece = testBoard[x][y];
				var currentPieceMoves = determineLegalMoves(currentPiece, x, y);

				for (var z = 0; z < currentPieceMoves.length; z++) {
					if (currentPiece.color == "white" && (specBlackKingPosition[0] == currentPieceMoves[z][0]) && (specBlackKingPosition[1] == currentPieceMoves[z][1])) {
						if (piecesCheckingBlocs.indexOf([x,y]) == -1) {
							piecesCheckingBlocs.push([x,y]);
						}
						blackKingChecked = true;
					}
				}

				// if the target piece is the same as the specMove, add the piece back, and remove it again
				if (x == specBlackKingPosition[0] && y == specBlackKingPosition[1]) {
					testBoard[targetR][targetC] = targetPiece;
					for (var z = 0; z < currentPieceMoves.length; z++) {
						if (currentPiece.color == "white" && (specBlackKingPosition[0] == currentPieceMoves[z][0]) && (specBlackKingPosition[1] == currentPieceMoves[z][1])) {
							if (piecesCheckingBlocs.indexOf([x,y]) == -1) {
								piecesCheckingBlocs.push([x,y]);
							}
							blackKingChecked = true;
						}
					}

					var targetPiece = testBoard[targetR][targetC];
					testBoard[targetR][targetC] = null;
				}
			}
		}
	}

	testBoard[targetR][targetC] = targetPiece;

	// add back black king hypothetically
	testBoard[rPosB][cPosB] = kingB;
	blackKingPosition = [rPosB, cPosB];

	// remove white king hypothetically 
	var rPosW = whiteKingPosition[0];
	var cPosW = whiteKingPosition[1];
	var kingW = testBoard[rPosW][cPosW];
	testBoard[rPosW][cPosW] = null;
	whiteKingPosition = [0,5]; // initial starting position


	var targetR = specWhiteKingPosition[0];
	var targetC = specWhiteKingPosition[1];
	var targetPiece = testBoard[targetR][targetC];
	testBoard[targetR][targetC] = null;

	for (var x = 0; x < 4; x++)
	{
		for (var y = 0; y < 4; y++)
		{
			if (testBoard[x][y] != null)
			{
				var currentPiece = testBoard[x][y];
				var currentPieceMoves = determineLegalMoves(currentPiece, x, y);

				for (var z = 0; z < currentPieceMoves.length; z++) {
					if (currentPiece.color == "black" && (specWhiteKingPosition[0] == currentPieceMoves[z][0]) && (specWhiteKingPosition[1] == currentPieceMoves[z][1])) {
						if (piecesCheckingWlocs.indexOf([x,y]) == -1) {
							piecesCheckingWlocs.push([x,y]);
						}
						whiteKingChecked = true;
					}
				}

				// if the target piece is the same as the specMove, add the piece back, and remove it again
				if (x == specWhiteKingPosition[0] && y == specWhiteKingPosition[1]) {
					testBoard[targetR][targetC] = targetPiece;
					for (var z = 0; z < currentPieceMoves.length; z++) {
						if (currentPiece.color == "black" && (specWhiteKingPosition[0] == currentPieceMoves[z][0]) && (specWhiteKingPosition[1] == currentPieceMoves[z][1])) {
							if (piecesCheckingWlocs.indexOf([x,y]) == -1) {
								piecesCheckingWlocs.push([x,y]);
							}
							whiteKingChecked = true;
						}
					}

					var targetPiece = testBoard[targetR][targetC];
					testBoard[targetR][targetC] = null;
				}
			}
		}
	}

	testBoard[targetR][targetC] = targetPiece;

	// add back white king hypothetically
	testBoard[rPosW][cPosW] = kingW;
	whiteKingPosition = [rPosW, cPosW];


	// change chessBoard back to real value
	chessBoard = realBoard;

	if (whiteKingChecked && blackKingChecked)
		return "both";
	else if (whiteKingChecked)
		return "white";
	else if (blackKingChecked)
		return "black";
	else
		return "none";
}

// if this function is called, you already know that king is in check
// only need to check if there are no viable moves
function testCheckMate()
{


	if (currentMove == 'white') {
		// test things King can do to avoid check
		var r = blackKingPosition[0];
		var c = blackKingPosition[1];
		var piece = chessBoard[r][c];
		var moves = addKingMoves(piece, r, c);
		for (var i=0; i < moves.length; i++) {
			specBlackKingPosition = moves[i];
			var check = performCheckTest(chessBoard);
			if (check == 'white' || check == 'none')
				return false;
		}

		// update correct value of piecesCheckingBlocs
		specBlackKingPosition = blackKingPosition;
		performCheckTest(chessBoard);
		var offender = piecesCheckingBlocs[0];


		// if there are more than 1 pieces checking king, there is nothing you can do
		if (piecesCheckingBlocs.length > 1)
			return true;

		// test whether some figure on the board can kill offending piece
		for (var i=0; i < 4; i++) {
			for (var j=0; j < 4; j++) {
				// figure must be on board and black
				if (chessBoard[i][j] != null && isOnBoard(i,j) && chessBoard[i][j].color == 'black') {
					switch (chessBoard[i][j].type) {
						case 'bishop':
							if (bishopCanTake(i,j,chessBoard[i][j].color))
								return false;
							break;
						case 'knight':
							if (knightCanTake(i,j,chessBoard[i][j].color))
								return false;
							break;
						case 'rook':
							if (rookCanTake(i,j,chessBoard[i][j].color))
								return false;
							break;			
						case 'queen':
							if (queenCanTake(i,j,chessBoard[i][j].color))
								return false;
							break;
						case 'king':
							break;
					}
				}
			}
		}

		// test whether some figure on or off the board can block offending piece
		var path = []; // spaces between attacker and king
		switch (chessBoard[offender[0]][offender[1]].type) {
			case 'bishop':
				path = getDiagonalPath(offender[0],offender[1],chessBoard[offender[0]][offender[1]].color)
				break;
			case 'rook':
				path = getStraightLinePath(offender[0],offender[1],chessBoard[offender[0]][offender[1]].color)
				break;			
			case 'queen':
				if (offender[0] == blackKingPosition[0] || offender[1] == blackKingPosition[1])
					path = getStraightLinePath(offender[0],offender[1],chessBoard[offender[0]][offender[1]].color)
				else
					path = getDiagonalPath(offender[0],offender[1],chessBoard[offender[0]][offender[1]].color)
				break;
		}




		// if path is empty, then cannot block
		if (path.length > 0) {

			// consider all pieces, on and off board
			for (var i=0; i < 4; i++) {
				for (var j=0;  j < 8; j++) {
					if (chessBoard[i][j] != null && chessBoard[i][j].color == 'white') {
						// if figure is on board, it must be able to block without placing king in check again (from another piece)
						if (isOnBoard(i,j)) {
							var legalMoves = [];
							switch (chessBoard[i][j].type) {
								case 'bishop': 
									legalMoves = addDiagonalMoves(chessBoard[i][j],i,j);
									break;
								case 'rook':
									legalMoves = addStraightLineMoves(chessBoard[i][j],i,j);
									break;
								case 'knight':
									legalMoves = addKnightMoves(chessBoard[i][j],i,j);
									break;
								case 'queen':
									legalMoves = addStraightLineMoves(chessBoard[i][j],i,j).concat(addDiagonalMoves(chessBoard[i][j],i,j));
									break;
							}
							// check for overlap
							for (var x=0; x < legalMoves.length; x++) {
								for (var y=0; y < path.length; y++) {
									if (path[y][0] == legalMoves[x][0] && path[y][1] == legalMoves[x][1]) {

										// would this cause another check? 
										var testBoard = cloneObject(chessBoard);
										testBoard[path[y][0]][path[y][1]] = chessBoard[i][j]; // move piece to block temporarily
										testBoard[i][j] = null;
										var check = performCheckTest(testBoard);

										// if it doesn't cause another check, then this move is a good block, so no checkmate
										if (check == 'none' || check == 'white') 
											return false;
									}
								}
							}
						}
						// if figure has not been placed on board, it can block
						else
							return false;
					}
				}
			}
		}


		// when all else fails, you have checkmate
		return true;
	}
	// THE WHITE KING
	else {
		// test things King can do to avoid check
		var r = whiteKingPosition[0];
		var c = whiteKingPosition[1];
		var piece = chessBoard[r][c];
		var moves = addKingMoves(piece, r, c);
		for (var i=0; i < moves.length; i++) {
			specWhiteKingPosition = moves[i];
			var check = performCheckTest(chessBoard);
			if (check == 'black' || check == 'none')
				return false;
		}

		// update correct value of piecesCheckingWlocs
		specWhiteKingPosition = whiteKingPosition;
		performCheckTest(chessBoard);
		var offender = piecesCheckingWlocs[0];

		// if there are more than 1 pieces checking king, there is nothing you can do
		if (piecesCheckingWlocs.length > 1)
			return true;

		// test whether some figure on the board can kill offending piece
		for (var i=0; i < 4; i++) {
			for (var j=0; j < 4; j++) {
				// figure must be on board and white
				if (chessBoard[i][j] != null && isOnBoard(i,j) && chessBoard[i][j].color == 'white') {
					switch (chessBoard[i][j].type) {
						case 'bishop':
							if (bishopCanTake(i,j,chessBoard[i][j].color))
								return false;
							break;
						case 'knight':
							if (knightCanTake(i,j,chessBoard[i][j].color))
								return false;
							break;
						case 'rook':
							if (rookCanTake(i,j,chessBoard[i][j].color))
								return false;
							break;			
						case 'queen':
							if (queenCanTake(i,j,chessBoard[i][j].color))
								return false;
							break;
					}
				}
			}
		}



	if (whiteKingPosition[0] == 1) {
		document.write(whiteKingPosition);
	}

		// test whether some figure on or off the board can block offending piece
		// special case: cannot block a knight
		var path = []; // spaces between attacker and king
		switch (chessBoard[offender[0]][offender[1]].type) {
			case 'bishop':
//	document.write('bishop');

				path = getDiagonalPath(offender[0],offender[1],chessBoard[offender[0]][offender[1]].color)
				break;
			case 'rook':
//	document.write('bishop');

				path = getStraightLinePath(offender[0],offender[1],chessBoard[offender[0]][offender[1]].color)
				break;			
			case 'queen':
//	document.write('queen');
				if (offender[0] == whiteKingPosition[0] || offender[1] == whiteKingPosition[1])
					path = getStraightLinePath(offender[0],offender[1],chessBoard[offender[0]][offender[1]].color)
				else
					path = getDiagonalPath(offender[0],offender[1],chessBoard[offender[0]][offender[1]].color)
				break;
		}


	if (whiteKingPosition[0] == 1) {
		document.write(whiteKingPosition);
	}


		// if path is empty, then cannot block
		if (path.length > 0) {

	if (whiteKingPosition[0] == 1) {
		document.write(whiteKingPosition);
	}


			// consider all pieces, on and off board
			for (var i=0; i < 4; i++) {
				for (var j=0;  j < 8; j++) {
					if (chessBoard[i][j] != null && chessBoard[i][j].color == 'white') {
						// if figure is on board, it must be able to block without placing king in check again (from another piece)
						if (isOnBoard(i,j)) {
							var legalMoves = [];
							switch (chessBoard[i][j].type) {
								case 'bishop': 
									legalMoves = addDiagonalMoves(chessBoard[i][j],i,j);
									break;
								case 'rook':
									legalMoves = addStraightLineMoves(chessBoard[i][j],i,j);
									break;
								case 'knight':
									legalMoves = addKnightMoves(chessBoard[i][j],i,j);
									break;
								case 'queen':
									legalMoves = addStraightLineMoves(chessBoard[i][j],i,j).concat(addDiagonalMoves(chessBoard[i][j],i,j));
									break;
							}

	if (whiteKingPosition[0] == 1) {
		document.write(whiteKingPosition);
	}

							// check for overlap
							for (var x=0; x < legalMoves.length; x++) {
								for (var y=0; y < path.length; y++) {
									if (path[y][0] == legalMoves[x][0] && path[y][1] == legalMoves[x][1]) {

										// would this cause another check? 
										var testBoard = cloneObject(chessBoard);
										testBoard[path[y][0]][path[y][1]] = chessBoard[i][j]; // move piece to block temporarily
										testBoard[i][j] = null;
										var check = performCheckTest(testBoard);

										// if it doesn't cause another check, then this move is a good block, so no checkmate
										if (check == 'none' || check == 'black') 
											return false;
									}
								}
							}
						}
						// if figure has not been placed on board, it can block
						else
							return false;
					}
				}
			}
		}


		// when all else fails, you have checkmate
		return true;
	}
}

function cloneObject(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

// returns true if knight can take the offending piece 
// row, col and color are all attributes of the knight
// therefore, offending piece is opposite color
function knightCanTake(row,col,color) {
	if (color == 'white') 
		target = piecesCheckingWlocs[0];
	else 
		target = piecesCheckingBlocs[0];
	
	if (target[0] == row+2 && target[1] == col+1) return true;
	if (target[0] == row+2 && target[1] == col-1) return true;
	if (target[0] == row-2 && target[1] == col+1) return true;
	if (target[0] == row-2 && target[1] == col-1) return true;
	if (target[0] == row+1 && target[1] == col+2) return true;
	if (target[0] == row+1 && target[1] == col-2) return true;
	if (target[0] == row-1 && target[1] == col+2) return true;
	if (target[0] == row-1 && target[1] == col-2) return true;
	return false;

}



// returns true if bishop can take the offending piece 
// row, col and color are all attributes of the knight
// therefore, offending piece is opposite color
function bishopCanTake(row,col,color) {
	if (color == 'white') 
		target = piecesCheckingWlocs[0];
	else 
		target = piecesCheckingBlocs[0];
	
	// if not on a diagonal line, then forget about it
	var rDiff = target[0] - row;
	var cDiff = target[1] - col;
	if (Math.abs(rDiff) != Math.abs(cDiff))
		return false;

	// now, find the path from bishop to target
	// first, find velocity (direction) along path
	var vr = rDiff / Math.abs(rDiff);
	var vc = cDiff / Math.abs(cDiff);
	
	// second, find distance
	var dist = Math.abs(vr);

	// if some space on the way is not empty, then cannot capture offending piece
	var newSpace = [];
	newSpace[0] = target[0];
	newSpace[1] = target[1];

	for (var i=0; i < dist - 1; i++) {
		newSpace[0] = newSpace[0] - vr;
		newSpace[1] = newSpace[1] - vc;
		if (chessBoard[newSpace[0]][newSpace[1]] != null)
			return false;
	}
	return true;

}

// returns true if rook can take the offending piece 
// row, col and color are all attributes of the knight
// therefore, offending piece is opposite color
function rookCanTake(row,col,color) {
	if (color == 'white') 
		target = piecesCheckingWlocs[0];
	else 
		target = piecesCheckingBlocs[0];
	
	// if not on a straight line, then forget about it
	var rDiff = target[0] - row;
	var cDiff = target[1] - col;
	if (rDiff != 0 && cDiff != 0)
		return false;

	// now, find the path from bishop to target
	// first, find velocity (direction) along path
	var vr;
	if (rDiff == 0)
		vr = 0;
	else	
		vr = rDiff / Math.abs(rDiff);
	var vc;
	if (cDiff == 0)
		vc = 0;
	else
		vc = cDiff / Math.abs(cDiff);
	
	// second, find distance
	var dist = Math.max(Math.abs(vr), Math.abs(vc));

	// if some space on the way is not empty, then cannot capture offending piece
	var newSpace = [];
	newSpace[0] = target[0];
	newSpace[1] = target[1];

	for (var i=0; i < dist - 1; i++) {
		newSpace[0] = newSpace[0] - vr;
		newSpace[1] = newSpace[1] - vc;
		if (chessBoard[newSpace[0]][newSpace[1]] != null)
			return false;
	}
	return true;

}

// returns true if queen can take the offending piece 
// row, col and color are all attributes of the knight
// therefore, offending piece is opposite color
function queenCanTake(row,col,color) {
	if (color == 'white') 
		target = piecesCheckingWlocs[0];
	else 
		target = piecesCheckingBlocs[0];
	
	// if not on a straight or diagonal line, then forget about it
	var rDiff = target[0] - row;
	var cDiff = target[1] - col;
	var pathType;
	if (rDiff == 0 || cDiff == 0)
		pathType = 'straight';
//	else if (rDiff * cDiff > 0)
	else if (Math.abs(rDiff) == Math.abs(cDiff))
		pathType = 'diagonal';
	else 
		return false;
	
	if (pathType == 'straight') {
		// now, find the path from bishop to target
		// first, find velocity (direction) along path
		var vr = rDiff / Math.abs(rDiff);
		var vc = cDiff / Math.abs(cDiff);
	
		// second, find distance
		var dist = Math.abs(rDiff);

		// if some space on the way is not empty, then cannot capture offending piece
		var newSpace = [];
		newSpace[0] = target[0];
		newSpace[1] = target[1];

		for (var i=0; i < dist - 1; i++) {
			newSpace[0] = newSpace[0] - vr;
			newSpace[1] = newSpace[1] - vc;
			if (chessBoard[newSpace[0]][newSpace[1]] != null)
				return false;
		}
		return true;
	}
	else {
		// now, find the path from bishop to target
		// first, find velocity (direction) along path
		var vr;
		if (rDiff == 0)
			vr = 0;
		else	
			vr = rDiff / Math.abs(rDiff);
		var vc;
		if (cDiff == 0)
			vc = 0;
		else
			vc = cDiff / Math.abs(cDiff);
	
		// second, find distance
		var dist = Math.max(Math.abs(rDiff), Math.abs(cDiff));

		// if some space on the way is not empty, then cannot capture offending piece
		var newSpace = [];
		newSpace[0] = target[0];
		newSpace[1] = target[1];

		for (var i=0; i < dist - 1; i++) {
			newSpace[0] = newSpace[0] - vr;
			newSpace[1] = newSpace[1] - vc;
			if (chessBoard[newSpace[0]][newSpace[1]] != null)
				return false;
		}
		return true;
	}


}

// get all empty space between the offending bishop/queen and the defending king
function getDiagonalPath(row,col,color) {
	var path = [];


	if (whiteKingPosition[0] == 1) {
		document.write(whiteKingPosition);
	}


	// get position of opposite color king (defending)
	var target;
	if (color == 'white') 
		target = blackKingPosition;
	else 
		target = whiteKingPosition;
	
	if (whiteKingPosition[0] == 1) {
		document.write(whiteKingPosition);
	}


	// now, find the path from bishop/queen to target
	// first, find velocity (direction) along path
	var vr = (target[0] - row) / Math.abs(target[0] - row);
	var vc = (target[1] - col) / Math.abs(target[1] - col);
	
	// second, find distance
	var dist = Math.abs(target[0] - row);

	if (whiteKingPosition[0] == 1) {
		document.write(whiteKingPosition);
	}


	// add new spaces
	var newSpace = [];
	newSpace[0] = target[0];
	newSpace[1] = target[1];
	for (var i=0; i < dist - 1; i++) {
		newSpace[0] = newSpace[0] - vr;
		newSpace[1] = newSpace[1] - vc;
		path.push(newSpace);
	}

	if (whiteKingPosition[0] == 1) {
		document.write(whiteKingPosition);
	}


	return path;
}

// get all empty space between the offending bishop and the defending king
function getStraightLinePath(row,col,color) {
	var path = [];

	// get position of opposite color king (defending)
	var target;
	if (color == 'white') 
		target = blackKingPosition;
	else 
		target = whiteKingPosition;

	// now, find the path from bishop to target
	// first, find velocity (direction) along path
	var rDiff = target[0] - row;
	var cDiff = target[1] - col;
	var vr;
	if (rDiff == 0)
		vr = 0;
	else	
		vr = rDiff / Math.abs(rDiff);
	var vc;
	if (cDiff == 0)
		vc = 0;
	else
		vc = cDiff / Math.abs(cDiff);
	
	// second, find distance
	var dist = Math.max(Math.abs(rDiff), Math.abs(cDiff));

	// for each space from attacker to king, add it to path
	var newSpace = [];
	newSpace[0] = target[0];
	newSpace[1] = target[1];
	for (var i=0; i < dist - 1; i++) {
		newSpace[0] = newSpace[0] - vr;
		newSpace[1] = newSpace[1] - vc;
		path.push(newSpace);
	}

//	return [1,3];


	return path;	
}

function performStalemateTest() {
	var smW = true;
	var smB = true;

	for (var i=0; i < 4; i++) {
		for (var j=0; j < 8; j++) {
			if (chessBoard[i][j] != null) {
				if (isOnBoard(i,j)) {


					// get legal moves
					var legalMoves = [];
					switch(chessBoard[i][j].type) {
						case 'king':
							legalMoves = addKingMoves(chessBoard[i][j], i,j);
							break;
						case 'queen':
							legalMoves = addDiagonalMoves(chessBoard[i][j], i,j).concat(addStraightLineMoves(chessBoard[i][j], i,j));
							break;
						case 'bishop':
							legalMoves = addDiagonalMoves(chessBoard[i][j], i,j);
							break;
						case 'rook':
							legalMoves = addStraightLineMoves(chessBoard[i][j], i,j);
							break;
					}

					

					// test each for check
					for (var k=0; k < legalMoves.length; k++) {
//						document.write();
						specBoard = cloneObject(chessBoard);
						specBoard[legalMoves[k][0]][legalMoves[k][1]] = chessBoard[i][j];
						specBoard[i][j] = null;
						var checkResult = performCheckTest(specBoard);

						// if this move does not check your own king, then you can still take it
						// and there is no stalemate
//						document.write(checkResult);
						if (checkResult != 'both' && (chessBoard[i][j].color == 'white' && checkResult != 'white')) {
//							document.write([i,j].concat(' '));
							smW = false;
						}
						else if (checkResult != 'both' && (chessBoard[i][j].color == 'black' && checkResult != 'black'))
							smB = false;
					}
				}
				else {
					if (chessBoard[i][j].color == 'white') 
						smW = false;
					else
						smB = false;
				}
				// return false iff there is no stalemate on either
				if (!smW && !smB)
					return 'none';
			}
		}
	}
	if (!smW && smB)
		return 'black';
	if (smW && !smB)
		return 'white';
	return 'both';
}










