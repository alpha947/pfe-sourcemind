package gn.dgd.dis.pod.resource;

import gn.dgd.dis.pod.constant.Constants;
import gn.dgd.dis.pod.domain.Response;
import gn.dgd.dis.pod.handler.ApiLogoutHandler;
import gn.dgd.dis.pod.service.JwtService;
import gn.dgd.dis.pod.service.UserService;
import gn.dgd.dis.pod.utils.RequestUtils;
import gn.dgd.dis.pod.dto.User;
import gn.dgd.dis.pod.dtorequset.EmailRequest;
import gn.dgd.dis.pod.dtorequset.QrCodeRequest;
import gn.dgd.dis.pod.dtorequset.ResetPasswordRequest;
import gn.dgd.dis.pod.dtorequset.RoleRequest;
import gn.dgd.dis.pod.dtorequset.UpdatePasswordRequest;
import gn.dgd.dis.pod.dtorequset.UserRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static gn.dgd.dis.pod.enumeration.TokenType.ACCESS;
import static gn.dgd.dis.pod.enumeration.TokenType.REFRESH;
import static java.net.URI.create;
import static java.util.Collections.emptyMap;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

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

@RestController
@RequiredArgsConstructor
@RequestMapping(path = { "/user" })
public class UserResource {
    private final UserService userService;
    private final JwtService jwtService;
    private final ApiLogoutHandler logoutHandler;


