export function getAvailableClasses() {
  function fetchClasses() {
    return fetch(`https://server.autius.com/api/classes/classes-from-students?disponibility=Libres&teacherID=Todos&exitPointID=Todos&centerID=3`).then((r) => r.json())
  }

  return fetchClasses();
}
