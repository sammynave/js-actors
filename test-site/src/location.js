import { Actor } from '../../src/index';

const randomHex = () =>  Math.floor(Math.random()*16777215).toString(16);

export const collision = {
  init() {
    return {
      occupied: new Map(),
      walls: {
        left: 0,
        right: 290
      }
    }
  },

  didMove(state, { move }) {
    state.occupied.set(move.self, move.coord);
    return state;
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

    let didCollide = false;
    for (let opts of state.occupied) {
      if (!opts) { break; }
      const [id, coords] = opts;
      if (id !== move.self) {
        if (coords.x < move.coord.x + move.coord.w &&
          coords.x + coords.w > move.coord.x &&
          coords.y < move.coord.y + move.coord.h &&
          coords.y + coords.h > move.coord.y) {
          didCollide = true;
          break;
        }
      }
    };

    if (didCollide) {
      const old = move.coord.x;
      move.direction = move.direction * -1;
      move.coord.x = move.direction > 0
        ? move.coord.x + move.speed
        : move.coord.x - move.speed;
      move.color = randomHex();
      Actor.send(move.self, ['advance', { move }]);

      return state;
    }

    Actor.send(move.self, ['advance', { move }]);

    return state;
  }
};
