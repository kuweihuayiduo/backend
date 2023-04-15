package cn.first.tool.domain.common;

import cn.first.tool.domain.XinQiuConfig;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.spring.SpringUtil;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 自定义消息
 *
 * @author louye
 */
@Data
@Builder
public class YourMessage implements Serializable {
    private String gptMsg;
    private String yourMsg;


    public static List<YourMessage> init() {
        XinQiuConfig config = SpringUtil.getBean(XinQiuConfig.class);
        if (StrUtil.isBlank(config.getYourMsgFile())) {
            return ListUtil.empty();
        }
        if (FileUtil.isFile(config.getYourMsgFile())) {
            List<String> msg = FileUtil.readLines(config.getYourMsgFile(), "UTF-8");
            return msg.stream().map(e -> {
                String[] m = StrUtil.split(e, "=");
                return YourMessage.builder().gptMsg(m[0]).yourMsg(m[1]).build();
            }).collect(Collectors.toList());
        }
        return ListUtil.empty();
    }
}
