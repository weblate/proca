const fs = require("fs");
require("./dotenv.js");
const { read, file, save } = require("./config");
const argv = require("minimist")(process.argv.slice(2));
const merge = require("lodash.merge");

console.log(argv);

if (argv.help) {
  console.log (["options"
    ,"--help (this command"
    ,"--color=#cafebebe (set the primary color)"
    ,"--bla"
    ," {id} (actionpage id)"
  ].join ("\n"));
  process.exit (0);
}

const id = argv._[0];
if (!id) {
  console.error("actionpage id missing");
  process.exit (1);
}
if (argv.color) {
  // todo, add some QA if the color is an hex
  return update (id,{layout:{primaryColor:argv.color}});
} 


function update (id, d) {
  let current = read (id);
  const next = merge (current, d);
  save (next);
}


