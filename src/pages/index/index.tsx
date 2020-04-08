import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
// import { AtGrid } from "taro-ui"
import './index.less'
import { getMusicRanking, getRankDetail } from '../../api/music'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      musicList: [
        {
          url: "http://music.163.com/song/media/outer/url?id=569214250.mp3",
          pic: "http://p1.music.126.net/vmCcDvD1H04e9gm97xsCqg==/109951163350929740.jpg?param=300x300",
          author: "毛不易",
          name: "借",
        },

        {
          name: "从前慢",
          author: "刘胡轶",
          pic: "http://p1.music.126.net/LWmhB3XX8szN3V9TU-A5UA==/3390893862255408.jpg?param=300x300",
          url: "http://music.163.com/song/media/outer/url?id=36229050.mp3"
        },
        {
          url: "http://music.163.com/song/media/outer/url?id=31877536.mp3",
          pic: "http://p2.music.126.net/93vWfsA7gvpBK20Ify82bw==/2908208256687521.jpg?param=300x300",
          author: "李健",
          name: "当你老了"
        },
        { "url": "http://music.163.com/song/media/outer/url?id=108119.mp3", "pic": "http://p1.music.126.net/IkqZpnGPKCu8RFUyuLSr0Q==/898300999893406.jpg?param=300x300", "author": "老狼", "name": "恋恋风尘" },
        { "url": "http://music.163.com/song/media/outer/url?id=569214251.mp3", "pic": "http://p1.music.126.net/vmCcDvD1H04e9gm97xsCqg==/109951163350929740.jpg?param=300x300", "author": "毛不易", "name": "芬芳一生" },
        {
          name: "我们在蓝色海上漂",
          author: "邢天溯",
          pic: "http://p2.music.126.net/1F37m8r9fjS__JSXHFUufA==/18807146394596089.jpg?param=300x300",
          url: "http://music.163.com/song/media/outer/url?id=445144812.mp3"
        },
      ],
      isAudioPaused: false,
      rangeList: []
    }
  }

  componentDidMount() {
    //@ts-ignore
    this.saveMusicList(this.state.musicList);
    this.getRankList();
    this.getSong(
     {detail:{
       value:'我和我的祖国'
     }}
    );
  }

  onSearchChange(value) {
    // console.log(value)
    this.setState({
      searchText: value
    })
  }
  createMusicList(item, index) {
    return <View key={index} onClick={this.routerLink.bind(this, item)} className='music-item'>
      <Image className='image' onClick={this.routerLink.bind(this, item)} src={item.pic}></Image>
      <Text>{item.name + ' - ' + item.author}</Text>
    </View>
  }
  routerLink(item) {
    // 这里不通过路由获取参数信息，使用本地缓存获取
    Taro.navigateTo({
      url: `/pages/details/index`,
      success: () => {
        Taro.setStorage({
          key: 'detail-info', data: JSON.stringify(item)
        }
        ).then(() => {
          // console.log('set-storage',res)
        })
      }
    })
  }

  getSong(value) {
    console.log(value)
    let searchText = value.detail.value ? value.detail.value : '';
    const url = `https://api.apiopen.top/searchMusic?name=${searchText}`
    Taro.request({
      url: url,
      header: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        let list = res.data.result || [];
        // console.log({ list })
        let arr = [];
        list.forEach((item) => {
          // @ts-ignore
          arr.push({ url: item.url, pic: item.pic, author: item.author, name: item.title, lyric: item.lrc })
        });
        this.setState({ musicList: arr });

        // 保存当前整个播放列表，实现上一曲和下一曲功能
        this.saveMusicList(arr)
      })
  }
  getRankList() {
    getMusicRanking().then((result) => {
      this.setState({ rangeList: result })
    }).catch(() => { })
  }
  getRankDetail(type) {
    getRankDetail(type).then((result) => {
      this.setState({ rankDetailInfo: result })
      this.rankDetailRouterLink(result)
    })
  }
  saveMusicList(list) {
    //给播放列表项添加index，标明顺序
    if (list && list.length > 0) {
      list.forEach((item, index) => {
        item.index = index;
      })
    }
    Taro.setStorage({ key: 'music-list', data: JSON.stringify(list) })
  }
  rankClickHandle(type) {
    // console.log(type)
    this.getRankDetail(type)
  }
  rankDetailRouterLink(result) {

    // 这里不通过路由获取参数信息，使用本地缓存获取
    Taro.navigateTo({
      url: `/pages/rank/index`,
      success: () => {
        Taro.setStorage({
          key: 'rank-info', data: JSON.stringify(result)
        })
      }

    })
  }
  render() {
    const { musicList, rangeList } = this.state as any;
    // console.log('ranglist', rangeList)
    const imageSwiper = musicList.map((item, index) => {
      return <SwiperItem key={index} onClick={this.routerLink.bind(this, item)}>
        <Image src={item.pic} ></Image>
      </SwiperItem>
    })

    const musicBox = musicList.map((item, index) => {
      return <div key={index} className='music-list'>
        {this.createMusicList(item, index)}
      </div>
    })

    const rankBox = rangeList.map((item, index) => {
      return <div key={index} className='rank-list'>
        <Image className='image' src={item.image} onClick={this.rankClickHandle.bind(this, item.type)}></Image>
      </div >
    })
    return (
      <View className='home-page-container' >
        <Swiper
          className='swiper-content'
          indicatorColor='#6495ED'
          indicatorActiveColor='#333'
          interval={2000}
          circular
          indicatorDots
          autoplay>
          {imageSwiper}
        </Swiper>
        <View
          className='music-search'
        >
          <Input className='search-input' type='text' onInput={this.getSong} placeholder='搜索音乐、歌名、歌手' />
        </View>
        {/* TODO: 搜索后改变为 音乐列表 */}
        <View className='guess'> 猜你喜欢</View>
        <View className='music-content'>{musicBox}</View>
        <View className='guess'> 排行榜</View>
        <View className='rank-content'> {rankBox}</View>
      </View>
    )
  }
}
