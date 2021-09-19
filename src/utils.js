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
 * Method to archive and remove records from a sheet based on values in a Set
 * For memory reasons, would reccomend chunking the opperation if raw source ever gets larger than around 6000 records
 * 
 * ! Takes sheet objects NOT sheet names !
 * ! Meant to be called from within another method that handles locking the sheet !
 */
function filterSheet(src_sh, filter_set, target_col, options){

  // Grab data chunk from raw sheet
    const src_rng = src_sh.getRange(`A2:E${src_sh.getLastRow()}`);
    const src_vals = src_rng.getValues();
  
    // Filter list and push items for archiving
    let archive_vals = [];
    let filtered_vals = [];
    // const join_col = options?.join_column;
    // const join_data = options?.join_data;
    
    filtered_vals = src_vals.reduce((acc, v) => {
      if(filter_set.has(v[target_col])){
        archive_vals.push(v.slice(0,4));
      } else {
        acc.push(v);
      }
      return acc;
    }, []);

    // If there is nothing to be filtered in the sheet
    if(!archive_vals.length) return;

    // Archive
    const d = options?.event_date || "NOT PROVIDED";
    archiveRecords(archive_vals, d, src_sh.getSheetName());
    
    // Paste remaining values back into raw sheet
    const new_rng = src_sh.getRange(`A2:E${filtered_vals.length + 1}`);
    src_rng.clear();
    new_rng.setValues(filtered_vals);
}


/**
 * Method to handle appending new records to a sheet
 * 
 * Must pass in an array of dimensions NxM
 *    N being the number of records to append to the archive
 *    M being the number of columns in the sheet
 * 
 * ! Takes sheet objects NOT sheet names !
 */
function appendRecords(records, sh) {
  // Add in dimension validation later (if we want manual entry capabilities)

  // Append the records to the sheet
  const nxt_rng = sh.getRange(`${sh.getLastRow() + 1}:${sh.getLastRow() + records.length}`);
  nxt_rng.setValues(records);
}


/**
 * Efficient method to flatten arrays
 * 
 * ! Mutates original array !
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
