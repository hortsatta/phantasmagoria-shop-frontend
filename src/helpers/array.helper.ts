export const arrayUnion = (arr1: any[], arr2: any[], field: string) => {
  const mergedArray = [...arr2, ...arr1];
  // mergedArray have duplicates, lets remove the duplicates using Set
  const set = new Set();
  return mergedArray.filter(item => {
    if (!set.has(item[field])) {
      set.add(item[field]);
      return true;
    }
    return false;
  }, set);
};
