import Taro from '@tarojs/taro';

/**
 * 音乐排行榜
 * @export
 * @returns
 */
export async function getMusicRanking() {
  const data = await Taro.request({
    url: 'https://api.apiopen.top/musicRankings',
    header: {
      'content-type': 'application/json'
    }
  });
  let result = data.data.result;
  let list = [];
  result.forEach((item) => {
    let rangObj = {
      value: item.name,
      image: item.pic_s444,
      type:item.type
    }
    //@ts-ignore
    list.push(rangObj)
  })
  return list;
}

/**
 * 获取排行榜详情
 * @export
 * @param {number} type
 * @returns
 */
export async function getRankDetail(type){
  const data = await Taro.request({
    url: `https://api.apiopen.top/musicRankingsDetails?type=${type}`,
    header: {
      'content-type': 'application/json'
    }
  });

  return data.data.result;
}
