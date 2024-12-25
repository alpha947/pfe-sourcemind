package gn.dgd.surveillance.server.configuration;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Broker simple intégré
        config.setApplicationDestinationPrefixes("/app"); // Préfixe pour les messages envoyés au serveur
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/power-status-websocket")
                .setAllowedOrigins("*") // Autoriser toutes les origines ou spécifiez les origines nécessaires
                .withSockJS();
    }
}
