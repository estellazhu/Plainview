var bigString = "The fox jumps over the red fence every other Monday.";
var subString = "mon";
var char_buffer = 2; // number of buffer words before and after the subString


function bufferedStr(bigStr, subStr, char_buffer) {
  // Check if bigStr contains subStr
  if (bigStr.search(subStr) == -1) {
    return subStr;
  }
  // Get the start and end indexes of subStr
  var start = bigStr.indexOf(subStr);
  var end = start + subStr.length - 1;

  function charBufferStart(start) {
    var count = 0; // count occurrences of space before subStr
    var ocr = bigStr.lastIndexOf(" ", start); // check occurences
    while (count < char_buffer + 1 && ocr !== -1) {
      count++;
      var idx = ocr; // save the index of the furthest space needed before subStr if applicable
      ocr = bigStr.lastIndexOf(" ", ocr - 1);
    }
    var newStart;
    if (count < char_buffer + 1) {
      newStart = 0; // when there are fewer than expected buffer words before subStr
    } else {
      newStart = idx + 1; // when there are enough buffer words before subStr
    }
    return newStart;
  }

  function charBufferEnd(end) {
    var count = 0; // count occurrences of space after subStr
    var ocr = bigStr.indexOf(" ", end); // check occurences
    while (count < char_buffer + 1 && ocr !== -1) {
      count++;
      var idx = ocr; // save the index of the furthest space needed after subStr if applicable
      ocr = bigStr.indexOf(" ", ocr + 1);
    }
    var newEnd;
    if (count < char_buffer + 1) {
      newEnd = bigStr.length - 1; // when there are fewer buffer words after subStr
    } else {
      newEnd = idx - 1; // when there are enough buffer words after subStr
    }
    return newEnd;
  }

  var newStart = charBufferStart(start);
  var newEnd = charBufferEnd(end);
  var bufferedStr = bigStr.slice(newStart, newEnd + 1);
  return bufferedStr;
}

console.log(bufferedStr(bigString, subString, char_buffer));
