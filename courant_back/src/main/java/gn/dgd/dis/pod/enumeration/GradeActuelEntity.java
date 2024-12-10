package gn.dgd.dis.pod.enumeration;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Table;
import lombok.*;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_DEFAULT;

/**
 * Classe Grade
 * <p>
 * Description : c'est la classe qui vas contenir la liste des differentes grades disponnible a la douane
 *
 * @Author Alpha_Amadou_DIALLO
 * @Version 1.0
 * @Date 06/07/2024
 * @LastModified 06/07/2024
 */
@Getter
@Table(name = "grade_actuel")
@JsonInclude(NON_DEFAULT)
public enum GradeActuelEntity {
CAPORAL, SOUS_LIEUTENANT, LIEUTENANT, CAPITAINE, COMMANDANT, LIEUTENANT_COLONEL, COLONEL, GERERAL, ADMIRAL, MARECHAL

}
