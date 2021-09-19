/**
 * Attempt to grab a sheet by name and alert user if unsuccessful
 */
function safeGetSheet(sh_name) {
  try {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sh_name);
      if(!sh){
        SpreadsheetApp.getUi().alert(`"${sh_name}" is not a valid sheet name.`);
        return;
      };
    } catch(e) {
      Logger.log(e);
      SpreadsheetApp.getUi().alert(`There was an error selecting the sheet "${sh_name}". Check the logs for more info.`)
      return;
    };
    return sh;
}


/**
 * Clears the passed in range and pastes new data into it
 * @param {GoogleAppsScript.Spreadsheet.Range} rng
 * @param {Array<Array>} vals
 */
function setNewRangeValues(rng, vals){
  const new_rng = rng.getSheet().getRange(rng.getRow(), rng.getColumn(), vals.length, vals[0].length);
  rng.clear();
  new_rng.setValues(vals);
  return new_rng;
}


/**
 * Append new values to a sheet
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sh
 * @param {Array<Array>} vals
 */
function appendValues(sh, vals) {
  // Append the records to the sheet
  const rng = sh.getRange(sh.getLastRow() + 1, 1, vals.length, vals[0].length);
  rng.setValues(vals);
  return rng;
}


/**
 * Method to flatten deep arrays
 * Mutates the original
 */
const flatten = arr => {

  if(!Array.isArray(arr)) return arr;

  let i=0;
  while (i < arr.length) {
    if(Array.isArray(arr[i])){
      arr.splice(i, 1, ...arr[i]);
    } else {
      i++;
    }
  }
  return arr;
};
