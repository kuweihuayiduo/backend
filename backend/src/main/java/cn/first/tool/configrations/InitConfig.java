package cn.first.tool.configrations;


import cn.first.tool.domain.XinQiuConfig;
import cn.hutool.core.io.FileUtil;
import cn.hutool.json.JSONUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * @author louye
 */
@Slf4j
@Component
@AllArgsConstructor
public class InitConfig implements ApplicationRunner {

    private final XinQiuConfig xinQiuConfig;

    @Override
    public void run(ApplicationArguments args) {
        log.info(xinQiuConfig.getYourConfigFile());
        if (!FileUtil.exist(new File(xinQiuConfig.getYourConfigFile()))) {
            return;
        }
        XinQiuConfig temp = JSONUtil.toBean(FileUtil.readUtf8String(xinQiuConfig.getYourConfigFile()), XinQiuConfig.class);
        xinQiuConfig.setAuth(temp.getAuth());
        xinQiuConfig.setContent(temp.getContent());
        xinQiuConfig.setNotAuthContent(temp.getNotAuthContent());
        xinQiuConfig.setFreeApiKey(temp.getFreeApiKey());
    }
}
