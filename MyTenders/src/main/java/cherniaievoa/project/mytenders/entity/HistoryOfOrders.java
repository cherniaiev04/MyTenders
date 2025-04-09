package cherniaievoa.project.mytenders.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "history_of_orders")
public class HistoryOfOrders {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "material_id", nullable = false)
  private Material material;

  @ManyToOne
  @JoinColumn(name = "provider_id", nullable = false)
  private Provider provider;

  @Column(name = "date")
  private LocalDate date;

  @Column(name = "amount")
  private Integer amount;

  @Column(name = "price")
  private Double price;

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

  public Provider getProvider() {
    return provider;
  }

  public void setProvider(Provider provider) {
    this.provider = provider;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public Integer getAmount() {
    return amount;
  }

  public void setAmount(Integer amount) {
    this.amount = amount;
  }

  public Double getPrice() {
    return price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }

  @Override
  public String toString() {
    return "HistoryOfOrders{" +
            "id=" + id +
            ", material=" + material +
            ", provider=" + provider +
            ", date=" + date +
            ", amount=" + amount +
            ", price=" + price +
            '}';
  }

  // Getters and setters
}

