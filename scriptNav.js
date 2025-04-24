document.addEventListener("DOMContentLoaded", () => {
  const jobContainer = document.getElementById('job-list');
  const searchInput = document.getElementById('search');

  async function fetchJobs(query = "") {
      try {
          const url = "http://localhost:8080/api/offer/all";
          const response = await fetch(url);
          const data = await response.json();
          renderJobs(data, query);
      } catch (error) {
          jobContainer.innerHTML = `
              <div class="bg-red-100 text-red-700 p-4 rounded col-span-full">
                  No se pudieron cargar las ofertas. Verifica la API
              </div>
          `;
          console.error("Error cargando ofertas:", error);
      }
  }

  function renderJobs(jobs, query) {
      const filteredJobs = jobs.filter(job =>
          job.tittle.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredJobs.length === 0) {
          jobContainer.innerHTML = `
              <div class="text-gray-500 text-center p-4 col-span-full">
                  No se encontraron ofertas con ese nombre.
              </div>
          `;
          return;
      }

      jobContainer.innerHTML = filteredJobs.map(job => `
          <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 class="text-xl font-semibold mb-2 text-slate-800">${job.tittle}</h3>
              <p class="text-gray-700 mb-2">${job.description}</p>
              <p class="text-sm text-gray-500 mb-1">Publicado el: ${job.datePosted}</p>
              <p class="text-sm text-gray-500 mb-1">${job.remote ? "Remoto" : "Presencial"}</p>
              <div class="mt-2">
                  ${job.technologyDto.map(tech => `
                      <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                          ${tech.name}
                      </span>
                  `).join('')}
              </div>
          </div>
      `).join('');
  }

  searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
          const query = searchInput.value.trim();
          fetchJobs(query);
      }
  });

  fetchJobs();
});
