// PostCSS Configuration for CSS Optimization
// Used by: npm run optimize:css

export default {
  plugins: {
    cssnano: {
      preset: ['default', {
        // Remove all comments
        discardComments: {
          removeAll: true
        },
        // Normalize whitespace
        normalizeWhitespace: true,
        // Minify colors (#ffffff → #fff)
        colormin: true,
        // Minify font values
        minifyFontValues: true,
        // Minify gradients
        minifyGradients: true,
        // Minify selectors
        minifySelectors: true,
        // Merge rules where possible
        mergeRules: true,
        // Remove duplicate rules
        discardDuplicates: true,
        // Sort media queries
        cssDeclarationSorter: {
          order: 'smacss'
        }
      }]
    }
  }
};
