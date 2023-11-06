const util = require("util");
const { execPromise } = require("./utils");
const { Messages } = require("./constants");
const exec = util.promisify(require("child_process").exec);
const BASE_RESOURCES_FOLDER = `D:\\Users\\Filament_Games\\Documents\\ProjectResources`;

// const PROJECT_FOLDER = `${BASE_RESOURCES_FOLDER}\\CSAR\\v1.40\\Tickets\\sprint-5`;
// const PROJECT_FOLDER= `${BASE_RESOURCES_FOLDER}\\CASA\\Tickets`
const PROJECT_FOLDER = `${BASE_RESOURCES_FOLDER}\\FGW\\Tickets`;

const newTickets = ["Defect/CSAR-952-CSAR-954/WSOD-defensive-approach"];

function categorize(string, folders) {
  let entry = string;
  const date = new Date();
  const hotstring = (ticket, type = "") =>
    `::${ticket.toLowerCase().split("-").join("")}${type}::`;

  if (entry.includes("/")) {
    // Entry is a git style string
    entry = entry.split("/");
    let [type, ticket, description] = entry;
    const file = `${ticket} - ${description.split("-").join(" ")}`;
    folders.push(`${PROJECT_FOLDER}\\"${file}"`);
    console.log(`# ${date.toISOString().split("T")[0]}`);

    // Determine if ticket is bundled based on extra hyphens and set truncated hotkey trigger if so.
   const trigger =
      ticket.match(/-/g).length > 1
        ? `${ticket.split("-")[0]}${ticket.split("-")[1]}`
        : ticket;

    console.log(`${hotstring(trigger, "file")}${file}`);
    console.log(`${hotstring(trigger, "git")}${string}`);
    console.log(`${hotstring(trigger)}${ticket}`);
    console.log(`\n`);
  } else {
    // Entry is a file style string
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

async function process(tickets) {
  let folders = [];

  printHotstrings(tickets, folders);
  await makeFolders(folders);
}
function printHotstrings(tickets, folders) {
  for (const string of tickets) {
    categorize(string, folders);
  }
}
async function makeFolders(folders) {
  try {
    const command = "mkdir " + folders.join(" ");
    await execPromise(command);
    console.log(Messages.FOLDERS_CREATED);
  } catch (err) {
    console.log(Messages.FOLDER_CREATE_ERROR);
  }
}

process(newTickets);
