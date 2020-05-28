export async function getAvailableClasses() {
  async function fetchUserData() {
    const response = await fetch('/getUserData')

    return await response.json()
  }

  async function fetchClasses(centerID: number, userID: number) {
    const response = await fetch(`/api/getAvailableClassesByCenter/${ centerID }/${ userID }?availability=sin_reserva`)

    return await response.json()
  }

  const { centerId, idEntity } = await fetchUserData()
  const data = await fetchClasses(centerId, idEntity)

  return data
}
