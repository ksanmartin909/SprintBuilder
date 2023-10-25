const PREFIX = "CSAR";
const PROJECT_RESOURCES_FOLDER =
  "D:\\Users\\Filament_Games\\Documents\\ProjectResources";
const BUILD_FOLDER = "builder-folder";
const JIRA_URL = `https://filamentgames.atlassian.net/browse/${PREFIX}-`;

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
  PREFIX,
  Labels,
  PROJECT_RESOURCES_FOLDER,
  BUILD_FOLDER,
};
