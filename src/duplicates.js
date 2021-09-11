


function checkDuplicates() {


  var app = SpreadsheetApp.getActiveSpreadsheet();

  //Create an array with all of the needed sheets.

  const sheets = [app.getSheetByName('IC'), app.getSheetByName('CR'), app.getSheetByName('PE'), app.getSheetByName('NA'), app.getSheetByName('DP'), app.getSheetByName('CI'), app.getSheetByName('DM'), app.getSheetByName('SPA')];

  //Create an Array to push all of the collected data into.

  var allNamesRaw = [];

  //Call readData function for every sheet.

    sheets.forEach(readData);

  //Convert allNamesRaw to a one dimensional Array, assigned to the variable allNamesFlat

    allNamesFlat = [].concat.apply([], allNamesRaw);

  //Sort allNamesFlat into a new variable (sortedNames)

    var sortedNames = allNamesFlat.sort();

  //Call findDuplicates function on sorted allNames array. 

    var duplicates = findDuplicates();

  //Call showDuplicates function for every sheet to highlight duplicate names on each.

    showDuplicates();
  

  
  /* Remaining tasks: Right now, this script will fundamentally serve to highlight duplicate names in all of the data, but it does not check the assignment column 
  for discrepancies among these duplicate names. That would be the ideal result of this script, but for now it may suffice to somehow highlight all of the duplicate names in
  the spreadsheet.*/


/* -----------------------------  sub functions ------------------------------------------------------------------------------------------------------- */


  function readData(item){

    //Determine how many rows are in the sheet, then subtract one. (This is to remove the 'name' label at the top of the sheet.)

    var lastRow = item.getLastRow();
    lastRow -= 1;

    //Create an array using the values found in the first column, excluding the first row and any blank rows at the end.

    var columnRange = item.getRange(2, 1, lastRow);
    var rangeArray = columnRange.getValues();

    //Convert rangeArray to a one dimensional array

    rangeArray = [].concat.apply([], rangeArray);
    allNamesRaw.push(rangeArray);
  }





 function findDuplicates(){

    //Create an Array to hold the result (Each name that appears more than once in the data set)

    var duplicates = [];

    /*Loop through every item in the allNames array. since the array is sorted, simply check the next value to see if the two are the same. 
    If a value meets this criteria, push it's value into the duplicates array. */
    
    for (var i=0; i < sortedNames.length - 1; i++) {
      if (sortedNames[i - 1] == sortedNames[i]) {
        duplicates.push(sortedNames[i]);
      }
    }
    return duplicates;
  } 


 function showDuplicates(){

  //Create an Array to hold all of the indexes of the names.

  var indexes = [];

  const duplicatesFilter = new Set(duplicates);
  duplicates = Array.from(duplicatesFilter);
  Logger.log(duplicates);

  //For every page's sheet on the spreadsheet, in order...

   for (let i = 0; i < sheets.length; i++){

     //Create an array containing the names for that same sheet.
     var sheetValues = allNamesRaw[i];

     //Create a variable to allow the while loop to run.
     var x = -1;

      //For every name in the duplicates array, in order...
      for (var n = 0; n < duplicates.length; n++) {
        
        //If a duplicate name can be found in the sheet...
        if (sheetValues.includes(duplicates[n]) == true){

          //Get the index of that item, then add it to the indexes array
           while ((x = sheetValues.indexOf(duplicates[n], x + 1)) != -1) {
            indexes.push(x);
          }
        }

      }
      //Mark each of the names via their indexes.
      /* A 2 dimensional array can be sorted by a value in each sub-array, so at this step in the process all that needs to happen is creating an array 
      using the index (col 1), the sheet(ex: 'IC'), the name (col 2), and the assignment (col 4). This array then needs to be pushed into another array
      to create a 2 dimensional array with all of the data to be written to a table. */
      for (n = 0; n < indexes.length; n++) {
        sheets[i].getRange(indexes[n] + 2, 1, 1, 7).setBackground("yellow");
      }
   
      //Empty the indexes array so the data is clean for the next page.
      indexes.splice(0,indexes.length);
   }

 }

}
