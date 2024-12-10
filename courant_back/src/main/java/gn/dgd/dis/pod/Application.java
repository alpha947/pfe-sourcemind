package gn.dgd.dis.pod;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

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

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	// @Bean
	// CommandLineRunner commandLineRunner(RoleRepository roleRepository) {
	// return args -> {
	// RequestContext.setUserId(0L); // chargement automatique de deux roles dans la
	// base de donnees lors du
	// // premier de marrage de l'application
	// var userRole = new RoleEntity();
	// userRole.setName(Authority.USER.name());
	// userRole.setAuthorities(Authority.USER);
	// roleRepository.save(userRole);

	// var adminRole = new RoleEntity();
	// adminRole.setName(Authority.ADMIN.name());
	// adminRole.setAuthorities(Authority.ADMIN);
	// roleRepository.save(adminRole);
	// RequestContext.start();
	// };
	// }
}