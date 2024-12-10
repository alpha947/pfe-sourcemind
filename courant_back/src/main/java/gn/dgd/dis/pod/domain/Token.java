package gn.dgd.dis.pod.domain;

import lombok.Builder;
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

@Builder
@Getter
@Setter
public class Token {
    private String access;
    private String refresh;
}