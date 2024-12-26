package gn.dgd.surveillance.server.service;

 

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;
// import org.springframework.web.socket.client.standard.StandardWebSocketClient;
// import org.springframework.web.socket.messaging.WebSocketStompClient;
// import org.springframework.messaging.simp.stomp.*;
// import org.springframework.util.concurrent.ListenableFuture;
// import javax.annotation.PostConstruct;
// import java.lang.reflect.Type;

// @Component
// public class PowerStatusWebSocketClient {

//     @Value("${websocket.url}")
//     private String URL;

//     @PostConstruct
//     public void connect() {
//         StandardWebSocketClient client = new StandardWebSocketClient();
//         WebSocketStompClient stompClient = new WebSocketStompClient(client);
//         stompClient.setMessageConverter(new org.springframework.messaging.converter.MappingJackson2MessageConverter());

//         ListenableFuture<StompSession> future = stompClient.connect(URL, new StompSessionHandlerAdapter() {});
        
//         future.addCallback(new org.springframework.util.concurrent.ListenableFutureCallback<StompSession>() {
//             @Override
//             public void onSuccess(StompSession session) {
//                 session.subscribe("/topic/power-status", new StompFrameHandler() {
//                     @Override
//                     public Type getPayloadType(StompHeaders headers) {
//                         return String.class;
//                     }

//                     @Override
//                     public void handleFrame(StompHeaders headers, Object payload) {
//                         String message = (String) payload;
//                         System.out.println("Message reçu via WebSocket: " + message);
//                         if ("POWER_OFF".equals(message)) {
//                             // Déclencher le bip sonore
//                             startAlert();
//                         } else if ("POWER_ON".equals(message)) {
//                             // Arrêter le bip sonore
//                             stopAlert();
//                         }
//                     }
//                 });
//                 System.out.println("Connecté au WebSocket d'App A");
//             }

//             @Override
//             public void onFailure(Throwable ex) {
//                 System.err.println("Échec de la connexion au WebSocket: " + ex.getMessage());
//             }
//         });
//     }

//     private AdvancedPlayer player;

//     private void startAlert() {
//         try {
//             // Charger le fichier audio
//             InputStream inputStream = getClass().getResourceAsStream("/danger.mp3"); 
//             // Charger le lecteur audio
//             player = new AdvancedPlayer(inputStream);

//             // Ajouter un listener pour détecter la fin de la lecture
//             player.setPlayBackListener(new PlaybackListener() {
//                 @Override
//                 public void playbackFinished(PlaybackEvent evt) {
//                     stopAlert();  // Arrêter l'alerte sonore à la fin de la lecture
//                 }
//             });

//             // Démarrer la lecture
//             new Thread(() -> {
//                 try {
//                     player.play();
//                 } catch (Exception e) {
//                     e.printStackTrace();
//                 }
//             }).start();

//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//     }

//     private void stopAlert() {
//         if (player != null) {
//             player.close();
//         }
//     }
// }  

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.util.concurrent.ListenableFuture;
import javax.annotation.PostConstruct;
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
        StandardWebSocketClient client = new StandardWebSocketClient();
        WebSocketStompClient stompClient = new WebSocketStompClient(client);
        stompClient.setMessageConverter(new org.springframework.messaging.converter.MappingJackson2MessageConverter());

        ListenableFuture<StompSession> future = stompClient.connect(URL, new StompSessionHandlerAdapter() {});
        
        future.addCallback(new org.springframework.util.concurrent.ListenableFutureCallback<StompSession>() {
            @Override
            public void onSuccess(StompSession session) {
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
