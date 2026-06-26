package com.magugi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TesteController {

    @GetMapping("/test")
    public String test() {
        return "MAGUGI API teste";
    }
}