document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("results");
  const resultsWrapper = document.getElementById("resultsContainer");
  const loadingIndicator = document.getElementById("loading");

  searchInput.addEventListener("input", async (event) => {
    const query = event.target.value.trim();
    if (query.length < 2) {
      resultsContainer.innerHTML = "";
      resultsWrapper.classList.add("hidden");
      loadingIndicator.classList.add("hidden");
      return;
    }

    loadingIndicator.classList.remove("hidden");
    
    try {
      const response = await fetch(`http://localhost:8080/api/area/name/${query}`);
      if (!response.ok) throw new Error("Error al obtener datos");
      
      const data = await response.json();
      displayResults([data]);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      resultsContainer.innerHTML = "<li class='p-2 text-red-500'>Error al buscar</li>";
      resultsWrapper.classList.remove("hidden");
    } finally {
      loadingIndicator.classList.add("hidden");
    }
  });

  function displayResults(results) {
    if (!results || results.length === 0 || !results[0].nombre) {
      resultsContainer.innerHTML = "<li class='p-2 text-gray-500'>No se encontraron resultados</li>";
    } else {
      resultsContainer.innerHTML = results.map(item => 
        `<li class='p-2 border-b last:border-none'>${item.nombre}</li>`
      ).join("");
    }
    resultsWrapper.classList.remove("hidden");
  }
});
