package cherniaievoa.project.mytenders.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "materials_for_project")
public class MaterialsForProject {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "material_id", nullable = false)
  private Material material;

  @Column(name = "amount", nullable = false)
  private Integer amount;

  @ManyToOne
  @JoinColumn(name = "project_id", nullable = false)
  private Project project;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Material getMaterial() {
    return material;
  }

  public void setMaterial(Material material) {
    this.material = material;
  }

  public Integer getAmount() {
    return amount;
  }

  public void setAmount(Integer amount) {
    this.amount = amount;
  }

  public Project getProject() {
    return project;
  }

  public void setProject(Project project) {
    this.project = project;
  }

  @Override
  public String toString() {
    return "MaterialsForProject{" +
            "id=" + id +
            ", material=" + material +
            ", amount=" + amount +
            ", project=" + project +
            '}';
  }

  // Getters and setters
}

