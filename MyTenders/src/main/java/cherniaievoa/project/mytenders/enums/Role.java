package cherniaievoa.project.mytenders.enums;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {

  DIRECTOR,
  MANAGER,
  STAFF;

  @Override
  public String getAuthority() {
    return this.name();
  }
}
