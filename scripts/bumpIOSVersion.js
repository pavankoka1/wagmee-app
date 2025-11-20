const fs = require("fs");
const path = require("path");

const appJsonPath = path.join(__dirname, "../app.json");
const infoPlistPath = path.join(__dirname, "../ios/WagmeeClub/Info.plist");
const projectPbxprojPath = path.join(
    __dirname,
    "../ios/WagmeeClub.xcodeproj/project.pbxproj"
);

// Read files
let appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
let infoPlist = fs.readFileSync(infoPlistPath, "utf8");
let projectPbxproj = fs.readFileSync(projectPbxprojPath, "utf8");

// Get current versions
const currentVersion = appJson.expo.version;
const currentBuildNumber = parseInt(appJson.expo.ios.buildNumber, 10);

// Bump version (patch version)
const versionParts = currentVersion.split(".");
const major = parseInt(versionParts[0], 10);
const minor = parseInt(versionParts[1], 10);
const patch = parseInt(versionParts[2], 10) + 1;
const newVersion = `${major}.${minor}.${patch}`;

// Bump build number
const newBuildNumber = currentBuildNumber + 1;

console.log(
    `Bumping iOS version from ${currentVersion} (build ${currentBuildNumber}) to ${newVersion} (build ${newBuildNumber})`
);

// Update app.json
appJson.expo.version = newVersion;
appJson.expo.ios.buildNumber = newBuildNumber.toString();
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 4) + "\n");
console.log(`✅ Updated app.json: version=${newVersion}, buildNumber=${newBuildNumber}`);

// Update Info.plist
const versionRegex = /(<key>CFBundleShortVersionString<\/key>\s*<string>)([\d.]+)(<\/string>)/;
const buildRegex = /(<key>CFBundleVersion<\/key>\s*<string>)(\d+)(<\/string>)/;

if (!versionRegex.test(infoPlist) || !buildRegex.test(infoPlist)) {
    console.error("Could not find CFBundleShortVersionString or CFBundleVersion in Info.plist");
    process.exit(1);
}

infoPlist = infoPlist.replace(versionRegex, `$1${newVersion}$3`);
infoPlist = infoPlist.replace(buildRegex, `$1${newBuildNumber}$3`);
fs.writeFileSync(infoPlistPath, infoPlist);
console.log(`✅ Updated Info.plist: CFBundleShortVersionString=${newVersion}, CFBundleVersion=${newBuildNumber}`);

// Update project.pbxproj
const marketingVersionRegex = /(MARKETING_VERSION = )([\d.]+)(;)/g;
const currentProjectVersionRegex = /(CURRENT_PROJECT_VERSION = )(\d+)(;)/g;

if (!marketingVersionRegex.test(projectPbxproj) || !currentProjectVersionRegex.test(projectPbxproj)) {
    console.error("Could not find MARKETING_VERSION or CURRENT_PROJECT_VERSION in project.pbxproj");
    process.exit(1);
}

// Reset regex lastIndex to search from beginning
marketingVersionRegex.lastIndex = 0;
currentProjectVersionRegex.lastIndex = 0;

projectPbxproj = projectPbxproj.replace(marketingVersionRegex, `$1${newVersion}$3`);
projectPbxproj = projectPbxproj.replace(currentProjectVersionRegex, `$1${newBuildNumber}$3`);
fs.writeFileSync(projectPbxprojPath, projectPbxproj);
console.log(
    `✅ Updated project.pbxproj: MARKETING_VERSION=${newVersion}, CURRENT_PROJECT_VERSION=${newBuildNumber}`
);

console.log("\n🎉 iOS version bump complete!");
console.log(`   Version: ${currentVersion} → ${newVersion}`);
console.log(`   Build: ${currentBuildNumber} → ${newBuildNumber}`);

