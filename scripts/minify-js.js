// JavaScript Minification Script
// Minifies all JavaScript files in _site/assets/js using Terser

import { minify } from 'terser';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Terser options for aggressive minification
const terserOptions = {
  compress: {
    dead_code: true,
    drop_console: false, // Keep console.log for debugging
    drop_debugger: true,
    keep_classnames: false,
    keep_fnames: false,
    passes: 2
  },
  mangle: {
    toplevel: true,
    keep_classnames: false,
    keep_fnames: false
  },
  format: {
    comments: false,
    ascii_only: true
  }
};

async function minifyFile(filePath) {
  try {
    const code = readFileSync(filePath, 'utf8');
    const result = await minify(code, terserOptions);

    if (result.error) {
      console.error(`✗ Error minifying ${filePath}:`, result.error);
      return false;
    }

    const originalSize = Buffer.byteLength(code, 'utf8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf8');
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

    writeFileSync(filePath, result.code);
    console.log(`✓ ${filePath}: ${originalSize}B → ${minifiedSize}B (-${reduction}%)`);

    return true;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function minifyAllJS() {
  console.log('🔧 Minifying JavaScript files...\n');

  const pattern = resolve(__dirname, '../_site/assets/js/**/*.js');
  const files = await glob(pattern, { nodir: true });

  if (files.length === 0) {
    console.log('⚠️  No JavaScript files found to minify');
    return;
  }

  console.log(`Found ${files.length} JavaScript files\n`);

  let totalOriginal = 0;
  let totalMinified = 0;
  let successCount = 0;

  for (const file of files) {
    const originalSize = Buffer.byteLength(readFileSync(file, 'utf8'), 'utf8');
    const success = await minifyFile(file);

    if (success) {
      const minifiedSize = Buffer.byteLength(readFileSync(file, 'utf8'), 'utf8');
      totalOriginal += originalSize;
      totalMinified += minifiedSize;
      successCount++;
    }
  }

  if (successCount > 0) {
    const totalReduction = ((totalOriginal - totalMinified) / totalOriginal * 100).toFixed(1);
    console.log(`\n✅ Successfully minified ${successCount}/${files.length} files`);
    console.log(`📊 Total: ${totalOriginal}B → ${totalMinified}B (-${totalReduction}%)`);
  } else {
    console.log('\n⚠️  No files were successfully minified');
  }
}

// Run minification
minifyAllJS().catch(error => {
  console.error('❌ Minification failed:', error);
  process.exit(1);
});
