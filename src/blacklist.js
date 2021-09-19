/**
 * Start the process of selecting rows from a set of raw data and moving them to the blacklist
 */
 function startBlacklistUpdater() {
    const ui = SpreadsheetApp.getUi();
  
    // Pick the Sheet to pull data from
    let sh;
    const res = ui.prompt("Select Sheet", "Type the name of the sheet you would like to pull data from", ui.ButtonSet.OK_CANCEL);
    if(res.getSelectedButton() == ui.Button.OK) {
      sh = safeGetSheet(res.getResponseText());
      if(!sh) return;
    } else {
      return;
    };
  
    // Make sure there is data beneath the headers before continuing
    if(sh.getLastRow() <= 1) {
      ui.alert("Selected Sheet has no data.");
      return;
    }
  
  
    // Serve HTML form
    let html = HtmlService.createTemplateFromFile("test.html");
    // Tee only way to pass data down is to explicitly set env vars
    // html.data_map = data_map;
    
    let rendered_html = html.evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle("Blacklist Selector");
    
    ui.showSidebar(rendered_html);
  }
  
  
  /**
   * Method to be called by the Blacklist Update sidebar
   * Retrieves the data from the sheet and maps it to the correct array form
   * 
   * ! Does not validate a sheet name !
   */
  function getSidebarItems(sh_name) {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sh_name);
  
    const vals = sh.getRange(2,1, sh.getLastRow()-1, 2).getValues();
    let data_map = [];
    vals.forEach((v, index) => {
      data_map.push([
        v[0],
        index + 2 // Accounts for the way the index was thrown off
      ]);
    });
    Logger.log(data_map);
    return data_map;
  }
  
  
  /**
   * Method to pull rows from a raw data sheet and add the name to the blacklist.
   * 
   * Requires an array of row numbers, the sheet name of the raw source, and the sheet name of the blacklist
   */
  function updateBlacklist(row_nums, src_name, blk_name, classification="Memeber"){
  
    // Verify Sheets Exist
    let src_sh = safeGetSheet(src_name);
    let blk_sh = safeGetSheet(blk_name);
    // Throw an error so that the row_nums can be collected by the withFailureHandler() so we don't have to click the checkboxes again.
    if((!src_sh)||(!blk_sh)) throw Error("There was an error opening one of the sheets.");
  
    // Lock the Spreadsheet
  
    // Grab source data
  
    // Add data to blacklist
  
    // Remove records from source sheet
  
    // Unlock the spreadsheet
  };
  