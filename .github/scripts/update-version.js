const fs = require("fs");
const { execSync } = require("child_process");
const semver = require("semver");

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

// Get the new version from the input
const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Please provide a new version as an argument.");
  process.exit(1);
}

// Check if the new version is valid
if (!semver.valid(newVersion)) {
  console.error("Invalid version format.");
  process.exit(1);
}

// Check if the new version is less than or equal to the current version
if (semver.lte(newVersion, packageJson.version)) {
  console.error("New version must be greater than the current version.");
  process.exit(1);
}

// Check if the tag already exists
try {
  execSync(`git rev-parse v${newVersion}^{tag}`);
  console.error(`Tag v${newVersion} already exists.`);
  process.exit(1);
} catch (error) {
  // Tag does not exist, proceed
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
execSync("git push origin main --tags");

console.log(`Version ${newVersion} updated successfully.`);
