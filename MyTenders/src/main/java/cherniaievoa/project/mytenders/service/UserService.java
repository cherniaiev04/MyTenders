package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.enums.Role;

import java.util.List;

public interface UserService {

  List<User> getAllUsers();
  List<User> getUsersByRole(Role role);
  User getUserById(Long userId);
  User getUserByUsername(String username);
  User saveUser(User user);
  User updateUser(User user);
  Boolean existedById(Long userId);
  void deleteUserById(Long userId);
}
