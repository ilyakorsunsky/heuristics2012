#include "board.h"



int main() {

	int wallRate = 5;
	int maxWalls = 10;
	int Nrounds = 600;

	Gameboard mainBoard(maxWalls);

	Hunter h1(maxWalls, wallRate);
	Prey p1(maxWalls);


	string output;
	string input;
	for (int i = 0; i < Nrounds; i++) {

		// Hunter moves
		input = mainBoard.getStatus();
		output = h1.nextMove(input);
		mainBoard.updateHunterMove(output);
		if (mainBoard.gameOver()) break;
		
//		cout << input << endl;
//		mainBoard.displayBoard(50);

		// Both move simultaneously
		input = mainBoard.getStatus();
		output = h1.nextMove(input);
		mainBoard.updateHunterMove(output);
		output = p1.nextMove(input);
		mainBoard.updatePreyMove(output);
		if (mainBoard.gameOver()) break;

		input = mainBoard.getStatus();
		cout << input << endl;
//		mainBoard.displayBoard(50);

	}



}





















