/**
 * Maps values to a raw sheet to an array ready for archiving
 * 
 * @param {Array<Array>} vals
 */
function archiveRecords(vals, event_date, page_name, ordered_indexes=[]) {
    
    vals.forEach((value, index, arr) => {

        // Mutate into proper form for archiving
        if(ordered_indexes.length){
            let acc = []
            ordered_indexes.forEach(i => {
                acc.push(value[i]);
            });
            arr[index] = acc;
        };

        // Append event and page data
        arr[index].unshift(event_date, page_name);
    });

    const arc_sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Archive");
    appendValues(arc_sh, vals);
}


/**
 * Archives all data found in the passed sheets
 * 
 * @param {(GoogleAppsScript.Spreadsheet.Sheet|Array<GoogleAppsScript.Spreadsheet.Sheet>)} src
 */
function archiveSheets(src, event_date){

     if(!Array.isArray(src)){
        src = [src];
    };

    src.forEach(sh => {
        const rng = sh.getRange(2,1,sh.getLastRow()-1, sh.getLastColumn());
        archiveRecords(rng.getValues(), event_date, sh.getName(), [0,1,2,3]);
        rng.clear();
    });
}
