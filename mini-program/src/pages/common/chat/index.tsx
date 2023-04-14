import Taro from '@tarojs/taro';
import {Image, ScrollView, Text, Textarea, View} from '@tarojs/components';
import {AtFab, AtIcon} from 'taro-ui';
import classNames from 'classnames';
import {useEffect, useState} from "react";
import './index.less';
import CustomSocket from '../../util/socket'
import {eventCenter, getCurrentInstance} from "@tarojs/runtime";

let socket = new CustomSocket()
const createMessage = (content, type = 'robot', isLoading: false) => {
  return {id: new Date().getTime(), type, content, createTime: new Date(), isLoading}
}
const defaultMessage = createMessage("hi, 我是你的私人小助理，有什么需要帮助的吗？")
const robot = require('../../assert/robot.png')
const person = require('../../assert/person.png')

const Chat = ({showKeyContext = true, isFake = false, tabBarHeight = 0}) => {
  console.log(!Taro.getStorageSync('isOk'))
  const [list, setList] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [addMediaModal, setAddMediaModal] = useState(false);
  const [scrollHeight, setScrollHeight] = useState('100vh');
  const [inputBottom, setInputBottom] = useState(0);
  const [listScrollTop, setListScrollTop] = useState(14999);
  const [moveTime, setMoveTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyContext, setIsKeyContext] = useState(showKeyContext);
  const [rewardedVideoAd, setRewardedAd] = useState(undefined);
  const [interstitialAd, setInterstitialAd] = useState(undefined);
  const [textAreaHeight, setTextAreaHeight] = useState(50);

  const onShow = () => {
    socket = new CustomSocket()
  }


  useEffect(() => {
    // if (!interstitialAd) {
    //   initAd();
    // }
    const onShowEventId = getCurrentInstance().router.onShow
    eventCenter.on(onShowEventId, onShow)

    if (socket && socket.socketOpen) {
      return
    }

    socket.onSocketMessage(msg => {
      if (msg === 'END') {
        setIsLoading(false);
      } else {
        if (msg.startsWith('机器人小黑为你服务')) {
          setIsLoading(false);
        }
        updateMessage(msg);

      }
    });
    return () => {
      setList([])
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setIsKeyContext(!showKeyContext)
    setList([])
    setIsLoading(false)
  }, [showKeyContext]);


  const updateMessage = (msg) => {
    setList(prev => {
      if (prev.length === 0) {
        return prev
      }
      let prevElement = prev[prev.length - 1];
      prevElement.content = prevElement.content + msg;
      return prev.slice(0, prev.length - 1).concat(prevElement)
    });
    setListScrollTop((listScrollTop + (list.length + 1) * 1000 + moveTime));
  }

  const initAd = async () => {

    // 激励广告
    let rewardedVideoAd = Taro.createRewardedVideoAd({
      adUnitId: 'adunit-39e9e17254391172'
    });
    rewardedVideoAd.onError(e => setIsKeyContext(false))
    rewardedVideoAd.onClose(e => {
      if (!e.isEnded) {
        setIsKeyContext(false)
      }
    })
    setRewardedAd(rewardedVideoAd)

    //插屏广告
    let interstitialAd = Taro.createInterstitialAd({
      adUnitId: 'adunit-9381b076be9275d0'
    })
    setInterstitialAd(interstitialAd)
  }

  const handleMessageSubmit = () => {
    if (messageContent && messageContent.trim() !== '') {
      let message = createMessage(messageContent.trim(), 'user');
      setList((prev) => prev.concat(message));

      if (isFake) {
        setList((prev) => prev.concat(createMessage(
          "机器人小黑为你服务，你的问题是" + messageContent + "，我还在学习中，还不能为你服务...."
        )));
        return
      }

      setIsLoading(true)
      setMoveTime(moveTime + 1);
      const sendMessages = isKeyContext ? list.concat(message).map(item => item.content) : [messageContent]


      setMessageContent('');
      setListScrollTop((listScrollTop + (list.length + 1) * 1000 + moveTime));

      socket.sendSocketMessage(sendMessages);
      setList(prevState => prevState.concat(createMessage("")))

      // 如果对话超过30次，关闭一下连续对话，让其重新看个广告
      if (list.length !== 0 && list.length % 30 === 0 && !showKeyContext) {
        setIsKeyContext(false)
      }

      //10次对话弹出一次插屏广告
      if (list.length !== 0 && list.length % 10 === 0) {
        interstitialAd?.show();
      }

    }
  }

  const handleLineChange = (event) => {
    setTextAreaHeight(event.detail.height)
  }

  const handleKeyboardHeightChange = (e) => {
    setInputBottom(e.detail.height === 0 ? e.detail.height : e.detail.height - tabBarHeight);
  }

  const handleFocus = (e) => {
    setAddMediaModal(false);
    setInputBottom(e.detail.height === 0 ? e.detail.height : e.detail.height - tabBarHeight);
  }

  const handleBlur = () => {
    const scrollHeight = '100vh';
    setScrollHeight(scrollHeight);
    setInputBottom(0);
  }

  const handleInput = (e) => {
    setMessageContent(e.detail.value);
  }

  const isRobot = item => {
    return item.type === 'robot';
  }

  const formatMessages = () => {
    return list.length > 0 ? list : [defaultMessage];
  }

  return (
    <View className='im-page'>
      {/*{*/}
      {/*  showKeyContext*/}
      {/*    ? <Ad unit-id="adunit-959bd759ca7cce8e"/>*/}
      {/*    : ''*/}
      {/*}*/}

      <View className='at-row at-row__align--center at-row__justify--center'
            style={{
              position: "fixed",
              bottom: 0,
              zIndex: 100,
              display: showKeyContext ? 'inline' : 'none',
              padding: '10px 0 15px 5px',
              background: '#f1f2f650',
              left: 0
            }}
      >
        <View style={{
          position: "fixed",
          left: 8,
          bottom: 80
        }} onClick={() => {
          if (!isKeyContext) {
            Taro.showModal({
              title: '确认开启连续对话? 观看广告后可以免费开启',
              success: function (res) {
                if (res.confirm) {
                  // 广告
                  setIsKeyContext(!isKeyContext);
                  rewardedVideoAd?.show().catch(() => {
                    // 失败重试
                    rewardedVideoAd.load()
                      .then(() => rewardedVideoAd.show())
                      .catch(err => {
                        console.log('激励视频 广告显示失败')
                      })
                  })
                }
              }
            })
          } else {
            setIsKeyContext(!isKeyContext)
          }
        }}
        >
          <AtFab size='small' className={isKeyContext ? 'conversation' : 'conversation-disable'}>
            <Text className='at-fab__icon at-icon at-icon-message'/>
          </AtFab>
        </View>
      </View>

      <View>
        <ScrollView
          className='im-list'
          enableFlex
          enableBackToTop
          scrollY
          style={{height: scrollHeight}}
          scrollTop={listScrollTop}
        >
          {formatMessages().map((item) => {
            return (
              <View
                key={item.id}
                className={classNames({
                  'im-list--item__other': isRobot(item),
                  'im-list--item': true
                })}
              >
                <View className='list-item--content'>{item.content}</View>
                <Image className='list-item--avatar' src={isRobot(item) ? robot : person} mode='aspectFill' lazyLoad/>
              </View>
            );
          })}
          <View className='placeholder-box'/>
        </ScrollView>
      </View>
      <View className='im-toolbar' style={{bottom: addMediaModal ? '122px' : inputBottom}}>
        <View style={{textAlign: "center", marginLeft: 10}}
              onClick={() => {
                Taro.showModal({
                  title: '确认清除对话内容?',
                  success: function (res) {
                    if (res.confirm) {
                      setList([])
                      setIsLoading(false)
                      Taro.showToast({title: '清除成功！'})
                    }
                  }
                })
              }}
        >
          <AtIcon value='trash' size='25' color='red'
                  customStyle={{
                    fontWeight: 'bold'
                  }}
          ></AtIcon>
        </View>
        <Textarea
          style={{height: `${textAreaHeight}px`}}
          placeholder={isLoading ? '正在回答中...' : '输入你的问题'}
          placeholderStyle={{color: '#cccccc'}}
          showConfirmBar={false}
          maxlength={1000}
          disabled={isLoading}
          value={messageContent}
          adjustPosition={false}
          confirmType='send'
          onKeyboardHeightChange={handleKeyboardHeightChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleInput}
          onConfirm={handleMessageSubmit}
          onLinechange={handleLineChange}
        />
        <View className={`send-button ${messageContent ? '' : 'hidden'}`} onClick={handleMessageSubmit}>
          <AtIcon value='mail' size='25' color='green'
                  customStyle={{
                    fontWeight: 'bold'
                  }}
          ></AtIcon>
        </View>
      </View>

    </View>
  );
}

export default Chat
