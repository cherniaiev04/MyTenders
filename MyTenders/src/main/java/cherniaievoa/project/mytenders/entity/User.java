package cherniaievoa.project.mytenders.entity;

import cherniaievoa.project.mytenders.enums.Role;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "username")
  private String username;

  @Column(name = "password")
  private String password;

  @Column(name = "name")
  private String name;

  @Column(name = "surname")
  private String surname;

  @Column(name = "position")
  private String position;

  @Enumerated(EnumType.STRING)
  @Column(name = "role")
  private Role role;

  @ManyToMany(mappedBy = "users")
  private Set<Project> projects;

  public User(String username, String password, String name, String surname, String position, Role role) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.position = position;
    this.role = role;
  }

  public User() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSurname() {
    return surname;
  }

  public void setSurname(String surname) {
    this.surname = surname;
  }

  public String getPosition() {
    return position;
  }

  public void setPosition(String position) {
    this.position = position;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public Set<Project> getProjects() {
    return projects;
  }

  public void setProjects(Set<Project> projects) {
    this.projects = projects;
  }

  @Override
  public String toString() {
    return "User{" +
            "id=" + id +
            ", username='" + username + '\'' +
            ", password='" + password + '\'' +
            ", name='" + name + '\'' +
            ", surname='" + surname + '\'' +
            ", position='" + position + '\'' +
            ", role='" + role + '\'' +
            ", projects=" + projects +
            '}';
  }

  // Getters and setters
}

