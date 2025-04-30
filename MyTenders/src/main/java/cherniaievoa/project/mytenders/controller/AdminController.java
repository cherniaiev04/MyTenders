package cherniaievoa.project.mytenders.controller;


import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin
@RequestMapping("/admin")
public class AdminController {

  private final UserServiceImpl userService;

  @Autowired
  public AdminController(UserServiceImpl userService) {
    this.userService = userService;
  }

  @Autowired
  PasswordEncoder encoder;

  @PostMapping("/addUser")
  public ResponseEntity<User> addUser(@RequestBody User user) {
    if (userService.getUserByUsername(user.getUsername()) != null) {
      return ResponseEntity.status(403).build();
    }
    // Create new user's account
    User newUser = new User(
            user.getUsername(),
            encoder.encode(user.getPassword()),
            user.getName(),
            user.getSurname(),
            user.getPosition(),
            user.getRole()
    );
    userService.saveUser(newUser);
    user.setPassword("");
    return ResponseEntity.ok(user);
  }
}
