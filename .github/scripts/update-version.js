const fs = require("fs");
const { execSync } = require("child_process");
const semver = require("semver");

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

// Get the version type and pre-release type from the input
const versionType = process.argv[2];
const preReleaseType = process.argv[3] || "";

if (!versionType) {
  console.error("Please provide a version type as an argument (patch, minor, major).");
  process.exit(1);
}

// Determine the new version based on the version type
let newVersion = packageJson.version;
switch (versionType) {
  case "patch":
    newVersion = semver.inc(newVersion, "patch");
    break;
  case "minor":
    newVersion = semver.inc(newVersion, "minor");
    break;
  case "major":
    newVersion = semver.inc(newVersion, "major");
    break;
  default:
    console.error("Invalid version type. Use 'patch', 'minor', or 'major'.");
    process.exit(1);
}

// Add pre-release type if specified
if (preReleaseType) {
  newVersion = `${newVersion}-${preReleaseType}.0`;
}

// Check if the new version is valid
if (!semver.valid(newVersion)) {
  console.error("Invalid version format.");
  process.exit(1);
}

// Check if the tag already exists in the remote repository
try {
  execSync(`git ls-remote --tags origin | grep "refs/tags/v${newVersion}$"`);
  console.error(`Tag v${newVersion} already exists in the remote repository.`);
  process.exit(1);
} catch (error) {
  // Tag does not exist in the remote repository, proceed
}

// Update the version in package.json
packageJson.version = newVersion;
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

// Add changes to Git
execSync("git add package.json");

// Create a commit with the new version
execSync(`git commit -m "chore(release): ${newVersion}"`);

// Create a Git tag
execSync(`git tag v${newVersion}`);

// Push changes and tag to the remote repository
execSync(
  `git push https://${process.env.GH_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git main`,
);

console.log(`Version ${newVersion} updated successfully.`);
