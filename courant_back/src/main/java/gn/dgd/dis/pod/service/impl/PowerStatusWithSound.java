package gn.dgd.dis.pod.service.impl;


import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import javazoom.jl.player.advanced.AdvancedPlayer;
import javazoom.jl.player.advanced.PlaybackEvent;
import javazoom.jl.player.advanced.PlaybackListener;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
public class PowerStatusWithSound {

    private boolean powerIsOn = true;

    @Scheduled(fixedRate = 2000)
    public void checkPowerStatus() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("powershell", "Get-CimInstance -ClassName Win32_Battery");
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            boolean currentPowerStatus = false;

            while ((line = reader.readLine()) != null) {
                // Vérifier si l'ordinateur est branché (alimenté)
                if (line.contains("BatteryStatus") && line.contains("2")) {
                    // BatteryStatus 2 signifie que l'ordinateur est branché
                    currentPowerStatus = true;
                    break;
                }

            }
            if (currentPowerStatus != powerIsOn) {
                // Changement d'état du courant
                if (currentPowerStatus) {
                    stopAlert();  // Arrêter l'alerte sonore en cas de rétablissement
                } else {
                    startAlert();  // Démarrer l'alerte sonore en cas de coupure
                }
                // m-a-j de l'etat du courant
                powerIsOn = currentPowerStatus;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private AdvancedPlayer player;

    private void startAlert() {
        try {
            // Charger le fichier audio
            InputStream inputStream = getClass().getResourceAsStream("/danger.mp3");
            // Charger le lecteur audio
            player = new AdvancedPlayer(inputStream);

            // Ajouter un listener pour détecter la fin de la lecture
            player.setPlayBackListener(new PlaybackListener() {
                @Override
                public void playbackFinished(PlaybackEvent evt) {
                    stopAlert();  // Arrêter l'alerte sonore à la fin de la lecture
                }
            });

            // Démarrer la lecture
            new Thread(() -> {
                try {
                    player.play();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void stopAlert() {
        if (player != null /*&& !player.isComplete()*/) {
            player.close();
        }
    }



}
