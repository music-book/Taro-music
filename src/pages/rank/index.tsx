import Taro, { Component } from '@tarojs/taro';
import { Text, Progress, View, Image, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.less'
import { secondsFormat } from '../../utils/index'

const innerAudioContext = Taro.createInnerAudioContext()
// const backgroundContext = Taro.getBackgroundAudioManager()
// const innerAudioContext = Taro.getBackgroundAudioManager()
export default class DetailBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      detailInfo: [],
      isAudioPaused: false,
      percent: 0,
      total: "",
      totalList: []
    }
  }

  componentDidMount() {
    this.getCurrentInfo()
  }

  getAudioInstance(item, next = false) {
    // if(next) {
    //   innerAudioContext.pause()
    // }
    // 实例化audio播放器，如果播放器是停止状态，播放，否则，停止播放
    if (innerAudioContext.paused) {
      innerAudioContext.src = item.url;
      // innerAudioContext.title=item.url;
      // innerAudioContext.coverImgUrl=item.url;
      innerAudioContext.play();
      innerAudioContext.autoplay = true

      innerAudioContext.onPlay(() => {
        // console.log('开始播放')
        this.setState({ isAudioPaused: true })
      })
      innerAudioContext.onTimeUpdate(() => {
        // 这里设置倒计时
        const radius = innerAudioContext.currentTime / innerAudioContext.duration * 100;
        const total = secondsFormat(innerAudioContext.duration - innerAudioContext.currentTime)
        this.setState({ percent: radius, total: total })
      })

      innerAudioContext.onEnded(() => {
        // 播放结束，停止旋转，按钮初始化
        this.setState({ isAudioPaused: true })
      })
      return;
    }
    innerAudioContext.pause();
    this.setState({ isAudioPaused: false })
  }

  // 详情页
  creatDetailPage() {
    // @ts-ignore
    const info = this.state.detailInfo;
    return <div>
      <Text>{info.name || info.title}</Text>
      <Text>{"演唱: " + info.author}</Text>
    </div>
  }


  // 获取当前歌曲详情
  getCurrentInfo() {
    Taro.getStorage({ key: 'rank-info' }).then((res) => {
      const info = JSON.parse(res.data)
      this.setState({ detailInfo: info })
      // this.getAudioInstance(info)
    })
  }


  render() {
    // @ts-ignore
    const { percent, total, totalList, detailInfo, isAudioPaused } = this.state;
    const RankList = detailInfo.map((item) => {
      return <div className={'album-item'}>
        <View>
          <Text>{item.album_title}</Text>
          <Text className={'author'}>{item.author}</Text>
          <Image src={item.pic_small}></Image>
        </View>
      </div>
    })
    return (

      <View className='rank-page' >
        {RankList}
      </View>
    )
  }
}
