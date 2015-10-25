package fw;

import fw.PMF;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "entryendpoint", namespace = @ApiNamespace(ownerDomain = "mycompany.com", ownerName = "mycompany.com", packagePath = "services"))
public class EntryEndpoint {

	/**
	 * This method lists all the entities inserted in datastore. It uses HTTP
	 * GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 *         persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listEntry")
	public CollectionResponse<Entry> listEntry(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Entry> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Entry.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Entry>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and
			// accomodate
			// for lazy fetch.
			for (Entry obj : execute)
				System.out.println(obj);
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Entry> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET
	 * method.
	 *
	 * @param id
	 *            the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getEntry")
	public Entry getEntry(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Entry entry = null;
		try {
			entry = mgr.getObjectById(Entry.class, id);
		} finally {
			mgr.close();
		}
		return entry;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity
	 * already exists in the datastore, an exception is thrown. It uses HTTP
	 * POST method.
	 *
	 * @param entry
	 *            the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertEntry")
	public Entry insertEntry(Entry entry) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (entry.getId() != null && containsEntry(entry)) {
				throw new EntityExistsException("Object already exists");
			}
			if (entry.getCategory() != null
					&& entry.getCategory().getId() != null) {
				try {
					Category category = mgr.getObjectById(Category.class, entry
							.getCategory().getId().getId());
					entry.setCategory(category);
				} catch (javax.jdo.JDOObjectNotFoundException ex) {
					throw new EntityNotFoundException(
							"Category was not found - Please add category first");
				}
			}
			if (entry.getAccount() != null
					&& entry.getAccount().getId() != null) {
				try {
					Account account = mgr.getObjectById(Account.class, entry
							.getAccount().getId().getId());
					entry.setAccount(account);
				} catch (javax.jdo.JDOObjectNotFoundException ex) {
					throw new EntityNotFoundException(
							"Account was not found - Please add account first");
				}
			}

			mgr.makePersistent(entry);
		} finally {
			mgr.close();
		}
		return entry;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does
	 * not exist in the datastore, an exception is thrown. It uses HTTP PUT
	 * method.
	 *
	 * @param entry
	 *            the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateEntry")
	public Entry updateEntry(Entry entry) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsEntry(entry)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			// bug in GAE - NullPointer when namespace=null
			entry.setId(KeyFactory.createKey(Entry.class.getSimpleName(), entry.getId().getId()));
			mgr.makePersistent(entry);
		} finally {
			mgr.close();
		}
		return entry;
	}

	/**
	 * This method removes the entity with primary key id. It uses HTTP DELETE
	 * method.
	 *
	 * @param id
	 *            the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeEntry")
	public void removeEntry(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Entry entry = mgr.getObjectById(Entry.class, id);
			mgr.deletePersistent(entry);
		} finally {
			mgr.close();
		}
	}

	private boolean containsEntry(Entry entry) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Entry.class, entry.getId().getId());
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
