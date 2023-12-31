// Note: The ` is used to escape spaces
const PROJECT_VAULTS_FOLDER =
  "D:\\Users\\Filament_Games\\Documents\\ProjectResources\\Vaults\\Projects";

const TICKETS_FILE = "tickets.txt";
const PREV_TICKETS_FILE = "prev-tickets.txt";

const BUILD_FOLDER = "builder-folder";
const JIRA_URL = `https://filamentgames.atlassian.net/browse`;
const USERNAME = "ksanmartin@filamentgames.com";
const APP_PASS = "pafi wsyd lykp nsyp";

const Type = {
  STORY: "Story",
  DEFECT: "Defect",
  IMPROVEMENT: "Improvement",
  TASK: "Task",
};

const Hotkey = {
  JIRA: "git",
  FILE: "file",
};

const AHK_HEADER = `#SingleInstance Force\n\n`;

const Messages = {
  NO_SUBJECT: "No subject",
  NO_BODY: "No body",
  FOLDER_CREATE_ERROR: "Folders not created.",
  FOLDERS_CREATED: "Folders created.",
  EMAIL_ERROR: "Email not sent.",
  EMAILS_SENT: "Email sent.",
  AHK_FILE_WRITTEN: "AHK file written.",
  AHK_FILE_WRITE_ERROR: "AHK file not written.",
  TICKETS_FILE_WRITE_ERROR: "Tickets file not written.",
  TICKETS_FILE_RESET: "Tickets file was updated.",
  PREVIOUS_TICKETS_APPENDED: "Previous tickets appended.",
  PREVIOUS_TICKETS_ERROR: "Previous tickets not appended.",
};

const Labels = {
  NEEDS_PROOF: "Needs Proof",
  TICKET_LINKED: "Ticket Linked",
  NEEDS_PR_LINK: "Needs PR Link",
  NEEDS_LEAD_RESOURCE: "Needs Lead Resource",
};

module.exports = {
  Type,
  Hotkey,
  APP_PASS,
  USERNAME,
  JIRA_URL,
  Messages,
  AHK_HEADER,
  Labels,
  PROJECT_VAULTS_FOLDER,
  BUILD_FOLDER,
  TICKETS_FILE,
  PREV_TICKETS_FILE,
};
