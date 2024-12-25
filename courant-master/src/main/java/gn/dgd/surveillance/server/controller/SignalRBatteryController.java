package gn.dgd.surveillance.server.controller;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@RestController
@RequestMapping("/power")
//pour la reactivite de la compatibilite du backend avec C#(Blazor)
public class SignalRBatteryController { 
    private final SimpMessagingTemplate template;
    public SignalRBatteryController(SimpMessagingTemplate template) {
        this.template = template;
    }
    @GetMapping("/status")
    public String getPowerStatus() {
        String status = isPowerOutage() ? "Il n'y a pas de courant" : "Il ya de courant";
        // Envoie de la mise a jour aux client signalR
        template.convertAndSend("/topic/powerStatus", status);
        return status;
    }
    public boolean isPowerOutage() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("powershell", "Get-CimInstance -ClassName Win32_Battery");
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                // verification de l'allimentation du PC
                if (line.contains("BatteryStatus") && line.contains("2")) {
                    return false;
                }
            }
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    @PostMapping("/verifyUSSD")
    public String verifyUSSD(@RequestParam String codeInput) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("powershell", "Get-CimInstance -ClassName Win32_Battery");
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            //similation du portail d'orange
            if ("*144#".equals(codeInput) || "#144#".equals(codeInput)) {
                return "Bienvenue sur Orange Money \n"+
                                    "1. Transfert              \n"+
                                    "2. Achat Credit et Pass   \n"+
                                    "3. Solde                  \n"+
                                    "4. Paiements              \n"+
                                    "5. Services Financiers    \n"+
                                    "6. Paiement Marchand      \n"+
                                    "7. Mon compte             \n"+
                                    "8. Loisirs                \n"+
                                    "3. Ouverture de compte    \n";
            } else if ("*947#".equals(codeInput)) {
                    return "Bienvenue aux Douanes Guinéenes \n"+
                                    "1. Verification courant        \n"+
                                    "2. Verification Server         \n"+
                                    "3. Verification Ondulaire      \n"+
                                    "4. Verification temperature    \n"+
                                    "5. Verification Stockage       \n";
            }
            else if ("".equals(codeInput)) {
                return "Il faut au moins saisir un code USSD pour tester le Systeme";
            }
            while ((line = reader.readLine()) != null) {
                // verification de l'allimentation du PC
                if (line.contains("BatteryStatus") && line.contains("2")&& "1".equals(codeInput) || line.contains("BatteryStatus") && line.contains("2")&& "*947*1#".equals(codeInput)) {
                    return "Il ya le courant";
                }else if(line.contains("BatteryStatus") && line.contains("1")&& "1".equals(codeInput) || line.contains("BatteryStatus") && line.contains("1")&& "*947*1#".equals(codeInput))
                {
                    return "il n'ya pas de courant";
                }
            }
           return "mauvais code ussd, verifier et ressayer";
        } catch (IOException e) {
            e.printStackTrace();
            return "il n'ya pas de courant";
        }
   
    }

}