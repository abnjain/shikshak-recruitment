package com.shikshak.recruitment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ShikshakRecruitmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShikshakRecruitmentApplication.class, args);
    }
}
