package gn.dgd.dis.pod.service;

import gn.dgd.dis.pod.entity.CredentialEntity;
import gn.dgd.dis.pod.entity.RoleEntity;
import gn.dgd.dis.pod.dto.User;
import gn.dgd.dis.pod.enumeration.LoginType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

public interface UserService {
    void createUser(String firstName, String lastName, String email, String password);
    RoleEntity getRoleName(String name);
    void verifyAccountKey(String key);
    void updateLoginAttempt(String email, LoginType loginType);
    User getUserByUserId(String userId);
    User getUserByEmail(String email);
    CredentialEntity getUserCredentialById(Long id);
    User setUpMfa(Long id);
    User cancelMfa(Long id);
    User verifyQrCode(String userId, String qrCode);
    void resetPassword(String email);
    User verifyPasswordKey(String key);
    void updatePassword(String userId, String newPassword, String confirmNewPassword);
    void updatePassword(String userId, String currentPassword, String newPassword, String confirmNewPassword);
    User updateUser(String userId, String firstName, String lastName, String email, String phone, String bio);
    void updateRole(String userId, String role);
    void toggleAccountExpired(String userId);
    void toggleAccountLocked(String userId);
    void toggleAccountEnabled(String userId);
    void toggleCredentialsExpired(String userId);
    List<User> getUsers();
    String uploadPhoto(String userId, MultipartFile file);
    User getUserById(Long id);
}