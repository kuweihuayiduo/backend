import {View} from '@tarojs/components'
import {Component} from 'react'
import 'taro-ui/dist/style/index.scss'

import './app.less'

class App extends Component {
  componentDidMount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }


  // this.props.children 就是要渲染的页面
  render() {
    return (
      <View>
        {this.props.children}
      </View>
    )
  }
}

export default App
