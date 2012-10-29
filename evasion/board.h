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

	bool operator==(const wall &wallA) {
		if (wallA.x0 == x0 &&
			wallA.y0 == y0 &&
			wallA.x1 == x1 &&
			wallA.y1 == y1 ) 
				return true;
		else 
			return false;
	}
};

struct BoundedBox {
	wall top;
	wall bottom;
	wall left;
	wall right;

	void init() {
		top.x0 = 0;
		top.x1 = 499;
		top.y0 = 0;
		top.y1 = 0;

		bottom.x0 = 0;
		bottom.x1 = 499;
		bottom.y0 = 499;
		bottom.y1 = 499;

		left.x0 = 0;
		left.x1 = 0;
		left.y0 = 0;
		left.y1 = 499;

		right.x0 = 499;
		right.x1 = 499;
		right.y0 = 0;
		right.y1 = 499;
	}
	
	int area() {
		return (right.x0 - left.x0) * (bottom.y0 - top.y0);
	}
	bool contains(wall w) {
		if (w == top) return true;
		else if (w == bottom) return true;
		else if (w == left) return true;
		else if (w == right) return true;
		else return false;	
	}

	void print() {
		cout << "Bounded Box" << endl;
		cout << "\ttop" << "(" << top.x0 << " " << top.y0 << ") ("<< top.x1 << " " << top.y1 << ")" << endl;
		cout << "\tbottom" << "(" << bottom.x0 << " " << bottom.y0 << ") ("<< bottom.x1 << " " << bottom.y1 << ")" << endl;
		cout << "\tleft" << "(" << left.x0 << " " << left.y0 << ") ("<< left.x1 << " " << left.y1 << ")" << endl;
		cout << "\tright" << "(" << right.x0 << " " << right.y0 << ") ("<< right.x1 << " " << right.y1 << ")" << endl;
	}

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
	location velocity;
	BoundedBox bounds;

public:

	Hunter(int paramMaxWalls, int paramWallRate);
    string nextMove(string);

};

class Prey: public Player {

public:

	Prey(int maxWalls);
    string nextMove(string);

};