    @PostMapping("/register")
    public ResponseEntity<Response> saveUser(@RequestBody @Valid UserRequest user, HttpServletRequest request) {
        userService.createUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getPassword());
        return ResponseEntity.created(create("")).body(RequestUtils.getResponse(request, emptyMap(), "Compte créé.\n Vérifiez votre courrier électronique pour activer votre compte. ", CREATED));
    }

    @GetMapping("/verify/account")
    public ResponseEntity<Response> verifyAccount(@RequestParam("key") String key, HttpServletRequest request) throws InterruptedException {
        userService.verifyAccountKey(key);
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Compte verifié.", OK));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyAuthority('user:read') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> profile(@AuthenticationPrincipal User userPrincipal, HttpServletRequest request) {
        var user = userService.getUserByUserId(userPrincipal.getUserId());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, of("user", user), "Profil récupéré", OK));
    }

    @PatchMapping("/update")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> update(@AuthenticationPrincipal User userPrincipal, @RequestBody UserRequest userRequest, HttpServletRequest request) {
        var user = userService.updateUser(userPrincipal.getUserId(), userRequest.getFirstName(), userRequest.getLastName(), userRequest.getEmail(), userRequest.getPhone(), userRequest.getBio());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, of("user", user), "L'utilisateur a été mis à jour avec succès", OK));
    }

    @PatchMapping("/updaterole")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> updateRole(@AuthenticationPrincipal User userPrincipal, @RequestBody RoleRequest roleRequest, HttpServletRequest request) {
        userService.updateRole(userPrincipal.getUserId(), roleRequest.getRole());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Le role a été mis à jour avec succès", OK));
    }

    @PatchMapping("/toggleaccountexpired")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> toggleAccountExpired(@AuthenticationPrincipal User user, HttpServletRequest request) {
        userService.toggleAccountExpired(user.getUserId());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Le compte a été mis à jour avec succès.", OK));
    }

    @PatchMapping("/toggleaccountlocked")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> toggleAccountLocked(@AuthenticationPrincipal User user, HttpServletRequest request) {
        userService.toggleAccountLocked(user.getUserId());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Compte mis a jour avec succes", OK));
    }

    @PatchMapping("/toggleaccountenabled")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> toggleAccountEnabled(@AuthenticationPrincipal User user, HttpServletRequest request) {
        userService.toggleAccountEnabled(user.getUserId());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Compte mis a jour avec succes", OK));
    }

    @PatchMapping("/togglecredentialsexpired")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> toggleCredentialsExpired(@AuthenticationPrincipal User user, HttpServletRequest request) {
        userService.toggleCredentialsExpired(user.getUserId());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Compte mis a jour avec succe", OK));
    }

    @PatchMapping("/mfa/setup")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> setUpMfa(@AuthenticationPrincipal User userPrincipal, HttpServletRequest request) {
        var user = userService.setUpMfa(userPrincipal.getId());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, of("user", user), "MFA Activée avec succes", OK));
    }

    @PatchMapping("/mfa/cancel")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> cancelMfa(@AuthenticationPrincipal User userPrincipal, HttpServletRequest request) {
        var user = userService.cancelMfa(userPrincipal.getId());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, of("user", user), "MFA a été supprimée avec succes", OK));
    }

    @PostMapping("/verify/qrcode")
    public ResponseEntity<Response> verifyQrcode(@RequestBody QrCodeRequest qrCodeRequest, HttpServletRequest request, HttpServletResponse response) {
        var user = userService.verifyQrCode(qrCodeRequest.getUserId(), qrCodeRequest.getQrCode());
        jwtService.addCookie(response, user, ACCESS);
        jwtService.addCookie(response, user, REFRESH);
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, of("user", user), "Le code QR a été verifier avec succes", OK));
    }
    // DEBUT - Réinitialiser le mot de passe lorsque l'utilisateur est connecté
    @PatchMapping("/updatepassword")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> updatePassword(@AuthenticationPrincipal User user, @RequestBody UpdatePasswordRequest passwordRequest, HttpServletRequest request) {
        userService.updatePassword(user.getUserId(), passwordRequest.getPassword(), passwordRequest.getNewPassword(), passwordRequest.getConfirmNewPassword());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Le mot de passe a été mis a jour avec succes", OK));
    }
    // FIN - Réinitialiser le mot de passe lorsque l'utilisateur est connecté

    // DEBUT - Réinitialiser le mot de passe lorsque l'utilisateur n'est PAS connecté
    @PostMapping("/resetpassword")
    public ResponseEntity<Response> resetPassword(@RequestBody @Valid EmailRequest emailRequest, HttpServletRequest request) {
        userService.resetPassword(emailRequest.getEmail());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Nous vous avons deja envoyer un mail de reinitialisation du mot de passe", OK));
    }


    @GetMapping("/verify/password")
    public ResponseEntity<Response> verifyPassword(@RequestParam("key") String key, HttpServletRequest request) {
        var user = userService.verifyPasswordKey(key);
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, of("user", user), "Entrer le nouveau mot de passe", OK));
    }

    @PostMapping("/resetpassword/reset")
    public ResponseEntity<Response> doResetPassword(@RequestBody @Valid ResetPasswordRequest resetPasswordRequest, HttpServletRequest request) {
        userService.updatePassword(resetPasswordRequest.getUserId(), resetPasswordRequest.getNewPassword(), resetPasswordRequest.getConfirmNewPassword());
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Mot de passe reinitialiser avec succes", OK));
    }
    // FIN - Réinitialiser le mot de passe lorsque l'utilisateur n'est PAS connecté

    @GetMapping(path = "/list")
    @PreAuthorize("hasAnyAuthority('user:read') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> getUsers(@AuthenticationPrincipal User user, HttpServletRequest request) {
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, of("users", userService.getUsers()), "Utilisateurs récupérés", OK));
    }

    @PatchMapping("/photo")
    @PreAuthorize("hasAnyAuthority('user:update') or hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Response> uploadPhoto(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        var imageUrl = userService.uploadPhoto(user.getUserId(), file);
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, of("imageUrl", imageUrl), "Photo mise à jour avec succès", OK));
    }

    @GetMapping(path = "/image/{filename}", produces = { IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE })
    public byte[] getPhoto(@PathVariable("filename") String filename) throws IOException {
        return Files.readAllBytes(Paths.get(Constants.FILE_STORAGE + filename));
    }
    //La deconnection
    @PostMapping("/logout")
    public ResponseEntity<Response> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        logoutHandler.logout(request, response, authentication);
        return ResponseEntity.ok().body(RequestUtils.getResponse(request, emptyMap(), "Vous vous êtes déconnecté avec succès", OK));
    }
}
