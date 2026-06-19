# SlashExperts Blog Management Guide

A comprehensive guide for managing the SlashExperts blog through CloudCannon CMS.

---

## Table of Contents

1. [Accessing the CMS](#accessing-the-cms)
2. [Dashboard Overview](#dashboard-overview)
3. [Creating a New Blog Post](#creating-a-new-blog-post)
4. [Editing an Existing Post](#editing-an-existing-post)
5. [Managing Authors](#managing-authors)
6. [Managing Categories](#managing-categories)
7. [Working with Images](#working-with-images)
8. [Publishing Workflow](#publishing-workflow)
9. [SEO Best Practices](#seo-best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Accessing the CMS

### First-Time Setup

1. Go to [cloudcannon.com](https://cloudcannon.com)
2. Sign in with your GitHub account (recommended) or email
3. Your organization owner will invite you to the SlashExperts project
4. Accept the invitation from your email

### Daily Login

1. Go to [app.cloudcannon.com](https://app.cloudcannon.com)
2. Sign in with your credentials
3. Select **SlashExperts Website** from your projects
4. You'll land on the dashboard

---

## Dashboard Overview

### Main Navigation

| Section | Purpose |
|---------|---------|
| **Dashboard** | Overview of recent activity and quick actions |
| **Collections** | Access blog posts, authors, and categories |
| **Files** | Browse all site files (advanced users) |
| **Settings** | Site configuration (admin only) |
| **Builds** | View build history and status |

### Collections Structure

- **Blog Posts** (`src/blog/`) - All 221+ blog articles
- **Authors** (`src/data/authors.json`) - Author profiles
- **Categories** (`src/data/categories.json`) - Blog categories

---

## Creating a New Blog Post

### Step 1: Navigate to Blog Posts

1. Click **Collections** in the left sidebar
2. Select **Blog Posts**
3. Click the **+ Add** button (top right)

### Step 2: Fill in Post Details

CloudCannon will display a form with these fields:

#### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Title** | Post headline (50-70 chars recommended) | "How to Boost Your Sales Pipeline with Peer Validation" |
| **Description** | Meta description for SEO (150-160 chars) | "Learn how leading B2B companies use peer validation to accelerate deal cycles and increase win rates." |
| **Date** | Publication date | Select from calendar |
| **Author** | Select from dropdown | "James Sterling" |
| **Category** | Primary category | "Strategy" |

#### Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Tags** | Related topics (2-5 recommended) | `enterprise-sales`, `peer-validation`, `case-studies` |
| **Featured Image** | Hero image for the post | Upload or select from media library |
| **Featured Image Alt** | Accessibility text for image | "Sales team reviewing pipeline dashboard" |
| **Read Time** | Estimated minutes to read | `7` (auto-calculated if left blank) |
| **Featured** | Show in featured section | Check to feature on blog homepage |
| **Draft** | Hide from production | Check to save without publishing |

### Step 3: Write Your Content

CloudCannon provides two editing modes:

#### Visual Editor (Recommended)

- WYSIWYG editing like Google Docs/Word
- Format text with toolbar buttons
- Insert images, links, and media visually
- Preview exactly how the post will look

#### Content Editor

- Write in Markdown format
- Better for technical content with code blocks
- Full control over formatting
- Faster for experienced users

#### Content Tips

1. **Structure your post:**
   - Start with an engaging introduction
   - Use H2 and H3 headings to organize sections
   - Include bullet points and numbered lists
   - End with a clear conclusion or CTA

2. **Formatting shortcuts:**
   - `**bold**` for emphasis
   - `*italic*` for quotes or titles
   - `> blockquote` for pull quotes
   - `- item` for bullet lists

3. **Adding code blocks:**
   ```
   ```javascript
   // Your code here
   ```
   ```

### Step 4: Preview Your Post

1. Click the **Preview** button (eye icon) in the top toolbar
2. Review how the post looks on desktop
3. Check mobile preview using device toggle
4. Verify images load correctly

### Step 5: Save and Publish

| Action | Button | Result |
|--------|--------|--------|
| **Save Draft** | Save | Saves without publishing (draft: true) |
| **Publish** | Publish | Makes post live on website |
| **Schedule** | Schedule | Set future publication date |

---

## Editing an Existing Post

### Finding a Post

1. Go to **Collections** > **Blog Posts**
2. Use the **Search** bar to find posts by title
3. Or browse by date (newest first by default)
4. Click on the post to open the editor

### Making Changes

1. Edit any field in the form
2. Modify content in the editor
3. Click **Save** to update

### Unpublishing a Post

1. Open the post
2. Check the **Draft** checkbox
3. Click **Save**
4. The post will be hidden from the website

### Deleting a Post

1. Open the post
2. Click the **More options** menu (three dots)
3. Select **Delete**
4. Confirm deletion

**Warning:** Deletion is permanent. Consider unpublishing instead.

---

## Managing Authors

### Viewing Authors

1. Go to **Collections** > **Authors**
2. View all author profiles

### Adding a New Author

1. Click **+ Add** in the Authors collection
2. Fill in the required fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Slug** | URL-friendly ID (lowercase, hyphens) | `sarah-chen` |
| **Name** | Display name | `Sarah Chen` |
| **Initials** | For avatar placeholder | `SC` |
| **Title** | Job title | `VP of Sales, TechCorp` |
| **Bio** | Short biography (1-2 sentences) | `Sarah leads sales strategy at TechCorp with 15+ years in B2B enterprise sales.` |

3. Click **Save**

### Editing an Author

1. Click on the author name
2. Update any fields
3. Click **Save**

**Note:** Changing an author's slug will break posts that reference them. Update the slug in all affected posts.

---

## Managing Categories

### Available Categories

The blog uses these predefined categories:

| Category | Description |
|----------|-------------|
| **Strategy** | High-level business and sales strategy |
| **Best Practices** | Tactical how-to guides |
| **Industry News** | Market trends and announcements |
| **Case Studies** | Customer success stories |
| **Product Updates** | SlashExperts feature releases |
| **Thought Leadership** | Expert opinions and insights |
| **Events** | Webinars, conferences, meetups |
| **News** | Company and industry news |

### Adding a New Category

1. Go to **Collections** > **Categories**
2. Click **+ Add**
3. Fill in the fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Slug** | URL-friendly ID | `customer-success` |
| **Name** | Display name | `Customer Success` |
| **Description** | Category description | `Resources for customer success teams` |

4. Click **Save**

---

## Working with Images

### Image Guidelines

| Type | Recommended Size | Format |
|------|------------------|--------|
| **Featured Image** | 1200 x 630 px | WebP or JPG |
| **In-Post Images** | Max 1200px wide | WebP, JPG, or PNG |
| **Author Avatars** | 200 x 200 px | JPG or PNG |

### Uploading Images

1. In the post editor, click the **Featured Image** field
2. Click **Upload** to add a new image
3. Or **Browse** to select from existing uploads
4. Add descriptive **Alt Text** for accessibility

### Image Best Practices

1. **Compress images** before uploading (use [squoosh.app](https://squoosh.app))
2. **Use WebP format** for smaller file sizes
3. **Always add alt text** for SEO and accessibility
4. **Use descriptive filenames** (e.g., `sales-pipeline-dashboard.webp` not `IMG_1234.jpg`)

### Image Storage Location

Uploaded images are stored in:
- `src/assets/images/blog/` (recommended)
- CloudCannon's media library

---

## Publishing Workflow

### Draft → Review → Publish

1. **Create Draft**
   - Write post content
   - Check "Draft" checkbox
   - Save

2. **Internal Review**
   - Share preview link with reviewers
   - Make revisions based on feedback
   - Verify all images and links work

3. **Publish**
   - Uncheck "Draft" checkbox
   - Set publication date (today or future)
   - Click **Publish**

4. **Post-Publish Check**
   - Visit the live URL
   - Verify social sharing preview
   - Share on social channels

### Scheduling Posts

1. Keep the post as draft
2. Set the desired **Date**
3. Note: Scheduling requires CloudCannon's scheduling feature or a manual publish

### Bulk Operations

To update multiple posts:
1. Use the checkbox next to each post
2. Select **Bulk actions** from the toolbar
3. Available actions: Delete, Move, Change status

---

## SEO Best Practices

### Title Optimization

- **Length:** 50-70 characters
- **Include:** Primary keyword near the beginning
- **Make it:** Compelling and click-worthy
- **Example:** "5 Proven Ways to Accelerate Your B2B Sales Pipeline"

### Meta Description

- **Length:** 150-160 characters
- **Include:** Primary keyword and call-to-action
- **Make it:** Summarize the post's value
- **Example:** "Discover how top B2B companies use peer validation to close deals 40% faster. Learn actionable strategies you can implement today."

### URL Structure

URLs are auto-generated from the post title:
- `/post/5-proven-ways-accelerate-b2b-sales-pipeline/`

**Tips:**
- Keep titles concise for cleaner URLs
- URLs are permanent once published (avoid changing)

### Internal Linking

Link to other relevant content:
- Related blog posts
- Product pages (`/pages/how-it-works/`)
- Case studies (`/pages/case-studies/`)

**Link Format:**
- Use `/pages/page-name/` for internal pages
- Use `/post/post-slug/` for blog posts
- Use full URLs for external sites

### Image SEO

- Always fill in **Featured Image Alt** text
- Use descriptive, keyword-rich alt text
- Keep alt text under 125 characters

---

## Troubleshooting

### Post Not Appearing on Website

**Possible causes:**
1. **Draft is checked** - Uncheck the Draft checkbox
2. **Date is in future** - Set date to today or earlier
3. **Build failed** - Check the Builds section for errors
4. **Cache issue** - Wait 5 minutes or clear browser cache

### Images Not Loading

**Possible causes:**
1. **File too large** - Compress and re-upload
2. **Wrong format** - Use WebP, JPG, or PNG only
3. **Path issue** - Re-upload through CloudCannon

### Build Errors

1. Go to **Builds** in the left sidebar
2. Click on the failed build
3. Review the error log
4. Common fixes:
   - Check for invalid YAML in frontmatter
   - Verify all required fields are filled
   - Ensure author/category slugs match exactly

### Need Help?

1. **CloudCannon Docs:** [docs.cloudcannon.com](https://docs.cloudcannon.com)
2. **CloudCannon Support:** support@cloudcannon.com
3. **Internal Support:** Contact your development team

---

## Quick Reference

### Post Checklist

Before publishing, verify:

- [ ] Title is compelling and under 70 characters
- [ ] Description is filled (150-160 characters)
- [ ] Author is selected
- [ ] Category is selected
- [ ] Featured image is uploaded with alt text
- [ ] Content is proofread
- [ ] Links are working
- [ ] Draft checkbox is unchecked (if publishing)

### Keyboard Shortcuts (Visual Editor)

| Action | Mac | Windows |
|--------|-----|---------|
| Bold | Cmd + B | Ctrl + B |
| Italic | Cmd + I | Ctrl + I |
| Link | Cmd + K | Ctrl + K |
| Undo | Cmd + Z | Ctrl + Z |
| Redo | Cmd + Shift + Z | Ctrl + Shift + Z |
| Save | Cmd + S | Ctrl + S |

### URL Patterns

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| Blog listing | `/blog/` | `slashexperts.com/blog/` |
| Blog post | `/post/{slug}/` | `slashexperts.com/post/sales-pipeline-tips/` |
| Paginated blog | `/blog/page/{n}/` | `slashexperts.com/blog/page/2/` |

---

## Version History

| Date | Author | Changes |
|------|--------|---------|
| Dec 23, 2025 | Claude Code | Initial guide created (Session 30) |

---

*This guide was created as part of the SlashExperts website modernization project.*
