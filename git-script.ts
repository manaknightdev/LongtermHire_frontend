const { exec } = require("child_process");

const getNonNullValue = (value) => {
  if (value != "") {
    return value;
  } else {
    return undefined;
  }
};

const commandConfigMap = {
  init: {
    requireArgument: false,
    requirements: {
      arguments: [],
      message: "",
    },
    action() {
      return [null, "git init"];
    },
  },
  branch: {
    requireArgument: true,
    requirements: {
      arguments: ["branch name"],
      message: "branch=<branch name> \n eg. branch=pws",
    },
    action(value) {
      return [null, `git branch ${value}`];
    },
  },
  checkout: {
    requireArgument: true,
    requirements: {
      arguments: ["branch name"],
      message: "checkout=<branch name> \n eg. checkout=pws",
    },
    action(value) {
      return [null, `git checkout ${value}`];
    },
  },
  merge: {
    requireArgument: true,
    requirements: {
      arguments: ["branch name"],
      message: "merge=<branch name> \n eg. merge=pws",
    },
    action(value) {
      return [null, `git merge ${value}`];
    },
  },
  "add-remote": {
    requireArgument: true,
    requirements: {
      arguments: ["remote name", "remote url"],
      message:
        'add-remote=<remote name> <remote url> \n eg. add-remote="remotename https://github.com/username/reponame.git"',
    },
    action(remoteName, remoteUrl) {
      return [null, `git remote add ${remoteName} ${remoteUrl}`];
    },
  },
  "rm-remote": {
    requireArgument: true,
    requirements: {
      arguments: ["remote name"],
      message: "rm-remote=<remote name> \n eg. rm-remote=pws",
    },
    action(remoteName) {
      return [null, `git remote remove ${remoteName}`];
    },
  },
  add: {
    requireArgument: true,
    requirements: {
      arguments: ["file path"],
      message: "add=<file path> \n eg. add=.",
    },
    action(filePath) {
      return [null, `git add ${filePath}`];
    },
  },
  commit: {
    requireArgument: true,
    requirements: {
      arguments: ["commit message"],
      message: 'commit=<commit message> \n eg. commit="commit message"',
    },
    action(commitMessage) {
      return [null, `git commit -m "${commitMessage}"`];
    },
  },
  pull: {
    requireArgument: false,
    requirements: {
      arguments: ["remote name", "branch name"],
      message: 'pull=<remote name> <branch name> \n eg. pull="origin main"',
    },
    action(remoteName = null, branchName = null) {
      if (getNonNullValue(remoteName) && !getNonNullValue(branchName)) {
        return [`${this.requirements.message} : branch name is missing`, null];
      }
      if (!getNonNullValue(remoteName) && getNonNullValue(branchName)) {
        return [`${this.requirements.message} : remote name is missing`, null];
      }

      return [
        null,
        `git pull ${remoteName ? `${remoteName}` : ""} ${
          branchName ? `${branchName}` : ""
        }`,
      ];
    },
  },
  push: {
    requireArgument: false,
    requirements: {
      arguments: ["remote name", "branch name"],
      message: 'push=<remote name> <branch name> \n eg. push="origin main"',
    },
    action(remoteName = null, branchName = null) {
      if (getNonNullValue(remoteName) && !getNonNullValue(branchName)) {
        return [`${this.requirements.message} : branch name is missing`, null];
      }
      if (!getNonNullValue(remoteName) && getNonNullValue(branchName)) {
        return [`${this.requirements.message} : remote name is missing`, null];
      }

      return [
        null,
        `git push ${remoteName ? `${remoteName}` : ""} ${
          branchName ? `${branchName}` : ""
        }`,
      ];
    },
  },
};
// const allowedCommands = [
//   "init",
//   "branch",
//   "checkout",
//   "add-remote",
//   "rm-remote",
//   "add",
//   "commit",
//   "pull",
//   "push",
// ];

const computeCommand = (commandConfig, values) => {
  const arguments =
    commandConfig?.requirements?.arguments?.length > 1
      ? values
      : [values?.join(" ")];

  const [error, command] = commandConfig?.action(...arguments);
  if (error) {
    return [error, null];
  }
  return [null, command];
};

const runCommands = (commands, i) => {
  return new Promise((resolve, reject) => {
    return commandProcess(commands, i, resolve, reject);
  });
};

const commandProcess = (commands, i, resolve, reject) => {
  if (i >= commands.length) {
    return resolve([null, "All commands executed successfully"]);
  }

  const command = commands[i];
  exec(command, (error, stdout, stderr) => {
    console.log(`\n$Git >> ${command}`);
    if (!error) {
      console.log(`$Git >> ${command} command output: ${stdout}`);
      commandProcess(commands, i + 1, resolve, reject);
    } else {
      console.error(`$Git >> Error executing Git command: ${stderr}`);
    }
  });
};

const argvs = process.argv.splice(2);

const startGitProcess = async () => {
  return new Promise(async (resolve, reject) => {
    let commands = [];

    for (const commandEntry of argvs) {
      const [key, value] = commandEntry.split("=");
      const commandConfig = commandConfigMap[key];
      const values = value?.trim()?.replace(/\s+/g, " ")?.split(" ");
      // console.log("values >>", values);
      if (!commandConfig) {
        return reject(`Command ${key} is not recognised as internal command`);
      }

      if (commandConfig.requireArgument) {
        if (!value) {
          return reject(
            `Argument is required: ${commandConfig.requirements.message}`
          );
        }

        if (commandConfig.requirements.arguments.length > 1) {
          if (values.length !== commandConfig.requirements.arguments.length) {
            return reject(
              `Invalid number of arguments: ${commandConfig.requirements.message}`
            );
          }
        }
      }
      const [error, command] = computeCommand(commandConfig, values);
      if (error) {
        return reject(error);
      }
      commands = commands.concat(command);
    }

    // console.log("$Git >> commands:", commands);
    if (!commands?.length) {
      return reject("No command to execute");
    }

    const [error, message] = (await runCommands(commands, 0)) as [any, any];
    if (error) {
      return reject(error);
    }
    return resolve(message);
  });
};

const main = async () => {
  try {
    const result = await startGitProcess();
    console.log("\n$Git >>", result);
  } catch (error) {
    console.error("\n$Git >> Error:", error);
  }
};

main();

// git checkout master && git pull origin master && yarn build && git add . && git commit -m "Build Master" && git push origin master && git checkout wireframe && git merge master && git push origin wireframe
// const operations = argvs.map((argv) => argv.split("=")[0]?.toLowerCase())
// const allowedCommands = Object.keys(commandConfigMap);

// const commandValidation = operations.map((command) => {
//   if (!allowedCommands.includes(command.trim())) {
//     return {
//       command,
//       isValid: false,
//     };
//   }

//   return {
//     command,
//     isValid: true,
//   };
// });

// const invalidCommands = commandValidation.filter((command) => !command.isValid);

// if (invalidCommands.length) {
//   const errorMessage = invalidCommands
//     .map((command) => `${command.command} is not recognised as internal command`)
//     .join(", ");

//   return [errorMessage, null];
// }
// node git-script add=. commit="Update" push="origin pws" checkout=master merge=pws push="origin master" checkout=pws
