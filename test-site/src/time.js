import { Actor } from '../../src/index';

export const tick = {
  name: 'tick',
  init(state) {
    return state;
  },

  advance(state) {
    Actor.send(state.cubes,
      ['advance',
        document.getElementById('field').getContext('2d')]);

    return state
  }
};
