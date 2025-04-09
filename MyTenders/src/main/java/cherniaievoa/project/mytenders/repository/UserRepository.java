package cherniaievoa.project.mytenders.repository;

import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  List<User> findAllByRole(Role role);

  Optional<User> findByUsername(String username);
}
