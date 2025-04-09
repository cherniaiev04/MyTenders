package cherniaievoa.project.mytenders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
@AutoConfiguration
public class MyTendersApplication {

  public static void main(String[] args) {
    SpringApplication.run(MyTendersApplication.class, args);
  }

}

