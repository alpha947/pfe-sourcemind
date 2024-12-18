package org.ctcapp.electricitymonitor.pod.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PowerOutageEvent {
    private String id;
    private String startTime;
    private String endTime;
    private long duration;
    private String location;
    private String status;
}