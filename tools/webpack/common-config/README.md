# Using this 'common-config' folder

**Don't try too hard to re-use code.**

If extracting webpack config to this folder makes the config harder to reason, then it's not worth it.

The things that have been extracted so far are either:

1) So similar (or exactly the same) across configs that they're easy to understand.  `getHtmlWebpackPlugin`, `getImageMinimizer`, `ignoreWarnings`, and `getFileLoaderRules` fit in this category.
2) Need to be kept in sync and tended to drift, despite being a bit different.  The `getStylesheetRule` and `getCodeRules` functions fit in this category.  They are arguably easier to reason all in one place so we can understand the differences between
them.

What they all share in common is that they're fairly long and make the configs harder to read.  Extracting them has made the configs about a page of text and all the important high-level stuff that makes them different is still present.

More or less.  Use your judgment.
