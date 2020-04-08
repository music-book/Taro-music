import Taro,{Component} from '@tarojs/taro';
import { View } from '@tarojs/components';

// type PoertyProps = {
//   poerty:any
// }
// tpye PoertyState = {}

class PoertyView extends Component{


  constructor (props:PoertyProps){
    super(props);
    this.state = {}
  }
  render (){
    // const {poerty} = this.props;
    return (
      <div>
        <View className='at-article'>
            <View className='at-article__h1'>
              {this.props.poerty}
            </View>
            <View className='at-article__content'>
              <View className='at-article__section'>
              </View>
            </View>
        </View>
      </div>
    )
  }
}

export default PoertyView
