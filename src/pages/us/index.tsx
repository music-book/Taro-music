import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { AtAccordion } from 'taro-ui'
import './index.less'
import { getPoertyInfo } from '../../api/poetry'
// import  PoertyView  from '../../components/PoertyView'
export default class UsView extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {
      poertyInfo: null,
      open: false
    }
  }
  componentDidMount() {
    this.getPoertyDetailInfo();
    this.getQQHot('李健')
    this.getSongDetail('000PLHrM2luXiz')
    this.getLyricDetail('000PLHrM2luXiz')
    // this.getCloudInfo();
  }
  componentWillUnmount() { }

  getPoertyDetailInfo() {
    getPoertyInfo().then((data) => {
      this.setState({ poertyInfo: data })
    })
  }
  getCloudInfo() {
    // Taro.cloud.callFunction({
    //   // 要调用的云函数名称
    //   name: 'add',
    //   // 传递给云函数的event参数
    //   data: {
    //     "key1": "1111 value 1",
    //     "key2": "2222 value 2"
    //   }
    // }).then(res => {
    //   console.log(res.result)
    //   // output: res.result === 3
    // }).catch(err => {
    //   console.log(err)
    //   // handle error
    // })
    const db = Taro.cloud.database();
    const userInfo = db.collection('books').where({ "_id": '123456' }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        // console.log(res)
      }
    })
    // console.log(userInfo)
  }
  handleClick(value) {
    this.setState({
      open: value
    })
  }
  // NOTE: 根据type返回不同内容 ： 1 返回内容 2 返回翻译 3 返回标签
  poertyInfoHandle() {
    // console.log(poerty, '======')
    // if (!poerty) return null;
    // // 1. 内容
    // const orign: Object = poerty.origin ? poerty.origin : null;
    // // console.log(orign.content,'orgin')

    // // @ts-ignore
    // const poertyRow = orign.content.map((item, index) => {
    //   return <View key={index}>{item}</View>
    // })
    // 2. 翻译
    // const poertyTranslate = poerty.translate.map((item, index) => {
    //   return <View className='translate-item' key={index}>{item}</View>
    // })
    // console.log(poerty,'======')

    // // 3. 标签
    // let matchTags = poerty.matchTags || [];
    // const tags = matchTags.map((item, index) => {
    //   return <AtTag active={true}
    //     circle={true} key={index}>{item}</AtTag>
    // })
    // switch (type) {
    //   case 1:
    //     return poertyRow || '';
    //   case 2:
    //     return poertyTranslate;
    //   case 3:
    //     return tags;
    //   case 4:
    //     return orign;
    // }
  }

  getQQHot(key) {
    Taro.request({
      url: `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=${key}g_tk=5381&jsonpCallback=SmartboxKeysCallbackmod_top_search3847&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
      data: {
        is_xml: 0,
        format: 'jsonp',
        key: key,
        g_tk: 5381,
        jsonpCallback: 'SmartboxKeysCallbackmod_top_search3847',
        loginUin: 0,
        hostUin: 0,
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
      },
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }

  getSongDetail(songmidid) {
    Taro.request({
      url: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&loginUin=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&filename=C400${songmidid}.m4a&guid=3913883408&songmid=${songmidid}&callback=callback`,
      data: {
        g_tk: 5381,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp',
        hostUin: 0,
        loginUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 0,
        filename: `C400${songmidid}.m4a`,
        guid: 3913883408,
        songmid: songmidid,
        callback: 'callback',
      },
      success: function (res) {
        var res1 = res.data.replace("callback(", "")
        var res2 = JSON.parse(res1.substring(0, res1.length - 1))
        const playUrl = `http://dl.stream.qqmusic.qq.com/${res2.data.items[0].filename}?vkey=${res2.data.items[0].vkey}&guid=3913883408&uin=0&fromtag=66`
        console.log(playUrl, 'palyurl--------')
        // _this._getBackPlayfileName().then((nowPlay) => {

        // }).catch((err) => {
        //   // _this._createAudio(playUrl)
        // })
      }
    })
    // Taro.request({
    //   url: `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songmid=${mid}&tpl=yqq_song_detail&format=jsonp&callback=getOneSongInfoCallback&g_tk=5381&jsonpCallback=getOneSongInfoCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
    //   data: {
    //     songmid: mid,
    //     tpl: 'yqq_song_detail',
    //     format: 'jsonp',
    //     callback: 'getOneSongInfoCallback',
    //     g_tk: 5381,
    //     jsonpCallback: 'getOneSongInfoCallback',
    //     loginUin: 0,
    //     hostUin: 0,

    //     inCharset: 'utf8',
    //     outCharset: 'utf-8',
    //     notice: 0,
    //     platform: 'yqq',
    //     needNewCode: 0
    //   },
    //   success: function (res) {

    //   },
    //   fail: function (err) {

    //   }
    // })
    //
  }
  getLyricDetail(musicID) {
    Taro.request({
      url:
        `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg?g_tk=5381&uin=0&format=jsonp&jsonpCallback=callback&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&nobase64=1&musicid=${musicID}`,
      data: {
        songmid: musicID,
        format: 'jsonp',
        g_tk: 5381,
        jsonpCallback: 'callback',
        loginUin: 0,
        hostUin: 0,
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        nobase64: 1
      },
      success: function (res) {

      },
      fail: function (err) {

      }
    })
  }


  render() {
    // @ts-ignore
    const { open, poertyInfo } = this.state
    const orign: Object = poertyInfo.origin ? poertyInfo.origin : null;
    //@ts-ignore
    const poertyRow = orign.content.map((item, index) => {
      return <View key={index}>{item}</View>
    })
    // @ts-ignore
    const poertyTranslate = orign.translate.map((item, index) => {
      return <View className='translate-item' key={index}>{item}</View>
    })

    return (
      <View className='poerty-page' >
        <View className='at-article'>
          <View className='at-article__h1'>
            {orign.title}
          </View>
          <View className='at-article__info'>
            ({orign.dynasty})  作者: {orign.author}
          </View>
          <View className='at-article__content'>
            <View className='at-article__section'>
              <View className='at-article__h3'>{poertyRow}</View>
              <View className='at-article__p'>
                <AtAccordion
                  open={open}
                  onClick={this.handleClick.bind(this)}
                  title='译文'
                  icon={{ value: "at-icon at-icon-add-circle", size: '20' }}
                >
                  {poertyTranslate}
                </AtAccordion>
              </View>
            </View>
          </View>
        </View>
        {/* {this.poertyInfoHandle(poertyInfo,3)} */}
        {/* <AtDivider content='分割线' /> */}
      </View>
    )
  }

}
