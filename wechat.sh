#!/bin/bash

if [ "$1" = "init" ]
then
  docker rm -f wechat-chatgpt
  docker run -it -d --name wechat-chatgpt \
      -e OPENAI_API_KEY="$2" \
      -e MODEL="gpt-3.5-turbo" \
      -v $(pwd)/data:/app/data/wechat-assistant.memory-card.json \
      holegots/wechat-chatgpt:latest
  docker logs -f wechat-chatgpt
elif [ "$1" = "log" ]
then
  docker logs -f wechat-chatgpt
else
  echo "请输入 sh wechat.sh init API_KEY 启动程序，输入 sh we"
fi

exit 0
