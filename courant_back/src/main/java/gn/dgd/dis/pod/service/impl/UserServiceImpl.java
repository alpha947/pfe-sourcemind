package gn.dgd.dis.pod.service.impl;

import gn.dgd.dis.pod.cache.CacheStore;
import gn.dgd.dis.pod.domain.RequestContext;
import gn.dgd.dis.pod.entity.ConfirmationEntity;
import gn.dgd.dis.pod.entity.CredentialEntity;
import gn.dgd.dis.pod.entity.RoleEntity;
import gn.dgd.dis.pod.entity.UserEntity;
import gn.dgd.dis.pod.event.UserEvent;
import gn.dgd.dis.pod.utils.UserUtils;
import gn.dgd.dis.pod.dto.User;
import gn.dgd.dis.pod.enumeration.Authority;
import gn.dgd.dis.pod.enumeration.LoginType;
import gn.dgd.dis.pod.exception.ApiException;
import gn.dgd.dis.pod.repository.ConfirmationRepository;
import gn.dgd.dis.pod.repository.CredentialRepository;
import gn.dgd.dis.pod.repository.RoleRepository;
import gn.dgd.dis.pod.repository.UserRepository;
import gn.dgd.dis.pod.service.UserService;
import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiFunction;

import static gn.dgd.dis.pod.constant.Constants.FILE_STORAGE;
import static gn.dgd.dis.pod.enumeration.EventType.REGISTRATION;
import static gn.dgd.dis.pod.enumeration.EventType.RESETPASSWORD;
import static gn.dgd.dis.pod.validation.UserValidation.verifyAccountStatus;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static java.time.LocalDateTime.now;
import static java.util.Map.of;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.EMPTY;

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
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CredentialRepository credentialRepository;
    private final ConfirmationRepository confirmationRepository;
    private final BCryptPasswordEncoder encoder;
    private final CacheStore<String, Integer> userCache;
    private final ApplicationEventPublisher publisher;

    @Override
    public void createUser(String firstName, String lastName, String email, String password) {
        var userEntity = userRepository.save(createNewUser(firstName, lastName, email));
        var credentialEntity = new CredentialEntity(userEntity, encoder.encode(password));
        credentialRepository.save(credentialEntity);
        var confirmationEntity = new ConfirmationEntity(userEntity);
        confirmationRepository.save(confirmationEntity);
        publisher.publishEvent(new UserEvent(userEntity, REGISTRATION, of("key", confirmationEntity.getKey())));
    }

    @Override
    public RoleEntity getRoleName(String name) {
        var role = roleRepository.findByNameIgnoreCase(name);
        return role.orElseThrow(() -> new ApiException("Rôle introuvable"));
    }

    @Override
    public void verifyAccountKey(String key) {
        var confirmationEntity = getUserConfirmation(key);
        var userEntity = getUserEntityByEmail(confirmationEntity.getUserEntity().getEmail());
        userEntity.setEnabled(true);
        userRepository.save(userEntity);
        confirmationRepository.delete(confirmationEntity);
    }

    @Override
    public void updateLoginAttempt(String email, LoginType loginType) {
        var userEntity = getUserEntityByEmail(email);
        RequestContext.setUserId(userEntity.getId());
        switch (loginType) {
            case LOGIN_ATTEMPT -> {
                if (userCache.get(userEntity.getEmail()) == null) {
                    userEntity.setLoginAttempts(0);
                    userEntity.setAccountNonLocked(true);
                }
                userEntity.setLoginAttempts(userEntity.getLoginAttempts() + 1);
                userCache.put(userEntity.getEmail(), userEntity.getLoginAttempts());
                if (userCache.get(userEntity.getEmail()) > 5) {
                    userEntity.setAccountNonLocked(false);
                }
            }
            case LOGIN_SUCCESS -> {
                userEntity.setAccountNonLocked(true);
                userEntity.setLoginAttempts(0);
                userEntity.setLastLogin(now());
                userCache.evict(userEntity.getEmail());
            }
        }
        userRepository.save(userEntity);
    }

    @Override
    public User getUserByUserId(String userId) {
        var userEntity = userRepository.findUserByUserId(userId).orElseThrow(() -> new ApiException("Utilisateur non trouvé"));
        return UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId()));
    }

    @Override
    public User getUserByEmail(String email) {
        UserEntity userEntity = getUserEntityByEmail(email);
        return UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId()));
    }

    @Override
    public CredentialEntity getUserCredentialById(Long userId) {
        var credentialById = credentialRepository.getCredentialByUserEntityId(userId);
        return credentialById.orElseThrow(() -> new ApiException("Impossible de trouver les informations d'identification de l'utilisateur"));
    }

    @Override
    public User setUpMfa(Long id) {
        var userEntity = getUserEntityById(id);
        var codeSecret = UserUtils.qrCodeSecret.get();
        userEntity.setQrCodeImageUri(UserUtils.qrCodeImageUri.apply(userEntity.getEmail(), codeSecret));
        userEntity.setQrCodeSecret(codeSecret);
        userEntity.setMfa(true);
        userRepository.save(userEntity);
        return UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId()));
    }

    @Override
    public User cancelMfa(Long id) {
        var userEntity = getUserEntityById(id);
        userEntity.setMfa(false);
        userEntity.setQrCodeSecret(EMPTY);
        userEntity.setQrCodeImageUri(EMPTY);
        userRepository.save(userEntity);
        return UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId()));
    }

    @Override
    public User verifyQrCode(String userId, String qrCode) {
        var userEntity = getUserEntityByUserId(userId);
        verifyCode(qrCode, userEntity.getQrCodeSecret());
        return UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId()));
    }

    @Override
    public void resetPassword(String email) {
        var user = getUserEntityByEmail(email);
        var confirmation = getUserConfirmation(user);
        if (confirmation != null) {
            publisher.publishEvent(new UserEvent(user, RESETPASSWORD, of("key", confirmation.getKey())));
        } else {
            var confirmationEntity = new ConfirmationEntity(user);
            confirmationRepository.save(confirmationEntity);
            publisher.publishEvent(new UserEvent(user, RESETPASSWORD, of("key", confirmationEntity.getKey())));
        }

    }

    @Override
    public User verifyPasswordKey(String key) {
        var confirmationEntity = getUserConfirmation(key);
        if (confirmationEntity == null) { throw new ApiException("Impossible de trouver le token"); }
        var userEntity = getUserEntityByEmail(confirmationEntity.getUserEntity().getEmail());
        if (userEntity == null) { throw new ApiException("Token incorrecte"); }
        verifyAccountStatus(userEntity);
        confirmationRepository.delete(confirmationEntity);
        return UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId()));
    }

    @Override
    public void updatePassword(String userId, String newPassword, String confirmNewPassword) {
        if(!confirmNewPassword.equals(newPassword)) { throw new ApiException("Le mot de passe ne corresponds pas reessayer encore."); }
        var user = getUserByUserId(userId);
        var credentials = getUserCredentialById(user.getId());
        credentials.setPassword(encoder.encode(newPassword));
        credentialRepository.save(credentials);
    }

    @Override
    public void updatePassword(String userId, String currentPassword, String newPassword, String confirmNewPassword) {
        if(!confirmNewPassword.equals(newPassword)) { throw new ApiException("Le mot de passe ne corresponds pas reessayer encore."); }
        var user = getUserEntityByUserId(userId);
        verifyAccountStatus(user);
        var credentials = getUserCredentialById(user.getId());
        if(!encoder.matches(currentPassword, credentials.getPassword())) { throw new ApiException("Le mot de passe existant est incorrecte. Reessayer plus tard."); }
        credentials.setPassword(encoder.encode(newPassword));
        credentialRepository.save(credentials);
    }

    @Override
    public User updateUser(String userId, String firstName, String lastName, String email, String phone, String bio) {
        var userEntity = getUserEntityByUserId(userId);
        userEntity.setFirstName(firstName);
        userEntity.setLastName(lastName);
        userEntity.setEmail(email);
        userEntity.setPhone(phone);
        userEntity.setBio(bio);
        userRepository.save(userEntity);
        return UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId()));
    }

    @Override
    public void updateRole(String userId, String role) {
        var userEntity = getUserEntityByUserId(userId);
        userEntity.setRole(getRoleName(role));
        userRepository.save(userEntity);

    }

    @Override
    public void toggleAccountExpired(String userId) {
        var userEntity = getUserEntityByUserId(userId);
        userEntity.setAccountNonExpired(!userEntity.isAccountNonExpired());
        userRepository.save(userEntity);
    }

    @Override
    public void toggleAccountLocked(String userId) {
        var userEntity = getUserEntityByUserId(userId);
        userEntity.setAccountNonLocked(!userEntity.isAccountNonLocked());
        userRepository.save(userEntity);

    }

    @Override
    public void toggleAccountEnabled(String userId) {
        var userEntity = getUserEntityByUserId(userId);
        userEntity.setEnabled(!userEntity.isEnabled());
        userRepository.save(userEntity);

    }

    @Override
    public void toggleCredentialsExpired(String userId) {
        var userEntity = getUserEntityByUserId(userId);
        var credentials = getUserCredentialById(userEntity.getId());
        credentials.setUpdatedAt(LocalDateTime.of(1995, 7, 12, 11, 11));
        /*if (credentials.getUpdatedAt().plusDays(NINETY_DAYS).isAfter(now())) {
            credentials.setUpdatedAt(now());
        } else {
            credentials.setUpdatedAt(LocalDateTime.of(1995, 7, 12, 11, 11));
        }*/
        credentialRepository.save(credentials);
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll()
                .stream()
                .filter(userEntity -> !"system@gmail.com".equalsIgnoreCase(userEntity.getEmail()))
                .map(userEntity -> UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId())))
                .collect(toList());
    }

    @Override
    public String uploadPhoto(String userId, MultipartFile file) {
        var user = getUserEntityByUserId(userId);
        var photoUrl = photoFunction.apply(userId, file);
        user.setImageUrl(photoUrl + "?timestamp=" + System.currentTimeMillis());
        userRepository.save(user);
        return photoUrl;
    }

    @Override
    public User getUserById(Long id) {
        var userEntity = userRepository.findById(id).orElseThrow(() -> new ApiException("Utilisateur non trouvé"));
        return UserUtils.fromUserEntity(userEntity, userEntity.getRole(), getUserCredentialById(userEntity.getId()));
    }

    private final BiFunction<String, MultipartFile, String> photoFunction = (id, file) -> {
        var filename = id + ".png";
        try {
            var fileStorageLocation = Paths.get(FILE_STORAGE).toAbsolutePath().normalize();
            if(!Files.exists(fileStorageLocation)) { Files.createDirectories(fileStorageLocation); }
            Files.copy(file.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/user/image/" + filename).toUriString();
        } catch (Exception exception) {
            throw new ApiException("Imposible d'enregistrer l'image.");
        }
    };

    private boolean verifyCode(String qrCode, String qrCodeSecret) {
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier codeVerifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        if(codeVerifier.isValidCode(qrCodeSecret, qrCode)) {
            return true;
        } else {
            throw new ApiException("Code Qr code invalide. Reessayer plus tard.");
        }
    }

    private UserEntity getUserEntityByUserId(String userId) {
        var userByUserId = userRepository.findUserByUserId(userId);
        return userByUserId.orElseThrow(() -> new ApiException("Utilisateur non trouvé"));
    }

    private UserEntity getUserEntityById(Long id) {
        var userById = userRepository.findById(id);
        return userById.orElseThrow(() -> new ApiException("Utilisateur non trouvé"));
    }

    private UserEntity getUserEntityByEmail(String email) {
        var userByEmail = userRepository.findByEmailIgnoreCase(email);
        return userByEmail.orElseThrow(() -> new ApiException("Utilisateur non trouvé"));
    }

    private ConfirmationEntity getUserConfirmation(String key) {
        return confirmationRepository.findByKey(key).orElseThrow(() -> new ApiException("Cle de confirmation non trouvé"));
    }

    private ConfirmationEntity getUserConfirmation(UserEntity user) {
        return confirmationRepository.findByUserEntity(user).orElse(null);
    }

    private UserEntity createNewUser(String firstName, String lastName, String email) {
        var role = getRoleName(Authority.USER.name());
        return UserUtils.createUserEntity(firstName, lastName, email, role);
    }
}