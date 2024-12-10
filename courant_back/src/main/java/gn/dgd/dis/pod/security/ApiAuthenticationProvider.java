package gn.dgd.dis.pod.security;

import gn.dgd.dis.pod.domain.ApiAuthentication;
import gn.dgd.dis.pod.domain.UserPrincipal;
import gn.dgd.dis.pod.service.UserService;
import gn.dgd.dis.pod.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;
import java.util.function.Function;

import static java.time.LocalDateTime.now;

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

@Component
@RequiredArgsConstructor
public class ApiAuthenticationProvider implements AuthenticationProvider {
    private final UserService userService;
    private final BCryptPasswordEncoder encoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        var apiAuthentication = authenticationFunction.apply(authentication);
        var user = userService.getUserByEmail(apiAuthentication.getEmail());
        if(user != null) {
            var userCredential = userService.getUserCredentialById(user.getId());
            //if(userCredential.getUpdatedAt().minusDays(NINETY_DAYS).isAfter(now())) { throw new ApiException("Les informations d'identification ont expiré. Veuillez réinitialiser votre mot de passe"); }
            //if(!user.isCredentialsNonExpired()) { throw new ApiException("Les informations d'identification ont expiré. Veuillez réinitialiser votre mot de passe"); }
            var userPrincipal = new UserPrincipal(user, userCredential);
            validAccount.accept(userPrincipal);
            if(encoder.matches(apiAuthentication.getPassword(), userCredential.getPassword())) {
                return ApiAuthentication.authenticated(user, userPrincipal.getAuthorities());
            } else throw new BadCredentialsException("Adresse e-mail et/ou mot de passe incorrect(s). Veuillez réessayer");
        } throw new ApiException("Impossible d'authentifier");
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return ApiAuthentication.class.isAssignableFrom(authentication);
    }

    private final Function<Authentication, ApiAuthentication> authenticationFunction = authentication -> (ApiAuthentication) authentication;

    private final Consumer<UserPrincipal> validAccount = userPrincipal -> {
        if(!userPrincipal.isAccountNonLocked()) { throw new LockedException("Votre compte est actuellement verrouillé"); }
        if(!userPrincipal.isEnabled()) { throw new DisabledException("Votre compte est actuellement désactivé"); }
        if(!userPrincipal.isCredentialsNonExpired()) { throw new CredentialsExpiredException("Votre mot de passe a expiré. Veuillez le mettre à jour"); }
        if(!userPrincipal.isAccountNonExpired()) { throw new DisabledException("Votre compte a expiré. Veuillez contacter l'administrateur"); }
    };

}