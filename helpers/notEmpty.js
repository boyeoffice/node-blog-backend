/**
 * Function to check if value is empty
 * @param {string} value
 * @param {string} msg
 * @return {(error|bool)} returns error or true
 */

 const notEmpty = (value, mgs)  => {
  if(value === ''){
    throw new Error(mgs);
  }
  return true;
 }