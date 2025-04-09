package cherniaievoa.project.mytenders.entity;

import cherniaievoa.project.mytenders.enums.Status;
import jakarta.persistence.*;



import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "projects")
public class Project {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name")
  private String name;

  @Column(name = "numberOfProject")
  private String numberOfProject;

  @Column(name = "date")
  private LocalDate date;

  @Column(name = "additional_information")
  private String additionalInformation;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  private Status status;

  @Column(name = "participate")
  private boolean participate;

  @ManyToMany
  @JoinTable(
          name = "users_to_project",
          joinColumns = @JoinColumn(name = "project_id"),
          inverseJoinColumns = @JoinColumn(name = "user_id")
  )
  private Set<User> users;

  @Transient
  private Set<FileDocument> documents;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getNumberOfProject() {
    return numberOfProject;
  }

  public void setNumberOfProject(String numberOfProject) {
    this.numberOfProject = numberOfProject;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public String getAdditionalInformation() {
    return additionalInformation;
  }

  public void setAdditionalInformation(String additionalInformation) {
    this.additionalInformation = additionalInformation;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public boolean isParticipate() {
    return participate;
  }

  public void setParticipate(boolean participate) {
    this.participate = participate;
  }

  public Set<User> getUsers() {
    return users;
  }

  public void setUsers(Set<User> users) {
    this.users = users;
  }

  public Set<FileDocument> getDocuments() {
    return documents;
  }

  public void setDocuments(Set<FileDocument> documents) {
    this.documents = documents;
  }

  public void addUser(User user) {
    this.users.add(user);
  }

  public void removeUser(User user) {
    this.users.remove(user);
  }
  @Override
  public String toString() {
    return "Project{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", numberOfProject='" + numberOfProject + '\'' +
            ", date=" + date +
            ", additionalInformation='" + additionalInformation + '\'' +
            ", status=" + status +
            ", participate=" + participate +
            ", users=" + users +
            ", documents=" + documents +
            '}';
  }
}

