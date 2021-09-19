/**
 * Method to archive all records from the event data where the Facebook account is in the blacklist
 * 
 * Currently, only 1 BlacklistSet will be loaded in memory at a time
 * This means that if the fallback filter set is needed, it will expend time swapping out
 * Arrays of sheets reduce unneccessary getBlacklistSet() calls by continuing the loop instead of rerunning the whole method
 * 
 * @param {(GoogleAppsScript.Spreadsheet.Sheet|Array<GoogleAppsScript.Spreadsheet.Sheet>)} src
 * @param {{
 *      blk_sh?: GoogleAppsScript.Spreadsheet.Sheet,
 *      primary_col?: String,
 *      fallback_col?: String,
 *      event_date?: (Date|String)
 * }} options
 */
function filterWithBlacklist(src, options={}) {

    // Parse options
    const blk_sh = options?.blk_sh || SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Blacklist");
    // The columns of the blacklist sheet that contain the data for the primary and fallback filters
    const primary_col = options?.primary_col || "B"; 
    const fallback_col = options?.fallback_col || "A";
    const event_date = options?.event_date || "Not Provided";
    let blk = getBlacklistSet(blk_sh, primary_col);

    // If only a single sheet was passed, place it in an array before continuing
    if(!Array.isArray(src)){
        src = [src];
    }

    // Loop through each sheet, filter it, and archive the removed values
    src.forEach(sh => {
        let {removed_vals, empty_vals} = filterSheetValues(sh, blk, 1);

        if(empty_vals){
            // Swap out the filter_set so we don't fill up memory
            blk = getBlacklistSet(blk_sh, fallback_col);
            empty_vals = empty_vals.reduce((acc, val) => {
                if(blk.has(val[0])){
                    removed_vals.push(val);
                } else {
                    acc.push(val);
                }
                return acc;
            }, []);
            // Write empty_vals back into the sheet
            appendValues(sh, empty_vals);
            // Swap the filter_set back
            blk = getBlacklistSet(blk_sh, primary_col);
        };

        archiveRecords(removed_vals, event_date, sh.getSheetName());
    });

};


/**
 * Build a filter set from a column in the blacklist sheet
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} blk_sh
 * @param {String} col
 */
function getBlacklistSet(blk_sh, col) {
    return new Set(
        flatten(
            blk_sh.getRange(`${col}2:${col}`)
            .getValues()
        )
    );
};


/**
 * Remove rows from a sheet based on values in a Set
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} src_sh
 * @param {Set} filter_set
 * @param {Number} target_col
 * @param {{
 *      src_vals?: Array,
 *      removed_vals?: Array,
 *      src_range?: GoogleAppsScript.Spreadsheet.Range
 * }} options
 * 
 * @returns {{
 *      removed_vals: Array,
 *      empty_vals: Array
 * }}
 */
function filterSheetValues(src_sh, filter_set, target_col, options={}) {

    // Parse options
    const src_range = options?.src_range || src_sh.getRange(`A2:${src_sh.getLastRow()}`); // Assume pressence of a header row
    let src_vals = options?.src_vals || src_range.getValues();
    let removed_vals = options?.removed_vals || [];
    let empty_vals = []; // Rows where the target_col is blank

    // Filter rows out of the src_vals based on if the value in the target_col is also in the filter_set
    src_vals = src_vals.reduce( (acc, val) => {
        if(val[target_col] === ""){
            empty_vals.push(val);
        } else if(filter_set.has(val[target_col])){
            removed_vals.push(val);
        } else {
            acc.push(val);
        }
        return acc;
    }, []);

    // Rewrite the src_range with the unremoved values
    setNewRangeValues(src_range, src_vals);

    // These are all returned for chaining different filtering operations on the same data set
    return {"removed_vals":removed_vals, "empty_vals":empty_vals};
}
