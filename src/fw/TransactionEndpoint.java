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

@Api(name = "transactionendpoint", namespace = @ApiNamespace(ownerDomain = "mycompany.com", ownerName = "mycompany.com", packagePath = "services"))
public class TransactionEndpoint {

	/**
	 * This method lists all the entities inserted in datastore. It uses HTTP
	 * GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 *         persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listTransaction")
	public CollectionResponse<Transaction> listTransaction(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Transaction> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Transaction.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Transaction>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and
			// accomodate
			// for lazy fetch.
			for (Transaction obj : execute)
				System.out.println(obj);
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Transaction> builder().setItems(execute)
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
	@ApiMethod(name = "getTransaction")
	public Transaction getTransaction(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Transaction transaction = null;
		try {
			transaction = mgr.getObjectById(Transaction.class, id);
		} finally {
			mgr.close();
		}
		return transaction;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity
	 * already exists in the datastore, an exception is thrown. It uses HTTP
	 * POST method.
	 *
	 * @param transaction
	 *            the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertTransaction")
	public Transaction inserttransaction(Transaction transaction) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (transaction.getId() != null && containsTransaction(transaction)) {
				throw new EntityExistsException("Object already exists");
			}
			if (transaction.getCategory() != null
					&& transaction.getCategory().getId() != null) {
				try {
					Category category = mgr.getObjectById(Category.class, transaction
							.getCategory().getId().getId());
					transaction.setCategory(category);
				} catch (javax.jdo.JDOObjectNotFoundException ex) {
					throw new EntityNotFoundException(
							"Category was not found - Please add category first");
				}
			}
			if (transaction.getAccount() != null
					&& transaction.getAccount().getId() != null) {
				try {
					Account account = mgr.getObjectById(Account.class, transaction
							.getAccount().getId().getId());
					transaction.setAccount(account);
				} catch (javax.jdo.JDOObjectNotFoundException ex) {
					throw new EntityNotFoundException(
							"Account was not found - Please add account first");
				}
			}

			mgr.makePersistent(transaction);
		} finally {
			mgr.close();
		}
		return transaction;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does
	 * not exist in the datastore, an exception is thrown. It uses HTTP PUT
	 * method.
	 *
	 * @param transaction
	 *            the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateTransaction")
	public Transaction updateTransaction(Transaction transaction) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsTransaction(transaction)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			// bug in GAE - NullPointer when namespace=null
			transaction.setId(KeyFactory.createKey(Transaction.class.getSimpleName(), transaction.getId().getId()));
			
			if (transaction.getCategory() != null && transaction.getCategory().getId() != null) {
				Category category = mgr.getObjectById(Category.class, transaction.getCategory().getId().getId());
				transaction.setCategory(category);
			}
			
			if (transaction.getAccount() != null && transaction.getAccount().getId() != null) {
				Account account = mgr.getObjectById(Account.class, transaction.getAccount().getId().getId());
				transaction.setAccount(account);
			}
			
			mgr.makePersistent(transaction);
		} finally {
			mgr.close();
		}
		return transaction;
	}

	/**
	 * This method removes the entity with primary key id. It uses HTTP DELETE
	 * method.
	 *
	 * @param id
	 *            the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeTransaction")
	public void removeTransaction(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Transaction transaction = mgr.getObjectById(Transaction.class, id);
			mgr.deletePersistent(transaction);
		} finally {
			mgr.close();
		}
	}

	private boolean containsTransaction(Transaction transaction) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Transaction.class, transaction.getId().getId());
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