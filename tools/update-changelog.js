/*
 * Looks at each commit that is not a "Merge pull request", figure out
 * the packages it modified and group the commit messages by package.
 * 
 * Then check for [major], [minor], [patch] in the commit message, and
 * automatically generate the new package tag name with the would be 
 * updated version.
 * 
 * Write all these to the file CHANGELOG.md.
 *
 */

const Fs = require("fs");
const xsh = require("xsh");
const Path = require("path");
const assert = require("assert");
const Promise = require("bluebird");
const semver = require("semver");
xsh.Promise = Promise;
xsh.envPath.addToFront(Path.join(__dirname, "../node_modules/.bin"));
const _ = require("lodash");

const changeLogFile = Path.resolve("CHANGELOG.md");
const changeLog = Fs.readFileSync(changeLogFile).toString();
let gitClean = false;
const packageMapping = {
  "electrode-archetype-react-app": "electrode-archetype-react-app[-dev]",
  "electrode-archetype-react-app-dev": "electrode-archetype-react-app[-dev]",
  "electrode-archetype-react-component": "electrode-archetype-react-component[-dev]",
  "electrode-archetype-react-component-dev": "electrode-archetype-react-component[-dev]"
};

const reverseMapping = Object.assign.apply(
  undefined,
  _(packageMapping)
    .values()
    .uniq()
    .map(mapped => {
      return { [mapped]: _.keys(_.pickBy(packageMapping, v => v === mapped)) };
    })
    .value()
);

const mapPkg = n => {
  return packageMapping[n] || n;
};

const checkGitClean = () => {
  return xsh
    .exec(`git diff --quiet`)
    .then(() => (gitClean = true))
    .catch(() => (gitClean = false));
};

const processLernaUpdated = output => {
  // search for last commit that's Publish using lerna
  const lernaInfo = output.stderr.split("\n");
  const tagSig = "Comparing with";
  let tagIndex;
  let tagLine = lernaInfo
    .find(x => {
      tagIndex = x.indexOf(tagSig);
      return tagIndex >= 0;
    })
    .trim();

  if (tagLine.endsWith(".")) {
    tagLine = tagLine.substr(0, tagLine.length - 1);
  }

  assert(tagLine, "Can't find last publish tag from lerna");
  const tag = tagLine.substr(tagIndex + tagSig.length).trim();
  const packages = output.stdout
    .split("\n")
    .filter(x => x.trim().length > 0)
    .map(x => x.substr(2));
  return { tag, packages };
};

const listGitCommits = updated => {
  const tag = updated.tag;
  return xsh
    .exec(true, `git log ${tag}...HEAD --pretty=format:'%H %s'`)
    .then(output => {
      const commits = output.stdout.split("\n").filter(x => !x.startsWith("Merge pull request #"));
      return commits.reduce(
        (a, x) => {
          const idx = x.indexOf(" ");
          const id = x.substr(0, idx);
          a.ids.push(id);
          a[id] = x.substr(idx + 1);
          return a;
        },
        { updated, ids: [] }
      );
    })
    .then(commits => {
      if (changeLog.indexOf(commits.ids[0]) >= 0) {
        console.log("change log already contain a commit from new commits");
        process.exit(1);
      }
      return commits;
    });
};

const collateCommitsPackages = commits => {
  const commitIds = commits.ids;
  const collated = {
    realPackages: [],
    packages: {},
    samples: {},
    others: {},
    files: {}
  };

  return Promise.map(
    commitIds,
    id => {
      return xsh.exec(true, `git diff-tree --no-commit-id --name-only -r ${id}`).then(output => {
        // determine packages changed
        const files = output.stdout.split("\n").filter(x => x.trim().length > 0);
        const handled = { packages: {}, samples: {}, others: {}, files: {} };
        files.reduce((a, x) => {
          const parts = x.split("/");
          const add = (group, key) => {
            if (handled[group][key]) return;
            if (!a[group][key]) {
              a[group][key] = { msgs: [] };
            }
            a[group][key].msgs.push({ m: commits[id], id });
            handled[group][key] = true;
          };
          if (parts[0] === "packages" || parts[0] === "samples") {
            if (parts[0] === "packages" && collated.realPackages.indexOf(parts[1]) < 0) {
              collated.realPackages.push(parts[1]);
            }
            add(parts[0], mapPkg(parts[1]));
          } else if (parts.length > 1) {
            add("others", parts[0]);
          } else {
            add("files", parts[0]);
          }
          return a;
        }, collated);
        return "";
      });
    },
    { concurrency: 1 }
  ).then(() => {
    collated.lernaPackages = commits.updated.packages.filter(
      r => collated.realPackages.indexOf(r) < 0
    );
    const updateByMap = _(collated.realPackages)
      .map(p => packageMapping[p])
      .filter()
      .map(p => {
        return reverseMapping[p] || undefined;
      })
      .flatMap()
      .value();
    collated.realPackages = _.uniq(collated.realPackages.concat(updateByMap));
    collated.forcePackages = collated.realPackages.filter(
      r => commits.updated.packages.indexOf(r) < 0
    );
    return collated;
  });
};

