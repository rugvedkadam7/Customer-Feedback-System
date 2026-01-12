let feedbacks = JSON.parse(localStorage.getItem('pulseBoardFeedbacks')) || [];

const stars = document.querySelectorAll('.star');
const feedbackText = document.getElementById('feedbackText');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

const totalReviewsEl = document.getElementById('totalReviews');
const avgRatingEl = document.getElementById('avgRating');
const fiveStarsEl = document.getElementById('fiveStars');

let ratingChart;
let selectedRating = 0;

function saveFeedbacks() {
    localStorage.setItem('pulseBoardFeedbacks', JSON.stringify(feedbacks));
}

function updateStats() {
    const total = feedbacks.length;
    const sum = feedbacks.reduce((a, f) => a + f.rating, 0);
    const avg = total ? (sum / total).toFixed(1) : '0.0';
    const fiveStarCount = feedbacks.filter(f => f.rating === 5).length;

    totalReviewsEl.textContent = total;
    avgRatingEl.textContent = avg;
    fiveStarsEl.textContent = fiveStarCount;

    updateChart();
}

function updateChart() {
    const counts = [0,0,0,0,0,0];
    feedbacks.forEach(f => counts[f.rating]++);

    if (ratingChart) ratingChart.destroy();

    ratingChart = new Chart(document.getElementById('ratingChart'), {
        type: 'doughnut',
        data: {
            labels: ['1★','2★','3★','4★','5★'],
            datasets: [{
                data: counts.slice(1),
                backgroundColor: [
                    '#ef4444','#f97316','#eab308','#84cc16','#22c55e'
                ]
            }]
        },
        options: {
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function updateStars(value = selectedRating) {
    stars.forEach(star => {
        const v = parseInt(star.dataset.value);
        star.classList.toggle('active', v <= value);
        star.classList.toggle('hovered', v <= value);
    });
}

stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        updateStars();
    });
    star.addEventListener('mouseover', () => updateStars(parseInt(star.dataset.value)));
    star.addEventListener('mouseout', () => updateStars());
});

submitBtn.addEventListener('click', () => {
    if (!selectedRating) {
        messageDiv.textContent = "Please select a rating before submitting.";
        messageDiv.className = 'message error';
        return;
    }

    feedbacks.push({
        rating: selectedRating,
        comment: feedbackText.value.trim(),
        date: new Date().toISOString()
    });

    saveFeedbacks();
    updateStats();

    selectedRating = 0;
    feedbackText.value = '';
    updateStars();

    messageDiv.textContent = "Thank you for sharing your feedback.";
    messageDiv.className = 'message success';
});

resetBtn.addEventListener('click', () => {
    if (!confirm("This will permanently delete all feedback data. Continue?")) return;
    feedbacks = [];
    saveFeedbacks();
    updateStats();
    messageDiv.textContent = "All feedback data has been cleared.";
    messageDiv.className = 'message success';
});

updateStats();
