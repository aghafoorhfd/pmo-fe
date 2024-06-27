import { useSelector, useDispatch } from 'react-redux';
import { filterSelector } from 'utils/selectors/filterSelector';
import { setFilters, resetFilters } from 'store/slices/filterSlice';

const useFilter = (name) => {
  const dispatch = useDispatch();

  const appliedFilters = useSelector((state) => filterSelector(state, name));

  const applyFilters = (applied = {}, formatted = {}) => dispatch(setFilters(
    { name, applied, formatted }
  ));

  const clearFilters = () => {
    dispatch(resetFilters({ name }));
  };

  return [appliedFilters, applyFilters, clearFilters];
};

export default useFilter;
