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

const a = setInterval(() => {
  Actor.send(time, ['advance']);
}, 10);

window.stop = () => clearInterval(a);
