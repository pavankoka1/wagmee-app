const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const gradlePath = path.join(__dirname, '../android/app/build.gradle');
// New flavored output path for Play release bundle
const aabPathPlay = path.join(
    __dirname,
    '../android/app/build/outputs/bundle/playRelease/app-play-release.aab'
);
// Legacy path (pre-flavors) kept for cleanup compatibility
const aabPathLegacy = path.join(
    __dirname,
    '../android/app/build/outputs/bundle/release/app-release.aab'
);

// Read build.gradle
let gradle = fs.readFileSync(gradlePath, 'utf8');

// Bump versionCode
const versionCodeRegex = /(versionCode\s+)(\d+)/;
const versionNameRegex = /(versionName\s+")(\d+)\.(\d+)\.(\d+)(")/;

const codeMatch = gradle.match(versionCodeRegex);
const nameMatch = gradle.match(versionNameRegex);

if (!codeMatch || !nameMatch) {
    console.error('Could not find versionCode or versionName in build.gradle');
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
console.log(`Updated versionCode to ${newVersionCode}, versionName to ${newVersionName}`);

// Delete old .aab(s) if exist
if (fs.existsSync(aabPathPlay)) {
    fs.unlinkSync(aabPathPlay);
    console.log('Deleted old app-play-release.aab');
}
if (fs.existsSync(aabPathLegacy)) {
    fs.unlinkSync(aabPathLegacy);
    console.log('Deleted old app-release.aab');
}

// Build new .aab with Play flavor (uses applicationId com.pavankoka1.tradetribe)
console.log('Building new Play release .aab (bundlePlayRelease)...');
try {
    execSync('./gradlew bundlePlayRelease', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '../android'),
        env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log('Build complete!');
    if (fs.existsSync(aabPathPlay)) {
        console.log(`AAB generated at: ${aabPathPlay}`);
    }
} catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
} 