import { Actor } from '../../src/index';
import { cubes as cbs } from './cube';
import { field } from './field';
import { tick } from './time';

const cubes = Actor.create(cbs);
const fieldBox = Actor.create(field);
const time = Actor.create(tick, { cubes });

Actor.send(cubes,
  ['attach',
   document.getElementById('field')
           .getContext('2d')]);

setInterval(() => {
  Actor.send(time, ['advance']);
}, 10);


// each actor gets a hex color, direction and speed
// if it bumps into another actor, it combines it's color with it's own
// ex: actor1 has #ffffff actor2 is #000000, after collision,
// actor1 now has #fff000 actor2 is now #000fff and direction is reversed;

// actors must return `state`
