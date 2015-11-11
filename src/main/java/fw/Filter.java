package fw;

import java.util.ArrayList;
import java.util.List;

import org.datanucleus.util.StringUtils;

public class Filter {

	private String description;
	private String comment;
	private Long priceFrom;
	private Long priceTo;

	public Filter descriptionContains(String description) {
		this.description = description;
		return this;
	}

	public Filter commentContains(String comment) {
		this.comment = comment;
		return this;
	}

	public Filter priceTo(Long priceTo) {
		this.priceTo = priceTo;
		return this;
	}

	public Filter priceFrom(Long priceFrom) {
		this.priceFrom = priceFrom;
		return this;
	}

	public List<Transaction> filter(List<Transaction> transactions) {
		return //
		filterByPriceFrom( //
		filterByPriceTo( //
		filterByComment( //
		filterByDescription(transactions) //
		)));
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

	private List<Transaction> filterByComment(List<Transaction> transactions) {
		if (StringUtils.isEmpty(comment)) {
			return transactions;
		}

		List<Transaction> filteredTransactions = new ArrayList<>();
		for (Transaction transaction : transactions) {
			if (transaction.getComment().contains(comment)) {
				filteredTransactions.add(transaction);
			}
		}
		return filteredTransactions;
	}

	private List<Transaction> filterByPriceFrom(List<Transaction> transactions) {
		if (priceFrom == null) {
			return transactions;
		}

		List<Transaction> filteredTransactions = new ArrayList<>();
		for (Transaction transaction : transactions) {
			if (transaction.getPrice() >= priceFrom) {
				filteredTransactions.add(transaction);
			}
		}
		return filteredTransactions;
	}

	private List<Transaction> filterByPriceTo(List<Transaction> transactions) {
		if (priceTo == null) {
			return transactions;
		}

		List<Transaction> filteredTransactions = new ArrayList<>();
		for (Transaction transaction : transactions) {
			if (transaction.getPrice() <= priceTo) {
				filteredTransactions.add(transaction);
			}
		}
		return filteredTransactions;
	}
}
