/**
 * Maps values to a raw sheet to an array ready for archiving
 */
function archiveRecords(vals, event_date, page_name) {
  const archive_vals = vals.map((v) => {
    return [event_date, page_name].concat(v);
  });

  const arc_sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Archive");
  appendValues(arc_sh, archive_vals);
}
