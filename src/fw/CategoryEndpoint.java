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

@Api(name = "categoryendpoint", namespace = @ApiNamespace(ownerDomain = "mycompany.com", ownerName = "mycompany.com", packagePath = "services"))
public class CategoryEndpoint {

	/**
	 * This method lists all the entities inserted in datastore. It uses HTTP
	 * GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 *         persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listCategory")
	public CollectionResponse<Category> listCategory(@Nullable @Named("cursor") String cursorString, @Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Category> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Category.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Category>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and
			// accomodate
			// for lazy fetch.
			for (Category obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Category> builder().setItems(execute).setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET
	 * method.
	 *
	 * @param id
	 *            the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getCategory")
	public Category getCategory(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Category category = null;
		try {
			category = mgr.getObjectById(Category.class, id);
		} finally {
			mgr.close();
		}
		return category;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity
	 * already exists in the datastore, an exception is thrown. It uses HTTP
	 * POST method.
	 *
	 * @param category
	 *            the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertCategory")
	public Category insertCategory(Category category) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (category.getId() != null && containsCategory(category)) {
				throw new EntityExistsException("Object already exists");
			}
			if (category.getParentCategory() != null && category.getParentCategory().getId() != null) {
				try {
					Category parentCategory = mgr.getObjectById(Category.class, category.getParentCategory().getId().getId());
					category.setParentCategory(parentCategory);
				} catch (javax.jdo.JDOObjectNotFoundException ex) {
					throw new EntityNotFoundException("Parent category was not found - Please add parent category first");
				}
			}
			mgr.makePersistent(category);
		} finally {
			mgr.close();
		}
		return category;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does
	 * not exist in the datastore, an exception is thrown. It uses HTTP PUT
	 * method.
	 *
	 * @param category
	 *            the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateCategory")
	public Category updateCategory(Category category) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsCategory(category)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			// bug in GAE - NullPointer when namespace=null
			category.setId(KeyFactory.createKey(Category.class.getSimpleName(), category.getId().getId()));
			mgr.makePersistent(category);
		} finally {
			mgr.close();
		}
		return category;
	}

	/**
	 * This method removes the entity with primary key id. It uses HTTP DELETE
	 * method.
	 *
	 * @param id
	 *            the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeCategory")
	public void removeCategory(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Category category = mgr.getObjectById(Category.class, id);
			mgr.deletePersistent(category);
		} finally {
			mgr.close();
		}
	}

	private boolean containsCategory(Category category) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Category.class, category.getId().getId());
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
