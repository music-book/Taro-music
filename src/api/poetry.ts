import Taro from '@tarojs/taro';

/**
 * 获取接口token
 * @returns
 */
async function getToken() {
  const results = await
    Taro.request({
      url: 'https://v2.jinrishici.com/token?client=mini-progrram-sdk/1.0',
      success: res => {
        if (res.data.status === "success") {
          Taro.setStorage({
            key: 'token', data: res.data.data
          })
        } else {
          console.error("今日诗词API获取 Token 失败，错误原因：" + res.data.errMessage)
        }
      },
      fail: () => {
        console.error("今日诗词-小程序SDK 获取 Token 失败，可能是网络问题或者您没有添加到域名白名单")
      }
    })
  return results.data.data;
}

/**
 * 获取诗歌列表
 *
 */
async function getPoertyInfo() {
  let token = '';
  await Taro.getStorage({ key: 'token' }).then(res => {
    token = res.data;
  })

  let results = await Taro.request({
    url: 'https://v2.jinrishici.com/one.json?client=mini-progrram-sdk/1.0',
    header: {
      'X-User-Token': token
    },
  });
  return results.data.data;
}

export { getToken, getPoertyInfo };
