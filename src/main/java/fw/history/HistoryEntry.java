package fw.history;

import java.util.Date;

import javax.jdo.annotations.PersistenceCapable;

@PersistenceCapable
public class HistoryEntry {

	private Date timestamp = new Date();
	private String entry;

	public HistoryEntry(String entry) {
		this.entry = entry;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public String getEntry() {
		return entry;
	}
}
