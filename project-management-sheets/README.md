# Crop Recommendation Master Project Tracker

Created on 2026-06-23.

This folder now contains one combined tracker:

- `Master_Project_Tracker.csv`
- `Master_Project_Tracker_Tabs.xlsx`
- `Current_Project_Management_Report.md`

It merges all earlier tracker sheets into a single Google Sheets tab using the `Section` column. Filter by `Section` to view Projects Master, Daily Updates, Roadmap, Sprint Tracker, Feature Tracker, Frontend, Backend, Database, API, Bugs, Testing, Deployment, Risks, Productivity, and Reports.

Use `Master_Project_Tracker_Tabs.xlsx` when you want one Google Sheet file with separate tabs for each section.

`Current_Project_Management_Report.md` contains the complete project analysis, feature breakdown, roadmap, all 15 requested sheet tables, daily report, weekly report, release report, and continuous memory rule.

Recommended Google Sheets workflow:
1. Open Google Sheets and create a blank spreadsheet.
2. Use File > Import > Upload.
3. Upload `Master_Project_Tracker_Tabs.xlsx` for separate tabs, or `Master_Project_Tracker.csv` for one combined tab.
4. Choose "Replace spreadsheet" or "Insert new sheet".
5. Turn on filters for row 1, then filter by `Section`.

Current project health: Yellow.
Main blockers: backend source is not present in this repo, database schema is not implemented, and external API calls should be moved behind a backend proxy.
