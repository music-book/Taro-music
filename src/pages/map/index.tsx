import Taro, { Component } from '@tarojs/taro';
import { Map, View, Input } from '@tarojs/components'
import './index.less'

export default class UsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      longitude: 0,
      latitude: 0,
    }
  }
  componentDidMount() {
    // @ts-ignore
    // this.timerID = setInterval(() => { this.timeTick() }, 1000)
    // this.getOwnLocation()
  }
  componentWillUnmount() {
    //@ts-ignore
    clearInterval(this.timerID)

  }
  getOwnLocation() {
    Taro.getLocation().then((res) => {

      this.getDistrict(res.latitude, res.longitude)
      // console.log("纬度："+res.latitude,"经度"+ res.longitude)
      this.setState({ latitude: res.latitude, longitude: res.longitude })
    })
  }
  // 获取街区信息
  getDistrict(latitude, longitude) {
    let keys = '26HBZ-XZD6F-UCCJG-JIW43-AZVST-O6BV3'
    Taro.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function () {
        // console.log(res)
      }

    })
  }
  searchHandle(evt) {
    // console.log(evt.detail.value)
    let value = evt.detail.value;
    Taro.request({
      url: 'https://apis.map.qq.com',
      data: {
        keyword: value
      }
    }).then(() => {
      // console.log(res)
    })
  }

  timeTick() {
    this.setState({
      date: new Date()
    })
  }

  render() {
    // @ts-ignore
    const { latitude, longitude, date } = this.state

    return (
      <View className='images-page' >
        {/* <AtDivider content='分割线' /> */}
        {/* <Text>几点啦？</Text>
      <Text>{date.toLocaleTimeString()}</Text> */}
        <Input type='text' placeholder='地点'  onInput={this.searchHandle} ></Input>
        <Map scale={18} show-location className='map-content' longitude={longitude} latitude={latitude}></Map>
      </View>
    )
  }

}
