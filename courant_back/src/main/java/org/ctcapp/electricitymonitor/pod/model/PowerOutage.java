package org.ctcapp.electricitymonitor.pod.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "power_outages")
public class PowerOutage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long duration;

    private String location;

    private String status;
}
