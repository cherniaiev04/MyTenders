package cherniaievoa.project.mytenders.dto;

import java.time.LocalDate;

public class OrderDto {
  private Long providerId;
  private Integer quantity;
  private Double price;
  private LocalDate date;

  public OrderDto(Long providerId, Integer quantity, Double price, LocalDate date) {
    this.providerId = providerId;
    this.quantity = quantity;
    this.price = price;
    this.date = date;
  }

  public OrderDto() {}
  public Long getProviderId() {
    return providerId;
  }

  public void setProviderId(Long providerId) {
    this.providerId = providerId;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }

  public Double getPrice() {
    return price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }
}
