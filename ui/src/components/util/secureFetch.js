

export const SecureFetch = async (URL, Options) => {
  return fetch(URL, {...Options})
}