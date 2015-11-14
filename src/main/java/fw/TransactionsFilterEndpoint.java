package fw;

import fw.PMF;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "transactionsfilterendpoint", namespace = @ApiNamespace(ownerDomain = "mycompany.com", ownerName = "mycompany.com", packagePath="services"))
public class TransactionsFilterEndpoint {

  /**
   * This method lists all the entities inserted in datastore.
   * It uses HTTP GET method and paging support.
   *
   * @return A CollectionResponse class containing the list of all entities
   * persisted and a cursor to the next page.
   */
  @SuppressWarnings({"unchecked", "unused"})
  @ApiMethod(name = "listTransactionsFilter")
  public CollectionResponse<TransactionsFilter> listTransactionsFilter(
    @Nullable @Named("cursor") String cursorString,
    @Nullable @Named("limit") Integer limit) {

    PersistenceManager mgr = null;
    Cursor cursor = null;
    List<TransactionsFilter> execute = null;

    try{
      mgr = getPersistenceManager();
      Query query = mgr.newQuery(TransactionsFilter.class);
      if (cursorString != null && cursorString != "") {
        cursor = Cursor.fromWebSafeString(cursorString);
        HashMap<String, Object> extensionMap = new HashMap<String, Object>();
        extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
        query.setExtensions(extensionMap);
      }

      if (limit != null) {
        query.setRange(0, limit);
      }

      execute = (List<TransactionsFilter>) query.execute();
      cursor = JDOCursorHelper.getCursor(execute);
      if (cursor != null) cursorString = cursor.toWebSafeString();

      // Tight loop for fetching all entities from datastore and accomodate
      // for lazy fetch.
      for (TransactionsFilter obj : execute);
    } finally {
      mgr.close();
    }

    return CollectionResponse.<TransactionsFilter>builder()
      .setItems(execute)
      .setNextPageToken(cursorString)
      .build();
  }

  /**
   * This method gets the entity having primary key id. It uses HTTP GET method.
   *
   * @param id the primary key of the java bean.
   * @return The entity with primary key id.
   */
  @ApiMethod(name = "getTransactionsFilter")
  public TransactionsFilter getTransactionsFilter(@Named("id") Long id) {
    PersistenceManager mgr = getPersistenceManager();
    TransactionsFilter transactionsfilter  = null;
    try {
      transactionsfilter = mgr.getObjectById(TransactionsFilter.class, id);
    } finally {
      mgr.close();
    }
    return transactionsfilter;
  }

  /**
   * This inserts a new entity into App Engine datastore. If the entity already
   * exists in the datastore, an exception is thrown.
   * It uses HTTP POST method.
   *
   * @param transactionsfilter the entity to be inserted.
   * @return The inserted entity.
   */
  @ApiMethod(name = "insertTransactionsFilter")
  public TransactionsFilter insertTransactionsFilter(TransactionsFilter transactionsfilter) {
    PersistenceManager mgr = getPersistenceManager();
    try {
      if(transactionsfilter.getId() != null && containsTransactionsFilter(transactionsfilter)) {
        throw new EntityExistsException("Object already exists");
      }
      mgr.makePersistent(transactionsfilter);
    } finally {
      mgr.close();
    }
    return transactionsfilter;
  }

  /**
   * This method is used for updating an existing entity. If the entity does not
   * exist in the datastore, an exception is thrown.
   * It uses HTTP PUT method.
   *
   * @param transactionsfilter the entity to be updated.
   * @return The updated entity.
   */
  @ApiMethod(name = "updateTransactionsFilter")
  public TransactionsFilter updateTransactionsFilter(TransactionsFilter transactionsfilter) {
    PersistenceManager mgr = getPersistenceManager();
    try {
      if(!containsTransactionsFilter(transactionsfilter)) {
        throw new EntityNotFoundException("Object does not exist");
      }
      mgr.makePersistent(transactionsfilter);
    } finally {
      mgr.close();
    }
    return transactionsfilter;
  }

  /**
   * This method removes the entity with primary key id.
   * It uses HTTP DELETE method.
   *
   * @param id the primary key of the entity to be deleted.
   */
  @ApiMethod(name = "removeTransactionsFilter")
  public void removeTransactionsFilter(@Named("id") Long id) {
    PersistenceManager mgr = getPersistenceManager();
    try {
      TransactionsFilter transactionsfilter = mgr.getObjectById(TransactionsFilter.class, id);
      mgr.deletePersistent(transactionsfilter);
    } finally {
      mgr.close();
    }
  }

  private boolean containsTransactionsFilter(TransactionsFilter transactionsfilter) {
    PersistenceManager mgr = getPersistenceManager();
    boolean contains = true;
    try {
      mgr.getObjectById(TransactionsFilter.class, transactionsfilter.getId());
    } catch (javax.jdo.JDOObjectNotFoundException ex) {
      contains = false;
    } finally {
      mgr.close();
    }
    return contains;
  }

  private static PersistenceManager getPersistenceManager() {
    return PMF.get().getPersistenceManager();
  }

}
