const fs = require("fs-extra");
const { execSync } = require("child_process");
const path = require("path");
const os = require("os");

const SOURCE_ICON = "public/logo-512x512.png";
const ASSETS_DIR = "assets";
const ICONSET_DIR = path.join(ASSETS_DIR, "icon.iconset");
const ICNS_FILE = path.join(ASSETS_DIR, "icon.icns");
const ICO_FILE = path.join(ASSETS_DIR, "icon.ico");
const PNG_FILE = path.join(ASSETS_DIR, "icon.png");

// Icon sizes required for all platforms
const ICON_SIZES = [16, 32, 64, 128, 256, 512, 1024];
const WINDOWS_SIZES = [16, 24, 32, 48, 64, 128, 256];

async function generateMacOSIcons() {
  if (os.platform() !== "darwin") {
    console.warn("Skipping macOS icon generation: not running on macOS.");
    return;
  }

  try {
    await fs.ensureDir(ICONSET_DIR);

    // Generate different icon sizes
    for (const size of ICON_SIZES) {
      const doubleSize = size * 2;

      // Normal icon
      execSync(
        `sips -z ${size} ${size} ${SOURCE_ICON} --out ${ICONSET_DIR}/icon_${size}x${size}.png`,
      );

      // Retina icon (@2x)
      if (doubleSize <= 1024) {
        execSync(
          `sips -z ${doubleSize} ${doubleSize} ${SOURCE_ICON} --out ${ICONSET_DIR}/icon_${size}x${size}@2x.png`,
        );
      }
    }

    // Convert iconset to .icns
    execSync(`iconutil -c icns ${ICONSET_DIR} -o ${ICNS_FILE}`);

    // Clean up temporary directory
    await fs.remove(ICONSET_DIR);
    console.log("✓ macOS icons generated successfully");
  } catch (error) {
    console.error("Error generating macOS icons:", error);
    process.exit(1);
  }
}

async function generateWindowsIcons() {
  try {
    const tempDir = path.join(ASSETS_DIR, "temp_icons");
    await fs.ensureDir(tempDir);

    // Generate PNG files for each required size
    for (const size of WINDOWS_SIZES) {
      const outputFile = path.join(tempDir, `icon-${size}.png`);
      execSync(`sips -z ${size} ${size} ${SOURCE_ICON} --out ${outputFile}`);
    }

    // Checking if ImageMagick is installed
    try {
      execSync("magick -version");
    } catch (error) {
      console.error(
        "ImageMagick n'est pas installé. Veuillez l'installer avec la commande suivante :",
      );
      console.error("brew install imagemagick");
      process.exit(1);
    }

    // Convert PNGs to ICO using ImageMagick
    const pngFiles = WINDOWS_SIZES.map((size) => path.join(tempDir, `icon-${size}.png`));
    execSync(`magick ${pngFiles.join(" ")} ${ICO_FILE}`);

    // Clean up temporary files
    await fs.remove(tempDir);
    console.log("✓ Windows icons generated successfully");
  } catch (error) {
    console.error("Error generating Windows icons:", error);
    process.exit(1);
  }
}

async function generateLinuxIcons() {
  try {
    // For Linux, we'll use the 512x512 PNG
    execSync(`sips -z 512 512 ${SOURCE_ICON} --out ${PNG_FILE}`);
    console.log("✓ Linux icons generated successfully");
  } catch (error) {
    console.error("Error generating Linux icons:", error);
    process.exit(1);
  }
}

async function generateIcons() {
  try {
    // Check if source icon exists
    if (!fs.existsSync(SOURCE_ICON)) {
      console.error(`Source icon not found: ${SOURCE_ICON}`);
      process.exit(1);
    }

    // Create assets directory
    await fs.ensureDir(ASSETS_DIR);

    console.log("Generating icons for all platforms...");

    // Generate icons for all platforms
    await generateMacOSIcons();
    await generateWindowsIcons();
    await generateLinuxIcons();

    console.log("✨ All icons generated successfully!");
  } catch (error) {
    console.error("Error during icon generation:", error);
    process.exit(1);
  }
}

generateIcons();
