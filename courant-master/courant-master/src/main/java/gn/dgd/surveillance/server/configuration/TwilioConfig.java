package gn.dgd.surveillance.server.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.twilio.Twilio;
import com.twilio.http.TwilioRestClient;

@Configuration
public class TwilioConfig {
    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;
    @Value("${twilio.phoneNumber}")
    private String phoneNumber;
    // @Value("${alpha.destination.phoneNumber}")
    // private String destinationPhoneNumber;
    @Bean
    public TwilioRestClient twilioInitializer() {
        Twilio.init(accountSid, authToken);
        return Twilio.getRestClient();
    }
}
