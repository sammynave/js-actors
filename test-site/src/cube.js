import { Actor } from '../../src/index';
import { collision } from './location';

const SPEED = 3;

const cube1State = {
  color: 'aaafff',
  direction: 1,
  speed: SPEED,
  coord: {
    x: 0,
    y: 0,
    w: 10,
    h: 10
  },
};

const cube2State = {
  color: '000000',
  direction: -1,
  speed: SPEED,
  coord: {
    x: 290,
    y: 0,
    w: 10,
    h: 10
  }
};

const collisonDetector = Actor.create(collision);

export const cubes = {
  init() {
    const cube1 = Actor.create(cube, cube1State);
    const cube2 = Actor.create(cube, cube2State);
    return [cube1, cube2];
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
