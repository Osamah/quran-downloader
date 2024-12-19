# Quran Audio Downloader

A Node.js application to download Quran audio files from QuranicAudio.com. The application consists of two scripts:
1. A scraper to collect available Qari (reciters) IDs
2. A downloader to fetch all surahs from a specific Qari

## Prerequisites

- Node.js (v12.0.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository or download the source code:
```bash
git clone <repository-url>
cd quran-audio-downloader
```

2. Install the required dependencies:
```bash
npm install
```

## Usage

### [Optional] Step 1: Collect Available Qari IDs

First, run the scraper to get a list of available Qari IDs:

```bash
node scraper.js
```

This will create a `qari_ids.json` file containing all available Qari IDs from QuranicAudio.com.

### Step 2: Download Surahs

Once you have the Qari IDs, you can download all surahs from a specific Qari:

```bash
node downloader.js <qari_id>
```

For example:
```bash
node downloader.js noreen_siddiq
```

## Features

### Scraper (`scraper.js`)
- Scrapes QuranicAudio.com to find all available Qari IDs
- Uses built-in `https` module for requests
- Implements polite scraping with delays between requests
- Saves results to `qari_ids.json`

### Downloader (`downloader.js`)
- Downloads all 114 surahs from a specified Qari
- Creates a dedicated folder for each Qari
- Shows a progress bar during downloads
- Validates Qari ID against available options

## Output Structure

Downloads will be organized in the following structure:
```
.
├── qari_ids.json
└── <qari_id>/
    ├── 001.mp3
    ├── 002.mp3
    └── ...
```