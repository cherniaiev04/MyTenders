package cherniaievoa.project.mytenders.controller;

import cherniaievoa.project.mytenders.entity.Material;
import cherniaievoa.project.mytenders.entity.MaterialsForProject;
import cherniaievoa.project.mytenders.entity.Project;
import cherniaievoa.project.mytenders.entity.User;
import cherniaievoa.project.mytenders.enums.Role;
import cherniaievoa.project.mytenders.service.*;
import cherniaievoa.project.mytenders.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Controller
@CrossOrigin
@RequestMapping("/projects")
public class ProjectController {

  private final ProjectServiceImpl projectService;
  private final MaterialsForProjectServiceImpl materialsForProjectService;
  private final MaterialServiceImpl materialsService;
  private final UserServiceImpl userService;

  @Autowired
  public ProjectController(ProjectServiceImpl projectService,
                           MaterialsForProjectServiceImpl materialsForProjectService,
                           MaterialServiceImpl materialsService,
                           UserServiceImpl userService) {
    this.projectService = projectService;
    this.materialsForProjectService = materialsForProjectService;
    this.materialsService = materialsService;
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<List<Project>> getAllProjects(HttpServletRequest request) {
    String username = (String) request.getAttribute("username");
    User user = userService.getUserByUsername(username);
    List<Project> listOfProjects = user.getProjects().stream().toList();
    listOfProjects.forEach(project -> project.setUsers(null));
    return ResponseEntity.ok(listOfProjects);
  }

  @GetMapping("/user/{username}")
  public ResponseEntity<List<Project>> getAllProjectsByUserId(@PathVariable String username) {
    User user = userService.getUserByUsername(username);
    List<Project> listOfProjects = user.getProjects().stream().toList();
    listOfProjects.forEach(project -> project.setUsers(null));
    return ResponseEntity.ok(listOfProjects);
  }
  @PostMapping("/add")
  public ResponseEntity<Project> add(@RequestBody Project project) {
    List<User> users = userService.getUsersByRole(Role.DIRECTOR);
    users.addAll(userService.getUsersByRole(Role.MANAGER));
    project.setUsers(Set.copyOf(users));
    Project newProject = projectService.saveProject(project);
    return ResponseEntity.ok(newProject);
  }

  //  @GetMapping("fromWebsite/{id}")
//  public ResponseEntity<Project> getProjectFromWebsite(@PathVariable String id) throws IOException {
//   return ResponseEntity.ok(fetchProjectInfoByNumber(id));
//  }
  @GetMapping("/{id}")
  public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
    Project project = projectService.getProjectById(id);
    project.getUsers().forEach(user -> {
      user.setProjects(null);
    });
    return ResponseEntity.of(Optional.of(project));
  }

  @GetMapping("/{id}/materials")
  public ResponseEntity<List<MaterialsForProject>> getMaterialsByProjectId(@PathVariable Long id) {
    List<MaterialsForProject> materials = materialsForProjectService.getMaterialsByProjectID(id);
    materials.forEach(materialsForProject -> materialsForProject.setProject(null));
    return ResponseEntity.of(Optional.of(materials));
  }

  @PutMapping("/{id}/update")
  public ResponseEntity update(@PathVariable Long id, @RequestBody Project project) {
    if (!id.equals(project.getId())) {
      return new ResponseEntity<>(
              "mismatching Ids in path and in object",
              HttpStatus.BAD_REQUEST
      );
    }

    if (!projectService.existedById(id)) {
      return ResponseEntity.notFound().build();
    }

    Project updatedProject = projectService.updateProject(project);
    return ResponseEntity.ok(updatedProject);
  }

  @DeleteMapping("/{id}/delete")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    if (!projectService.existedById(id))
      return ResponseEntity.notFound().build();

