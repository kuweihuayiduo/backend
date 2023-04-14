import Chat from '../common/chat/index';
import {Component} from "react";
import Taro from "@tarojs/taro";
import data from "../util/data";


class CommonChat extends Component {

  onShareAppMessage = () => {
    return {
      title: data.APP_NAME,
      path: '/pages/prompt-chat/index'
    }
  }
  enableShareTimeline = () => {
    return {
      title: data.APP_NAME,
      path: '/pages/prompt-chat/index'
    }
  }

  render() {
    return <Chat isFake={!Taro.getStorageSync('isOk')}/>;
  }
}

export default CommonChat;
