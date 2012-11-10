#include <vector>
#include <cmath>
#include <iostream>
#include <sstream>
#include <string>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <fstream>
#include <queue>
#include <algorithm>
using namespace std;


class node{
	
	public:
	bool eaten;
	//vector<int> links;
	int xloc;
	int yloc;
	int node_id;
		node(int id, int x, int y);
		//void add_links(int id2);
};


class tree
{		
	public:
	int num_node;	
	vector< vector<node> > adjacency_mat;	
	void setnum_node(int n);
	void print_tree();
	static bool comp_func(tree i,tree j) { 
		return (i.num_node > j.num_node); 
	}
	
};


class forest
{
	public:
		bool sorted;
		vector<tree> input;
		void print_forest();		
		forest(vector<vector<node> > links);
		void sort_forest();

		
};