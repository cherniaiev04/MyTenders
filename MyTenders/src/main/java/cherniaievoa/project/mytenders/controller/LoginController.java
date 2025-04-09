package cherniaievoa.project.mytenders.controller;


import cherniaievoa.project.mytenders.dto.AuthRequest;
import cherniaievoa.project.mytenders.dto.AuthResponse;
import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin
public class LoginController {

  @Autowired
  private UserServiceImpl userService;

  @PostMapping(value = "/login")
  public ResponseEntity<AuthResponse> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {

    User user = userService.getUserByUsername(authRequest.getUsername());

    if (user == null || !user.getPassword().equals(authRequest.getPassword()))
      throw new BadCredentialsException("Incorrect username or password");

    return ResponseEntity.ok(new AuthResponse(user.getUsername(),
            user.getName(),
            user.getSurname(),
            user.getRole().toString()));
  }
}
