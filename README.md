# Image Optimization Tool

A Node.js-based tool for automatically optimizing and converting images to AVIF format with smart compression.

## Features

- Converts images to AVIF format for better compression
- Automatically adjusts quality to meet size constraints
- Supports multiple image formats (JPG, JPEG, PNG, GIF, WebP)
- Creates timestamped output directories for each batch
- Processes multiple images in parallel

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

## Usage

1. Create an `input` directory in the project root (it will be created automatically if it doesn't exist)
2. Place your images in the `input` directory
3. Run the script:
```bash
node index.js
```

The optimized images will be saved in the `output` directory, organized in timestamped folders.

## Configuration

The tool uses these default settings:
- Image Quality: 60 (can be adjusted in `index.js`)
- Maximum File Size: 1MB
- Output Format: AVIF

## Supported Input Formats

- JPEG/JPG
- PNG
- GIF
- WebP

## Output

- All images are converted to AVIF format
- Output files are saved in: `output/[timestamp]/[filename].avif`
- Console logs show optimization progress and final file sizes

## Requirements

- Node.js
- Sharp library for image processing

## License

MIT License
