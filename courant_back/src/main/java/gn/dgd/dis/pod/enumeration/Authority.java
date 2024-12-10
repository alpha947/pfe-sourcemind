package gn.dgd.dis.pod.enumeration;

import gn.dgd.dis.pod.constant.Constants;

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

public enum Authority {
    USER(Constants.USER_AUTHORITIES),
    ADMIN(Constants.ADMIN_AUTHORITIES),
    SUPER_ADMIN(Constants.SUPER_ADMIN_AUTHORITIES),
    MANAGER(Constants.MANAGER_AUTHORITIES);

    private final String value;

    Authority(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }
}