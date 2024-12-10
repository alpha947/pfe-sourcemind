package gn.dgd.dis.pod.dtorequset;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

/**
 * Description : C'est une description standard de EAAD
 *
 * @Author Alpha_Amadou_DIALLO
 * @Version 1.0
 * @Date 28/05/2024
 * @LastModified 28/06/2024
 * @Email dialloalphaamadou947@gmail.com
 * @GitHub: https://github.com/alpha947
 */

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRequest {
    @NotEmpty(message = "Le prenom ne doit pas etre vide ou nul")
    private String firstName;
    @NotEmpty(message = "Le nom ne doit pas etre vide ou nul")
    private String lastName;
    @NotEmpty(message = "L'adresse email ne doit pas etre vide ou nul")
    @Email(message = "Adresse email invalide")
    private String email;
    @NotEmpty(message = "Le mot de passe ne doit pas etre vide ou nul")
    private String password;
    private String bio;
    private String phone;
    private String grade;
    private String departement;
}