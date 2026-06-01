export type Timing = [number, number]

export const init = (): Timing => process.hrtime()

export const getDiff = (timing: Timing): number => {
  const duration = process.hrtime(timing)

  return duration[0] * 1000 + duration[1] / 1e6
}
