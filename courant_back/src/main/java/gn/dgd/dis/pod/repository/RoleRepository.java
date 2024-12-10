package gn.dgd.dis.pod.repository;

import gn.dgd.dis.pod.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

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

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    Optional<RoleEntity> findByNameIgnoreCase(String name);
}