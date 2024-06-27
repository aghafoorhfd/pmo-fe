import { preProcessingQuartersData, preProcessingSprintsData } from './cadenceUtils';

describe('preProcessingQuartersData ', () => {
  it('return array with an empty object', () => {
    const res = preProcessingQuartersData([]);
    expect(res).toStrictEqual([{}]);
  });
  it('return array with an object containing Quarter 1 range', () => {
    const res = preProcessingQuartersData([{ startDate: '2023-02-02', endDate: '2023-03-03' }]);
    expect(res).toStrictEqual([{ quarter1: '02 Feb 2023 - 03 Mar 2023' }]);
  });
});

describe('preProcessingSprintsData ', () => {
  it('return array with an empty object', () => {
    const res = preProcessingSprintsData([]);
    expect(res).toStrictEqual([{}]);
  });
  it('return array with an object containing Sprint 1 range', () => {
    const res = preProcessingSprintsData([{ startDate: '2023-02-02', endDate: '2023-03-03', name: 'Sprint 1' }]);
    expect(res).toStrictEqual([{ sprint1: '02 Feb - 03 Mar' }]);
  });
});
