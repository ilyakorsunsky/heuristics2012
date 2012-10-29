#include "board.h"

void Gameboard::updatePreyMove(string move) {
	// parse move
	istringstream in(move);
	string param1, param2;
	in >> param1 >> param2;
	int dx,dy;	
	dx = atoi(param1.c_str());
	dy = atoi(param2.c_str());

	// get target square
	int newX = Ploc.x + dx;
	int newY = Ploc.y + dy;

	// bounce if necessary
	// hit a vertical wall
	if (isWall[newX][newY] == 'V'|| newX == 0 || newX == 499) {
		newX = Ploc.x;
		if (isWall[newX][newY] != 'N' || newX == 0 || newX == 499 || newY == 0 || newY == 499) {
			newX += dx;
			newY = Ploc.y;
			if (isWall[newX][newY] != 'N'|| newX == 0 || newX == 499 || newY == 0 || newY == 499)
				newX = Ploc.x;
		}
	} 
	// hit a horizontal wall
	else if (isWall[newX][newY] == 'H'|| newY == 0 || newY == 499) {
		newY = Ploc.y;
		if (isWall[newX][newY] != 'N'|| newX == 0 || newX == 499 || newY == 0 || newY == 499) {
			newY += dy;
			newX = Ploc.x;
			if (isWall[newX][newY] != 'N'|| newX == 0 || newX == 499 || newY == 0 || newY == 499)
				newY = Ploc.y;
		}
	}
	
	Ploc.x = newX;
	Ploc.y = newY;

}


void Gameboard::displayBoard(int nBuckets) {
	char output[nBuckets][nBuckets];
	float ratio = 1.0*nBuckets / 500.0;
	
	for (int y = 0; y < nBuckets; y++) 
		for (int x = 0; x < nBuckets; x++) 
			output[x][y] = '.';

	// draw walls
	for (int i = 0; i < walls.size(); i++) 
		for (int x = walls[i].x0; x < walls[i].x1; x++) 
			for (int y = walls[i].y0; y < walls[i].y1; y++) 
				output[x][y] = '*';

	// draw Prey
	output[ (int)(Ploc.x * ratio) ][ (int)(Ploc.y * ratio) ] = 'P';
	
	// draw Hunter
	output[ (int)(Hloc.x * ratio) ][ (int)(Hloc.y * ratio) ] = 'H';


	for (int y = 0; y < nBuckets; y++) {
		for (int x = 0; x < nBuckets; x++) {
			cout << output[x][y];
		}
		cout << endl;
	}
	cout << endl << endl << endl;
}



void Gameboard::updateHunterMove(string move) {
	// parse move
	// case 1: No wall
	if ((strcmp(move.c_str(),"0")) == 0);
	
	// case 2: wall
	else {
		istringstream in(move);
		string param1, param2, param3, param4;
		in >> param1 >> param2 >> param3 >> param4;
		int x0,y0,x1,y1;
		x0 = atoi(param1.c_str());
		y0 = atoi(param2.c_str());
		x1 = atoi(param3.c_str());
		y1 = atoi(param4.c_str());

		bool placeWall = true;
		for (int i = 0; i < walls.size(); i++) {
			// does this wall match any others (if so, remove)
			if (x0 == walls[i].x0 && 
				y0 == walls[i].y0 && 	
				x1 == walls[i].x1 && 	
				y1 == walls[i].y1 ) {
					removeWall(i);
					placeWall = false;
					break;
			}

			// does it cross some other wall? (if so, do nothing)
			if ((walls[i].x0 < x0 < walls[i].x1 && y0 < walls[i].y0 < y1) ||
				(walls[i].y0 < y0 < walls[i].y1 && x0 < walls[i].x0 < x1)) {
					placeWall = false;
					break;			
			}
		}

		// if every check in the loop passed, then build your wall		
		if (placeWall) buildWall(x0,y0,x1,y1);
	}

	// get target square
	int newX = Hloc.x + HVelocity.x;
	int newY = Hloc.y + HVelocity.y;


	// bounce if necessary
	// hit a vertical wall
	if (isWall[newX][newY] == 'V' || newX == 0 || newX == 499) {
		newX = Hloc.x;
		if (isWall[newX][newY] != 'N' || newX == 0 || newX == 499 || newY == 0 || newY == 499) {
			newX += HVelocity.x;
			newY = Hloc.y;
			if (isWall[newX][newY] != 'N' || newX == 0 || newX == 499 || newY == 0 || newY == 499)
				newX = Hloc.x;
		}
	} 

	// hit a horizontal wall
	else if (isWall[newX][newY] == 'H' || newY == 0 || newY == 499) {
		newY = Hloc.y;
		if (isWall[newX][newY] != 'N' || newX == 0 || newX == 499 || newY == 0 || newY == 499) {
			newY += HVelocity.y;
			newX = Hloc.x;
			if (isWall[newX][newY] != 'N' || newX == 0 || newX == 499 || newY == 0 || newY == 499)
				newY = Hloc.y;
		}
	}

	if (newX == Hloc.x) HVelocity.x *= -1;
	if (newY == Hloc.y) HVelocity.y *= -1;
	Hloc.x = newX;
	Hloc.y = newY;
	
}

