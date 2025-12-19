export const randomCode = (length, upperCase = false) => {
  const symbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)]

  const code = [...Array(length)].map(getRandomSymbol).join('')

  return upperCase ? code.toUpperCase() : code
}

export const uuidV4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    c => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)

      return v.toString(16)
    },
  )
}