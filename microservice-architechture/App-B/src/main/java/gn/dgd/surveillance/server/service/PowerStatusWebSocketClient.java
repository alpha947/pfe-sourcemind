package gn.dgd.surveillance.server.service;



import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.util.concurrent.ListenableFuture;
import java.lang.reflect.Type;
import java.io.InputStream;
import javazoom.jl.player.advanced.AdvancedPlayer;
import javazoom.jl.player.advanced.PlaybackEvent;
import javazoom.jl.player.advanced.PlaybackListener;

@Component
public class PowerStatusWebSocketClient {

    @Value("${websocket.url}")
    private String URL;

    @PostConstruct
    public void connect() {
        // Créer un client WebSocket
        StandardWebSocketClient client = new StandardWebSocketClient();
        WebSocketStompClient stompClient = new WebSocketStompClient(client);
        stompClient.setMessageConverter(new org.springframework.messaging.converter.MappingJackson2MessageConverter());

        // Connecter au serveur WebSocket de App A
        ListenableFuture<StompSession> future = stompClient.connect(URL, new StompSessionHandlerAdapter() {});

        future.addCallback(new org.springframework.util.concurrent.ListenableFutureCallback<StompSession>() {
            @Override
            public void onSuccess(StompSession session) {
                // S'abonner au topic où App A envoie les messages
                session.subscribe("/topic/power-status", new StompFrameHandler() {
                    @Override
                    public Type getPayloadType(StompHeaders headers) {
                        return String.class;
                    }

                    @Override
                    public void handleFrame(StompHeaders headers, Object payload) {
                        String message = (String) payload;
                        System.out.println("Message reçu via WebSocket: " + message);
                        if ("POWER_OFF".equals(message)) {
                            // Déclencher le bip sonore
                            startAlert();
                        } else if ("POWER_ON".equals(message)) {
                            // Arrêter le bip sonore
                            stopAlert();
                        }
                    }
                });
                System.out.println("Connecté au WebSocket d'App A");
            }

            @Override
            public void onFailure(Throwable ex) {
                System.err.println("Échec de la connexion au WebSocket: " + ex.getMessage());
                ex.printStackTrace();
            }
        });
    }

    private AdvancedPlayer player;

    private void startAlert() {
        try {
            // Charger le fichier audio (assurez-vous que danger.mp3 est dans src/main/resources)
            InputStream inputStream = getClass().getResourceAsStream("/danger.mp3");
            if (inputStream == null) {
                System.err.println("Fichier danger.mp3 non trouvé!");
                return;
            }
            // Initialiser le lecteur audio
            player = new AdvancedPlayer(inputStream);

            // Ajouter un listener pour détecter la fin de la lecture
            player.setPlayBackListener(new PlaybackListener() {
                @Override
                public void playbackFinished(PlaybackEvent evt) {
                    stopAlert();  // Arrêter l'alerte sonore à la fin de la lecture
                }
            });

            // Démarrer la lecture dans un nouveau thread
            new Thread(() -> {
                try {
                    player.play();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();

            System.out.println("Bip sonore déclenché!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void stopAlert() {
        if (player != null) {
            player.close();
            player = null;
            System.out.println("Bip sonore arrêté!");
        }
    }
}
