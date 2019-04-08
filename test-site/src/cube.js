import { Actor } from '../../src/index';
import { collision } from './collision';

const SPEED = 1;
const NUM_OF_PAIRS = 100;

const randomHex = () =>  Math.floor(Math.random()*16777215).toString(16);

const bad = {
  color: randomHex(),
  coord: {x: 2, y: 10, w: 10, h: 10},
  direction: 1,
  speed: 2
};

const bad2 = {
  color: randomHex(),
  coord: {x: 283, y: 10, w: 10, h: 10},
  direction: -1,
  speed: 7
};

const cubePairMaker = (i) => {
  return [
    // Actor.create(cube, bad), Actor.create(cube, bad2)
     Actor.create(cube, {
       color: randomHex(),
       direction: 1,
       speed: Math.floor(Math.random()*10) + 1,
       coord: {
         x: 0,
         y: 10 * i,
         w: 10,
         h: 10
       },
     }),
     Actor.create(cube, {
       color: randomHex(),
       direction: -1,
       speed: Math.floor(Math.random()*10) + 1,
       coord: {
         x: 290,
         y: 10 * i,
         w: 10,
         h: 10
       }
     })
  ]
};

const collisonDetector = Actor.create(collision);

export const cubes = {
  init() {
    // return cubePairMaker();

    let cs = [];
    for (let i = NUM_OF_PAIRS; i > 0; i--) {
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

    Actor.send(collisonDetector,
      ['validateMove', {
        self: move.self,
        x: move.coord.x,
        y: move.coord.y,
        direction: move.direction,
        w: move.coord.w,
        h: move.coord.h
      }]);

    state.nextMove = move;

    return state;
  },

  collide(state) {
    state.nextMove.direction = state.nextMove.direction * -1;

    if (state.nextMove.direction > 0) {
      state.nextMove.coord.x = state.nextMove.coord.x + state.nextMove.speed;
    } else {
      state.nextMove.coord.x = state.nextMove.coord.x - state.nextMove.speed;
    }

    // const newSpeed = state.nextMove.speed + 1;
    // state.nextMove.speed = newSpeed >= 0 ? newSpeed : 0;

    state.nextMove.color = randomHex();

    state.ctx.clearRect(
      state.coord.x,
      state.coord.y,
      state.coord.w,
      state.coord.h);

    state.ctx.save();
    state.ctx.fillStyle = `#${state.nextMove.color}`;

    state.ctx.fillRect(
      state.nextMove.coord.x,
      state.nextMove.coord.y,
      state.nextMove.coord.w,
      state.nextMove.coord.h
    );

    state.ctx.restore();

    Actor.send(collisonDetector, ['didMove', {
      self: state.self,
      direction: state.nextMove.direction,
      x: state.nextMove.coord.x,
      y: state.nextMove.coord.y,
      w: state.nextMove.coord.w,
      h: state.nextMove.coord.h
    }]);

    return state.nextMove;
  },

  reverse(state) {
    state.nextMove.direction = state.nextMove.direction * -1;

    state.ctx.clearRect(
      state.coord.x,
      state.coord.y,
      state.coord.w,
      state.coord.h);

    state.ctx.save();
    state.ctx.fillStyle = `#${state.nextMove.color}`;

    state.ctx.fillRect(
      state.nextMove.coord.x,
      state.nextMove.coord.y,
      state.nextMove.coord.w,
      state.nextMove.coord.h
    );

    state.ctx.restore();
    Actor.send(collisonDetector, ['didMove', {
      self: state.self,
      direction: state.nextMove.direction,
      x: state.nextMove.coord.x,
      y: state.nextMove.coord.y,
      w: state.nextMove.coord.w,
      h: state.nextMove.coord.h
    }]);

    return state.nextMove;
  },

  advance(state) {
    state.ctx.clearRect(
      state.coord.x,
      state.coord.y,
      state.coord.w,
      state.coord.h);

    state.ctx.save();
    state.ctx.fillStyle = `#${state.nextMove.color}`;
    state.ctx.fillRect(
      state.nextMove.coord.x,
      state.nextMove.coord.y,
      state.nextMove.coord.w,
      state.nextMove.coord.h
    );

    state.ctx.restore();

    Actor.send(collisonDetector, ['didMove', {
      self: state.self,
      direction: state.nextMove.direction,
      x: state.nextMove.coord.x,
      y: state.nextMove.coord.y,
      w: state.nextMove.coord.w,
      h: state.nextMove.coord.h
    }]);

    return state.nextMove;
  }
};
