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
let newVersion;
if (preReleaseType) {
  // Vérifie si la version actuelle est déjà une pré-release avec le même identifiant
  const currentPre = semver.prerelease(packageJson.version);
  if (currentPre && currentPre[0] === preReleaseType) {
    // Incrémente la version pré-release (par exemple, de "0.3.1-alpha.0" à "0.3.1-alpha.1")
    newVersion = semver.inc(packageJson.version, "prerelease", preReleaseType);
  } else {
    // Sinon, réalise un bump patch et ajoute le suffixe pré-release
    newVersion = semver.inc(packageJson.version, "patch");
    newVersion = `${newVersion}-${preReleaseType}.0`;
  }
} else {
  // Pas de pré-release demandée, réalise un bump classique (patch, minor ou major)
  newVersion = semver.inc(packageJson.version, versionType);
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
execSync("git push origin main --tags");

console.log(`Version ${newVersion} updated successfully.`);
