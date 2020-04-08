import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import '@tarojs/async-await'
import './app.less';
import 'taro-ui/dist/style/index.scss'
import { getToken } from './api/poetry'
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/us/index',
      'pages/details/index',
      'pages/rank/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },

    tabBar: {
      list: [{
        "pagePath": "pages/index/index",
        "text": "音乐"
      },
      {
        "pagePath": "pages/us/index",
        "text": "诗歌"
      }]
    },
    // TODO:后台播放
    requiredBackgroundModes: ['audio'],
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口" // 高速公路行驶持续后台定位
      }
    }
  }

  componentDidMount() {
    // 初始化页面调用，保存token
    getToken();
    Taro.cloud.init();
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
