
// Function to show job details

function showJobDetails(jobId) {

    // Hide all job details
    
    document.querySelectorAll('.job-details-panel').forEach(el => {
        el.classList.add('hidden');
    });
    document.getElementById('defaultMessage').classList.add('hidden');
    document.getElementById('jobDetails' + jobId).classList.remove('hidden');
    document.querySelectorAll('.job-card').forEach(card => {
        card.classList.remove('active');
    });

    event.currentTarget.classList.add('active');
    if (window.innerWidth < 1024) {
        document.getElementById('jobDetailsPanel').scrollIntoView({ behavior: 'smooth' });
    }
}
document.addEventListener('DOMContentLoaded', function () {
    if (window.innerWidth >= 1024) {
        showJobDetails(1);
        document.querySelectorAll('.job-card')[0].classList.add('active');
    }
});
