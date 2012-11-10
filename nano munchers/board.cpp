#include "board.h"

node :: node(int id, int x, int y){
	xloc = x; 
	yloc = y;
	node_id = id;
	eaten = false;
}

/*		
void node:: add_links(int id2){
			links.push_back(id2);
		}
*/

void tree :: setnum_node(int n){
			num_node = n;
		}

void tree :: print_tree(){
		for (int i = 0; i < adjacency_mat.size(); ++i)
		{
			for (int j = 0; j < adjacency_mat.at(i).size(); ++j)
			{
				cout << adjacency_mat[i][j].node_id<<" ";
			}
			cout << endl;
		}
	}


void forest :: print_forest(){
		cout<< " Printing Forest :" << endl;
		for (int i = 0; i < input.size(); ++i)
		{	
			cout << "Tree: " << i << ", containing "<< input[i].num_node <<" nodes" <<endl;
			input[i].print_tree();
			cout<< endl;
		}
	} 

forest :: forest(vector<vector<node> > links){
		vector<int> visited;				

		for(int x = 0; x< links.size(); x++) {				
				tree temp;
				queue<node> bag;

				int visit_flag = 0;
					for (int j = 0; j < visited.size(); ++j) {  // skippping already visited nodes
						if ( x == visited[j] ) {
								visit_flag = 1;
						}
					}

					if(visit_flag == 1){
						continue;
					}	
				
				bag.push(links.at(x).at(0));
				
				int num = 1;
				visited.push_back(links.at(x).at(0).node_id);
				while(!bag.empty()) {
					
					node y = bag.front();
					temp.adjacency_mat.push_back(links.at(y.node_id));
					
					for (int i = 0; i < links.at(y.node_id).size(); ++i) {
						int flag = 0;
						for (int j = 0; j < visited.size(); ++j) {    // Not pushing already visited niebhours into the bag
							if ( links.at(y.node_id).at(i).node_id == visited[j]) {
								flag = 1;
							}
						}
						if (flag == 0)	{
							bag.push(links.at(y.node_id).at(i));
							num++;
							visited.push_back(links.at(y.node_id).at(i).node_id);
						}
						
					}
					bag.pop();
				}
				temp.setnum_node(num);
				input.push_back(temp);	
		}

	}

	
	void forest :: sort_forest(){
  		sort(input.begin(), input.end(), tree::comp_func);
	}
