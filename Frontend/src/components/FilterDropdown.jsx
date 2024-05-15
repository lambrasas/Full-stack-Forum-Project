import PropTypes from "prop-types";
import styles from "./FilterDropdown.module.scss";
const FilterDropdown = ({ filter, onChange }) => {
  const handleFilterChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <select
      className={styles.dropDownMenu}
      value={filter}
      onChange={handleFilterChange}
    >
      <option value="likesDesc">Likes Descending</option>
      <option value="likesAsc">Likes Ascending</option>
      <option value="dislikesDesc">Dislikes Descending</option>
      <option value="dislikesAsc">Dislikes Ascending</option>
      <option value="repliesDesc">Replies Descending</option>
      <option value="repliesAsc">Replies Ascending</option>
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
    </select>
  );
};

FilterDropdown.propTypes = {
  filter: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterDropdown;
