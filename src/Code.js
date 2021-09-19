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

function manualArchive() {
  const names = ["IC", "CR", "PE", "NA", "DP", "CI", "DM", "SPA"];
  const app = SpreadsheetApp.getActiveSpreadsheet();
  const fset = new Set(["Invited"]);
  const options = {
    "event_date": new Date(2021, 7, 29)
  }

  names.forEach( n => {
    const src = app.getSheetByName(n);
    if(!src) {
      Logger.log(`${n} is not a valid sheet!`);
      return
    }
    // filterSheet(app.getSheetByName(n), fset, 2, options);
    // filterWithBlacklist(app.getSheetByName(n), options);
  })


  SpreadsheetApp.flush();
}

