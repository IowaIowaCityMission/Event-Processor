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
