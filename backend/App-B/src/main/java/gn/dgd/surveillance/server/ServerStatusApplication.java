package gn.dgd.surveillance.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;


@SpringBootApplication 
public class ServerStatusApplication  {
    public static void main(String[] args) {
        SpringApplication.run(ServerStatusApplication.class, args);

    }

}
