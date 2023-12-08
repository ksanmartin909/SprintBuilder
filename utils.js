const {
  Hotkey,
  Type,
  USERNAME,
  APP_PASS,
  JIRA_URL,
  AHK_HEADER,
  Labels,
  Messages,
  PROJECT_VAULTS_FOLDER,
  BUILD_FOLDER,
} = require("./constants");
const fs = require("fs");
var nodemailer = require("nodemailer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function generateHotstrings({ tickets, prefix, sprint }) {
  let hotstrings = "";

  const date = new Date();

  hotstrings += `; ${sprint} - ${date.toISOString().split("T")[0]} \n\n`;
  for (let [key, value] of Object.entries(tickets)) {
    let type = Type.STORY;
    let text = value;

    if (text.includes("/")) {
      type = value.split("/")[0];
      text = value.split("/")[1];
    }
    hotstrings += `::${prefix.toLowerCase()}${key}${
      Hotkey.JIRA
    }::${type}/${prefix}-${key}/${text.split(" ").join("-")}\n`;

    hotstrings += `::${prefix.toLowerCase()}${key}${
      Hotkey.FILE
    }::${prefix}-${key} - ${text}\n`;

    hotstrings += `::${prefix.toLowerCase()}${key}::${prefix}-${key}\n\n`;
  }

  return hotstrings;
}

function writeSprintAHK(projectData) {
  fs.appendFile(
    `${PROJECT_VAULTS_FOLDER}/${projectData.prefix}/${BUILD_FOLDER}/${projectData.prefix}-Tickets.ahk`,
    generateHotstrings(projectData),
    (err) => {
      if (err) {
        console.log(err);
        console.error(Messages.AHK_FILE_WRITE_ERROR);
      } else {
        console.log(Messages.AHK_FILE_WRITTEN);
      }
    }
  );
}

function emailToTrello(
  cardInfo = { subject: "No subject", text: "No body" },
  boardEmail
) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USERNAME,
      pass: APP_PASS,
    },
  });

  var mailOptions = {
    from: USERNAME,
    to: boardEmail,
  };

  transporter.sendMail(Object.assign(mailOptions, cardInfo), function (error) {
    if (error) {
      console.log(Messages.EMAIL_ERROR);
    } else {
      console.log(`Email Sent: ${cardInfo.subject}`);
    }
  });
}

function sendSprintCardsToBoard(projectData) {
  const { tickets, boardEmail, prefix } = projectData;
  for (let [key, value] of Object.entries(tickets)) {
    let type = Type.STORY;
    let text = value;

    if (text.includes("/")) {
      type = value.split("/")[0];
      text = value.split("/")[1];
    }
    const jiraTicket = `**Jira Ticket:** \n ${JIRA_URL}/${prefix}-${key} \n\n`;
    const prLink = `**PR Link:** \n\n\n\n`;
    const description = `**Description:** \n\n`;

    const labels = [
      Labels.NEEDS_PROOF,
      Labels.TICKET_LINKED,
      Labels.NEEDS_PR_LINK,
    ];

    const addLabels = labels
      .map((label) => `#${label.split(" ").join("_")}`)
      .join(" ");

    emailToTrello(
      {
        subject: `${type}/${prefix}-${key}/${text} ${addLabels}`,
        text: jiraTicket + prLink + description,
      },
      boardEmail
    );
  }
}

const makeSnapshotFolders = async (projectData) => {
  let { prefix, tickets, screenshotPath, sprint } = projectData;
  sprint = sprint ?? "sprint";
  let folders = [];
  for (let [key, value] of Object.entries(tickets)) {
    if (value.includes("/")) {
      value = value.split("/")[1];
    }
    let text = value.split("-").join(" ");
    folders.push(
      `"${PROJECT_VAULTS_FOLDER}\\${prefix}\\${screenshotPath}\\${sprint}\\${prefix}-${key} - ${text}"`
    );
  }
  const command = "mkdir " + folders.join(" ");
  console.log(command);

  try {
    await execPromise(command);
    console.log(Messages.FOLDERS_CREATED);
  } catch (err) {
    console.log(Messages.FOLDER_CREATE_ERROR);
  }
};

async function execPromise(
  command,
  callback = () => null,
  returnValues = null
) {
  const promise = exec(command);
  const child = promise.child;
  const fn = returnValues
    ? (stdout) => callback(stdout, returnValues)
    : callback;
  child.stdout.on("data", fn);

  return promise;
}

module.exports = {
  execPromise,
  makeSnapshotFolders,
  generateHotstrings,
  writeSprintAHK,
  sendSprintCardsToBoard,
};
