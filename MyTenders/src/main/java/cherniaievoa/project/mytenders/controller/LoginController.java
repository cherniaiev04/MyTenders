package cherniaievoa.project.mytenders.controller;


import cherniaievoa.project.mytenders.dto.AuthRequest;
import cherniaievoa.project.mytenders.dto.AuthResponse;
import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.repository.UserRepository;
import cherniaievoa.project.mytenders.service.UserServiceImpl;
import cherniaievoa.project.mytenders.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.*;

@Controller
@CrossOrigin
public class LoginController {

  @Autowired
  @Qualifier("authenticationManager")
  AuthenticationManager authenticationManager;
  @Autowired
  UserRepository userRepository;
  @Autowired
  PasswordEncoder encoder;
  @Autowired
  JwtUtil jwtUtils;
  @Autowired
  UserServiceImpl userService;

  @PostMapping(value = "/login")
  public ResponseEntity<AuthResponse> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    authRequest.getUsername(),
                    authRequest.getPassword()
            )
    );


    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    User user = userService.getUserByUsername(authRequest.getUsername());

    return ResponseEntity.ok(new AuthResponse(user.getUsername(),
            user.getName(),
            user.getSurname(),
            user.getRole().toString(),
            jwtUtils.generateToken(userDetails.getUsername())));
  }
}
