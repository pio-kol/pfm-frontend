package fw;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType=IdentityType.APPLICATION)
public class Category {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key id;
	
	@Persistent
	private Long parentCategoryId;
	
	@Persistent
	private String name;

	public Key getId() {
		return id;
	}

	public void setId(Key id) {
		this.id = id;
	}

	public Long getParentCategoryId() {
		return parentCategoryId;
	}

	public void setParentCategoryId(Long parentCategoryId) {
		this.parentCategoryId = parentCategoryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result
				+ ((parentCategoryId == null) ? 0 : parentCategoryId.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Category other = (Category) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (parentCategoryId == null) {
			if (other.parentCategoryId != null)
				return false;
		} else if (!parentCategoryId.equals(other.parentCategoryId))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Category [id=" + id + ", parentCategoryId=" + parentCategoryId
				+ ", name=" + name + "]";
	}
}
