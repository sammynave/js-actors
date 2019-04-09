import { Actor } from '../../src/index';
import { createWorker } from './worker';

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

  didMove(state, { self, x, y, w, h, direction }) {
    state.occupied.set(self, { x, y, w, h, direction });
    return state;
  },

  validateMove(state, { self, x, y, direction, h, w }) {
    if (x >= state.walls.right) {
      Actor.send(self, ['reverse']);
      return state;
    }

    if (x <= state.walls.left) {
      Actor.send(self, ['reverse']);
      return state;
    }

    let didCollide = false;
    for (let opts of state.occupied) {
      if (!opts) { break; }
      const [id, coords] = opts;
      if (id !== self) {
        if (coords.x < x + w &&
          coords.x + coords.w > x &&
          coords.y < y + h &&
          coords.y + coords.h > y) {
          didCollide = true;
          break;
        }
      }
    };

    if (didCollide) {
      Actor.send(self, ['collide']);
      return state;
    }
    Actor.send(self, ['advance']);

    return state;
  }
};

export const collisionWorker = createWorker(function({ data }) {
  data = JSON.parse(data);

  let state = {
    occupied: new Map(),
    walls: {
      left: 0,
      right: 290
    }
  };

  const methods = {
    didMove({ self, x, y, w, h, direction }) {
      state.occupied.set(self, { x, y, w, h, direction });
    },

    validateMove({ self, x, y, direction, h, w }) {
      if (x >= state.walls.right) {
        return ['reverse'];
      }

      if (x <= state.walls.left) {
        return ['reverse'];
      }

      let didCollide = false;
      for (let opts of state.occupied) {
        if (!opts) { break; }
        const [id, coords] = opts;
        if (id !== self) {
          if (coords.x < x + w &&
            coords.x + coords.w > x &&
            coords.y < y + h &&
            coords.y + coords.h > y) {
            didCollide = true;
            break;
          }
        }
      };

      if (didCollide) {
        return ['collide'];
      }

      return ['advance'];
    }
  };

  console.log(data[0]);
  postMessage(methods[data[0]](data[1]));
});
