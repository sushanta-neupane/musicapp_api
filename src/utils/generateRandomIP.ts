export const generateRandomIPv6 = () => {
  return Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, '0')
  ).join(':');
};
