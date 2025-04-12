const teamMap = {
    600: "Arizona Diamondbacks",
    601: "Atlanta Braves",
    602: "Baltimore Orioles",
    603: "Boston Red Sox",
    604: "Chicago Cubs",
    605: "Chicago White Sox",
    606: "Cincinnati Reds",
    607: "Cleveland Guardians",
    608: "Colorado Rockies",
    609: "Detroit Tigers",
    610: "Houston Astros",
    611: "Kansas City Royals",
    612: "Los Angeles Angels",
    613: "Los Angeles Dodgers",
    614: "Miami Marlins",
    615: "Milwaukee Brewers",
    616: "Minnesota Twins",
    617: "New York Mets",
    618: "New York Yankees",
    619: "Athletics",
    620: "Philadelphia Phillies",
    621: "Pittsburgh Pirates",
    622: "San Diego Padres",
    623: "San Francisco Giants",
    624: "Seattle Mariners",
    625: "St. Louis Cardinals",
    626: "Tampa Bay Rays",
    627: "Texas Rangers",
    628: "Toronto Blue Jays",
    629: "Washington Nationals"
  };
  
  async function getLiveGames() {
    const url = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
    try {
      const response = await fetch(url);
      const data = await response.json();
      const now = new Date();
      const liveGames = [];
  
      for (const event of data.events) {
        const gameTime = new Date(event.date);
        const timeDiff = (gameTime - now) / 60000;
  
        if (event.status.type.state === "in" || (timeDiff >= 0 && timeDiff <= 15)) {
          const homeTeam = event.competitions[0].competitors.find(team => team.homeAway === "home").team.displayName;
          liveGames.push(homeTeam);
        }
      }
  
      return liveGames;
    } catch (e) {
      console.error("Error loading games", e);
      return [];
    }
  }

  function decryptWithPassword(encryptedData, password) {
    // Convert the encrypted data back from Base64
    const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
    // Create a simple key based on the password (just a repeating XOR operation with the password)
    let passwordBytes = new TextEncoder().encode(password);
    let decryptedBytes = new Uint8Array(encryptedBytes.length);
  
    // Simple XOR decryption based on the password
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ passwordBytes[i % passwordBytes.length];
    }
  
    // Convert decrypted bytes back to a string
    const decryptedText = new TextDecoder().decode(decryptedBytes);
  
    return decryptedText;
  }

  const encryptedURL = 'GBsbAANVQF8DHwACBAwOAwQYChJeDAAdXwwOAwQYChJeHwcATwcLTQ==';
  
  let currentColumns = undefined; // Initial column count
  const maxCols = 4; // Maximum columns
  const minCols = 1; // Minimum columns
  
  // Function to adjust columns based on user input
  function adjustColumns(change) {
    if(!currentColumns) {return;}
    const grid = document.getElementById("iframeGrid");
    currentColumns = Math.max(minCols, Math.min(maxCols, currentColumns + change));
    
    // Update column count on UI
    document.getElementById("colCount").textContent = currentColumns;
    
    // Adjust the grid-template-columns based on currentColumns
    grid.style.gridTemplateColumns = `repeat(${currentColumns}, 1fr)`;
  
    // Re-render the iframes (this assumes renderIframes can handle a dynamic grid)
    renderIframes(decryptedURL);
  }
  
  // Reinitialize grid with default values
  async function renderIframes(decryptedURL) {
    const liveGames = await getLiveGames();
    if(!currentColumns) {
        const numLiveGames = liveGames.length;
  if (numLiveGames === 1) {
    currentColumns = 1; // 1 column for 1 game
  } else if (numLiveGames <= 4) {
    currentColumns = 2; // 2 columns for 2-4 games
  } else if (numLiveGames <= 9) {
    currentColumns = 3; // 3 columns for 5-9 games
  } else {
    currentColumns = 4; // 4 columns for 10+ games
  }
    }
    const links = Object.entries(teamMap)
      .filter(([, team]) => liveGames.includes(team))
      .map(([num]) => `${decryptedURL}${num}`);
  
    const grid = document.getElementById("iframeGrid");
    const num = links.length;
  
    // Update the number of columns dynamically
    const columns = Math.min(currentColumns, num);
    grid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  
    links.forEach((url, i) => {
      const container = document.createElement("div");
      container.className = "iframe-container";
      container.dataset.index = i;
  
      const button = document.createElement("button");
      button.className = "feature-btn";
      button.innerText = "⭐";
      button.onclick = () => {
        document.querySelectorAll(".iframe-container").forEach((el, idx) => {
          if (idx === i) {
            el.classList.toggle("featured");
          } else {
            el.classList.remove("featured");
          }
        });
      };
  
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.frameBorder = 0;
  
      container.appendChild(button);
      container.appendChild(iframe);
      grid.appendChild(container);
    });
  }

  const encryptedFilters = [
    "AB0AExUcHBIZCAgVAkEMHx1MTF4FAQIFBAo=",
    "AB0AExUcHBIZCAgVAkEMHx1MTFMlASIFBAo/HBEWCgI=",
    "Ax8AAgQMDgMEGAoSXgwAHVNMQR8eAQ==",
    "Ax8AAgQMDgMEGAoSXgwAHVNMCxkGVRwECQMKWApCBh4UChdKUF1eREdbV0NGW1hZ",
    "Ax8AAgQMDgMEGAoSXgwAHVNMBwQdA09OUAsGBg==",
    "Ax8AAgQMDgMEGAoSXgwAHVNMVQIfABtQTk8LGQY=",
    "Ax8AAgQMDgMEGAoSXgwAHVNMBwQdA09OUAYJAhECCg==",
    "Ax8AAgQMDgMEGAoSXgwAHVNMVQIfABtQTk8GFgIOAhU=",
    "DBMfFF4cBxECChsYGRxBEx8CQAAUQAsEAwwABQRLBh0RCAo="
  ];
  
