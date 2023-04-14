import Taro from '@tarojs/taro'

const url = `wss://HOST/chatgpt-proxy/socket`;

class CustomSocket {
  public socketOpen: boolean = false
  private lockReConnect: boolean = false
  private timer: any = null
  private limit: number = 0

  constructor() {
    this.connectSocket()
  }

  connectSocket() {
    console.log(11111)
    const _this = this
    if (_this?.socketOpen) {
      return
    }
    Taro.connectSocket({
      url,
      success: (response: any) => {
        _this.initSocketEvent()
      },
      fail: (e: any) => {
        console.log('connectSocket fail:', e)
      }
    });
  }

  initSocketEvent() {
    const _this = this
    Taro.onSocketOpen(() => {
      _this.socketOpen = true
    })
    Taro.onSocketError((e: any) => {
      console.log("WebSocket error", e)
    })
    Taro.onSocketClose(() => {
      console.log('WebSocket close！')
      _this.reconnectSocket()
    })
  }

  reconnectSocket() {
    console.log('reconnect')
    const _this = this
    if (_this.lockReConnect) {
      return
    }
    _this.lockReConnect = true
    clearTimeout(_this.timer)
    if (_this.limit < 10) {
      _this.timer = setTimeout(() => {
        _this.connectSocket()
        _this.lockReConnect = false
      }, 5000)
      _this.limit = _this.limit + 1
    }
  }

  public sendSocketMessage(message: string, errorCallback: (any) => void = () => {
  }) {
    const _this = this
    if (!_this.socketOpen) {
      _this.reconnectSocket()
    }

    Taro.sendSocketMessage({
      data: JSON.stringify({
        message
      }),
      success: () => {
        console.log('sendSocketMessage succ')
      },
      fail: (e: any) => {
        console.log('sendSocketMessage fail', e)
        errorCallback && errorCallback(true)
      }
    });
  }

  public onSocketMessage(callback: (string) => void) {
    this.connectSocket();
    Taro.onSocketMessage(({data}: any) => {
      callback(data)
    })
  }

  public closeSocket() {
    if (this.socketOpen) {
      Taro.closeSocket()
    }
  }

}

export default CustomSocket
