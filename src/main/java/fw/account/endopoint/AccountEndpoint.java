package fw.account.endopoint;

import fw.PMF;
import fw.account.Account;
import fw.account.AccountOperation;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "accountendpoint", namespace = @ApiNamespace(ownerDomain = "mycompany.com", ownerName = "mycompany.com", packagePath = "services") )
public class AccountEndpoint {

	/**
	 * This method lists all the entities inserted in datastore. It uses HTTP
	 * GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 *         persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked" })
	@ApiMethod(name = "listAccount")
	public CollectionResponse<Account> listAccount(@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Account> execute = null;

		try {
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
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

		} finally {
			mgr.close();
		}

		List<Account> accounts = new ArrayList<>();
		for (Account account : execute) {
			if (account.getDeleteDate() == null) {
				accounts.add(account);
			}
		}

		return CollectionResponse.<Account> builder().setItems(accounts).setNextPageToken(cursorString).build();
	}
	
	/**
	 * This method gets the entity having primary key id. It uses HTTP GET
	 * method.
	 *
	 * @param id
	 *            the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getAccount")
	public Account getAccount(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Account account = null;
		try {
			account = mgr.getObjectById(Account.class, id);
			for (AccountOperation entry : account.getHistory()){
				System.out.println(entry.getTimestamp() + " " + entry.getState());
			};
		} finally {
			mgr.close();
		}
		return account;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity
	 * already exists in the datastore, an exception is thrown. It uses HTTP
	 * POST method.
	 *
	 * @param account
	 *            the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertAccount")
	public Account insertAccount(Account account) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (account.getId() != null && containsAccount(account)) {
				throw new EntityExistsException("Object already exists");
			}

			AccountOperation operation = new AccountOperation(account.getState());
//			operation.setNewName(account.getName());
//			operation.setNewState(account.getState());
			account.getHistory().add(operation);

			mgr.makePersistent(account);
		} finally {
			mgr.close();
		}
		return account;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does
	 * not exist in the datastore, an exception is thrown. It uses HTTP PUT
	 * method.
	 *
	 * @param account
	 *            the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateAccount")
	public Account updateAccount(Account account) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Account stateInDB = mgr.getObjectById(Account.class, account.getId().getId());

			// bug in GAE - NullPointer when namespace=null
			account.setId(KeyFactory.createKey(Account.class.getSimpleName(), account.getId().getId()));
			
//			AccountOperation operation = new AccountOperation();
//			if (!stateInDB.getName().equals(account.getName())){
//				operation.setPreviousName(stateInDB.getName());
//				operation.setNewName(account.getName());
//			}
//			if (!stateInDB.getState().equals(account.getState())){
//				operation.setPreviousState(stateInDB.getState());
//				operation.setNewState(account.getState());
//			}
//			// to filter out changes when nothing changed
//			if (operation.getNewName() != null || operation.getNewState() != null){
//				account.getHistory().add(operation);
//			}
			AccountOperation operation = new AccountOperation(account.getState());
			account.getHistory().addAll(stateInDB.getHistory());
			account.getHistory().add(operation);
			
			mgr.makePersistent(account);
		} catch (javax.jdo.JDOObjectNotFoundException ex) {
			throw new EntityNotFoundException("Object does not exist");
		} finally {
			mgr.close();
		}
		return account;
	}

	/**
	 * This method removes the entity with primary key id. It uses HTTP DELETE
	 * method.
	 *
	 * @param id
	 *            the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeAccount")
	public void removeAccount(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Account account = mgr.getObjectById(Account.class, id);
			account.markAsDeleted();
			
//			AccountOperation operation = new AccountOperation();
//			operation.setPreviousName(account.getName());
//			operation.setPreviousState(account.getState());
//			account.getHistory().add(operation);
			AccountOperation operation = new AccountOperation(account.getState());
			account.getHistory().add(operation);
			
			mgr.makePersistent(account);
		} finally {
			mgr.close();
		}
	}

	private boolean containsAccount(Account account) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Account.class, account.getId().getId());
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
