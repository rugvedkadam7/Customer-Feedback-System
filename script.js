let selectedRating = 0;
let selectedSatisfaction = 0;
let feedbackData = JSON.parse(localStorage.getItem("feedbacks")) || [];

// Theme toggle
const toggleBtn = document.getElementById("toggleTheme");
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
}

toggleBtn.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
};

// Star rating
function rate(value) {
    selectedRating = value;
    document.querySelectorAll(".stars span")
        .forEach((s, i) => s.classList.toggle("active", i < value));
}

// Satisfaction
function setSatisfaction(value) {
    selectedSatisfaction = value;
    document.querySelectorAll(".satisfaction-bar span")
        .forEach((s, i) => s.classList.toggle("active", i + 1 === value));
}

// Submit feedback
function submitFeedback() {
    const name = document.getElementById("name").value.trim();
    const text = document.getElementById("feedback").value.trim();

    if (!name || !text || !selectedRating || !selectedSatisfaction) {
        alert("Please complete all fields");
        return;
    }

    feedbackData.unshift({
        name,
        text,
        rating: selectedRating,
        satisfaction: selectedSatisfaction,
        priority:
            selectedRating <= 2 ? "High" :
            selectedRating === 3 ? "Medium" : "Low"
    });

    localStorage.setItem("feedbacks", JSON.stringify(feedbackData));
    location.reload();
}

// Stats
document.getElementById("totalFeedback").innerText = feedbackData.length;
const avg = feedbackData.reduce((a, b) => a + b.rating, 0) / (feedbackData.length || 1);
document.getElementById("avgRating").innerText = avg.toFixed(1);

// Recent feedback
const list = document.getElementById("feedbackList");
feedbackData.slice(0, 6).forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${f.name}</strong> (${f.rating}★)<br>${f.text}`;
    list.appendChild(li);
});

// Priority list
const priorityList = document.getElementById("priorityList");
feedbackData.slice(0, 5).forEach(f => {
    const li = document.createElement("li");
    li.className = `priority-${f.priority.toLowerCase()}`;
    li.innerHTML = `<strong>${f.priority}</strong><br>${f.text}`;
    priorityList.appendChild(li);
});

// Testimonials
const testimonials = document.getElementById("testimonials");
feedbackData.filter(f => f.rating >= 4).slice(0, 3).forEach(f => {
    const div = document.createElement("div");
    div.innerHTML = `“${f.text}”<br><strong>— ${f.name}</strong>`;
    testimonials.appendChild(div);
});

// Reports
document.getElementById("reportTotal").innerText = feedbackData.length;
const positive = feedbackData.filter(f => f.rating >= 4).length;
document.getElementById("positiveRate").innerText =
    feedbackData.length ? Math.round((positive / feedbackData.length) * 100) + "%" : "0%";

// Charts
const ratingChart = new Chart(document.getElementById("ratingChart"), {
    type: "doughnut",
    data: {
        labels: ["1★","2★","3★","4★","5★"],
        datasets: [{
            data: [1,2,3,4,5].map(r => feedbackData.filter(f => f.rating === r).length),
            backgroundColor: ["#fecaca","#fed7aa","#fef3c7","#bbf7d0","#bfdbfe"]
        }]
    },
    options: { cutout: "65%" }
});

const reportChart = new Chart(document.getElementById("reportChart"), {
    type: "bar",
    data: {
        labels: ["1★","2★","3★","4★","5★"],
        datasets: [{
            label: "Responses",
            data: [1,2,3,4,5].map(r => feedbackData.filter(f => f.rating === r).length),
            backgroundColor: "#60a5fa"
        }]
    }
});
