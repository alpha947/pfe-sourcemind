package gn.dgd.dis.pod.utils;

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
public class EmailUtils {

    public static String getEmailMessage(String name, String host, String key) {
        return "Bonjour " + name + ",\n\nVotre nouveau compte a été créé. Veuillez cliquer sur le lien ci-dessous pour vérifier votre compte.\n\n" +
                getVerificationUrl(host, key) + "\n\nL'équipe de support";

    }

    public static String getResetPasswordMessage(String name, String host, String key) {
        return "Bonjour " + name + ",\n\nVeuillez utiliser le lien ci-dessous pour réinitialiser votre mot de passe.\n\n" +
                getResetPasswordUrl(host, key) + "\n\nL'équipe de support";

    }

    public static String getVerificationUrl(String host, String key) {
        return host + "/verify/account?key=" + key;
    }

    public static String getResetPasswordUrl(String host, String key) {
        return host + "/verify/password?key=" + key;
    }
}