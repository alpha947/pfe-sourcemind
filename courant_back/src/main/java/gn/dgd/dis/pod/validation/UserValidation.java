package gn.dgd.dis.pod.validation;

import gn.dgd.dis.pod.entity.UserEntity;
import gn.dgd.dis.pod.exception.ApiException;

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

public class UserValidation {

    public static void verifyAccountStatus(UserEntity user) {
        if(!user.isEnabled()) { throw new ApiException("Le compte est deactivé"); }
        if(!user.isAccountNonExpired()) { throw new ApiException("Le compte est expiré"); }
        if(!user.isAccountNonLocked()) { throw new ApiException("Le compte est verouillé"); }
    }
}