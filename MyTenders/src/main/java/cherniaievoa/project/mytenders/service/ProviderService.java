package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.Provider;

import java.util.List;

public interface ProviderService {

  List<Provider> getAllProviders();
  Provider getProviderById(Long providerId);
  Provider saveProvider(Provider provider);
  Provider updateProvider(Provider provider);
  Boolean existedById(Long providerId);
  void deleteProviderById(Long providerId);

}
