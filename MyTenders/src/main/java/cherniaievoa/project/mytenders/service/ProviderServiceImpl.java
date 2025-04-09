package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.Provider;
import cherniaievoa.project.mytenders.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProviderServiceImpl implements ProviderService {

  private ProviderRepository providerRepository;
  @Autowired
  public ProviderServiceImpl(ProviderRepository providerRepository) {
    this.providerRepository = providerRepository;
  }
  @Override
  public List<Provider> getAllProviders() {
    return providerRepository.findAll();
  }

  @Override
  public Provider getProviderById(Long providerId) {
    return providerRepository.findById(providerId).orElse(null);
  }

  @Override
  public Provider saveProvider(Provider provider) {
    return providerRepository.save(provider);
  }

  @Override
  public Provider updateProvider(Provider provider) {
    Optional<Provider> existingProvider = providerRepository.findById(provider.getId());

    if(existingProvider.isPresent()) {
      Provider updatedProvider = existingProvider.get();

      updatedProvider.setName(provider.getName());
      updatedProvider.setSurname(provider.getSurname());
      updatedProvider.setPhone(provider.getPhone());
      updatedProvider.setEmail(provider.getEmail());
      updatedProvider.setCompanyName(provider.getCompanyName());

      return providerRepository.save(updatedProvider);
    }
    return null;
  }

  @Override
  public Boolean existedById(Long providerId) {
    return providerRepository.existsById(providerId);
  }

  @Override
  public void deleteProviderById(Long providerId) {
    providerRepository.deleteById(providerId);
  }
}
