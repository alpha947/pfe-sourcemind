package gn.dgd.surveillance.server.configuration;


import jakarta.annotation.PostConstruct;
import javazoom.jl.player.advanced.AdvancedPlayer;
import javazoom.jl.player.advanced.PlaybackEvent;
import javazoom.jl.player.advanced.PlaybackListener;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.concurrent.CompletionStage;

@Component
public class PowerStatusSseClient {

    private final String URL = "http://192.168.1.183:8080/power-status-stream"; // Remplacez par l'IP et le port d'App A

    @PostConstruct
    public void connect() {
        HttpClient client = HttpClient.newHttpClient();
        client.newWebSocketBuilder()
                .buildAsync(URI.create(URL), new WebSocket.Listener() {
                    @Override
                    public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
                        String message = data.toString();
                        System.out.println("Message reçu via SSE: " + message);
                        if ("POWER_OFF".equals(message)) {
                            // Déclencher le bip sonore
                            startAlert();
                        } else if ("POWER_ON".equals(message)) {
                            // Arrêter le bip sonore
                            stopAlert();
                        }
                        webSocket.request(1);
                        return null;
                    }

                    @Override
                    public void onError(WebSocket webSocket, Throwable error) {
                        System.err.println("Erreur SSE: " + error.getMessage());
                    }
                });
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
        if (player != null) {
            player.close();
        }
    }
}
