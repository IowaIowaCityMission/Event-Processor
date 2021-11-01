function onOpen(e) {

  const menu = SpreadsheetApp.getUi().createMenu("Event Processing")
    // .addItem("Update Blacklist", "startBlacklistUpdater")
    .addItem("Test Serve", "serve")
    // .addItem("Manual Archive", "manualArchive")
  menu.addToUi();
}


// Test function to quickly render HTML and see if it is working correctly
function serve() {
  
  // Edit the template file to check it
  let html = HtmlService.createTemplateFromFile("test.html");
  // The only way to pass data down is to explicitly set env vars
  // It is difficult to pass conplex data structures, as they will be interepeted in String form
  html.sh_name = "e";
  
  let rendered_html = html.evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle("Blacklist Selector");
  
  SpreadsheetApp.getUi().showSidebar(rendered_html);
}


function archiveAllSheets() {
  const spr = SpreadsheetApp.getActiveSpreadsheet();
  const pages = [
    spr.getSheetByName("IC"),
    spr.getSheetByName("CR"),
    spr.getSheetByName("PE"),
    spr.getSheetByName("NA"),
    spr.getSheetByName("DP"),
    spr.getSheetByName("DM"),
    spr.getSheetByName("CI"),
    spr.getSheetByName("SPA"),
  ]
  archiveSheets(pages, new Date("August 29, 2021"));
}


function updateEventSheets() {
  const spr = SpreadsheetApp.getActiveSpreadsheet();
  const pages = [
    spr.getSheetByName("IC"),
    spr.getSheetByName("CR"),
    spr.getSheetByName("PE"),
    spr.getSheetByName("NA"),
    spr.getSheetByName("DP"),
    spr.getSheetByName("DM"),
    spr.getSheetByName("CI"),
    spr.getSheetByName("SPA"),
  ]
  updateBlacklist(pages, ["Member", "Member (Outside Mission)", "PBT", "Missionary"]);
  filterWithBlacklist(pages, {"event_date": new Date("August 29, 2021")})
}
