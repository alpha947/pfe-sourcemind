package gn.dgd.surveillance.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
//configuration de base pour la redirection dans l'application clientedu meme projet
@Controller
public class UssdController {

    @GetMapping("/ussd")
    public String showUSSDForm(Model model) {
        model.addAttribute("userInput", "");
        return "ussd";
    }

}
