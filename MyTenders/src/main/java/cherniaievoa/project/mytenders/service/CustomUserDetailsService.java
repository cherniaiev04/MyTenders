package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomUserDetailsService  implements UserDetailsService {
  @Autowired
  private UserRepository userRepository;
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username).get();
    if (user == null) {
      throw new UsernameNotFoundException("User Not Found with username: " + username);
    }
    return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            user.getAuthorities()
    );
  }
}
