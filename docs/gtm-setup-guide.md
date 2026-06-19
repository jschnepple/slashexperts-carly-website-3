# Google Tag Manager Setup Guide

## Overview

SlashExperts uses Google Tag Manager (GTM) to manage marketing and analytics tags centrally. This guide documents the current configuration and how to make changes.

**Primary Container:** GTM-W5ZHWLL6
**GTM Dashboard:** https://tagmanager.google.com
**Account ID:** 6274258716
**Container ID:** 209178381

## Container Architecture

### Scripts IN GTM (Managed Tags)
| Tag | Type | ID/Key | Purpose |
|-----|------|--------|---------|
| Google Analytics 4 | Google Tag | G-J489TMVRDR | Website analytics |
| Google Ads | Google Tag | AW-16935709056 | Ad conversion tracking |
| Google Ads Demo Conversion | Conversion | 16935709056/A9D2CMaSibQaEIDTyYs_ | Demo form conversions |
| Conversion Linker | Built-in | - | Cross-domain tracking |
| LinkedIn Insight Tag | LinkedIn | 7102220 | B2B audience targeting |
| Meta/Facebook Pixel | Custom HTML | 1053303143563541 | Retargeting |
| Reddit Pixel | Community Template | a2_h5ev1oo4mlap | Reddit ads |
| HubSpot Tracking | Custom HTML | 48943215 | CRM tracking |
| Google Consent Mode | Community Template | - | GDPR compliance |
| PostHog | Custom HTML | phc_6CGAIoA7NfXCuvZzayZNktQ9sG8DVOTM4UruDSmR9eC | Product analytics |
| Warmly | Custom HTML | 68f42f08c4190fa7a79819892a8994d3 | B2B visitor intelligence |
| Spara | Custom HTML | embed-rp9V7KS7z | B2B tracking |

### Scripts OUTSIDE GTM (Direct Embeds)
| Script | File Location | Reason |
|--------|---------------|--------|
| Customer.io | `head.njk` | Email marketing, needs direct JS access |
| Revenue Hero | `head.njk` | Scheduling widget, conditional loading |

### Code Locations
| File | Purpose |
|------|---------|
| `src/_includes/partials/tracking-scripts.njk` | GTM container snippet |
| `src/_includes/partials/head.njk` | Customer.io + Revenue Hero |
| `src/_includes/layouts/base.njk` | GTM noscript fallback |

---

## Tags to Add (Session 37)

### 1. Google Consent Mode Initialization (CRITICAL)

**Why:** GDPR/privacy compliance - sets default consent state before any tracking fires.

**Configuration:**
- **Tag Name:** Cookie Consent Mode Initialization
- **Tag Type:** Consent Mode (Google + Microsoft tags) - Community Template
- **Trigger:** Consent Initialization - All Pages

**Settings:**
| Parameter | Value |
|-----------|-------|
| Command | default |
| Regions | all |
| ad_storage | denied |
| ad_user_data | denied |
| ad_personalization | denied |
| analytics_storage | denied |
| functionality_storage | granted |
| personalization_storage | denied |
| security_storage | granted |
| Wait for update | 0 |
| URL passthrough | false |
| Ads data redaction | false |
| EEA only | false |
| Send to dataLayer | false |

**Consent Status:** Not needed (fires before consent check)

### 2. PostHog Analytics

**Configuration:**
- **Tag Name:** PostHog
- **Tag Type:** Custom HTML
- **Trigger:** All Pages (fires on consent update)
- **Consent:** Requires analytics_storage

**HTML Code:**
```html
<script>
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_6CGAIoA7NfXCuvZzayZNktQ9sG8DVOTM4UruDSmR9eC', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only'
});
</script>
```

### 3. Warmly Pixel

**Configuration:**
- **Tag Name:** Warmly Pixel
- **Tag Type:** Custom HTML
- **Trigger:** All Pages
- **Support document.write:** false

**HTML Code:**
```html
<script id="warmly-script-loader" src="https://opps-widget.getwarmly.com/warmly.js?clientId=68f42f08c4190fa7a79819892a8994d3" defer></script>
```

### 4. Spara Pixel

**Configuration:**
- **Tag Name:** Spara Pixel
- **Tag Type:** Custom HTML
- **Trigger:** All Pages
- **Support document.write:** false

**HTML Code:**
```html
<script type="text/javascript" src="https://app.spara.co/embed-rp9V7KS7z.js" defer></script>
```

---

## Triggers

