document.addEventListener('DOMContentLoaded', () => { // Replace with actual user email or identifier
    fetch(`http://localhost:4000/profile`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalCorrectAnswers').textContent = data.totalCorrectAnswers;
            document.getElementById('totalWrongAnswers').textContent = data.totalWrongAnswers;
            document.getElementById('totalTimeSpent').textContent = data.totalTimeSpent;
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
});
