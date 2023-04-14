package handler;

import cn.first.tool.controllers.request.Message;
import cn.first.tool.domain.XinQiuConfig;
import cn.first.tool.services.ChatGPTService;
import com.alibaba.fastjson.JSONObject;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class ChatGPTWebSocketHandler extends TextWebSocketHandler {
    private final ChatGPTService chatGPTService;
    private final XinQiuConfig config;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String request = message.getPayload();
        Message msg = JSONObject.parseObject(request, Message.class);
        if (Objects.equals(msg.getApiKey(), "mini")) {
            msg.setApiKey(config.getFreeApiKey());
        }

        chatGPTService.sendResponse(msg, response -> {
            try {
                session.sendMessage(new TextMessage(response));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
