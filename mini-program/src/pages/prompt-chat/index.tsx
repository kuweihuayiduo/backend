import Chat from '../common/chat/index';
import {Component} from "react";
import Taro from "@tarojs/taro";
import data from "../util/data";

class PromptChat extends Component {
  componentDidMount() {
    Taro.setStorageSync('isOk', true);
  }

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
    return <Chat/>;
  }
}

export default PromptChat;
