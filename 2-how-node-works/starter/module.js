const Calc = require("./test-module-1");

const calc1 = new Calc();
console.log(calc1.add(2, 5));

const calc2 = require("./test-module-2");
console.log(calc2.add(2, 5));

const { add, multiply } = require("./test-module-2");
console.log(add(2, 5));
console.log(multiply(2, 5));

//cache test
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
