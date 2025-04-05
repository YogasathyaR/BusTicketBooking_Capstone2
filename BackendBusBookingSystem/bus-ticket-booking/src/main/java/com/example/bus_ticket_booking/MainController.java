package com.example.bus_ticket_booking;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MainController {

    @GetMapping("/message")
    public Map<String, String> getMessage() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Spring Boot Backend!");
        return response;
    }
}
