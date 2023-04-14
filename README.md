## 环境说明

前端：
- Node 16+
- Vue

后端：
- SpringBoot
- java 11

## 本地开发

前端启动

```aidl
cd web
npm i
npm run dev
```

后端启动
```aidl
cd backend 
./gradlew bootrun

# 如果是用 idea 可以直接启动了..
```

## 如何打包构建

前端：
```aidl
cd web
npm run build
docker build -t aceysx/xinqiu-web:v1 .  //把 aceysx 换成自己的 docker hub username
```

后端
```aidl
cd backend
./gradlew clean build
docker build -t aceysx/xinqiu-be:v1 .  //把 aceysx 换成自己的 docker hub username
```

### 本地容器运行
1. 执行完本地打包构建步骤后
2. 在项目根目录下执行
```aidl
docker-compose up -d  // 需要修改 docker-compose.yml 文件中镜像的信息
```

### 发布镜像
```aidl
docker push aceysx/xinqiu-web:v1 //把 aceysx 换成自己的 docker hub username
docker push aceysx/xinqiu-be:v1 //把 aceysx 换成自己的 docker hub username
```
最后只需要把 docker-compose.yml 文件copy到所在的服务器执行 docker-compose up -d 即可

## 小程序

### 准备
- taro 3.5+
- Node 16+
- 小程序APP_ID
- wechat devtools

### 替换app id
将 project.config.json 文件中的 APP_ID 替换成自己的

### 替换接口
在 socket.ts 文件中替换自己的 url，这是一个 socket 接口，微信要求必须是 https（wss）

### 本地启动
```agsl
npm run dev:weapp
```

### 打包构建
```agsl
NODE_ENV=production taro build --type weapp
```

### 上传发布
#### 上传到小程序管理后台
![](https://images-1257364845.cos.ap-nanjing.myqcloud.com/1681494251287.png)

#### 后台提交审核
![](https://images-1257364845.cos.ap-nanjing.myqcloud.com/1681494314748.png)


