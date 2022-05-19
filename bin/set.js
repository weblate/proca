#!/usr/bin/env node
const fs = require("fs");
require("./dotenv.js");
const { read, file, save, push, pull } = require("./config");
const argv = require("minimist")(process.argv.slice(2));
const merge = require("lodash.merge");

console.log(1, argv);



const help = () => {
  console.log(
    [
      "options",
      "--help (this command)",
      "--push (push the modified config to the server)",
      "--pull (pull the config from the server before doing the modification)",
      "--color=#cafebebe (set the primary color)",
      "--url=http://example.com (set the url)",
      "--lang=en (set the language)",
      "--theme=dark (set the theme)",
      "--variant=light (set the variant)",
      "--mobile=true (set the mobile version)",
      "--autostart=true (set the autostart)",
      "--forcewidth=54 (force the width)",
      "--lastnameRequired=true (is lastname field required?)",
      "--orgdata=true ()",
     // "--journey=[] (set the journey)",
      " {id} (actionpage id)",
    ].join("\n")
  );
  process.exit(0);
};

if (argv.help) {
  help();
}

function update (id, d) {
  let current = read (id);
  const next = merge (current, d);
  save (next);
}

const ids = argv._;
if (ids.length === 0) {
  console.error("actionpage id(s) missing");
  help();
  process.exit(1);
}

const isBoolean = (arg, flag) => {
  if (!["true", "false"].includes(arg)) {
    console.error(`${flag} must be true or false`);
    process.exit(0);
  }
 return arg === "true" ? true : false;
};

ids.map(id => {
  (async () => {
    if (argv.pull) {
      try {
        const d = await pull(id);
      } catch (errors) {
        Array.isArray(errors) &&
          errors.map((e) => {
            console.error("\x1b[31m", e.message);
          });
      }
    }

    if (argv.push) {
      // must be the last one
      try {
        const d = await push(id);
      } catch (errors) {
        Array.isArray(errors) &&
          errors.map((e) => {
            console.error("\x1b[31m", e.message);
          });
      }
    }

    if (argv.url) {
      update(id, { org: { url: argv.url } });
    }

    if (argv.lang) {
      update(id, { lang: argv.lang });
    }

    // LAYOUT SETTINGS

    if (argv.color) {
      // todo, add some QA if the color is an hex
      update(id, { layout: { primaryColor: argv.color } });
    }

    if (argv.theme) {
      if (!["dark", "light"].includes(argv.theme)) {
        console.error("theme must be either dark or light");
        process.exit(1);
      }
      update(id, { layout: { theme: argv.theme } });
    }

    if (argv.variant) {
      if (!["standard", "filled", "outlined"].includes(argv.variant)) {
        console.error("variant must be standard, filled or outlined");
        process.exit(0);
      }
      update(id, { layout: { variant: argv.variant } });
    }

    // TO DO HTMLTEMPLATE

    // COMPONENT.WIDGET SETTINGS

    if (argv.mobile) {
      const mobile = isBoolean(argv.mobile, 'mobile');
      update(id, { component: { widget: { mobileVersion: mobile } } });
    }

    if (argv.autostart) {
       const autostart = isBoolean(argv.autostart, 'autostart');
      update(id, { component: { widget: { autoStart: autostart } } });
    }

    if (argv.forcewidth) {
      if(!(typeof argv.forcewidth === 'number')) {
        console.error("forcewidth must be true or number");
        process.exit(0);
      }
      update(id, { component: { widget: { forceWidth: argv.forcewidth } } });
    }

    // COMPONENT.REGISTER (FIELD) SETTINGS

    if (argv.orgdata) {
      const isRequired = isBoolean(argv.orgdata, 'orgdata');
      update(id, { component: { field: { organisation: isRequired } } });
    }

    if (argv.lastnamerequired) {
      const isRequired = isBoolean(argv.lastnamerequired, 'lastnameRequired');
      update(id, { component: { field: { lastname: { required: isRequired } } } });
    }

    if (argv.poscodeshow) {
      const show = isBoolean(argv.poscodeshow, 'poscodeshow');
      update(id, { component: { field: { poscode: show } } });
    }

    if (argv.poscoderequired) {
      const isRequired = isBoolean(argv.poscoderequired, 'poscoderequired');
      update(id, { component: { field: { poscode: { required: isRequired } } } });
    }

    if (argv.countryshow) {
      const show = isBoolean(argv.countryshow, 'countryshow');
      update(id, { component: { field: { country: show } } });
    }

    if (argv.countryrequired) {
      const isRequired = isBoolean(argv.countryrequired, 'countryrequired');
      update(id, { component: { field: { country: { required: isRequired } } } });
    }

    if (argv.commentshow) {
      const show = isBoolean(argv.commentshow, 'commentshow');
      update(id, { component: { field: { comment: show } } });
    }

    if (argv.commentrequired) {
      const isRequired = isBoolean(argv.commentrequired, 'commentrequired');
      update(id, { component: { field: { comment: { required: isRequired } } } });
    }

    if (argv.phoneshow) {
      const show = isBoolean(argv.phoneshow, 'phoneshow');
      update(id, { component: { field: { phone: show } } });
    }

    // COUNTER SETTINGS

    if (argv.goal) {
      if (!(typeof argv.goal === 'number')) {
        console.error("goal must be a number");
        process.exit(0);
      }
      update(id, { component: { counter: { steps: argv.goal } } });
    }

    // console.error("missing or incorrect parameter");
    // help();
  })();
});