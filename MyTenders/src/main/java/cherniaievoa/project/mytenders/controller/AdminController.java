package cherniaievoa.project.mytenders.controller;


import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

  @PostMapping("/addUser")
  public ResponseEntity<User> addUser(@RequestBody User user) {
    userService.saveUser(user);
    return ResponseEntity.ok(user);
  }
}
