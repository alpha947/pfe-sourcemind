package gn.dgd.surveillance.server.controller;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

//controller qui utilise mes reactions automatique websocket
@RestController
@RequestMapping("/power")
public class BatteriesWebSoketController {

    private final SimpMessagingTemplate template;
    public BatteriesWebSoketController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @GetMapping("/statusreact")
    public String getPowerStatus() {
        String status = isPowerOutage() ? "Il n'y a pas de courant" : "il ya le courant.";
        //envoie de la mise a jour aux clietns websoket de maniere automatique
        template.convertAndSend("/topic/powerStatus", status);
        return status;
    } 

    public boolean isPowerOutage() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("powershell", "Get-CimInstance -ClassName Win32_Battery");
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                // verificaiton du brachement de l'ordinateur
                if (line.contains("BatteryStatus") && line.contains("2")) {
                    // si BatteryStatus== 2; l'ordinateur est branché 
                    return false; // Pas de coupure d'électricite
                }
            }
            return true; // Coupure d'électricité détectée (si la boucle ne trouve pas de statut de batterie branchée)
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
