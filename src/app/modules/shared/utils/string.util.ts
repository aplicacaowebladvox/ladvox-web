export function trim(text: string): string {
  return text
    ? text
        .split(/ /)
        .filter((word) => word != '')
        .join(' ')
    : '';
}

export function isBlank(text: string) {
  return text === '' || trim(text) === '';
}

export function onlyNumbers(value: string): string {
  return value.replace(/[^\d]+/g, '');
}

export function reduceString(value: string | null, maxLength: number = 50): string {
  if (!value) return '';
  if (value.length > maxLength) {
    let min = Math.round(maxLength / 4);
    return value.substring(0, min) + '...' + value.substring(value.length - min, value.length);
  }
  return value;
}

export function isLink(text: string | undefined): boolean {
  if (!text) return false;
  var regex = new RegExp(
    '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
  );
  return regex.test(text);
}
