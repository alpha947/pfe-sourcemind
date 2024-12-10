package gn.dgd.dis.pod.resource;

import gn.dgd.dis.pod.enumeration.GradeActuelEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Classe GradeRessources
 * <p>
 * Description : c'est le endpoints des grades
 *
 * @Author Alpha_Amadou_DIALLO
 * @Version 1.0
 * @Date 06/07/2024
 * @LastModified 06/07/2024
 */
@RestController
@RequestMapping("/grades")
public class GradeRessources {
public List<?> getAllGrade(){
 return List.of(new GradeActuelEntity[10]);

}
}
