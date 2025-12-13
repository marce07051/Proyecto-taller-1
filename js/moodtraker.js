// Mood Tracker simple implementation using localStorage
      const STORAGE_KEY = "moodEntries_v1";

      function loadEntries() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      }

      function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      }

      function renderEntries() {
        const container = document.getElementById("entries");
        const entries = loadEntries();
        if (entries.length === 0) {
          container.innerHTML = "<p>No hay registros aún.</p>";
          return;
        }
        let html =
          '<table class="nospace"><thead><tr><th>Fecha</th><th>Estado</th><th>Nota</th><th></th></tr></thead><tbody>';
        entries
          .slice()
          .reverse()
          .forEach((e, idx) => {
            html += `<tr><td>${e.date}</td><td>${e.mood}</td><td>${
              e.note || ""
            }</td><td><button data-idx="${
              entries.length - 1 - idx
            }" class="btn del">Borrar</button></td></tr>`;
          });
        html += "</tbody></table>";
        container.innerHTML = html;
        container.querySelectorAll(".del").forEach((b) =>
          b.addEventListener("click", (ev) => {
            const i = parseInt(ev.currentTarget.getAttribute("data-idx"), 10);
            const all = loadEntries();
            all.splice(i, 1);
            saveEntries(all);
            renderEntries();
          })
        );
      }

      function exportCSV() {
        const entries = loadEntries();
        if (entries.length === 0) return alert("No hay datos para exportar");
        const rows = [["date", "mood", "note"]].concat(
          entries.map((e) => [
            e.date,
            e.mood,
            `"${(e.note || "").replace(/"/g, '""')}"`,
          ])
        );
        const csv = rows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mood-entries.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }

      document.addEventListener("DOMContentLoaded", () => {
        // default date today
        const d = new Date().toISOString().slice(0, 10);
        document.getElementById("moodDate").value = d;
        renderEntries();

        document.getElementById("moodForm").addEventListener("submit", (ev) => {
          ev.preventDefault();
          const date = document.getElementById("moodDate").value;
          const mood = document.getElementById("moodValue").value;
          const note = document.getElementById("moodNote").value.trim();
          const entries = loadEntries();
          entries.push({ date, mood, note });
          saveEntries(entries);
          document.getElementById("moodNote").value = "";
          renderEntries();
        });

        document
          .getElementById("exportBtn")
          .addEventListener("click", exportCSV);
      });