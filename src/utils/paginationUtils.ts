export function getOrderValue(sortByValues: string): { [key: string]: any } {
  return sortByValues.split(';').reduce((order: any, value: string) => {
    const mode = value.substr(0, 1) === '-' ? 'DESC' : 'ASC';
    const field = mode === 'ASC' ? value : value.substr(1);

    order[field] = mode;

    return order;
  }, {});
}

export function getSkipValue(page: number, pageSize: number): number {
  return Math.floor((page - 1) * pageSize);
}
