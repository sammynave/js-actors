import { Actor } from './index';

//ex
// const b = createWorker((e) => console.log(e.data));
// b.postMessage('some text')

export const WebActor = {
  create(behavior, initialState = {}) {
    function createWorker(fn) {
      const blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);

      return new Worker(url);
    }
    let state = initialState;
    const channel = createWorker(function({ data }) {
      const collision = {
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
            WebActor.send(self, ['reverse']);
            return state;
          }

          if (x <= state.walls.left) {
            WebActor.send(self, ['reverse']);
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
            WebActor.send(self, ['collide']);
            return state;
          }
          WebActor.send(self, ['advance']);

          return state;
        }
      };

      const d = JSON.parse(data)
      collision[d[0]](d[1]);
    });

    state = state.self
      ? (() => {
        state.self = channel
        return state;
      })()
      : state;

    return channel;
  },

  /*
   *  channel: symbol
   *  message: [<command>, <optional data>]
   */
  send(channel, message) {
    return channel.postMessage(JSON.stringify(message));
  }
};
