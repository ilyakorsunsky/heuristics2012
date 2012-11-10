#include "board.h"


int main() {
	int count = 0;
	string line;
  vector<vector<node> > links;
	vector<vector<int> > node_data;

  ifstream infile ("graph.txt");
  	if (infile.is_open())
  	{
    	while ( infile.good() )
    	{

      		getline (infile,line);     		
      		stringstream linestream(line);
      		string data;
      		
          if (line == "") {
            continue; //Skip blank line
          }

      		else if (line == "nodeid,xloc,yloc"){ // read nodeid and location
    				while(!line.empty()) {  		
             	int d;
              getline(infile, line);
              if(line=="\n") break;
              else {
                vector<int> v;
                char * temp = new char[line.size()+ 1];
                strcpy(temp, line.c_str());
                char * pch = strtok (temp,",");
                while (pch != NULL){
                  stringstream ss(pch);
                  ss >> d;
                  v.push_back(d);
                   pch = strtok (NULL, ",");
                }
                node_data.push_back(v);
              }     			
      			}
            node_data.pop_back(); // removes the last empty line
      		}
            

      		else if(line == "nodeid1,nodeid2"){  // read the links
					 
            count = node_data.size();
            for(int i=0; i<count; ++i){
               vector<node> v;
               node n(node_data.at(i)[0],node_data.at(i)[1],node_data.at(i)[2]);
               v.push_back(n);
               links.push_back(v);
            }
  
            while(!line.empty()){	
               int id1, id2;

						  getline(infile, line, ',');
						  if(line.empty()) break;
        			stringstream iss1(line);
      				while(iss1){
        				iss1 >> id1;
        			}
      				
      				getline(infile, line, '\n');
						  if(line.empty()) break;
        			stringstream iss2(line);
      				while(iss2){
        				iss2 >> id2;
        			}	

						 // cout << id1 << ": " << id2 << endl; 
              node n1(node_data.at(id1)[0], node_data.at(id1)[1], node_data.at(id1)[2]);
              node n2(node_data.at(id2)[0], node_data.at(id2)[1], node_data.at(id2)[2]);
              
              links.at(n1.node_id).push_back(n2);
              links.at(n2.node_id).push_back(n1);     				
      		  }
      	}

		  }
    	infile.close();
  	}

    
  
    // Prints node_data 
    /*
    cout<< "node_data: "<< endl;
    for (int i = 0; i < node_data.size(); ++i)
    {
      for (int j = 0; j < node_data.at(i).size() ; ++j)
      {
         cout << node_data[i][j] << " ";
      }
      cout << endl;
    }
    */

    
    // Prints the links
    /*
    cout << "global adacency matrix:"<< endl;
    for (int i = 0; i < links.size(); ++i){ 
      cout<< i <<": ";
      for (int j = 0; j < links.at(i).size(); ++j)
      {
        cout << links.at(i).at(j).node_id<< " x: "<<links.at(i).at(j).xloc << ":done:" ;
      }
      cout << endl;
    }
    */
    
    
    forest f1(links);
    f1.sort_forest();
    f1.print_forest();


	return 0;
}