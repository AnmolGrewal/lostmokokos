function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const utilities = { capitalize };

export default utilities;
