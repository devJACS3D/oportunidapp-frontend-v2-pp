

export const mapperId = (array: any[]) => {

  if (array.length === 0) return [];

  return array.map((object) => object.id);

}
