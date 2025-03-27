document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (event) => {
      console.log("Texto de búsqueda:", event.target.value);
    });
  });
