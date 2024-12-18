package org.ctcapp.electricitymonitor.pod.services;
import com.sun.jna.platform.win32.Kernel32;
import com.sun.jna.platform.win32.WinNT.HANDLE;
import com.sun.jna.platform.win32.Wtsapi32;
import jakarta.annotation.PostConstruct;
import org.ctcapp.electricitymonitor.pod.dto.PowerOutageEvent;
import org.ctcapp.electricitymonitor.pod.model.PowerOutage;
import org.ctcapp.electricitymonitor.pod.repository.PowerOutageRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import com.sun.jna.platform.win32.Kernel32;
import com.sun.jna.platform.win32.WinNT;


@Service
public class PowerOutageService {

    private final PowerOutageRepository repository;
    private final KafkaTemplate<String, PowerOutageEvent> kafkaTemplate;

    private boolean currentOutage = false;

    public PowerOutageService(PowerOutageRepository repository, KafkaTemplate<String, PowerOutageEvent> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostConstruct
    public void startPowerMonitoring() {
        new Thread(this::monitorPowerStatus).start();
    }

    private void monitorPowerStatus() {
        SYSTEM_POWER_STATUS batteryStatus = new SYSTEM_POWER_STATUS();

        while (true) {
            Kernel32.INSTANCE.GetSystemPowerStatus(batteryStatus);

            boolean isOutage = batteryStatus.ACLineStatus == 0; // ACLineStatus = 0 -> Débranché
            handlePowerEvent(isOutage);

            try {
                Thread.sleep(1000); // Vérification toutes les secondes
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private void handlePowerEvent(boolean isOutage) {
        if (isOutage && !currentOutage) {
            currentOutage = true;
            PowerOutage outage = new PowerOutage();
            outage.setStartTime(LocalDateTime.now());
            outage.setStatus("ONGOING");
            outage.setLocation("Local System");
            repository.save(outage);

            PowerOutageEvent event = new PowerOutageEvent(
                    UUID.randomUUID().toString(),
                    outage.getStartTime().toString(),
                    null,
                    0,
                    outage.getLocation(),
                    "ONGOING"
            );
            kafkaTemplate.send("powerOutage", event);
        } else if (!isOutage && currentOutage) {
            currentOutage = false;
            PowerOutage outage = repository.findAll().stream()
                    .filter(o -> "ONGOING".equals(o.getStatus()))
                    .findFirst()
                    .orElse(null);

            if (outage != null) {
                outage.setEndTime(LocalDateTime.now());
                outage.setDuration(java.time.Duration.between(outage.getStartTime(), outage.getEndTime()).toSeconds());
                outage.setStatus("RESOLVED");
                repository.save(outage);

                PowerOutageEvent event = new PowerOutageEvent(
                        UUID.randomUUID().toString(),
                        outage.getStartTime().toString(),
                        outage.getEndTime().toString(),
                        outage.getDuration(),
                        outage.getLocation(),
                        "RESOLVED"
                );
                kafkaTemplate.send("powerRestored", event);
            }
        }
    }
}
