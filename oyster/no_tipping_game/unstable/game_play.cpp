//
//  game_play.cpp
//  HeuristicProblemSolving
//
//  Created by Haoquan Guo on 10/4/12.
//  Copyright 2012 NYU. All rights reserved.
//

#include <iostream>
#include "random_ai.cpp"
#include "human_ai.cpp"

void game_state_example();
void play_hr(human_ai &first_player, random_ai &second_player);

void game_state_example() {
	// this is the test/example
	
	// get the initial state
	game_state current_state = initial_game_state();
	
	// graphic output
	string gout = current_state.graphic_output();
	cout << gout;
	
	// state vector
	int * state_vector = current_state.state_vector;
	for (int i = 0; i < 25; i ++) {
		cout << state_vector[i] << " ";
	}
	cout << "\n";
	
	// move to another state
	game_state next_state = current_state.move_add(3, 5);
	gout = next_state.graphic_output();
	cout << gout;
	
	// left and right support state
	cout << "l:" << next_state.left_support_state << " r:" << next_state.right_support_state << "\n";
	
	// lose state
	cout << "is lost: " << next_state.is_lose_state << "\n";
	
	// game turn
	cout << "turn: " << next_state.game_turn << "\n";
	
	// is first player's move
	cout << "first player: " << next_state.is_first_player_move() << "\n";
	
	// get empty slots
	vector<int> empty_slots = next_state.get_empty_slots();
	for (int i = 0; i < empty_slots.size(); i ++) {
		cout << empty_slots[i] << " ";
	}
	cout << " | empty_slots\n";
	
	// get available blocks
	vector<int> avail_blocks = next_state.get_available_blocks();
	for (int i = 0; i < avail_blocks.size(); i ++) {
		cout << avail_blocks[i] << " ";
	}
	cout << " | avail_blocks\n";	
}

void play_hr(human_ai &first_player, random_ai &second_player) {
	game_state state = initial_game_state();
	game_state next_state = initial_game_state();
	bool is_game_over = false;
	pair<int, int> move;
	cout << state.graphic_output();
	while (!is_game_over) {
		move = first_player.ai_move(state);
		if (move.first == -1 && move.second == 16) {
			cout << "first player (" << first_player.get_name() << ") surrender.\n";
			is_game_over = true;
			cout << "second player (" << second_player.get_name() << ") wins!\n";
			break;
		}
		next_state = state.move_any(move);		
		if (next_state.game_turn == state.game_turn) {
			cout << "first player (" << first_player.get_name() << ") made a bad move.\n";
			is_game_over = true;
			cout << "second player (" << second_player.get_name() << ") wins!\n";
			break;
		}
		cout << "first player (" << first_player.get_name() << ") move: <" << move.first << ", " << move.second << ">\n";
		state = next_state;
		cout << state.graphic_output();
		if (state.is_tip()) {
			cout << "first player (" << first_player.get_name() << ") made a tip.\n";
			is_game_over = true;
			cout << "second player (" << second_player.get_name() << ") wins!\n";
			break;			
		}
		
		move = second_player.ai_move(state);
		if (move.first == -1 && move.second == 16) {
			cout << "second player (" << second_player.get_name() << ") surrender.\n";
			is_game_over = true;
			cout << "first player (" << first_player.get_name() << ") wins!\n";
			break;
		}
		next_state = state.move_any(move);
		if (next_state.game_turn == state.game_turn) {
			cout << "second player (" << second_player.get_name() << ") made a bad move.\n";
			is_game_over = true;
			cout << "first player (" << first_player.get_name() << ") wins!\n";
			break;
		}
		cout << "second player (" << second_player.get_name() << ") move: <" << move.first << ", " << move.second << ">\n";
		state = next_state;
		cout << state.graphic_output();
		if (state.is_tip()) {
			cout << "second player (" << second_player.get_name() << ") made a tip.\n";
			is_game_over = true;
			cout << "first player (" << first_player.get_name() << ") wins!\n";
			break;			
		}
	}
	cout << "game is over.\n";
}

int main() {
	human_ai hai = human_ai("human");
	random_ai rai = random_ai("random_ai");
	play_hr(hai, rai);
}