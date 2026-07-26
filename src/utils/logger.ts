export function setupProductionLogging(): void {
  if (import.meta.env.PROD) {
    console.debug = () => {};
    console.trace = () => {};
  }
}
