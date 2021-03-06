const zipFolder = require("zip-folder");
const exec = require("child_process").exec;

const folder = "build";
const zipName = "pr-monitor.zip";

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EXTENSION_ID = process.env.EXTENSION_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

// to fetch it from node_modules
const webstoreLocation = "./node_modules/.bin/webstore";

zipFolder(folder, zipName, function(err) {
  if (err) {
    console.log("Error while creating the archive file!", err);
  } else {
    console.log(
      `Successfully created archive of ${folder} and saved as ${zipName}`
    );
    uploadZip(); // on successful zipping, call upload
  }
});

function uploadZip() {
  let cmd = getUploadCommand();
  exec(cmd, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (error !== null) {
      console.log(`Exec error: ${error}`);
    } else {
      console.log("Successfully Uploaded the zip to chrome web store");
      publishExtension(); // on successful upload, call publish
    }
  });
}

function publishExtension() {
  let cmd = getPublishCommand();
  exec(cmd, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (error !== null) {
      console.log(`Exec error: ${error}`);
    } else {
      console.log("Successfully published the newer version");
    }
  });
}

function getUploadCommand() {
  return `${webstoreLocation} upload --source ${zipName} --extension-id ${EXTENSION_ID} --client-id ${CLIENT_ID} --client-secret ${CLIENT_SECRET} --refresh-token ${REFRESH_TOKEN}`;
}

function getPublishCommand() {
  return `${webstoreLocation} publish --extension-id ${EXTENSION_ID} --client-id ${CLIENT_ID} --client-secret ${CLIENT_SECRET} --refresh-token ${REFRESH_TOKEN}`;
}
