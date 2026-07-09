# Skin by Karla

Static website for Skin by Karla, rebuilt from the Canva reference as a GitHub Pages-ready HTML/CSS/JS site.

## Files

- `index.html` - main page
- `styles.css` - responsive styling
- `script.js` - header and newsletter interaction
- `integrations/google-apps-script.js` - Google Apps Script endpoint for newsletter signups
- `assets/images/` - working images and logo used by the site
- `assets/source/` - local-only original Canva image exports, ignored for Git
- `reference-canva*.html` - local-only Canva references, ignored for Git

## Newsletter To Google Sheets

1. Create a Google Sheet for the newsletter signups.
2. Open `Extensions > Apps Script` from that Sheet.
3. Paste the contents of `integrations/google-apps-script.js`.
4. Deploy it as a Web App:
   - Execute as: `Me`
   - Who has access: `Anyone`
5. Copy the Web App URL.
6. Paste it into `index.html` on the newsletter form:
   `data-endpoint="YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"`.

The Apps Script will create/use a `Subscribers` tab with these columns:
`Submitted At` and `Email`.

## GitHub Pages

Publish this folder as a static site. If it becomes its own repository, set GitHub Pages to deploy from the repository root and use `index.html` as the entry page.

GitHub Pages URL: `https://ajratoni.github.io/skin-by-karla/`.
