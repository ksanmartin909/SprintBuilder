const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const {
  makeSnapshotFolders,
  writeSprintAHK,
  sendSprintCardsToBoard,
  execPromise,
} = require("./utils");
const { PROJECT_RESOURCES_FOLDER, BUILD_FOLDER } = require("./constants");

async function buildSprint() {
  const { prefix, sprint } = await readUserInput();

  const sprintData = {
    ...(await getProjectData(prefix)),
    tickets: await getTickets(prefix),
    sprint,
  };

  console.log(sprintData);

  writeSprintAHK(sprintData);
  makeSnapshotFolders(sprintData);
  sendSprintCardsToBoard(sprintData);
}

buildSprint();

async function readUserInput() {
  const promise = new Promise((resolve, reject) => {
    let prefix = "";
    let sprint = "";
    readline.question("For what project? ", function (input) {
      prefix = input;
      readline.question("What sprint? ", function (id) {
        sprint = id;
        readline.close();
      });
    });
    readline.on("close", function () {
      resolve({ prefix: prefix.toUpperCase(), sprint });
    });
  });

  return promise;
}

async function getTickets(prefix) {
  let tickets = {};
  await execPromise(
    `powershell Get-Content ${PROJECT_RESOURCES_FOLDER}\\${prefix}\\${BUILD_FOLDER}\\tickets.txt`,
    parseTicketStdOut,
    {
      tickets,
    }
  );
  function printTasks(tasks) {
    for (let values of Object.values(tasks)) {
      console.log(values.label);
    }
  }
  function getTasks(sprintData) {
    return {
      1: {
        label: "1. Write AHK Scripts",
        fn: () => writeSprintAHK(sprintData),
      },
      2: {
        label: "1. Make Screenshot Folders",
        fn: () => makeSnapshotFolders(sprintData),
      },
    };
  }

  function parseTicketStdOut(stdout, returnValues) {
    const { tickets } = returnValues;
    let content = stdout.split("\r\n").filter((item) => item !== "");
    for (const ticket in content) {
      const [key, description] = content[ticket].split(": ");
      tickets[key] = description;
    }
    return;
  }
  return tickets;
}

async function getProjectData(prefix) {
  const projects = {};
  await execPromise(
    `powershell Get-Content ${PROJECT_RESOURCES_FOLDER}\\${prefix}\\${BUILD_FOLDER}\\project.txt`,
    parseProjectStdOut,
    {
      projects,
    }
  );

  function parseProjectStdOut(stdout, returnValues) {
    let { projects } = returnValues;

    let content = stdout.split(",").filter((item) => item !== "");
    projects[content[0]] = {
      prefix: content[0],
      boardEmail: content[1],
      screenshotPath: content[2].split("\r\n").join(""),
    };

    return;
  }
  return projects[prefix];
}
