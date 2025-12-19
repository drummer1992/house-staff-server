export const init = () => process.hrtime()

export const getDiff = timing => {
  const duration = process.hrtime(timing)

  return duration[0] * 1000 + duration[1] / 1e6
}
