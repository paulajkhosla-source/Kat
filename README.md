# Kat Aesthetics

Responsive, self-contained static website built from the supplied design. All photography is displayed from the supplied reference using CSS crops. Three.js is vendored locally and renders a reflective silver sculpture with orbiting pearls, pointer/keyboard rotation and selectable finishes. Reduced motion, visibility pausing and an animated CSS 3D sculpture fallback are supported. The editorial redesign adds animated typography, a moving brand ribbon, scroll reveals and dimensional treatment cards.

## Brand

The supplied `kat aesthetics. / BEAUTY CLINIC` logo is used directly from `dist/assets/kat-brand.jpg`. CSS removes the photographed background visually without changing the original asset. The black, silver, pearl and textured-grey identity is applied throughout the site, including both 3D renderers and every form/dialog. `dist/brand.css` contains the brand-specific layout refinements.

## Included
- Responsive desktop/mobile navigation, anchor tracking and keyboard controls.
- Treatment dialogs, expandable FAQs and gallery filters/lightboxes.
- Review carousel with clearly labelled sample testimonials.
- Three-step consultation draft with validated inputs and downloadable summary.
- Enquiry drafts and optional mailto handoff.
- Privacy, terms, biography and social profile placeholders.
- Optional, feature-detected WebMCP start_consultation_draft tool.

## Before public launch
Edit `dist/config.js` to add verified clinic address, telephone, email, social URLs and an HTTPS booking provider URL. A booking URL changes all booking buttons to open that provider. An email address changes the enquiry form to compose an email in the visitor's email application; it does not send server-side. In-page placeholders and policies must be updated to match the chosen real services.

Replace unverified sample testimonials, illustrative results imagery, practitioner biography/qualifications, treatment details, pricing and final policies with approved clinic content. No claim is made that the reference's testimonials or qualifications are verified.

The current booking flow is explicitly a demonstration: no live availability, no confirmed bookings, no data submission, no payments. Drafts are created in browser memory and optionally downloaded to the visitor's device. No server database or email service is connected.

## Run locally

From this folder run `python3 -m http.server 8000 --directory dist` and open `http://localhost:8000`. Or upload the contents of `dist/` to a static web host. Opening the HTML directly is sufficient for menus and forms, but the Three.js module requires HTTP.

## Verification

JavaScript syntax, local assets and internal links checked. DOM interaction checks passed for menus, dialogs, gallery filters, reviews, date validation, booking drafts and downloads, enquiry drafts and the optional agent tool. Visual browser QA and live WebMCP browser validation were unavailable for the static preview in this environment.

## Files and hosting

`dist/` is the complete deployable website. No build step or package installation is required. Configure a static host to publish the `dist` directory.

Edit `dist/index.html` for page content, `dist/styles.css` for styling, `dist/app.js` for interactions and `dist/scene.js` for the Three.js effect.

Repository: https://github.com/paulajkhosla-source/Kat
