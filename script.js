const sidebarButton = document.querySelector('.sidebar-button');
const sidebar = document.querySelector('.sidebar');
const closeButton = document.querySelector('.close-button');
const videoContainer = document.querySelector('.recording-container');
const previewContainer = document.querySelector('.preview-container')

sidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

closeButton.addEventListener('click', () => {
  sidebar.classList.remove('open');
});

//Load data from JSON file
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    // Get the dropdown buttons container
    const dropdownButtonsContainer = document.querySelector('.dropdown-buttons');
    const selectedButton = document.querySelector('.selected-button');

    const learnContainer = document.createElement('div');
    learnContainer.classList.add('learn-container');
    document.body.appendChild(learnContainer);

    // Loop through the data and create dropdown buttons
    Object.entries(data).forEach(([name, buttonNo]) => {
      const dropdownButton = document.createElement('button');
      dropdownButton.textContent = name;

      dropdownButton.addEventListener('click', () => {
        const subButtons = dropdownButton.nextElementSibling;
        if (subButtons && subButtons.classList.contains('sub-buttons')) {
          subButtons.remove();
          dropdownButton.classList.remove('active');
          selectedButton.style.display = 'none';
          const learnContainer = document.querySelector('.learn-container');
          const practiceContainer = document.querySelector('.recording-container');
          if (learnContainer) {
            learnContainer.remove();
          }
          if (practiceContainer) {
            practiceContainer.remove();
          }
          return;
        } else {
          const subButtons = document.createElement('div');
          subButtons.classList.add('sub-buttons');

          const learnButton = document.createElement('button');
          learnButton.textContent = 'Learn';
          subButtons.appendChild(learnButton);

          const practiceButton = document.createElement('button');
          practiceButton.textContent = 'Practice';
          subButtons.appendChild(practiceButton);

          dropdownButton.classList.add('active');
          dropdownButton.parentNode.insertBefore(subButtons, dropdownButton.nextSibling);
          selectedButton.textContent = name;
          selectedButton.style.display = 'block';

          learnButton.addEventListener('click', () => {
            learnContainer.textContent = 'Learn'; // Set Learn text
            learnContainer.style.display = 'block'; // Show Learn text
            videoContainer.style.display = 'none';
            previewContainer.style.display = 'none';
          });

          //Event listener for practice button
          practiceButton.addEventListener('click', () => {
            videoContainer.style.display = 'block';
            previewContainer.style.display = 'block';
            const script = document.createElement('script');
            script.src = 'practice.js';
            document.body.appendChild(script);
            learnContainer.style.display = 'none'; // Hide Learn text
          });
        }
      });
      dropdownButtonsContainer.appendChild(dropdownButton);
    });
  });