// Select the password input and the submit button
const passwordInput = document.getElementById('passwordInput');
const submitButton = document.getElementById('submitPassword');
const filterBox = document.getElementById('filterCode');

function tryDecryptLines() {
    const password = passwordInput.value;
    const decrypted = [];
    for (const encrypted of encryptedFilters) {
      try {
        const result = decryptWithPassword(encrypted, password);
        if (result) {
          decrypted.push(result);
        }
      } catch (e) {
        // ignore failed decrypt
      }
    }
  
    if(decrypted && decrypted[3] && decrypted[3].endsWith('##div:style(z-index: 2147483647)')) {
        filterBox.textContent = decrypted.join('\n');
    } else {
        filterBox.textContent = "enter the correct password for this to appear"
    }
  }
  

  passwordInput.addEventListener('input', () => {
    tryDecryptLines();
  });
// Event listener for the "Enter" key
passwordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission if it's inside a form
    submitPassword();
  }
});

// Event listener for the submit button click
submitButton.addEventListener('click', submitPassword);

function submitPassword() {
  const password = passwordInput.value;
  if (password) {
    const decryptedData = decryptWithPassword(encryptedURL, password);
    renderIframes(decryptedData);
    document.getElementById('passwordOverlay').style.display = 'none'; // Hide the password overlay
  }
}

function copyFilterCode() {
    const codeBlock = document.getElementById('filterCode');
    const range = document.createRange();
    range.selectNode(codeBlock);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    
    // Get the button and change its style and text
    const copyButton = document.getElementById('copyFilterCode');
    copyButton.style.backgroundColor = '#28a745'; // Green color
    copyButton.innerText = 'Copied!'; // Change button text
    
    // Optionally, reset button after a short delay (e.g., 2 seconds)
    setTimeout(() => {
        copyButton.style.backgroundColor = '#007bff'; // Original blue color
        copyButton.innerText = 'Copy Filters'; // Original button text
    }, 2000);
}

let hideTimeout = null;

function showControls() {
    if(!currentColumns) {return;}
  const controls = document.getElementById("gridControls");
  controls.classList.add("visible");

  // Cancel any pending hide
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
}

function hideControls() {
  // Wait 3 seconds before hiding, to prevent jitter
  hideTimeout = setTimeout(() => {
    const controls = document.getElementById("gridControls");
    controls.classList.remove("visible");
    hideTimeout = null;
  }, 500); // 3 seconds
}