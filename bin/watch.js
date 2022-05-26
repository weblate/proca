#!/usr/bin/env node
const { pull } = require("./config");
const getId = require("./id");

const _build = (id) => {
  process.env.actionpage = id;
  process.env.NODE_ENV = process.env.BABEL_ENV = "production";

  const gatherPipes = require("@rescripts/cli/loader");
  const { webpack: transforms } = gatherPipes(["webpack"]);

  const patch = require("@rescripts/cli/patch");
  const { paths } = require("@rescripts/utilities");
  const { webpackConfig, build } = paths;

  patch(transforms, webpackConfig);

  require(build);
};

const readJsonFromStdin = () => {
  let stdin = process.stdin;
  let inputChunks = [];

  stdin.resume();
  stdin.setEncoding("utf8");

  stdin.on("data", function (chunk) {
    inputChunks.push(chunk);
  });

  return new Promise((resolve, reject) => {
    stdin.on("end", function () {
      let inputJSON = inputChunks.join();
      resolve(JSON.parse(inputJSON));
    });
    stdin.on("error", function () {
      reject(Error("error during read"));
    });
    stdin.on("timeout", function () {
      reject(Error("timout during read"));
    });
  });
};

const main = async () => {
  const json = await readJsonFromStdin();
  const id = json.id;
  const campaign = json.campaign.id;
  const org = json.org.name;
  console.log("building page for ", id, campaign, org);
  await pull(id);
  await _build(id);
};

main();
