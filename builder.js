const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const {
  makeSnapshotFolders,
  writeSprintAHK,
  sendSprintCardsToBoard,
  appendPreviousTickets,
  resetTicketsFile,
  execPromise,
  formatTicketStdOut,
} = require("./utils");
const {
  PROJECT_VAULTS_FOLDER,
  BUILD_FOLDER,
  TICKETS_FILE,
  PREV_TICKETS_FILE,
} = require("./constants");

const functions = [
  {
    label: "1. Write AHK Scripts",
    fn: (sprintData) => writeSprintAHK(sprintData),
  },
  {
    label: "2. Make Screenshot Folders",
    fn: (sprintData) => makeSnapshotFolders(sprintData),
  },
  {
    label: "3. Make Trello Cards",
    fn: (sprintData) => sendSprintCardsToBoard(sprintData),
  },
];

async function buildSprint() {
  const projects = ["casa", "fgw", "csar"];
  const { prefix, sprint, choices, resetTickets } = await readUserInput();

  if (projects.includes(prefix.toLowerCase()) && choices.length) {
    const sprintData = {
      ...(await getProjectData(prefix)),
      tickets: await getTickets(prefix, resetTickets),
      sprint,
    };

    console.log(sprintData);
    showChoices(choices);

    for (const choice of choices) {
      functions[choice].fn(sprintData);
    }
  } else {
    console.log("\nInvalid prefix or choices.");
    console.log({ prefix, sprint, choices });
    console.log();
  }
}

buildSprint();

async function readUserInput() {
  const promise = new Promise((resolve, reject) => {
    let prefix = "";
    let sprint = "sprint-";
    let choices = [];
    let resetTickets = false;
    readline.question("For what project? ", function (input) {
      prefix = input;
      readline.question("What sprint? ", function (id) {
        sprint += id;
        readline.question("Reset ticket file? (Y/N) ", function (reset) {
          resetTickets = reset.toLowerCase() === "y" ? true : false;

          choicesPrompt();
          readline.on("line", function (input) {
            const isList = isNaN(parseInt(input)) ? false : true;
            if (isList) {
              choices = confirmPrompt(input);
              readline.on("line", function () {});
            } else {
              switch (input.toLowerCase()) {
                case "y":
                  readline.close();
                  break;
                case "n":
                  choicesPrompt();
                  break;
                default:
                  choices = [];
                  break;
              }
            }
          });
        });
      });
    });
    readline.on("close", function () {
      resolve({ prefix: prefix.toUpperCase(), sprint, choices, resetTickets });
    });
  });

  return promise;
}
function choicesPrompt() {
  readline.setPrompt("What tasks do you want to run?\n");
  console.log("\n====================================");
  readline.prompt();
  console.log("====================================");
  readline.setPrompt("\n\n");
  showChoices();
}
function confirmPrompt(input) {
  const choices = getUserChoices(input);
  console.log("\n====================================");
  console.log("You chose:");
  console.log("====================================");
  showChoices(choices);
  readline.setPrompt("\nIs this correct? (Y/N) ");
  readline.prompt();
  return choices;
}

function getUserChoices(input) {
  return input.split(",").map((choice) => parseInt(choice) - 1);
}
function showChoices(choices = []) {
  if (choices.length === 0) {
    for (let fn of functions) {
      console.log(fn.label);
    }
  } else {
    for (const choice of choices) {
      console.log(functions[choice].label);
    }
  }
  console.log();
}
async function getTickets(prefix, resetTickets = false) {
  let tickets = {};
  await execPromise(
    `powershell Get-Content ${PROJECT_VAULTS_FOLDER}\\${prefix}\\${BUILD_FOLDER}\\${TICKETS_FILE}`,
    parseTicketStdOut,
    {
      tickets,
    }
  );

  function parseTicketStdOut(stdout, returnValues) {
    const { tickets } = returnValues;

    let [prev, current] = stdout.split("---");

    prev = formatTicketStdOut(prev);
    current = formatTicketStdOut(current);
    console.log(prev, current);

    if (current)
      for (const ticket of current) {
        const [key, description] = ticket.split(": ");
        if (description) {
          tickets[key] = description;
        }
      }

    if (prev && resetTickets)
      for (const ticket of prev) {
        //TODO Make so  only pass 1 string to appendPreviousTickets
        appendPreviousTickets(ticket, prefix);
      }
  }

  if (resetTickets) resetTicketsFile(tickets, prefix);
  return tickets;
}

async function getProjectData(prefix) {
  const projects = {};
  await execPromise(
    `powershell Get-Content ${PROJECT_VAULTS_FOLDER}\\${prefix}\\${BUILD_FOLDER}\\project.txt`,
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
