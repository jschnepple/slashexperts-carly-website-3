export default function(eleventyConfig) {
  // Copy static assets to output
  // Copy public folder contents to root of _site (for _redirects, robots.txt, etc.)
  eleventyConfig.addPassthroughCopy({"public": "/"});
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({"src/assets/css": "assets/css"});
  eleventyConfig.addPassthroughCopy({"src/assets/js": "assets/js"});
  eleventyConfig.addPassthroughCopy({"src/assets/pdfs": "assets/pdfs"});
  eleventyConfig.addPassthroughCopy({"src/assets/animations": "assets/animations"});
  eleventyConfig.addPassthroughCopy({"Carly_Spec_v1.6.html": "rd/carly/index.html"});
  eleventyConfig.addPassthroughCopy({"carly-first-look-encrypted.html": "rd/carly-first-look/index.html"});

  // Copy favicon files to root
  eleventyConfig.addPassthroughCopy({"src/favicon": "/"});

  // Watch for changes in CSS and JS
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  // HTTPS for local development (widget requires HTTPS origin)
  // domDiff: false disables HTML delta patching, forcing full page reload
  // Required for pages with external widgets that need to re-initialize
  eleventyConfig.setServerOptions({
    domDiff: false,
    https: {
      key: './certs/localhost-key.pem',
      cert: './certs/localhost.pem'
    }
  });

  // =============================================
  // COLLECTIONS
  // =============================================

  // Add collection for all pages
  eleventyConfig.addCollection("pages", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/**/*.njk");
  });

  // Blog posts collection - sorted by date descending, excludes drafts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/**/*.md")
      .filter(post => !post.data.draft)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Featured posts collection - posts marked as featured
  eleventyConfig.addCollection("featuredPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/**/*.md")
      .filter(post => post.data.featured && !post.data.draft)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  });

  // All categories used in posts (unique list)
  eleventyConfig.addCollection("blogCategories", function(collectionApi) {
    const categories = new Set();
    collectionApi.getFilteredByGlob("src/blog/**/*.md").forEach(post => {
      if (post.data.category && !post.data.draft) {
        categories.add(post.data.category);
      }
    });
    return Array.from(categories).sort();
  });

  // =============================================
  // FILTERS
  // =============================================

  // Add filter to check if a URL is active
  eleventyConfig.addFilter("isActive", function(url, currentUrl) {
    return url === currentUrl ? "active" : "";
  });

  // Date formatting filter
  eleventyConfig.addFilter("date", function(dateValue, format) {
    const date = new Date(dateValue);

    // Common format patterns
    const formats = {
      'Y-m-d': () => date.toISOString().split('T')[0],
      'Y-m-dTHH:mm:ssZ': () => date.toISOString(),
      'MMMM d, Y': () => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      'MMM d, Y': () => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      'F j, Y': () => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    return formats[format] ? formats[format]() : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  // Word count filter - returns number of words in content
  eleventyConfig.addFilter("wordCount", function(content) {
    if (!content) return 0;
    const text = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return text.split(' ').length;
  });

  // Reading time filter - calculates estimated reading time from content
  eleventyConfig.addFilter("readingTime", function(content) {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const words = text.split(' ').length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  });

  // Excerpt filter - extracts a text excerpt from content
  eleventyConfig.addFilter("excerpt", function(content, length = 160) {
    if (!content) return "";
    const text = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return text.length > length ? text.slice(0, length).trim() + '...' : text;
  });

  // Truncate filter - truncates text to specified length
  eleventyConfig.addFilter("truncate", function(text, length = 160) {
    if (!text) return "";
    return text.length > length ? text.slice(0, length).trim() + '...' : text;
  });

  // Limit filter - limits array to specified count
  eleventyConfig.addFilter("limit", function(arr, limit) {
    if (!Array.isArray(arr)) return arr;
    return arr.slice(0, limit);
  });

  // Title case filter
  eleventyConfig.addFilter("title", function(str) {
    if (!str) return "";
    return str.replace(/\b\w/g, char => char.toUpperCase());
  });

  // =============================================
  // SHORTCODES
  // =============================================

  // Add shortcode for current year (for footer)
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/"
  };
}