const determinePackageVersions = collated => {
  const types = ["patch", "minor", "major"];

  const findVersion = (name, packages) => {
    const Pkg = require(Path.resolve("packages", name, "package.json"));
    const mappedName = mapPkg(name);
    packages[mappedName] = packages[mappedName] || {};
    const msgs = packages[mappedName].msgs || [];
    const updateType = msgs.reduce((a, x) => {
      if (x.m.indexOf("[maj") >= 0) {
        if (a < 2) {
          a = 2;
        }
      } else if (x.m.indexOf("[min") >= 0) {
        if (a < 1) {
          a = 1;
        }
      }
      return a;
    }, 0);
    packages[mappedName].version = Pkg.version;
    const newVersion = semver.inc(Pkg.version, types[updateType]);
    packages[mappedName].newVersion = newVersion;
  };

  return Promise.map(collated.realPackages, name => findVersion(name, collated.packages))
    .then(() => {
      const packages = collated.lernaPackages;
      collated._lernaPackages = {};
      return Promise.map(collated.lernaPackages, name =>
        findVersion(name, collated._lernaPackages)
      );
    })
    .then(() => collated);
};

const updateChangelog = collated => {
  const emittedCommits = {};
  const d = new Date();
  const output = [];
  const lernaUpdated = collated.lernaPackages.length > 0;
  output.push(`# ${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}\n\n## Packages\n\n`);
  if (lernaUpdated) {
    output.push(`### Directly Updated\n\n`);
  }
  const emitPackageMsg = (p, packages) => {
    const pkg = packages[mapPkg(p)];
    output.push(
      `-   ${p}@${pkg.newVersion} ` + "`" + `(${pkg.version} => ${pkg.newVersion})` + "`\n"
    );
  };
  collated.realPackages.sort().forEach(p => emitPackageMsg(p, collated.packages));
  if (lernaUpdated) {
    output.push(`\n### Lerna Updated\n\n`);
    collated.lernaPackages.sort().forEach(p => emitPackageMsg(p, collated._lernaPackages));
  }
  output.push(`\n## Commits\n\n`);

  const commitUrl = "http://github.com/electrode-io/electrode/commit";

  const prUrl = "https://github.com/electrode-io/electrode/pull";

  const linkifyPR = x => x.replace(/\(#([0-9]+)\)$/, `([#$1](${prUrl}/$1))`);

  const emitCommitMsg = msg => {
    emitCommitMsg[msg.id] = true;
    output.push(`    -   ${linkifyPR(msg.m)} [commit](${commitUrl}/${msg.id})\n`);
  };

  const outputCommitMsgs = (items, prefix) => {
    const keys = Object.keys(items);
    if (keys.length === 0) return;
    keys.sort().forEach(p => {
      const pkg = items[p];
      if (pkg.msgs.length === 0) return;
      output.push("-   `" + prefix + p + "`\n\n");
      pkg.msgs
        .slice()
        .reverse()
        .forEach(emitCommitMsg);
      output.push("\n");
    });
  };

  const outputPkgCommitMsgs = (group, prefix) => {
    const items = collated[group];
    outputCommitMsgs(items, prefix ? group + "/" : "");
  };

  outputPkgCommitMsgs("packages", true);
  outputPkgCommitMsgs("samples", true);
  outputPkgCommitMsgs("others", false);
  const filesItems = Object.keys(collated.files).reduce(
    (a, x) => {
      a.MISC.msgs = a.MISC.msgs.concat(
        collated.files[x].msgs.filter(msg => {
          if (!emitCommitMsg[msg.id]) {
            return (emitCommitMsg[msg.id] = true);
          }
          return false;
        })
      );
      return a;
    },
    { MISC: { msgs: [] } }
  );
  outputCommitMsgs(filesItems, "");

  const updateText = output.join("");
  Fs.writeFileSync(changeLogFile, `${updateText}${changeLog}`);
};

const showPublishInfo = collated => {
  console.log(
    "publish command: node_modules/.bin/lerna publish",
    (collated.forcePackages || []).map(p => `--force-publish ${p}`).join(" ")
  );
  const majorBumps = collated.realPackages.filter(p => {
    const pkg = collated.packages[mapPkg(p)];
    return pkg.newVersion.split(".")[0] > pkg.version.split(".")[0];
  });
  const majorArchetypes = majorBumps.filter(p => p.startsWith("electrode-archetype-react"));
  if (majorArchetypes.length > 0) {
    console.log(
      `\nThese archetypes had major bumps:\n\n${majorArchetypes.join("\n")}`,
      "\n\nBefore publishing, make sure:",
      "\n\n- generator-electrode is updated",
      "\n- The -dev archetype's peer dep is updated\n"
    );
  }
};

const commitChangeLogFile = clean => {
  console.log("Change log updated.");
  if (!gitClean) {
    console.log("Your git branch is not clean, skip committing changelog file");
    return;
  }

  return xsh
    .exec(`git add ${changeLogFile} && git commit -m "Update changelog"`)
    .then(() => {
      console.log("Changelog committed");
    })
    .catch(e => {
      console.log("Comit changelog failed", e);
    });
};

xsh
  .exec(true, `lerna updated`)
  .then(processLernaUpdated)
  .then(listGitCommits)
  .then(collateCommitsPackages)
  .then(determinePackageVersions)
  .tap(checkGitClean)
  .tap(updateChangelog)
  .then(showPublishInfo)
  .then(commitChangeLogFile);
