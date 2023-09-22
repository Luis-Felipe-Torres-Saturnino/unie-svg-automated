import { Vector3, Vector2 } from "../library/Vector.mjs"
/* const Vector2 = require("../library/Vector").Vector2; */
let vectors = [
    new Vector2(1, 2),
    new Vector2([6,9]),
    new Vector2({x: 5, y: 3}),
    new Vector2(0, 1),
    new Vector2(1, 1)

]
vectors.forEach((v)=> {
    console.log(v);
});

console.clear()
console.log('not', vectors[0])
vectors[0].Normal()
console.log('normal', vectors[0])