export function isDate(anObject: object): anObject is Date {
  return (
    anObject instanceof Date ||
    Object.prototype.toString.call(anObject) === "[object Date]"
  );
}
