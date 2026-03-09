// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    window.location.href = 'login.html';
} else {
    // Display user name
    document.getElementById('userDisplay').textContent = `Welcome, ${currentUser.fullname}!`;
}

// Exercise MET values (calories per minute per kg)
const exerciseData = {
    'running-fast': 12.5,
    'running-moderate': 10,
    'walking': 3.5,
    'cycling-fast': 12,
    'cycling-moderate': 8,
    'swimming': 10,
    'jump-rope': 12,
    'weightlifting': 6,
    'yoga': 3,
    'dancing': 6.5,
    'basketball': 8,
    'football': 9
};

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Handle calorie calculation form
document.getElementById('calorieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const exercise = document.getElementById('exercise').value;
    const duration = parseInt(document.getElementById('duration').value);
    
    if (!exercise) {
        alert('Please select an exercise');
        return;
    }
    
    // Calculate calories
    const metValue = exerciseData[exercise];
    const caloriesBurned = (metValue * weight * duration / 60).toFixed(1);
    
    // Display result
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h4>🔥 Calories Burned: ${caloriesBurned} kcal</h4>
        <p>Exercise: ${document.getElementById('exercise').options[document.getElementById('exercise').selectedIndex].text}</p>
        <p>Duration: ${duration} minutes</p>
        <p>Your weight: ${weight} kg</p>
    `;
    resultDiv.classList.add('show');
    
    // Save to history
    saveToHistory(exercise, duration, caloriesBurned);
    
    // Update history display
    displayHistory();
});

// Save exercise to history
function saveToHistory(exercise, duration, calories) {
    const history = JSON.parse(localStorage.getItem(`history_${currentUser.id}`)) || [];
    
    const exerciseName = document.getElementById('exercise').options[document.getElementById('exercise').selectedIndex].text;
    
    const newEntry = {
        id: Date.now(),
        exercise: exerciseName,
        duration: duration,
        calories: calories,
        date: new Date().toISOString()
    };
    
    history.unshift(newEntry); // Add to beginning
    
    // Keep only last 10 entries
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem(`history_${currentUser.id}`, JSON.stringify(history));
}

// Display exercise history
function displayHistory() {
    const history = JSON.parse(localStorage.getItem(`history_${currentUser.id}`)) || [];
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #666;">No exercise history yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        return `
            <div class="history-item">
                <div>
                    <strong>${entry.exercise}</strong>
                    <div class="history-date">${formattedDate}</div>
                </div>
                <div>
                    <strong>${entry.calories} kcal</strong>
                    <div>${entry.duration} min</div>
                </div>
            </div>
        `;
    }).join('');
}

// Load history on page load
displayHistory();

// Add sample data for demo (optional)
function addSampleUser() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        const demoUser = {
            id: 1,
            fullname: 'Demo User',
            email: 'demo@example.com',
            password: 'demo123',
            createdAt: new Date().toISOString()
        };
        users.push(demoUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Initialize demo user (remove in production)
addSampleUser();
