#!/usr/bin/env node

/**
 * Webflow to Eleventy Blog Migration Script
 *
 * Usage: node scripts/migrate-webflow-blog.js <csv-file> [--download-images]
 *
 * This script converts Webflow CMS export (CSV) to Eleventy markdown files
 * with proper frontmatter for CloudCannon CMS.
 *
 * Prerequisites:
 *   npm install csv-parse turndown
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import TurndownService from 'turndown';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '../src/blog'),
  imagesDir: path.join(__dirname, '../src/assets/images/blog'),
  baseUrl: 'https://slashexperts.com',

  // Map Webflow CSV columns to frontmatter fields
  // Adjusted for actual SlashExperts Webflow export column names
  columnMapping: {
    'Name': 'title',
    'Slug': 'slug',
    'Post Body': 'content',
    'Post Body (Rich Text)': 'content',
    'Body': 'content',
    'Thumbnail Image': 'featuredImage',
    'Thumbnail image': 'featuredImage',  // Webflow uses lowercase 'i'
    'Featured Image': 'featuredImage',
    'Main Image': 'featuredImage',
    'Author': 'author',
    'Category': 'category',
    'Categories': 'category',
    'Tags': 'tags',
    'Post Tags': 'tags',
    'Published On': 'date',
    'Published': 'date',
    'Date Published': 'date',  // Webflow alternate date field
    'Created On': 'date',
    'Meta Title': 'metaTitle',
    'Meta Description': 'description',
    'Summary': 'description',
    'Excerpt': 'description',
    'Post Summary': 'description',  // Webflow uses this
    'Featured': 'featured',
    'Featured?': 'featured',  // Webflow uses question mark
    'Is Featured': 'featured',
    'Time To Read': 'readTime'  // Webflow reading time field
  },

  // Author slug mapping (Webflow name -> our slug)
  // Add your actual Webflow author names here
  authorMapping: {
    'Maya Richardson': 'maya-richardson',
    'James Sterling': 'james-sterling',
    'Amanda Knox': 'amanda-knox',
    'Thomas Chen': 'thomas-chen',
    'Sarah Liu': 'sarah-liu',
    'Rachel Park': 'rachel-park'
  },

  // Default values
  defaults: {
    author: 'maya-richardson',
    category: 'Strategy',
    readTime: 5
  }
};

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---'
});

// Custom rule for images - preserve them properly
turndownService.addRule('images', {
  filter: 'img',
  replacement: function(content, node) {
    const alt = node.getAttribute('alt') || '';
    const src = node.getAttribute('src') || '';
    const title = node.getAttribute('title') || '';
    const titlePart = title ? ` "${title}"` : '';
    return `![${alt}](${src}${titlePart})`;
  }
});

// Custom rule for links
turndownService.addRule('links', {
  filter: 'a',
  replacement: function(content, node) {
    const href = node.getAttribute('href') || '';
    const title = node.getAttribute('title') || '';
    if (!href) return content;
    const titlePart = title ? ` "${title}"` : '';
    return `[${content}](${href}${titlePart})`;
  }
});

/**
 * Calculate reading time from content
 */
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const text = (content || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter(w => w.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Generate slug from title
 */
function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/**
 * Download image from URL
 */
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) {
      resolve(null);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const filePath = path.join(CONFIG.imagesDir, filename);

    if (fs.existsSync(filePath)) {
      console.log(`  Image already exists: ${filename}`);
      resolve(filename);
      return;
    }

    const file = fs.createWriteStream(filePath);
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  Downloaded: ${filename}`);
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

/**
 * Generate filename from URL
 */
function getImageFilename(url, slug) {
  try {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath) || '.jpg';
    return `${slug}${ext}`;
  } catch {
    return `${slug}.jpg`;
  }
}

/**
 * Parse tags from Webflow format
 */
function parseTags(tagsValue) {
  if (!tagsValue) return [];

  // Handle comma-separated, semicolon-separated, or array format
  const tags = String(tagsValue)
    .split(/[,;|]/)
    .map(tag => tag.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(tag => tag.length > 0);

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Format date for frontmatter
 */
function formatDate(dateString) {
  if (!dateString) {
    return new Date().toISOString().split('T')[0];
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Find matching column in row
 */
function findColumn(row, possibleNames) {
  for (const name of possibleNames) {
    if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
      return row[name];
    }
  }
  return null;
}

/**
 * Convert a single post to markdown
 */
async function convertPost(row, downloadImages = false) {
  // Get title
  const title = findColumn(row, ['Name', 'Title', 'Post Title']) || 'Untitled';

  // Get slug
  let slug = findColumn(row, ['Slug', 'URL Slug', 'Post Slug']);
  if (!slug) {
    slug = slugify(title);
  }

  // Get content
  const htmlContent = findColumn(row, ['Post Body', 'Post Body (Rich Text)', 'Body', 'Content', 'Article Body']);

  // Get other fields
  const description = findColumn(row, ['Post Summary', 'Meta Description', 'Summary', 'Excerpt', 'Description']) || '';
  const dateStr = findColumn(row, ['Date Published', 'Published On', 'Published', 'Created On', 'Date']);
  const authorName = findColumn(row, ['Author', 'Author Name', 'Writer']);
  const categoryValue = findColumn(row, ['Category', 'Categories', 'Post Category']);
  const tagsValue = findColumn(row, ['Tags', 'Post Tags']);
  const featuredImageUrl = findColumn(row, ['Thumbnail image', 'Thumbnail Image', 'Featured Image', 'Main Image', 'Image']);
  const featuredValue = findColumn(row, ['Featured?', 'Featured', 'Is Featured']);
  const readTimeValue = findColumn(row, ['Time To Read', 'Read Time', 'Reading Time']);

  // Process values
  const date = formatDate(dateStr);
  const author = CONFIG.authorMapping[authorName] || CONFIG.defaults.author;
  const category = categoryValue || CONFIG.defaults.category;
  const tags = parseTags(tagsValue);
  const featured = featuredValue === 'true' || featuredValue === true || featuredValue === '1';

  // Convert HTML content to Markdown
  let markdownContent = '';
  if (htmlContent) {
    try {
      markdownContent = turndownService.turndown(htmlContent);
    } catch (err) {
      console.error(`  Warning: Error converting HTML to Markdown: ${err.message}`);
      markdownContent = htmlContent; // Keep original as fallback
    }
  }

  // Use read time from CSV if available, otherwise calculate
  const readTime = readTimeValue ? parseInt(readTimeValue, 10) : calculateReadTime(htmlContent || markdownContent);

  // Process featured image
  let featuredImage = '';
  let featuredImageAlt = title;

  if (featuredImageUrl && downloadImages) {
    try {
      const filename = getImageFilename(featuredImageUrl, slug);
      await downloadImage(featuredImageUrl, filename);
      featuredImage = `/assets/images/blog/${filename}`;
    } catch (err) {
      console.error(`  Warning: Error downloading image: ${err.message}`);
      featuredImage = featuredImageUrl; // Keep original URL as fallback
    }
  } else if (featuredImageUrl) {
    featuredImage = featuredImageUrl;
  }

  // Build frontmatter
  const frontmatterLines = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `date: ${date}`,
    `author: ${author}`,
    `category: ${category}`,
    `tags:`
  ];

  if (tags.length > 0) {
    tags.forEach(tag => frontmatterLines.push(`  - ${tag}`));
  } else {
    frontmatterLines.push(`  - ${category.toLowerCase().replace(/\s+/g, '-')}`);
  }

  frontmatterLines.push(
    `featuredImage: ${featuredImage}`,
    `featuredImageAlt: "${featuredImageAlt.replace(/"/g, '\\"')}"`,
    `readTime: ${readTime}`,
    `featured: ${featured}`,
    `draft: false`,
    '---'
  );

  const frontmatter = frontmatterLines.join('\n');

  // Generate filename: YYYY-MM-DD-slug.md
  const filename = `${date}-${slug}.md`;
  const filepath = path.join(CONFIG.outputDir, filename);

  // Combine frontmatter and content
  const fileContent = `${frontmatter}\n\n${markdownContent}`;

  return { filename, filepath, fileContent, slug, title };
}

