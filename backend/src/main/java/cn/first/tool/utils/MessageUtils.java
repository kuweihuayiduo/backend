package cn.first.tool.utils;

import cn.first.tool.domain.common.YourMessage;
import cn.hutool.core.util.StrUtil;

import java.util.List;

/**
 * @author louye
 */
public class MessageUtils {
    public static String handErrorMsg(String msgResult) {
        List<YourMessage> yourMessages = YourMessage.init();
        if (yourMessages.isEmpty()) {
            return msgResult;
        }
        for (YourMessage yourMessage : yourMessages) {
            if (StrUtil.contains(msgResult, yourMessage.getGptMsg())) {
                return yourMessage.getYourMsg();
            }
        }
        // not find
        return msgResult;
    }
}
