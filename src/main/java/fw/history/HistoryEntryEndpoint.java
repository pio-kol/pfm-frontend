package fw.history;

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
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "historyentryendpoint", namespace = @ApiNamespace(ownerDomain = "history.fw", ownerName = "history.fw", packagePath = "") )
public class HistoryEntryEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listHistoryEntry")
	public CollectionResponse<HistoryEntry> listHistoryEntry(@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<HistoryEntry> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(HistoryEntry.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<HistoryEntry>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (HistoryEntry obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<HistoryEntry> builder().setItems(execute).setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getHistoryEntry")
	public HistoryEntry getHistoryEntry(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		HistoryEntry historyentry = null;
		try {
			historyentry = mgr.getObjectById(HistoryEntry.class, id);
		} finally {
			mgr.close();
		}
		return historyentry;
	}
	
	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}
