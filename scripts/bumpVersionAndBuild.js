const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const gradlePath = path.join(__dirname, "../android/app/build.gradle");
// Standard output path for release bundle
const aabPathRelease = path.join(
    __dirname,
    "../android/app/build/outputs/bundle/release/app-release.aab"
);

// Read build.gradle
let gradle = fs.readFileSync(gradlePath, "utf8");

// Bump versionCode
const versionCodeRegex = /(versionCode\s+)(\d+)/;
const versionNameRegex = /(versionName\s+")(\d+)\.(\d+)\.(\d+)(")/;

const codeMatch = gradle.match(versionCodeRegex);
const nameMatch = gradle.match(versionNameRegex);

if (!codeMatch || !nameMatch) {
    console.error("Could not find versionCode or versionName in build.gradle");
    process.exit(1);
}

const newVersionCode = parseInt(codeMatch[2], 10) + 1;
const major = parseInt(nameMatch[2], 10);
const minor = parseInt(nameMatch[3], 10);
const patch = parseInt(nameMatch[4], 10) + 1;
const newVersionName = `${major}.${minor}.${patch}`;

gradle = gradle.replace(versionCodeRegex, `$1${newVersionCode}`);
gradle = gradle.replace(versionNameRegex, `$1${major}.${minor}.${patch}$5`);

fs.writeFileSync(gradlePath, gradle);
console.log(
    `Updated versionCode to ${newVersionCode}, versionName to ${newVersionName}`
);

// Note: AD_ID permission is now handled by manifest merger rules in AndroidManifest.xml
// The tools:node="remove" attribute ensures it's removed during manifest merging

// Delete old .aab if exists
if (fs.existsSync(aabPathRelease)) {
    fs.unlinkSync(aabPathRelease);
    console.log("Deleted old app-release.aab");
}

// Build new .aab for release
console.log("Building new release .aab (bundleRelease)...");
console.log("Using release keystore for signing...");
try {
    execSync("./gradlew bundleRelease", {
        stdio: "inherit",
        cwd: path.join(__dirname, "../android"),
        env: { ...process.env, NODE_ENV: "production" },
    });
    console.log("Build complete!");
    if (fs.existsSync(aabPathRelease)) {
        console.log(`AAB generated at: ${aabPathRelease}`);
        console.log(
            "✅ Release AAB signed with release keystore (ready for Google Play Store)"
        );
    }
} catch (e) {
    console.error("Build failed:", e);
    process.exit(1);
}
