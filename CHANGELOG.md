# Changelog

## v1.0.0 — 2026-04-14

Initial release.

### Features
- Scans job postings for US citizenship, security clearance, visa sponsorship, and export control restrictions
- Highlights flagged phrases inline in red
- Shows a warning banner at the top of the page with a summary of all flags found
- Dismissable banner with close button
- Auto re-scans on dynamic content changes (SPA support for Workday, etc.)
- Popup shows scan status for the current page

### Supported Job Sites
Greenhouse, Workday, AshbyHQ, Lever, SmartRecruiters, Jobvite, iCIMS, UltiPro, Breezy HR, ApplyToJob, Recruitee, Workable, BambooHR, Paylocity, Paycom, Taleo, SuccessFactors, JazzHR, Dover, Rippling, YC Jobs

### Browser Support
- Chrome, Edge, Brave (Manifest V3)
- Firefox 109+ (Manifest V3 with gecko settings)

### Detection Categories
- **Citizenship & Work Authorization:** US citizenship, permanent resident, green card, work authorization, no visa sponsorship
- **Security Clearance:** Secret, Top Secret, TS/SCI, DoD, polygraph, public trust positions
- **Export Controls:** ITAR, EAR, export control, government/federal contracts
