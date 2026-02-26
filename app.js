const API_URL = "http://localhost:3000/api/employees";
const tbody = document.getElementById("tbody");

function formatDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function renderRows(employees) {
  tbody.innerHTML = "";

  employees.forEach((e) => {
    const tr = document.createElement("tr");

    const projects = Array.isArray(e.projects) && e.projects.length
      ? e.projects.join(", ")
      : "—";

    tr.innerHTML = `
      <td>${e.employee ?? "—"}</td>
      <td>${e.organization ?? "—"}</td>
      <td>${e.object ?? "—"}</td>
      <td>${projects}</td>
      <td>${e.position ?? "—"}</td>
      <td>${formatDate(e.hireDate)}</td>
    `;

    tbody.appendChild(tr);
  });
}

async function loadEmployees() {
  try {
    const res = await axios.get(API_URL);
    renderRows(res.data);
  } catch (err) {
    console.log(err);
    tbody.innerHTML = `<tr><td colspan="6">Ошибка загрузки данных</td></tr>`;
  }
}

loadEmployees();
