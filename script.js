// DATA & STATE
let feedbacks = JSON.parse(localStorage.getItem('customerFeedbacks')) || [];

const ratingStars = document.getElementById('ratingStars');
const stars = document.querySelectorAll('.star');
const feedbackText = document.getElementById('feedbackText');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');

// Stats elements
const totalReviewsEl = document.getElementById('totalReviews');
const avgRatingEl = document.getElementById('avgRating');
const fiveStarsEl = document.getElementById('fiveStars');

// Chart
let ratingChart;

// =============================================
// FUNCTIONS
// =============================================
function saveFeedbacks() {
  localStorage.setItem('customerFeedbacks', JSON.stringify(feedbacks));
}

function updateStats() {
  const total = feedbacks.length;
  const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
  const avg = total ? (sum / total).toFixed(1) : 0;
  const fiveStarCount = feedbacks.filter(f => f.rating === 5).length;

  totalReviewsEl.textContent = total;
  avgRatingEl.textContent = avg;
  fiveStarsEl.textContent = fiveStarCount;

  updateChart();
}

function updateChart() {
  const countByRating = [0, 0, 0, 0, 0, 0]; // index 0 unused
  feedbacks.forEach(f => {
    countByRating[f.rating]++;
  });

  if (ratingChart) ratingChart.destroy();

  const ctx = document.getElementById('ratingChart').getContext('2d');
  ratingChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1★', '2★', '3★', '4★', '5★'],
      datasets: [{
        label: 'Number of Ratings',
        data: countByRating.slice(1),
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#84cc16',
          '#22c55e'
        ],
        borderColor: [
          '#b91c1c',
          '#c2410c',
          '#a16207',
          '#65a30d',
          '#15803d'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// =============================================
// EVENT LISTENERS
// =============================================
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.value);
    updateStars();
  });

  star.addEventListener('mouseover', () => {
    const value = parseInt(star.dataset.value);
    updateStars(value);
  });

  star.addEventListener('mouseout', () => {
    updateStars(selectedRating);
  });
});

function updateStars(hoverValue = selectedRating) {
  stars.forEach(star => {
    const value = parseInt(star.dataset.value);
    if (value <= hoverValue) {
      star.classList.add('active');
      if (hoverValue > 0) star.classList.add('hovered');
    } else {
      star.classList.remove('active', 'hovered');
    }
  });
}

submitBtn.addEventListener('click', () => {
  if (selectedRating === 0) {
    messageDiv.textContent = "Please select a rating!";
    messageDiv.className = 'message error';
    return;
  }

  const feedback = {
    rating: selectedRating,
    comment: feedbackText.value.trim(),
    date: new Date().toISOString()
  };

  feedbacks.push(feedback);
  saveFeedbacks();
  updateStats();

  // Reset form
  selectedRating = 0;
  updateStars();
  feedbackText.value = '';
  messageDiv.textContent = "Thank you for your feedback! ❤️";
  messageDiv.className = 'message success';

  setTimeout(() => {
    messageDiv.textContent = '';
  }, 4000);
});

// Initial load
updateStats();