const util = require("util");
const exec = util.promisify(require("child_process").exec);
const BASE_RESOURCES_FOLDER = `D:\\Users\\Filament_Games\\Documents\\ProjectResources`;

const PROJECT_FOLDER = `${BASE_RESOURCES_FOLDER}\\CSAR\\v1.40\\Tickets\\sprint-5`;
// const PROJCET_FOLDER: `${BASE_RESOURCES_FOLDER}\\CSAR\\v1.40\\Tickets\\sprint-4`

const newTickets = [
  "Story/CSAR-920/update-manual-for-v140",
  "Defect - CSAR-877 - duplicate accounts are bulk merged",
];

function categorize(string, folders) {
  let entry = string;
  const hotstring = (ticket, type = "") => `::${ticket}${type}::`;

  if (entry.includes("/")) {
    entry = entry.split("/");
    let [type, ticket, description] = entry;
    const file = `${ticket} - ${description.split("-").join(" ")}`;
    folders.push(`${PROJECT_FOLDER}\\"${file}"`);
    console.log(`${hotstring(ticket, "file")}${file}`);
    console.log(`${hotstring(ticket, "git")}${string}`);
    console.log(`${hotstring(ticket)}${ticket}`);
    console.log(`\n`);
  } else {
    entry = entry.split(" - ");
    let [type, ticket, description] = entry;
    const file = `${ticket} - ${description}`;
    folders.push(`${PROJECT_FOLDER}\\"${file}"`);
    console.log(
      `${hotstring(ticket, "git")}${type}/${ticket}/${description
        .split(" ")
        .join("-")}`
    );
    console.log(`${hotstring(ticket, "file")}${ticket} - ${description}`);
    console.log(`${hotstring(ticket)}${ticket}`);
    console.log(`\n`);
  }
}

function process(tickets) {
  let folders = [];

  printHotstrings(tickets, folders);
  makeFolders(folders);
}
function printHotstrings(tickets, folders) {
  for (const string of tickets) {
    categorize(string, folders);
  }
}
function makeFolders(folders) {
  const command = "mkdir " + folders.join(" ");
  const promise = exec(command);
  const child = promise.child;
}

process(newTickets);
