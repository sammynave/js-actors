import { Actor } from '../../src/index';
import { collision } from './location';

const SPEED = 1;
const NUM_OF_PAIRS = 500;

const randomHex = () =>  Math.floor(Math.random()*16777215).toString(16);

const cubePairMaker = (i) => {
  return [
    Actor.create(cube, {
      color: randomHex(),
      direction: 1,
      speed: Math.floor(Math.random()*10) + 1,
      coord: {
        x: 0,
        y: 2 * i,
        w: 4,
        h: 4
      },
    }),
    Actor.create(cube, {
      color: randomHex(),
      direction: -1,
      speed: Math.floor(Math.random()*10) + 1,
      coord: {
        x: 290,
        y: 2 * i,
        w: 4,
        h: 4
      }
    })
  ]
};

const collisonDetector = Actor.create(collision);

export const cubes = {
  init() {
    let cs = [];
    for (let i = 0; i < NUM_OF_PAIRS; i++) {
      cs = cs.concat(cubePairMaker(i));
    }
    return cs;
  },

  attach(state, ctx) {
    state.ctx = ctx;
    state.forEach(c => Actor.send(c, ['attach', { ctx }]));
    return state;
  },

  advance(state) {
    // see if cubes occupy same space
    state.forEach(c => {
      Actor.send(c, ['willAdvance'])
    });

    return state;
  }
};

export const cube = {
  init(initialState) {
    const state = initialState;;
    return state;
  },

  attach(state, { ctx }) {
    ctx.fillStyle = `#${state.color}`;
    ctx.fillRect(
      state.coord.x,
      state.coord.y,
      state.coord.w,
      state.coord.h
    );
    state.ctx = ctx;
    return state;
  },

  willAdvance(state) {
    const move = {
      color: state.color,
      direction: state.direction,
      coord: {
        x: state.coord.x + (state.speed * state.direction),
        y: state.coord.y,
        w: state.coord.w,
        h: state.coord.h
      },
      speed: state.speed,
      self: state.self,
      ctx: state.ctx
    };

    Actor.send(collisonDetector, ['validateMove', { move }]);

    return state;
  },

  advance(state, { move }) {
    // TODO measure with requestAnimationFrame
    state.ctx.clearRect(
      state.coord.x,
      state.coord.y,
      state.coord.w,
      state.coord.h);

    state.ctx.save();
    state.ctx.fillStyle = `#${move.color}`;
    state.ctx.fillRect(
      move.coord.x,
      move.coord.y,
      move.coord.w,
      move.coord.h
    );

    state.ctx.restore();

    Actor.send(collisonDetector, ['didMove', { move }]);

    return move;
  }
};

//   bump(state, messageData) {
//     const newColor = state.slice(0, 3) + messageData.slice(3);
// 
//     return {
//       color: newColor,
//       direction: state.direction.reverse(),
//       speed: state.speed / 1.1
//     }
//   },
// 
//   bumpWall(state, messageData) {
//     return {
//       color: state.color,
//       direction: state.direction.reverse(),
//       speed: state.speed / 1.1
//     }
//   }
