package gn.dgd.surveillance.server.service;


import com.twilio.rest.insights.v1.Call;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
public class PowerDetectorWithCall {
    //les informations du compte twilio
    private final String ACCOUNT_SID = "ACaea7f4830d5942df17d029e1a640542d";
    private final String AUTH_TOKEN = "8c548d79ac8feb33af6a6d04396582e9";
    private final String TWILIO_PHONE_NUMBER = "+12186568704";
    private final String TO_PHONE_NUMBER = "+224626929178";
    // la variable pour suivre l'etat actuel du courant
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
                    // detection du retour du courant
                    sendTwilioMessage("status: Le courant est rétabli.");
                } else {
                    //detection de la rupture
                    sendTwilioMessage("status: Coupure d'électricité détectée!");
                }
                // m-a-j de l'etat du courant
                powerIsOn = currentPowerStatus;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    //Methode d'envoie de message apres la detection de la coupure
    private void sendTwilioMessage(String messageBody) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        //creation de l'objet message
        Message message = Message.creator(
                new com.twilio.type.PhoneNumber(TO_PHONE_NUMBER),
                new com.twilio.type.PhoneNumber(TWILIO_PHONE_NUMBER),
                messageBody
        ).create();

        System.out.println("Message SID: " + message.getSid());
    }


//Methode d'emission d'appel automatiquement apres la coupure desactiver par manque de financement pour l'appel
//    private void makeTwilioCall() {
//        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);//
//        // creation de l'appel twilio
//        Call call = Call.creator(
//              // Numéro de téléphone du destinataire
//                new com.twilio.type.PhoneNumber(TO_PHONE_NUMBER),
//               // Numéro Twilio
//                new com.twilio.type.PhoneNumber(TWILIO_PHONE_NUMBER),
//                //URL TwiML
//                new URI("http://demo.twilio.com/docs/voice.xml")
//        ).create();
//        System.out.println("Call SID: " + call.getSid());
//    }


}
