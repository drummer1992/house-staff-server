export const randomCode = (length: number, upperCase = false): string => {
  const symbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)]

  const code = [...Array(length)].map(getRandomSymbol).join('')

  return upperCase ? code.toUpperCase() : code
}
