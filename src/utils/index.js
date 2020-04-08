
export function doubbleNum (value){
  if(value < 10 ) {
    return "0" + value
  }
  return value;
}

export  function secondsFormat(seconds){
  const value = parseFloat(seconds).toFixed(0)
  const minutes = doubbleNum(parseInt(value / 60));
  const second  = doubbleNum(value % 60);
  return minutes + ":"+ second
}