    projectService.deleteProjectById(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{id}/addUser")
  public ResponseEntity<Project> addUserToProject(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
    Project updatedproject = projectService.getProjectById(id);
    User userToAdd = userService.getUserById(payload.get("userId"));
    updatedproject.addUser(userToAdd);
    projectService.updateProject(updatedproject);

    return ResponseEntity.ok(updatedproject);
  }

  @GetMapping("/{id}/users")
  public ResponseEntity<List<User>> getAllUsers(@PathVariable Long id) {
    Project project = projectService.getProjectById(id);
    List<User> users = userService.getAllUsers();
    users.removeAll(project.getUsers());
    users.forEach(u -> u.setProjects(null));
    return ResponseEntity.ok(users);
  }

  @PostMapping("/{id}/deleteUser/{userId}")
  public ResponseEntity<Project> deleteUserFromProject(@PathVariable Long id, @PathVariable Long userId) {
    Project updatedProject = projectService.getProjectById(id);
    User userToDelete = userService.getUserById(userId);
    updatedProject.removeUser(userToDelete);
    projectService.updateProject(updatedProject);

    return ResponseEntity.ok(updatedProject);
  }

  @PostMapping("/{id}/addMaterial")
  public ResponseEntity<MaterialsForProject> addMaterialToProject(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
   Material material = materialsService.getMaterialById(payload.get("materialId"));
   List<MaterialsForProject> materials = materialsForProjectService.getMaterialsByProjectID(id);

   int index = -1;
   for(int i = 0; i < materials.size(); i++) {
     if(materials.get(i).getMaterial().equals(material)) {
       index = i;
       break;
     }
   }

   if(index == -1) {
     MaterialsForProject newMaterial = new MaterialsForProject();
     newMaterial.setMaterial(material);
     newMaterial.setAmount(Math.toIntExact(payload.get("amount")));
     newMaterial.setProject(projectService.getProjectById(id));
     materialsForProjectService.save(newMaterial);

     material.setAmount(material.getAmount() - Math.toIntExact(payload.get("amount")));
     materialsService.updateMaterial(material);
     return ResponseEntity.ok(newMaterial);
   } else {
     MaterialsForProject updatedMaterial = materials.get(index);
     updatedMaterial.setAmount(updatedMaterial.getAmount() + Math.toIntExact(payload.get("amount")));
     materialsForProjectService.update(updatedMaterial);

     material.setAmount(material.getAmount() - Math.toIntExact(payload.get("amount")));
     materialsService.updateMaterial(material);
     return ResponseEntity.ok(updatedMaterial);
   }
  }

  @PostMapping("/{id}/deleteMaterial/{materialid}")
  public ResponseEntity<MaterialsForProject> deleteMaterialFromProject(@PathVariable Long id, @PathVariable Long materialid) {
    List<MaterialsForProject> materials = materialsForProjectService.getMaterialsByProjectID(id);
    Long deleteID = materials.stream().filter(m -> m.getMaterial().getId() == materialid).findFirst().orElse(null).getId();
    MaterialsForProject materialsForProjectToDelete = materialsForProjectService.getMaterialsByProject(deleteID);
    materialsForProjectService.deleteMaterialsForProjectById(deleteID);

    Material updatedMaterial = materialsService.getMaterialById(materialid);
    updatedMaterial.setAmount(updatedMaterial.getAmount() + materialsForProjectToDelete.getAmount());
    materialsService.updateMaterial(updatedMaterial);

    return ResponseEntity.ok(materialsForProjectToDelete);
  }

  @PutMapping("/{id}/changeAmount/{materialid}")
  public ResponseEntity changeAmount(@PathVariable Long id, @PathVariable Long materialid, @RequestBody Integer amount) {
    List<MaterialsForProject> materials = materialsForProjectService.getMaterialsByProjectID(id);
    Long changeID = materials.stream().filter(m -> m.getMaterial().getId() == materialid).findFirst().orElse(null).getId();
    MaterialsForProject materialsForProjectToChange = materialsForProjectService.getMaterialsByProject(changeID);
    if(materialsForProjectToChange.getAmount() + amount == 0 ) {
      materialsForProjectService.deleteMaterialsForProjectById(materialsForProjectToChange.getId());
    } else {
      materialsForProjectToChange.setAmount(amount);
      materialsForProjectService.update(materialsForProjectToChange);
      Material updatedMaterial = materialsService.getMaterialById(materialid);
      updatedMaterial.setAmount(Math.toIntExact(amount));
      materialsService.updateMaterial(updatedMaterial);
    }
    return ResponseEntity.ok(materialsForProjectToChange);
  }
}
