package fw.account;

import java.util.Date;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable
public class AccountOperation {

	@Persistent
	private Date timestamp = new Date();
	
	@Persistent
	private Long state;

	public AccountOperation(Long state) {
		this.state = state;
	}
	
	public Date getTimestamp() {
		return timestamp;
	}

	public Long getState() {
		return state;
	}

	

}
