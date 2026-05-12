fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
  method: 'GET',
  headers: {
    'Authorization': 'Basic Y29hbGl0aW9uOnNraWxscy10ZXN0',
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {

    console.log("API Data:", data);

    // data is directly an array
    let patients = data;
    if (!Array.isArray(data)) {
      patients = data.patients || Object.values(data);
    }

    console.log("Patients:", patients);

    const jessica = patients.find(p => p.name === "Jessica Taylor");

    if (!jessica) {
      console.log("Not found! Full data:", data);
      return;
    }

    // Profile info
    document.getElementById('p-name').textContent = jessica.name;
    document.getElementById('p-dob').textContent = jessica.date_of_birth;
    document.getElementById('p-gender').textContent = jessica.gender;
    document.getElementById('p-phone').textContent = jessica.phone_number;
    document.getElementById('p-emergency').textContent = jessica.emergency_contact;
    // Diagnostic List
const tbody = document.getElementById('diagnostic-body');
jessica.diagnostic_list.forEach(item => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.description}</td>
    <td>${item.status}</td>
  `;
  tbody.appendChild(row);
});
    document.getElementById('p-insurance').textContent = jessica.insurance_type;

    // Stat cards
    const latest = jessica.diagnosis_history[0];
    document.getElementById('resp').textContent = latest.respiratory_rate.value + " bpm";
    document.getElementById('temp').textContent = latest.temperature.value + "°F";
    document.getElementById('heart').textContent = latest.heart_rate.value + " bpm";

    // Chart data
    const history = jessica.diagnosis_history.slice(0, 6).reverse();
    const months = history.map(d => d.month + " " + d.year);
    const systolic = history.map(d => d.blood_pressure.systolic.value);
    const diastolic = history.map(d => d.blood_pressure.diastolic.value);
    // Show BP values beside chart
document.getElementById('systolic-val').textContent = 
  jessica.diagnosis_history[0].blood_pressure.systolic.value;
document.getElementById('diastolic-val').textContent = 
  jessica.diagnosis_history[0].blood_pressure.diastolic.value;

    // Draw chart
    const ctx = document.getElementById('bpChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Systolic',
            data: systolic,
            borderColor: '#E66FD2',
            backgroundColor: 'rgba(230, 111, 210, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#E66FD2'
          },
          {
            label: 'Diastolic',
            data: diastolic,
            borderColor: '#8C6FE6',
            backgroundColor: 'rgba(140, 111, 230, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#8C6FE6'
          }
        ]
      },
      options: {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.5,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      min: 60,
      max: 180,
      grid: {
        color: 'rgba(0,0,0,0.05)'
      },
      ticks: {
        stepSize: 20,
        font: { size: 11 }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { size: 11 }
      }
    }
  },
  elements: {
    point: {
      radius: 5,
      hoverRadius: 7
    },
    line: {
      borderWidth: 2
    }
  }
}
    });

  })
  .catch(error => {
    console.error('Error:', error);
  });