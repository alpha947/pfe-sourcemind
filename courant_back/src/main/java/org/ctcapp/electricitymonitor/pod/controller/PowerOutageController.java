package org.ctcapp.electricitymonitor.pod.controller;


import org.ctcapp.electricitymonitor.pod.model.PowerOutage;
import org.ctcapp.electricitymonitor.pod.services.PowerOutageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/outages")
public class PowerOutageController {

    private final PowerOutageService service;

    public PowerOutageController(PowerOutageService service) {
        this.service = service;
    }

    @GetMapping
    public List<PowerOutage> getAllOutages() {
        return service.getAllOutages();
    }

    @PostMapping("/detect")
    public PowerOutage detectOutage(@RequestParam String location) {
        return service.detectOutage(location);
    }

    @PostMapping("/restore/{id}")
    public void restoreOutage(@PathVariable Long id) {
        service.restoreOutage(id);
    }
}