/**
 * Main migration function
 */
async function migrate(csvFile, downloadImages = false) {
  console.log('='.repeat(60));
  console.log('Webflow to Eleventy Blog Migration');
  console.log('='.repeat(60));
  console.log(`CSV File: ${csvFile}`);
  console.log(`Download Images: ${downloadImages}`);
  console.log('');

  // Ensure output directories exist
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`Created directory: ${CONFIG.outputDir}`);
  }

  if (downloadImages && !fs.existsSync(CONFIG.imagesDir)) {
    fs.mkdirSync(CONFIG.imagesDir, { recursive: true });
    console.log(`Created directory: ${CONFIG.imagesDir}`);
  }

  // Read and parse CSV
  console.log(`\nReading CSV: ${csvFile}`);
  let csvContent;
  try {
    csvContent = fs.readFileSync(csvFile, 'utf-8');
  } catch (err) {
    console.error(`Error reading CSV file: ${err.message}`);
    process.exit(1);
  }

  let records;
  try {
    records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true
    });
  } catch (err) {
    console.error(`Error parsing CSV: ${err.message}`);
    process.exit(1);
  }

  console.log(`Found ${records.length} posts to migrate\n`);

  if (records.length === 0) {
    console.log('No posts found in CSV file.');
    process.exit(0);
  }

  // Show detected columns
  console.log('Detected columns:', Object.keys(records[0]).join(', '));
  console.log('');

  // Process each post
  let successCount = 0;
  let errorCount = 0;
  const results = [];

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const title = row.Name || row.Title || row['Post Title'] || `Post ${i + 1}`;
    console.log(`[${i + 1}/${records.length}] Processing: ${title}`);

    try {
      const result = await convertPost(row, downloadImages);
      fs.writeFileSync(result.filepath, result.fileContent);
      console.log(`  Created: ${result.filename}`);
      results.push({ success: true, ...result });
      successCount++;
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      results.push({ success: false, title, error: err.message });
      errorCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Migration Complete');
  console.log('='.repeat(60));
  console.log(`Successfully migrated: ${successCount} posts`);
  console.log(`Errors: ${errorCount} posts`);
  console.log(`Output directory: ${CONFIG.outputDir}`);

  if (!downloadImages) {
    console.log('\nNote: Images were not downloaded. Run with --download-images flag to download.');
  }

  // Write migration report
  const reportPath = path.join(__dirname, '../migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    date: new Date().toISOString(),
    csvFile,
    totalPosts: records.length,
    successful: successCount,
    failed: errorCount,
    downloadedImages: downloadImages,
    results
  }, null, 2));
  console.log(`\nMigration report saved to: ${reportPath}`);

  return { successCount, errorCount };
}

// CLI
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Webflow to Eleventy Blog Migration Script

Usage:
  node migrate-webflow-blog.js <csv-file> [options]

Arguments:
  <csv-file>          Path to Webflow export CSV file

Options:
  --download-images   Download featured images locally
  --help, -h          Show this help message

Examples:
  node migrate-webflow-blog.js ./webflow-blog-export.csv
  node migrate-webflow-blog.js ./export.csv --download-images

Prerequisites:
  npm install csv-parse turndown

Note:
  Before running, update the authorMapping in this script
  to match your actual Webflow author names.
`);
  process.exit(0);
}

const csvFile = args[0];
const downloadImagesFlag = args.includes('--download-images');

if (!fs.existsSync(csvFile)) {
  console.error(`Error: CSV file not found: ${csvFile}`);
  process.exit(1);
}

migrate(csvFile, downloadImagesFlag)
  .then(({ successCount, errorCount }) => {
    process.exit(errorCount > 0 ? 1 : 0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
