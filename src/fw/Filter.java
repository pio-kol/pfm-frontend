package fw;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.datanucleus.util.StringUtils;

public class Filter {

	private String description;
	private Date dateFrom;
	private Date dateTo;

	public Filter descriptionContains(String description) {
		this.description = description;
		return this;
	}
	
	public Filter dateTo(Date dateTo) {
		this.dateTo = dateTo;
		return this;
	}
	
	public Filter dateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
		return this;
	}

	public List<Transaction> filter(List<Transaction> transactions) {
		if (StringUtils.isEmpty(description) && dateFrom == null && dateTo == null) {
			return transactions;
		}

		return //
		filterByDateFrom( //
		filterByDateTo( //
		filterByDescription(transactions) //
		));
	}

	private List<Transaction> filterByDescription(List<Transaction> transactions) {
		if (StringUtils.isEmpty(description)) {
			return transactions;
		}

		List<Transaction> filteredTransactions = new ArrayList<>();
		for (Transaction transaction : transactions) {
			if (transaction.getDescription().contains(description)) {
				filteredTransactions.add(transaction);
			}
		}
		return filteredTransactions;
	}

	private List<Transaction> filterByDateFrom(List<Transaction> transactions) {
		if (dateFrom == null) {
			return transactions;
		}

		List<Transaction> filteredTransactions = new ArrayList<>();
		for (Transaction transaction : transactions) {
			if (!transaction.getDate().before(dateFrom)) {
				filteredTransactions.add(transaction);
			}
		}
		return filteredTransactions;
	}

	private List<Transaction> filterByDateTo(List<Transaction> transactions) {
		if (dateTo == null) {
			return transactions;
		}

		List<Transaction> filteredTransactions = new ArrayList<>();
		for (Transaction transaction : transactions) {
			if (!transaction.getDate().after(dateTo)) {
				filteredTransactions.add(transaction);
			}
		}
		return filteredTransactions;
	}
}
