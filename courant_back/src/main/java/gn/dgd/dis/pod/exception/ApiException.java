package gn.dgd.dis.pod.exception;

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

public class ApiException extends RuntimeException {
    public ApiException(String message) { super(message); }
    public ApiException() { super("Une erreure est survenue"); }
}