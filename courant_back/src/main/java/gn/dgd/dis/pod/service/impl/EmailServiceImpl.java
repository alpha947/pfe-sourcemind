package gn.dgd.dis.pod.service.impl;

import gn.dgd.dis.pod.service.EmailService;
import gn.dgd.dis.pod.utils.EmailUtils;
import gn.dgd.dis.pod.exception.ApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

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

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
    private static final String NEW_USER_ACCOUNT_VERIFICATION = "Verification du compte d'un nouvel utilisateur";
    private static final String PASSWORD_RESET_REQUEST = "Requette de modification de mot de passe";
    private final JavaMailSender sender;
    @Value("${spring.mail.verify.host}")
    private String host;
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Async
    public void sendNewAccountEmail(String name, String email, String token) {
        try {
            var message = new SimpleMailMessage();
            message.setSubject(NEW_USER_ACCOUNT_VERIFICATION);
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setText(EmailUtils.getEmailMessage(name, host, token));
            sender.send(message);
        } catch (Exception exception) {
            log.error(exception.getMessage());
            throw new ApiException("Impossible d'envoyer un mail");
        }
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String name, String email, String token) {
        try {
            var message = new SimpleMailMessage();
            message.setSubject(PASSWORD_RESET_REQUEST);
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setText(EmailUtils.getResetPasswordMessage(name, host, token));
            sender.send(message);
        } catch (Exception exception) {
            log.error(exception.getMessage());
            throw new ApiException("Impossible d'envoyer un mail");
        }
    }
}