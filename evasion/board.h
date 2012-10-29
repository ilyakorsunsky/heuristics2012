#include <vector>
#include <cmath>
#include <iostream>
#include <sstream>
#include <string>
using namespace std;


struct wall {
	int x0;
	int x1;
	int y0; 
	int y1;
};

struct location {
	int x;
	int y;
};


class Gameboard {
	location Ploc;
	location HVelocity;
	location Hloc;
	vector<wall> walls;
	char isWall[500][500];    
//	int nWall;
	int maxWalls;

	int buildWall(int,int,int,int); // returns -1 on failure, 0 on success
	void removeWall(int);

public:

	Gameboard(int);
    void updatePreyMove(string);
    void updateHunterMove(string);
	bool gameOver();
	string getStatus();
	void displayBoard(int);

};

class Player {
protected:
	location Ploc;
	location Hloc;
	vector<wall> walls;
	int maxWalls;
	int nWall;

	void parseServerInput(string status);
};


class Hunter: public Player {
	int nMovesTaken;
	int wallRate;

public:

	Hunter(int paramMaxWalls, int paramWallRate);
    string nextMove(string);

};

class Prey: public Player {

public:

	Prey(int maxWalls);
    string nextMove(string);

};









