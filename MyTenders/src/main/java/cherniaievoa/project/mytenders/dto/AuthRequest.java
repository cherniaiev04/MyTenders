package cherniaievoa.project.mytenders.dto;

public class AuthRequest {

  String username;
  String password;

  public AuthRequest(String username, String password) {
    this.username = username;
    this.password = password;
  }

  public AuthRequest(){}

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
