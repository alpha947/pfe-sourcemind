package gn.dgd.dis.pod.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.stereotype.Service;

@Service
public class DetecteurDeCoupureElectricite {
    public boolean detectionDeCoupureDElectricite() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("powershell", "Get-CimInstance -ClassName Win32_Battery");
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                // Vérifier si l'ordinateur est branché (alimenté)
                if (line.contains("BatteryStatus") && line.contains("2")) {
                    // BatteryStatus 2 signifie que l'ordinateur est branché
                    return false; // Pas de coupure d'électricité
                }
            }

            return true; // Coupure d'électricité détectée (si la boucle ne trouve pas de statut de batterie branchée)
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }


}

