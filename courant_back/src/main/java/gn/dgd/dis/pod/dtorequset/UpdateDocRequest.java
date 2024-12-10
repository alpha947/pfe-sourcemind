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
public class UpdateDocRequest {
    @NotEmpty(message = "L'identifiant du document ne doit pas etre vide ou nul")
    private String documentId;
    @NotEmpty(message = "Le nom ne doit pas etre vide ou nul")
    private String name;
    @NotEmpty(message = "La description ne doit pas etre vide ou nulle")
    private String description;
}