### Current Triggers in W5
| Trigger | Type | Condition |
|---------|------|-----------|
| All Pages | Page View | Built-in (ID: 2147479553) |
| Demo form click trigger | Click | Form Classes contains "button white w-button" |
| REDDIT Custom Event | Custom Event | Matches regex .+ |

### Triggers to Add
| Trigger | Type | Condition |
|---------|------|-----------|
| Consent Initialization - All Pages | Consent Initialization | Built-in (ID: 2147479572) |

**Note:** The "Demo form click trigger" uses Webflow-specific classes. When the new Eleventy site is deployed, update this trigger to match the new form structure.

---

## Variables

### Current Variables
| Variable | Type | Value |
|----------|------|-------|
| REDDIT-a2_h5ev1oo4mlap-Web-Variable | Constant | AUTOMATIC_GTM |

### Built-in Variables Enabled
- Page URL, Page Hostname, Page Path
- Referrer, Event
- Click Element, Click Classes, Click ID, Click URL, Click Text
- Form Element, Form Classes, Form ID, Form URL, Form Text

---

## Consent Mode Setup

Google Consent Mode is configured with these defaults (before user consent):

| Consent Type | Default State | Purpose |
|--------------|---------------|---------|
| ad_storage | denied | Advertising cookies |
| ad_user_data | denied | User data for ads |
| ad_personalization | denied | Personalized ads |
| analytics_storage | denied | Analytics cookies |
| functionality_storage | granted | Essential functionality |
| personalization_storage | denied | Personalization features |
| security_storage | granted | Security features |

**Tags requiring consent:**
- GA4: analytics_storage
- Google Ads: ad_storage
- LinkedIn, Meta, Reddit: ad_storage
- PostHog: analytics_storage

**Tags NOT requiring consent:**
- Consent Mode Initialization (fires first)
- Conversion Linker (uses URL parameters, not cookies)

---

## Cross-Domain Tracking

The Conversion Linker is configured for these domains:
- slashexperts.com (primary)
- tryslashexperts.com (trial subdomain)
- slashexperts-com.webflow.io (legacy Webflow)

---

## How to Add a New Tag

1. Log in to https://tagmanager.google.com
2. Select workspace for GTM-W5ZHWLL6
3. Click Tags > New
4. Configure the tag:
   - Choose tag type
   - Add triggering (usually "All Pages")
   - Set consent requirements if applicable
5. Preview and debug using GTM Preview mode
6. Publish when tested

---

## How to Test Changes

1. Click "Preview" in GTM
2. Enter your site URL
3. Check that tags fire correctly in the debug panel
4. Verify in browser DevTools:
   - Network tab: Look for tag requests
   - Console: Check for errors
5. Test consent scenarios if applicable

---

## Backup & Export

Container exports are stored in `gtm_exports/`:
- `GTM-W5ZHWLL6_workspace15.json` - Current production
- `GTM-K5TGJMDB_workspace8.json` - Legacy (to be deleted)
- `GTM-W5ZHWLL6-optimized.json` - Optimized version (Session 37)

### To Export Current Container:
1. Go to Admin > Export Container
2. Choose "Current Workspace" or specific version
3. Download JSON file
4. Save to `gtm_exports/` directory with date/version

---

## Legacy Container (GTM-K5TGJMDB)

**Status:** TO BE DELETED

This container was the original setup but has been replaced by GTM-W5ZHWLL6.

**Before deleting:**
1. Verify all tags from K5 are in W5
2. Archive the export (GTM-K5TGJMDB_workspace8.json)
3. Remove from any staging/test environments
4. Delete the container in GTM Admin

---

## Troubleshooting

### Tags Not Firing
1. Check trigger conditions in Preview mode
2. Verify consent mode isn't blocking (check consent status)
3. Ensure GTM snippet is loading (Network tab)
4. Check for JavaScript errors in Console

### Duplicate Tracking
1. Verify only ONE GTM container is installed
2. Check for direct script embeds that duplicate GTM tags
3. Review tag firing options (once per page vs. unlimited)

### Consent Issues
1. Check Consent Mode Initialization fires first
2. Verify consent update events are being sent
3. Test with different consent states

---

## Contact

For GTM access or questions:
- Marketing Team: Pixel/conversion tracking
- Engineering: Technical implementation
- Privacy/Legal: Consent mode configuration

---

## Changelog

| Date | Change | By |
|------|--------|-----|
| Jan 2026 | Added Consent Mode, PostHog, Warmly, Spara | Session 37 |
| Jan 2026 | Created documentation | Session 37 |
| 2025 | Initial W5 container setup | - |
