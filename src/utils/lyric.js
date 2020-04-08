export default function lyricFormatHandle(lyric) {
  if (!lyric) return [[0, "歌词丢了，换一首试试吧"]];
  let row = lyric.split("\n");
  let result = [];

  row.forEach(item => {
    let index = item.indexOf("]");
    let time = item.substring(0, index + 1);
    let value = item.substring(index + 1);
    let timeString = time.substring(1, time.length - 2);
    let timeArr = timeString.split(":");
    result.push([
      parseInt(timeArr[0], 10) * 60 + parseFloat(timeArr[1]),
      value
    ]);
  });
  result.sort(function(a, b) {
    return a[0] - b[0];
  });
  return result;
}
