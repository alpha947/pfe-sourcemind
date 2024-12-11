package gn.dgd.dis.pod.configuration;


import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.broker.BrokerAvailabilityEvent;
import org.springframework.stereotype.Controller;

import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
//dans ce controlleur, signalR est utilisé pour construire un hub reactif pour une communication legere avec le client
public class PowerHub {

    @MessageMapping("/powerStatus")
    @SendTo("/topic/powerStatus")
    public String sendPowerStatus(String status) {
        return status;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        System.out.println("Client connecté: " + event.getUser());
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        System.out.println("Client deconnecté: " + event.getUser());
    }

    @EventListener
    public void handleBrokerAvailability(BrokerAvailabilityEvent event) {
        System.out.println("Le broker est disponible sur: " + event.isBrokerAvailable());
    }
}
