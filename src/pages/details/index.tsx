import Taro, { Component } from '@tarojs/taro';
import { Text, Progress, View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.less'
import { secondsFormat } from '../../utils/index'
import lyricFormatHandle from '../../utils/lyric'

const backgroundContext = Taro.getBackgroundAudioManager()

export default class DetailBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      detailInfo: null,
      isAudioPaused: false,
      percent: 0,
      total: "",
      totalList: [],
      showLyric: false,
      lyricArray: [],
      lyricPre: '',
      lyric: '',
      lyricNext: '',
      startTime: 0//播放起始时间

    }
  }

  componentDidMount() {
    this.getCurrentInfo()
    this.getTotalList()
  }

  getBackgroundAudioInstance(item, next = false) {
    //添加next类型判断，停止的时候不知道为什么是 object，加上这个判断OK
    if (next && typeof next === 'boolean') {
      console.log('enter next.....')
      const newAudio = Taro.getBackgroundAudioManager()
      if (newAudio.paused === undefined || !newAudio.paused) {
        newAudio.src = item.url;
        newAudio.title = item.name + ' - ' + item.author;
        newAudio.coverImgUrl = item.pic;
        newAudio.singer = item.author;
        newAudio.startTime = 0;
        newAudio.play();
        newAudio.onPlay(() => {
          // console.log('new play')
        })
        return;
      }

      if (!newAudio.paused) {
        // console.log('new 停止')
        this.setState({ startTime: newAudio.currentTime })
        this.setState({ isAudioPaused: false })
        newAudio.pause();
        return;
      }
    }

    // @ts-ignore
    const { startTime } = this.state;
    // console.log(backgroundContext.paused)

    if (backgroundContext.paused === undefined || backgroundContext.paused) {
      console.log('enter normal.....')

      backgroundContext.src = item.url;
      backgroundContext.title = item.name + ' - ' + item.author;
      backgroundContext.coverImgUrl = item.pic;
      backgroundContext.singer = item.author;
      backgroundContext.startTime = startTime;
      backgroundContext.play();

      backgroundContext.onPlay(() => {
        console.log('开始播放')
        //播放开始时候
        //@ts-ignore
        // lyric: this.state.lyricArray[0][1] || ''
        this.setState({ isAudioPaused: true })
      })


      backgroundContext.onTimeUpdate(() => {

        // 这里设置倒计时
        const radius = backgroundContext.currentTime / backgroundContext.duration * 100;
        const total = secondsFormat(backgroundContext.duration - backgroundContext.currentTime)
        this.setState({ percent: radius, total: total })

        //设置歌词
        //@ts-ignore
        const { lyricArray } = this.state;
        lyricArray.forEach((item, index) => {
          let time = item[0];
          let value = item[1]

          if (time < backgroundContext.currentTime) {
            if (index - 1 >= 0) {
              console.log('pre-----', lyricArray[index - 1][1], 'current-----', lyricArray[index][1], 'next-----', lyricArray[index + 1][1])
              this.setState({ lyricPre: lyricArray[index - 1][1] })
            }
            if (index + 1 < lyricArray.length) {
              // console.log('pre-----', lyricArray[index  1][1], 'current-----', lyricArray[index][1])
              this.setState({ lyricNext: lyricArray[index + 1][1] })
            }
            this.setState({ lyric: value })

          }
        })
      })

      backgroundContext.onNext(() => {
        //@ts-ignore
        const { totalList, detailInfo } = this.state;
        this.playNextSong(detailInfo, totalList)
      })
      backgroundContext.onPrev(() => {
        //@ts-ignore
        const { totalList, detailInfo } = this.state;
        this.playPreSong(detailInfo, totalList)
      })


      backgroundContext.onEnded(() => {
        // 播放结束，停止旋转，按钮初始化,自动播放下一首
        //@ts-ignore
        const { totalList, detailInfo } = this.state;
        this.setState({ isAudioPaused: true })
        this.playNextSong(detailInfo, totalList)
      })

      return;
    }
    if (!backgroundContext.paused) {
      console.log('播放暂停')
      this.setState({ startTime: backgroundContext.currentTime })
      backgroundContext.pause();
      this.setState({ isAudioPaused: false })
      return;
    }
  }

  // 详情页
  creatDetailPage() {
    // @ts-ignore
    const info = this.state.detailInfo;
    // console.log(info)
    return <div>
      <Text>{info.name || info.title}</Text>
      <Text>{"演唱: " + info.author}</Text>
    </div>
  }

  // 获取上一页播放列表信息
  getTotalList() {
    Taro.getStorage({ key: 'music-list' }).then(res => {

      const list = JSON.parse(res.data)
      this.setState({ totalList: list })
    })
  }

  // 获取当前歌曲详情
  getCurrentInfo() {
    Taro.getStorage({ key: 'detail-info' }).then((res) => {
      const info = JSON.parse(res.data)
      console.log('current-info', info)
      let lyric = lyricFormatHandle(info.lyric)
      // console.log('lyric', info.lyric)
      // console.log('lyric', lyricFormatHandle(info.lyric))

      // lyricArray: lyric
      this.setState({ detailInfo: info, lyricArray: lyric })
      this.getBackgroundAudioInstance(info)
    })
  }

  // 播放上一曲
  playPreSong(current, list) {
    if (list && list.length > 0) {
      list.forEach((item, index) => {
        if (current.index === item.index) {
          let currentIndex = index - 1;
          //循环播放
          if (currentIndex < 0) {
            currentIndex = list.length - 1;
          }
          let info = list[currentIndex];
          this.getBackgroundAudioInstance(info, true)
          this.setState({ detailInfo: info })
        }
      })
    }
  }
  // 播放下一曲
  playNextSong(current, list) {
    if (list && list.length > 0) {
      list.forEach((item, index) => {
        if (current.index === item.index) {
          let currentIndex = index + 1;
          //循环播放
          if (currentIndex === list.length) {
            currentIndex = 0;
          }
          let info = list[currentIndex];
          this.getBackgroundAudioInstance(info, true)
          this.setState({ detailInfo: info })
        }
      })
    }
  }
  songImageClick() {
    //@ts-ignore
    this.setState({ showLyric: !this.state.showLyric })
  }
  render() {
    // @ts-ignore
    const { percent, total, totalList, detailInfo, isAudioPaused, showLyric, lyric, lyricPre, lyricNext } = this.state;
    return (
      <View className='detail-page' >
        {this.creatDetailPage()}
        <View className='lyric-content'>
          {showLyric ? <View className='lyric' onClick={this.songImageClick.bind(this, detailInfo)}>
            <Text >{lyricPre}</Text>
            <Text className='active-lyric'>{lyric}</Text>
            <Text>{lyricNext}</Text>
          </View> :
            <Image className={isAudioPaused ? 'detail-image-active' : "detail-image"} src={detailInfo.pic} onClick={this.songImageClick.bind(this, detailInfo)}></Image>}
        </View>
        <Progress className='detail-pro' percent={percent} strokeWidth={5}>{total}
        </Progress>
        <View className='operation'>
          {/*下一曲，播放/暂停，上一曲 */}
          <View className='opt' onClick={this.playPreSong.bind(this, detailInfo, totalList)}> <AtIcon value='prev' /></View>
          <View className='opt' onClick={this.getBackgroundAudioInstance.bind(this, detailInfo)}>  {isAudioPaused ? <AtIcon value='pause' /> : <AtIcon value='play' />}</View>
          <View className='opt' onClick={this.playNextSong.bind(this, detailInfo, totalList)}> <AtIcon value='next' /></View>
        </View>
      </View>
    )
  }
}
