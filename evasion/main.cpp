#include "board.h"



int main() {

	int wallRate = 10;
	int maxWalls = 10;
	int Nrounds = 1000000;

	Gameboard mainBoard(maxWalls);

	Hunter h1(maxWalls, wallRate);
	Prey p1(maxWalls);

/*
	istringstream in("1 2 3 4,5 6 7 8");
	string t;
	char l[256];
	in.getline(l, 256, ',');
	while (in.getline(l, 256, ','))
		cout << l << endl;
*/
	string output;
	string input;
	for (int i = 0; i < Nrounds; i++) {

		// Hunter moves
		input = mainBoard.getStatus();
		output = h1.nextMove(input);
		mainBoard.updateHunterMove(output);
		if (mainBoard.gameOver()) { 
			printf("Hunter wins after %i turns\n", i);
			break;
		}
		
		// Both move simultaneously
		input = mainBoard.getStatus();
		output = h1.nextMove(input);
		mainBoard.updateHunterMove(output);
		output = p1.nextMove(input);
		mainBoard.updatePreyMove(output);
		if (mainBoard.gameOver()) { 
			printf("Hunter wins after %i turns\n", i);
			break;
		}

		input = mainBoard.getStatus();
		cout << "(turn " << i+1 << ") " << input << endl;
	}
}





















