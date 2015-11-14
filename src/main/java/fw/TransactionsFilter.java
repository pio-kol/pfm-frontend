package fw;

import java.util.Date;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class TransactionsFilter {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key id;

	@Persistent
	private Date dateFrom;

	@Persistent
	private Date dateTo;

	@Persistent
	private String description;

	@Persistent
	private String comment;

	@Persistent
	private List<Long> categories;

	@Persistent
	private List<Long> accounts;

	@Persistent
	private Long priceFrom;

	@Persistent
	private Long priceTo;

	@Persistent
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Key getId() {
		return id;
	}

	public void setId(Key id) {
		this.id = id;
	}

	public Date getDateFrom() {
		return dateFrom;
	}

	public void setDateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
	}

	public Date getDateTo() {
		return dateTo;
	}

	public void setDateTo(Date dateTo) {
		this.dateTo = dateTo;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public List<Long> getCategories() {
		return categories;
	}

	public void setCategories(List<Long> categories) {
		this.categories = categories;
	}

	public List<Long> getAccounts() {
		return accounts;
	}

	public void setAccounts(List<Long> accounts) {
		this.accounts = accounts;
	}

	public Long getPriceFrom() {
		return priceFrom;
	}

	public void setPriceFrom(Long priceFrom) {
		this.priceFrom = priceFrom;
	}

	public Long getPriceTo() {
		return priceTo;
	}

	public void setPriceTo(Long priceTo) {
		this.priceTo = priceTo;
	}

	@Override
	public String toString() {
		return "TransactionsFilter [id=" + id + ", dateFrom=" + dateFrom
				+ ", dateTo=" + dateTo + ", description=" + description
				+ ", comment=" + comment + ", categories=" + categories
				+ ", accounts=" + accounts + ", priceFrom=" + priceFrom
				+ ", priceTo=" + priceTo + ", name=" + name + "]";
	}

}
