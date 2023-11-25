// Fetch tactics data from tactics.json
fetch("tactics.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    // Now 'data' contains the tactics information

    // Populate map selection dropdown in alphabetical order
    const mapSelection = document.getElementById('map-selection');
    const sortedMaps = Object.keys(data.maps).sort();
    sortedMaps.forEach(map => {
      const option = document.createElement('option');
      option.value = map;
      option.textContent = map.charAt(0).toUpperCase() + map.slice(1);
      mapSelection.appendChild(option);
    });

    // Populate operator selection dropdown in alphabetical order
    const operatorSelection = document.getElementById('operator-selection');
    const sortedOperators = Object.keys(data.operators).sort();
    sortedOperators.forEach(operator => {
      const option = document.createElement('option');
      option.value = operator;
      option.textContent = operator.charAt(0).toUpperCase() + operator.slice(1);
      operatorSelection.appendChild(option);
    });

    // Event listeners for map and side selection
    mapSelection.addEventListener('change', updateTactics);
    document.getElementById('side-selection').addEventListener('change', updateTactics);

    // Event listener for operator selection
    operatorSelection.addEventListener('change', updateOperatorTactics);

    // Function to update tactics based on map and side selection
    function updateTactics() {
      const selectedMap = mapSelection.value;
      const selectedSide = document.getElementById('side-selection').value;

      const tacticsContainer = document.getElementById('tactics-container');
      const tactics = data.maps?.[selectedMap]?.[selectedSide];

      // Display tactics in the container
      tacticsContainer.innerHTML = '';
      if (tactics) {
        for (const tacticType in tactics) {
          const tacticElement = document.createElement('div');
          tacticElement.innerHTML = `<h4>${tacticType.charAt(0).toUpperCase() + tacticType.slice(1)}</h4>`;

          const tacticData = tactics[tacticType];
          if (tacticData && Array.isArray(tacticData)) {
            tacticData.forEach((step, index) => {
              const stepElement = document.createElement('div');
              if (step.description) {
                stepElement.innerHTML = `
                  <p><strong>Step ${index + 1}:</strong> ${step.description}</p>
                  ${step.image ? `<img src="${step.image}" alt="${tacticType} Step ${index + 1} Image" style="max-width: ${step.image_size || '100%'};">` : ''}
                `;
                tacticElement.appendChild(stepElement);
              }
            });
          } else if (tacticData && tacticData.steps && Array.isArray(tacticData.steps)) {
            tacticData.steps.forEach((step, index) => {
              const stepElement = document.createElement('div');
              if (step.description) {
                stepElement.innerHTML = `
                  <p><strong>Step ${index + 1}:</strong> ${step.description}</p>
                  ${step.image ? `<img src="${step.image}" alt="${tacticType} Step ${index + 1} Image" style="max-width: ${step.image_size || '100%'};">` : ''}
                `;
                tacticElement.appendChild(stepElement);
              }
            });
          } else if (tacticData && tacticData.description) {
            // If there are no steps, just display the description
            tacticElement.innerHTML += `<p>${tacticData.description}</p>`;
            if (tacticData.image) {
              tacticElement.innerHTML += `<img src="${tacticData.image}" alt="${tacticType} Image" style="max-width: ${tacticData.image_size || '100%'};">`;
            }
          }

          tacticsContainer.appendChild(tacticElement);
        }
      } else {
        tacticsContainer.innerHTML = '<p>No tactics available for the selected map and side.</p>';
      }
    }

    // Function to update tactics based on operator selection
    function updateOperatorTactics() {
      const selectedOperator = operatorSelection.value;
      const operatorTacticsContainer = document.getElementById('operator-tactics-container');

      // Check if tactics data exists for the selected operator
      if (data.operators?.[selectedOperator]) {
        const operatorTactics = data.operators[selectedOperator];

        // Display operator tactics in the container
        operatorTacticsContainer.innerHTML = '';
        for (const tacticType in operatorTactics) {
          const tacticElement = document.createElement('div');
          tacticElement.innerHTML = `<h4>${tacticType.charAt(0).toUpperCase() + tacticType.slice(1)}</h4>`;

          const tacticData = operatorTactics[tacticType];
          if (tacticData && tacticData.steps && Array.isArray(tacticData.steps)) {
            tacticData.steps.forEach((step, index) => {
              const stepElement = document.createElement('div');
              if (step.description) {
                stepElement.innerHTML = `
                  <p><strong>Step ${index + 1}:</strong> ${step.description}</p>
                  ${step.image ? `<img src="${step.image}" alt="${tacticType} Step ${index + 1} Image" style="max-width: ${step.image_size || '100%'};">` : ''}
                `;
                tacticElement.appendChild(stepElement);
              }
            });
          } else if (tacticData && tacticData.description) {
            // If there are no steps, just display the description
            tacticElement.innerHTML += `<p>${tacticData.description}</p>`;
            if (tacticData.image) {
              tacticElement.innerHTML += `<img src="${tacticData.image}" alt="${tacticType} Image" style="max-width: ${tacticData.image_size || '100%'};">`;
            }
          }

          operatorTacticsContainer.appendChild(tacticElement);
        }
      } else {
        operatorTacticsContainer.innerHTML = '<p>No tactics available for the selected operator.</p>';
      }
    }

    // Initial update when the page loads
    updateTactics();
    updateOperatorTactics();
  })
  .catch(error => console.error('Error fetching tactics data:', error));
