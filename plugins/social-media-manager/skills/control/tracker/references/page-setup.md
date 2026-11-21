# Publishing the tracker page

The page is a **read-only** view of the TDM Studio Database in the Claude app. It reads the sheet with each viewer's own Google Sheets connector and never writes.

Full details: `${CLAUDE_PLUGIN_ROOT}/library/storage/tracker-page/README.md`.

## Steps (admin only)

1. Run `get_config` and take `spreadsheet_id`. If `tracker_page_url` is already set, the page exists: offer to republish it to the same URL instead of creating a new one.
2. Read `${CLAUDE_PLUGIN_ROOT}/library/storage/tracker-page/index.html`. In a copy, replace `<SPREADSHEET_ID>` (in the `tracker-config` block) with the spreadsheet ID. Change nothing else.
3. Publish the copy as an artifact titled **TDM Social Media Tracker**, with:
   - icon `chart`;
   - capabilities `{"mcp": {"servers": [{"server": "Google Sheets", "tools": ["get_values"]}]}}`. In Claude Code the server can also be named by its tool prefix `claude_ai_Google_Sheets`.
4. Check the publish result: the connector must resolve to **Google Sheets**, the page's `sheets_server`. If it resolves to another name, change `sheets_server` in the copy to that name and publish again.
5. Save the URL to the Config tab (`tracker_page_url`), following concurrency.md.
6. Tell the admin:
   - the page is private until they share it from its Share menu (Claude can't change sharing);
   - each viewer allows Google Sheets once, the first time they open it;
   - it refreshes about every minute and has a Refresh button.

## Where it can't be done

If the Artifact tool isn't available in this session, give the admin these steps to run from a Claude chat. The page works without Claude: they can open the Google Sheet's Dashboard tab directly.
