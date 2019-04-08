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

    // TODO: this is slow
    const didCollide = [...state.occupied.entries()].reduce((acc, v) => {
      if (acc) {
        return acc;
      }

      if (v[0] !== move.self) {
        if (v[1].x < move.coord.x + move.coord.w &&
            v[1].x + v[1].w > move.coord.x &&
            v[1].y < move.coord.y + move.coord.h &&
            v[1].y + v[1].h > move.coord.y) {
          return true;
        }
      }

      return acc;
    }, false);

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
