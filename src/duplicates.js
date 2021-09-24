function checkDuplicates() {


  var app = SpreadsheetApp.getActiveSpreadsheet();

  //Create an array with all of the needed sheets.

  const sheets = [app.getSheetByName('IC'), app.getSheetByName('CR'), app.getSheetByName('PE'), app.getSheetByName('NA'), app.getSheetByName('DP'), app.getSheetByName('CI'), app.getSheetByName('DM'), app.getSheetByName('SPA')];

  //Create an Array to push all of the collected data into.

  var allNamesRaw = [];

  //Call readData function for every sheet.

    sheets.forEach(readData);

  //Convert allNamesRaw to a one dimensional Array, assigned to the variable allNamesFlat

    var allNamesFlat = [].concat.apply([], allNamesRaw);

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

  //Create an Array to hold all of the Data to be displayed.

  var displayData = [];

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
    
      //For every value in the indexes array...
      for (n = 0; n < indexes.length; n++) {

      //Get the values for cells 1-4 of the Duplicate name (due to some loop shenanigans, the index values are off by two. This might be fixable?)
      //Place the values in a new array (collectData) and immediately make that array 1 dimensional.

       var collectData = sheets[i].getRange(indexes[n] + 2, 1, 1, 4).getValues();
       collectData = [].concat.apply([], collectData);

      //Get the name of the sheet the index is on, as well as the index itself, and push both of those values to the collectData array.
       collectData.push(sheets[i].getName());
       collectData.push(indexes[n] + 2);

       //Take the whole collectData array and push it to the displayData array. This creates a 2 dimensional array with all of the information that will
       //need to be displayed.
       displayData.push(collectData);
      }
      //Empty the indexes array so the data is clean for the next page.
      indexes.splice(0,indexes.length);
   }
    //A Quick function to sort a 2 dimensional array alphabetically.
    function alphabetical(a, b) {
      var A = a[0];
      var B = b[0].toLowerCase(); 
     
      A = A.toLowerCase();
      B = B.toLowerCase();
     
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    }

    //Sort the displayData array alphabetically by name, using the above 'alphabetical' function.
    displayData.sort(alphabetical);
    Logger.log(displayData);

 }

}
