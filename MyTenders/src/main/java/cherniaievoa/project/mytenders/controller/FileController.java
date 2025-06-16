package cherniaievoa.project.mytenders.controller;

import cherniaievoa.project.mytenders.service.FileService;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
public class FileController {

  @Autowired
  private FileService fileService;

  @PostMapping("/upload")
  public ResponseEntity<String> upload(
          @RequestParam("file") MultipartFile file,
          @RequestParam("projectId") String projectId) {
    try {
      String id = fileService.uploadFile(file, projectId);
      return ResponseEntity.ok(id);
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при загрузке");
    }
  }

  @GetMapping("/download/{id}")
  public ResponseEntity<?> download(@PathVariable String id) {
    try {
      InputStream fileStream = fileService.downloadFile(id);
      if (fileStream == null) return ResponseEntity.notFound().build();

      GridFSFile file = fileService.getFile(id);
      String filename = file.getFilename();
      String contentType = file.getMetadata().get("contentType").toString();

      return ResponseEntity.ok()
              .contentType(MediaType.parseMediaType(contentType))
              .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
              .body(new InputStreamResource(fileStream));
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при скачивании");
    }
  }

  @GetMapping("/project/{projectId}")
  public ResponseEntity<List<Map<String, Object>>> getFilesByProject(@PathVariable String projectId) {
    List<GridFSFile> files = fileService.getFilesByProjectId(projectId);
    List<Map<String, Object>> result = files.stream()
            .map(file -> {
              Map<String, Object> map = new HashMap<>();
              map.put("id", file.getObjectId().toHexString()); // 👈 здесь мы явно кладем id
              map.put("filename", file.getFilename());
              return map;
            })
            .collect(Collectors.toList());

    return ResponseEntity.ok(result);
  }


  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable String id) {
    try {
      fileService.deleteFile(id);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при удалении");
    }
  }

}
