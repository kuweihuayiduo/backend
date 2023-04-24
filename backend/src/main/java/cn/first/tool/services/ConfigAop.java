package cn.first.tool.services;

import cn.first.tool.domain.XinQiuConfig;
import cn.hutool.core.io.FileUtil;
import cn.hutool.json.JSONUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * @author louye
 */
@Component
@Aspect
@AllArgsConstructor
@Slf4j
public class ConfigAop {
    private final XinQiuConfig xinQiuConfig;

    @After(value = "execution(* cn.first.tool.domain.XinQiuConfig.set*(..))")
    public void setConfigAfter() {
        if (FileUtil.isEmpty(new File(xinQiuConfig.getYourConfigFile()))) {
            FileUtil.touch(new File(xinQiuConfig.getYourConfigFile()));
        }
        log.info(xinQiuConfig.getYourConfigFile());
        FileUtil.writeUtf8String(JSONUtil.toJsonStr(xinQiuConfig), xinQiuConfig.getYourConfigFile());
    }
}
