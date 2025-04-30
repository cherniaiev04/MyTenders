package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.enums.Role;
import cherniaievoa.project.mytenders.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

  private UserRepository userRepository;

  @Autowired
  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  @Override
  public List<User> getUsersByRole(Role role) {
    return userRepository.findAllByRole(role);
  }

  @Override
  public User getUserById(Long userId) {
    return userRepository.findById(userId).orElse(null);
  }

  @Override
  public User getUserByUsername(String username) {
    if(userRepository.findByUsername(username).isPresent()) {
      return userRepository.findByUsername(username).get();
    }

    return null;
  }

  @Override
  public User saveUser(User user) {
    return userRepository.save(user);
  }

  @Override
  public User updateUser(User user) {
    Optional<User> existingUser = userRepository.findById(user.getId());

    if(existingUser.isPresent()) {
      User updatedUser = existingUser.get();

      updatedUser.setName(user.getName());
      updatedUser.setSurname(user.getSurname());
      updatedUser.setPassword(user.getPassword());
      updatedUser.setRole(user.getRole());
      updatedUser.setPosition(user.getPosition());
      updatedUser.setUsername(user.getUsername());
      updatedUser.setProjects(user.getProjects());

      return userRepository.save(updatedUser);
    }
    return null;
  }

  @Override
  public Boolean existedById(Long userId) {
    return userRepository.existsById(userId);
  }

  @Override
  public void deleteUserById(Long userId) {
    userRepository.deleteById(userId);
  }
}
