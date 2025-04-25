
export function renderNavbar() {
    const navbarHTML = `
        <nav class="bg-gray-800 text-white p-4">
            <div class="container mx-auto flex justify-between items-center">
                <a href="#" class="text-xl font-bold">Mi Sitio</a>
                <ul class="flex space-x-4">
                    <li><a href="index.html" class="hover:underline">Jobs</a></li>
                </ul>
            </div>
        </nav>
    `;

    const container = document.getElementById('navbar-container');
    if (container) {
        container.innerHTML = navbarHTML;
    }
}