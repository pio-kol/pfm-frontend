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

@Api(name = "accountendpoint", namespace = @ApiNamespace(ownerDomain = "mycompany.com", ownerName = "mycompany.com", packagePath="services"))
public class AccountEndpoint {

  /**
   * This method lists all the entities inserted in datastore.
   * It uses HTTP GET method and paging support.
   *
   * @return A CollectionResponse class containing the list of all entities
   * persisted and a cursor to the next page.
   */
  @SuppressWarnings({"unchecked", "unused"})
  @ApiMethod(name = "listAccount")
  public CollectionResponse<Account> listAccount(
    @Nullable @Named("cursor") String cursorString,
    @Nullable @Named("limit") Integer limit) {

    PersistenceManager mgr = null;
    Cursor cursor = null;
    List<Account> execute = null;

    try{
      mgr = getPersistenceManager();
      Query query = mgr.newQuery(Account.class);
      if (cursorString != null && cursorString != "") {
        cursor = Cursor.fromWebSafeString(cursorString);
        HashMap<String, Object> extensionMap = new HashMap<String, Object>();
        extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
        query.setExtensions(extensionMap);
      }

      if (limit != null) {
        query.setRange(0, limit);
      }

      execute = (List<Account>) query.execute();
      cursor = JDOCursorHelper.getCursor(execute);
      if (cursor != null) cursorString = cursor.toWebSafeString();

      // Tight loop for fetching all entities from datastore and accomodate
      // for lazy fetch.
      for (Account obj : execute);
    } finally {
      mgr.close();
    }

    return CollectionResponse.<Account>builder()
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
  @ApiMethod(name = "getAccount")
  public Account getAccount(@Named("id") Long id) {
    PersistenceManager mgr = getPersistenceManager();
    Account account  = null;
    try {
      account = mgr.getObjectById(Account.class, id);
    } finally {
      mgr.close();
    }
    return account;
  }

  /**
   * This inserts a new entity into App Engine datastore. If the entity already
   * exists in the datastore, an exception is thrown.
   * It uses HTTP POST method.
   *
   * @param account the entity to be inserted.
   * @return The inserted entity.
   */
  @ApiMethod(name = "insertAccount")
  public Account insertAccount(Account account) {
    PersistenceManager mgr = getPersistenceManager();
    try {
      if(account.getId() != null && containsAccount(account)) {
        throw new EntityExistsException("Object already exists");
      }
      mgr.makePersistent(account);
    } finally {
      mgr.close();
    }
    return account;
  }

  /**
   * This method is used for updating an existing entity. If the entity does not
   * exist in the datastore, an exception is thrown.
   * It uses HTTP PUT method.
   *
   * @param account the entity to be updated.
   * @return The updated entity.
   */
  @ApiMethod(name = "updateAccount")
  public Account updateAccount(Account account) {
    PersistenceManager mgr = getPersistenceManager();
    try {
      if(!containsAccount(account)) {
        throw new EntityNotFoundException("Object does not exist");
      }
      mgr.makePersistent(account);
    } finally {
      mgr.close();
    }
    return account;
  }

  /**
   * This method removes the entity with primary key id.
   * It uses HTTP DELETE method.
   *
   * @param id the primary key of the entity to be deleted.
   */
  @ApiMethod(name = "removeAccount")
  public void removeAccount(@Named("id") Long id) {
    PersistenceManager mgr = getPersistenceManager();
    try {
      Account account = mgr.getObjectById(Account.class, id);
      mgr.deletePersistent(account);
    } finally {
      mgr.close();
    }
  }

  private boolean containsAccount(Account account) {
    PersistenceManager mgr = getPersistenceManager();
    boolean contains = true;
    try {
      mgr.getObjectById(Account.class, account.getId());
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
