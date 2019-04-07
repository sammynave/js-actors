import { Actor } from '../../src/index';

export const collision = {
  init() {
    return {
      cubes: {},
      walls: {
        left: 10,
        right: 290
      }
    }
  },

  validateMove(state, { move }) {
    if (move.direction > 0 &&
        move.coord.x >= state.walls.right) {
      move.direction = move.direction * -1;
      Actor.send(move.self, ['advance', { move }]);
      return state;
    }

    if (move.direction < 0 &&
        move.coord.x <= state.walls.left) {
      move.direction = move.direction * -1;
      Actor.send(move.self, ['advance', { move }]);
      return state;
    }

    Actor.send(move.self, ['advance', { move }]);

    return state;
  }
};
