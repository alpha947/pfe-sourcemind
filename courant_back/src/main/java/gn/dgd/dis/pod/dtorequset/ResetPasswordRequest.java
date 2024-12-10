package gn.dgd.dis.pod.dtorequset;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class ResetPasswordRequest {
    @NotEmpty(message = "L'identifiant de l'utiliateur ne doit pas etre vide ou nul")
    private String userId;
    @NotEmpty(message = "Le mot de passe ne doit pas etre vide ou nul")
    private String newPassword;
    @NotEmpty(message = "Confirm Le mot de passe ne doit pas etre vide ou nul")
    private String confirmNewPassword;
}