string Gameboard::getStatus() {
	ostringstream out(ostringstream::out);
	out << "H " << Hloc.x << " " << Hloc.y << " ";
	out << "P " << Ploc.x << " " << Ploc.y << " ";
	out << "W ";
	for (int i = 0; i < walls.size(); i++) {
		out << walls[i].x0 << " ";
		out << walls[i].y0 << " ";
		out << walls[i].x1 << " ";
		out << walls[i].y1;
		if (i < walls.size()-1) out << ",";
	}

	return out.str();	
}

void Gameboard::removeWall(int loc) {
	for (int i = walls[loc].x0; i <= walls[loc].x1; i++) 
		for (int j = walls[loc].y0; j <= walls[loc].y1; j++) 
			isWall[i][j] = 'N';

	walls.erase(walls.begin()+loc);

}


// include the wall check
bool Gameboard::gameOver() {

	// if there is a wall in between Hunter and Prey, can't catch
	for (int i = 0; i < walls.size(); i++) 
		if ((walls[i].x0 < Ploc.x < walls[i].x1 && Ploc.y < walls[i].y0 < Hloc.y) ||
				(walls[i].y0 < Ploc.y < walls[i].y1 && Ploc.x < walls[i].x0 < Hloc.x))
			return false;

	if (abs(Ploc.x - Hloc.x) <= 4 && abs(Ploc.y - Hloc.y) <= 4)
		return true;

	return false;
}

int Gameboard::buildWall(int x0, int y0, int x1, int y1) {
	// check if it is horizontal or vertical
	if (x0 != x1 && y0 != y1) return -1;

	// check for intersections with existing walls
	for (int i = 0; i < walls.size(); i++) 
		if ((walls[i].x0 < x0 < walls[i].x1 && y0 < walls[i].y0 < y1) ||
				(walls[i].y0 < y0 < walls[i].y1 && x0 < walls[i].x0 < x1))
			return -1;

	// create wall and add
	wall newWall;
	newWall.x0 = x0;
	newWall.y0 = y0;
	newWall.x1 = x1;
	newWall.y1 = y1;
	walls.push_back(newWall);

	return 0;
}

Gameboard::Gameboard(int paramMaxWalls) {
	Ploc.x = 330;
	Ploc.y = 200;

	Hloc.x = 0;
	Hloc.y = 0;	
	
	HVelocity.x = 1;
	HVelocity.y = 1;

	maxWalls = paramMaxWalls;
	
/*
	buildWall(0,0,500,0);
	buildWall(500,0,500,500);
	buildWall(500,500,0,500);
	buildWall(0,500,0,0);


	for (int i = 0; i < 500; i++) 
		for (int j = 0; j < 500; j++) 
			isWall[i][j] = 'N';

	for (int i = 0; i < 500; i++) {
		isWall[i][0] = 'H';
		isWall[0][i] = 'V';
		isWall[i][500] = 'H';
		isWall[500][i] = 'V';
	}
*/
}


void Player::parseServerInput(string status) {
	// place the Hunter, Prey and Walls
	string type, param1, param2, param3, param4;
	istringstream in(status);
	nWall = 0;

	// place Hunter
	in >> type >> param1 >> param2;
	Hloc.x = atoi(param1.c_str());
	Hloc.y = atoi(param2.c_str());

	// place Prey
	in >> type >> param1 >> param2;
	Ploc.x = atoi(param1.c_str());
	Ploc.y = atoi(param2.c_str());

	// place Walls
	in >> type;
	while (in >> param1 >> param2 >> param3 >> param4) {
		walls[nWall].x0 = atoi(param1.c_str());
		walls[nWall].y0 = atoi(param2.c_str());
		walls[nWall].x1 = atoi(param3.c_str());
		walls[nWall].y1 = atoi(param4.c_str());
		nWall++;
	}
}

Hunter::Hunter(int paramMaxWalls, int paramWallRate) {

	nMovesTaken = 0;
	maxWalls = paramMaxWalls;
	wallRate = paramWallRate;

	for (int i = 0; i < maxWalls; i++){
		wall newWall;
		walls.push_back(newWall);
	}


}



string Hunter::nextMove(string status){
	// parse the server's input
	parseServerInput(status);

	// lazy hunter: never build walls
	string newMove = "0";
	return newMove;

}

Prey::Prey(int maxWalls) {
	for (int i = 0; i < maxWalls; i++){
		wall newWall;
		walls.push_back(newWall);
	}
}


string Prey::nextMove(string status){
	// parse the server's input
	parseServerInput(status);

	// greedy move: move away from the Hunter	
	string newMove;
	if ( Ploc.x >= Hloc.x)
		newMove += "1 ";
	else
		newMove += "-1 ";
	if ( Ploc.y >= Hloc.y)
		newMove += "1";
	else
		newMove += "-1";

	return newMove;

}




































