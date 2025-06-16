package cherniaievoa.project.mytenders.service;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileService {

  private final GridFsTemplate gridFsTemplate;
  private final GridFsOperations gridFsOperations;

  @Autowired
  public FileService(GridFsTemplate gridFsTemplate, GridFsOperations gridFsOperations) {
    this.gridFsTemplate = gridFsTemplate;
    this.gridFsOperations = gridFsOperations;
  }

  public String uploadFile(MultipartFile file, String projectId) throws IOException {
    DBObject metaData = new BasicDBObject();
    metaData.put("contentType", file.getContentType());
    metaData.put("projectId", projectId);

    ObjectId id = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), metaData);
    return id.toHexString();
  }

  public GridFSFile getFile(String id) {
    if (!ObjectId.isValid(id)) {
      throw new IllegalArgumentException("Invalid ObjectId: " + id);
    }
    return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(id))));
  }


  public InputStream downloadFile(String id) throws IOException {
    GridFSFile file = getFile(id);
    if (file == null) return null;
    GridFsResource resource = gridFsOperations.getResource(file);
    return resource.getInputStream();
  }

  public List<GridFSFile> getFilesByProjectId(String projectId) {
    Query query = new Query(Criteria.where("metadata.projectId").is(projectId));
    return gridFsTemplate.find(query).into(new ArrayList<>());
  }

  public void deleteFile(String id) {
    gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(id))));
  }


}
