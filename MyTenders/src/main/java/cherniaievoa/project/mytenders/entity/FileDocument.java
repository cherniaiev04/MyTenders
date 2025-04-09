package cherniaievoa.project.mytenders.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.Binary;
import java.time.LocalDate;

@Document(collection = "files")
public class FileDocument {

  @Id
  private String id;

  private String projectId;
  private String name;
  private String type;
  private LocalDate uploadDate;
  private Binary content;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getProjectId() {
    return projectId;
  }

  public void setProjectId(String projectId) {
    this.projectId = projectId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public LocalDate getUploadDate() {
    return uploadDate;
  }

  public void setUploadDate(LocalDate uploadDate) {
    this.uploadDate = uploadDate;
  }

  public Binary getContent() {
    return content;
  }

  public void setContent(Binary content) {
    this.content = content;
  }

  @Override
  public String toString() {
    return "FileDocument{" +
            "id='" + id + '\'' +
            ", projectId='" + projectId + '\'' +
            ", name='" + name + '\'' +
            ", type='" + type + '\'' +
            ", uploadDate=" + uploadDate +
            ", content=" + content +
            '}';
  }
}

