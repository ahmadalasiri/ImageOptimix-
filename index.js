import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const IMAGE_QUALITY = 60;
const INPUT_DIR = "input";
const OUTPUT_DIR = "output";
const MAX_SIZE = 700 * 1024; // 700KB in bytes

// Create input and output directories if they don't exist
async function createDirectories() {
  try {
    await fs.mkdir(INPUT_DIR, { recursive: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Create timestamped directory
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:.]/g, "-");
    const timeStampedDir = path.join(OUTPUT_DIR, timestamp);
    await fs.mkdir(timeStampedDir, { recursive: true });
    return timeStampedDir;
  } catch (error) {
    console.error("Error creating directories:", error);
    throw error;
  }
}

// Process a single image
async function processImage(inputPath, outputDir) {
  const filename = path.basename(inputPath);
  const outputFilename = `${path.parse(filename).name}.avif`;
  const outputPath = path.join(outputDir, outputFilename);

  try {
    let quality = IMAGE_QUALITY;
    let outputSize = Infinity;

    // Keep reducing quality until file size is under 700KB
    while (outputSize > MAX_SIZE && quality > 1) {
      await sharp(inputPath)
        .avif({
          quality: quality,
          //   effort: 4 // Balance between speed and compression
        })
        .toFile(outputPath);

      // Check file size
      const stats = await fs.stat(outputPath);
      outputSize = stats.size;

      if (outputSize > MAX_SIZE) {
        quality = Math.max(quality - 10, 1); // Reduce quality by 10, but not below 1
        console.log(
          `File still too large (${Math.round(
            outputSize / 1024
          )}KB), reducing quality to ${quality}`
        );
      }
    }

    console.log(
      `Successfully optimized: ${filename} -> ${outputPath} (${Math.round(
        outputSize / 1024
      )}KB, quality: ${quality})`
    );
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

// Main function to process all images
async function main() {
  try {
    const timeStampedDir = await createDirectories();

    // Read all files in input directory
    const files = await fs.readdir(INPUT_DIR);

    // Filter for image files
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log("No image files found in input directory");
      return;
    }

    // Process all images
    const promises = imageFiles.map((file) =>
      processImage(path.join(INPUT_DIR, file), timeStampedDir)
    );
    await Promise.all(promises);

    console.log("\nAll images have been processed!");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the program
main();
