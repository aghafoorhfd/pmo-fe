import { mapper } from './mapper';
import {
  hasPermission, removeItemFromLocalStorage, getValueFromLocalStorage,
  setValuesToLocalStorage, antdTableSorter, getMetricsData, getMetricsArray, preProcessingData
} from './utils';

describe('hasPermission', () => {
  const allRoles = ['user', 'admin', 'superadmin'];
  test('return true when role ', () => {
    expect(hasPermission(allRoles, 'user')).toBeTruthy();
  });
  test('return false when role ', () => {
    expect(hasPermission(allRoles, 'manager')).toBeFalsy();
  });
});

describe('removeItemFromLocalStorage', () => {
  test('should remove the key from local Storage', () => {
    removeItemFromLocalStorage('admin');
    expect(getValueFromLocalStorage('admin')).toBeNull();
  });
});

describe('setValuesToLocalStorage', () => {
  const name = 'Sarfaraz';
  test('should set the  string in the local Storage', () => {
    setValuesToLocalStorage('name', name);
    expect(
      getValueFromLocalStorage('name')
    ).toMatch(name);
    expect(
      getValueFromLocalStorage('name')
    ).not.toEqual({ name });
  });
  test('should set the  object in the local Storage', () => {
    setValuesToLocalStorage('user', { name });
    expect(
      getValueFromLocalStorage('user')
    ).toEqual({ name });
  });
});

describe('antdTableSorter', () => {
  const obj1 = { fname: 'sarfaraz', num: 123 };
  const obj2 = { fname: 'memon', num: 123 };
  const obj3 = { fname: 'memon', num: 123 };
  test('should display obj1 first', () => {
    expect(antdTableSorter(obj1, obj2, 'fname')).toBe(1);
    expect(antdTableSorter(obj2, obj1, 'fname')).toBe(-1);
    expect(antdTableSorter(obj2, obj3, 'fname')).toBe(0);
  });

  test('should return falsy value when sorting in being done on int values', () => {
    expect(antdTableSorter(obj1, obj2, 'num')).toBeFalsy();
  });
});

describe('mapper', () => {
  test('should resolve mapping', () => {
    const transformed = mapper(
      { newName: 'name' }, // mapping
      { name: 'Hassan' } // data
    );
    expect(transformed).toEqual({ newName: 'Hassan' });
  });
  test('should resolve nested mapping', () => {
    const transformed = mapper(
      { city: 'address.country.city' }, // mapping
      { // data
        address: {
          country: {
            city: 'Islamabad'
          }
        }
      }
    );
    expect(transformed).toEqual({ city: 'Islamabad' });
  });
  test('should get default values if mapping not resolved', () => {
    const transformed = mapper(
      { newName: 'name' }, // mapping
      {}, // data
      { name: 'Default Name' } // default mapping
    );
    expect(transformed).toEqual({ newName: 'Default Name' });
  });

  test('should get values from mapping function', () => {
    const transformed = mapper(
      { fullName: (data) => `${data.firstName} ${data.lastName}` }, // mapping
      { firstName: 'Hassan', lastName: 'Afzal' } // data
    );
    expect(transformed).toEqual({ fullName: 'Hassan Afzal' });
  });
  test('preProcessingData', () => {
    const res = preProcessingData(['g1'], {
      notSelected: ['n1', 'n2'],
      selected: ['s1', 's2']
    });
    const result = [
      [
        { disabled: true, key: 1, title: 'g1' },
        { key: 2, title: 's1' },
        { key: 3, title: 's2' },
        { key: 4, title: 'n1' },
        { key: 5, title: 'n2' }
      ],
      [1, 2, 3]];

    expect(res).toStrictEqual(result);
  });

  test('should return object with selected and not selected data', () => {
    const selectedData = [{ title: 'stage1', key: 1 },
      { title: 'stage 2', key: 2 },
      { title: 'stage 3', key: 3 }];
    const res = getMetricsData(selectedData, [1, 2], 1);
    expect(res).toStrictEqual({ notSelected: ['stage 3'], selected: ['stage 2'] });
  });

  test('getMetricsArray should return array or empty array', () => {
    expect(getMetricsArray([])).toEqual([]);
    expect(getMetricsArray()).toEqual([]);
    expect(getMetricsArray([1, 2])).toEqual([1, 2]);
  });
});
