package gn.dgd.surveillance.server.controller;


import gn.dgd.surveillance.server.service.PowerStatusDetectorWithSound;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Controller
public class PowerStatusController {

    private final PowerStatusDetectorWithSound detector;
    private SseEmitter emitter;

    public PowerStatusController(PowerStatusDetectorWithSound detector) {
        this.detector = detector;
    }

    @GetMapping("/power-status-stream")
    public SseEmitter streamPowerStatus() {
        emitter = new SseEmitter();
        detector.setEmitter(emitter);
        return emitter;
    }
}
