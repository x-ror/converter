type IIsObject = (item: unknown) => item is object;

export const isObject: IIsObject = (item: unknown): item is object => {
  return item === Object(item) && !Array.isArray(item);
};
