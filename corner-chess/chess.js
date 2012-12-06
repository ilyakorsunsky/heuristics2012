var chessBoard = InitBoard();

var whiteKingHasMoved = false; // need for castling
var blackKingHasMoved = false; 

var whiteKingPosition = [0, 4]; //shortcut to prevent searching entire board for king
var blackKingPosition = [7, 4];

var specWhiteKingPosition = null;
var specBlackKingPosition = null;

var currentMove = 'white';

$(document).ready(function(){
   
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
   
});
   

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
	for (i=0; i<4; i++)
	{
		newBoard[i] = [];
	}
	
	newBoard[0][0] = rook['white1'];
	newBoard[0][3] = rook['white2'];
	newBoard[3][0] = rook['black1'];
	newBoard[3][3] = rook['black2'];
				
	newBoard[1][0] = knight['white1'];
	newBoard[1][2] = knight['white2'];
	newBoard[2][0] = knight['black1'];
	newBoard[2][2] = knight['black2'];
				
	newBoard[1][1] = bishop['white1'];
	newBoard[1][3] = bishop['white2'];
	newBoard[2][1] = bishop['black1'];
	newBoard[2][3] = bishop['black2'];
				
	newBoard[0][2] = queen['white'];
	newBoard[3][2] = queen['black'];
				
	newBoard[0][1] = king['white'];
	newBoard[3][1] = king['black'];

	return newBoard;
}

function isOccupied(row, column)
{
	var targetNode = $(".row" + row + ".col" + column + " > div.piece");
	if (targetNode.length > 0)
	{
		if (targetNode.hasClass('bl'))
			return 'black';
		else
			return 'white';
	}
	return 'empty';
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
	
	for (i=0; i<spaces.length; i++)
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
	for (i=0; i<selectors.length; i++)
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
	if (currentMove == "white")
	{
		currentMove = "black";
		$('.wh').draggable("disable");
		$('.bl').draggable("enable");
	}
	else
	{
		currentMove = "white";
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
				if (whiteKingHasMoved == false)
					whiteKingHasMoved = true;
				whiteKingPosition = [spaceRow, spaceCol];
			}
			else
			{
				if (blackKingHasMoved == false)
					blackKingHasMoved = true;
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
		if (checkResult != "none")
		{
			if (testCheckMate())
				alert("Checkmate, " + currentMove + "wins!");
			alert("Check on " + checkResult + "!");
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
		
		for (i=0; i<legalMoves.length; i++)
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
	return legalMoves;	
}

function addStraightLineMoves(piece, pieceRow, pieceCol)
{
	var straightMoves = []; // holds return moves
	
	// start by going up in rows
	for (i=pieceRow+1; i<4; i++)
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
	for (i=pieceRow-1; i>-1; i--)
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
	for (i=pieceCol+1; i<4; i++)
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
	for (i=pieceCol-1; i>-1; i--)
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
	for (i=pieceRow+1; (i < 4 && j < 4); i++)
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
	for (i=pieceRow + 1; (i < 4 && j > -1); i++)
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
	for (i=pieceRow - 1; (i > -1 && j < 4); i--)
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
	for (i=pieceRow-1; (i > -1 && j > -1); i--)
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
	for (i = -1; i < 2; i++)
	{
		for (j = -1; j < 2; j++)
		{
			if (isOnBoard(pieceRow + i, pieceCol + j) && isOccupied(pieceRow + i, pieceCol + j) != piece.color)
				kingMoves.push([pieceRow + i, pieceCol + j]);
		}
	}
	
	return kingMoves;
}

function performCheckTest(testBoard)
{
	var whiteKingChecked = false;
	var blackKingChecked = false;
	
	for (x = 0; x < 4; x++)
	{
		for (y = 0; y < 4; y++)
		{
			if (typeof(testBoard[x][y]) == "object")
			{
				var currentPiece = testBoard[x][y];
				var currentPieceMoves = determineLegalMoves(currentPiece, x, y);
				for (z = 0; z < currentPieceMoves.length; z++)
				{
					if (currentPiece.color == "black" && (specWhiteKingPosition[0] == currentPieceMoves[z][0]) && (specWhiteKingPosition[1] == currentPieceMoves[z][1]))
						whiteKingChecked = true;
					if (currentPiece.color == "white" && (specBlackKingPosition[0] == currentPieceMoves[z][0]) && (specBlackKingPosition[1] == currentPieceMoves[z][1]))
						blackKingChecked = true;
				}
			}
		}
	}
	
	if (whiteKingChecked && blackKingChecked)
		return "both";
	else if (whiteKingChecked)
		return "white";
	else if (blackKingChecked)
		return "black";
	else
		return "none";
}

function testCheckMate()
{
	var checkmateStatus = true;
	
	for (x = 0; x < 4; x++)
	{
		for (y = 0; y < 4; y++)
		{
			var currentPiece = chessBoard[x][y];
			if (typeof(chessBoard[x][y]) == "object")
			{
				if (currentPiece.color != currentMove)
				{
					var currentPieceMoves = determineLegalMoves(currentPiece, x, y);
					
					var specBoard = cloneObject(chessBoard);
				
					for (var i = 0; i < currentPieceMoves.length; i++)
					// move the piece on this spec board
					specBoard[x][y] = currentPiece;
					specBoard[x][y] = null;
					
					var checkResult = performCheckTest(specBoard);
					if (checkResult != currentMove || checkResult != 'both')
						checkmateStatus = false;
				}
			}
		}
	}
	
	return checkmateStatus;
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