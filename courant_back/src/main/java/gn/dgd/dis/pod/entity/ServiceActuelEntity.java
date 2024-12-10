package gn.dgd.dis.pod.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_DEFAULT;

/**
 * Classe ServiceActuel
 * <p>
 * Description : c'est la classe qui stocke l'emplacement actuel d'un des users du systeme
 *
 * @Author Alpha_Amadou_DIALLO
 * @Version 1.0
 * @Date 06/07/2024
 * @LastModified 06/07/2024
 */
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "service_actuel")
@JsonInclude(NON_DEFAULT)
public class ServiceActuelEntity extends Auditable{
    @Column(updatable = false, unique = true, nullable = false)
    private String serviceId;
    @Column(updatable = true, unique = true, nullable = false)
    private String nomService;
    private String description;
}
