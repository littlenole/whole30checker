// Existing Product Compliance Checker Logic
const products = [
    { name: 'Almond Butter', ingredients: 'Almonds', compliance: 'Compliant' },
    { name: 'Greek Yogurt', ingredients: 'Milk', compliance: 'Non-Compliant' },
    { name: 'Coconut Milk', ingredients: 'Coconut, Water', compliance: 'Compliant' },
    { name: 'Sugar-Free Bacon', ingredients: 'Pork, Salt, Water', compliance: 'Compliant' },
    { name: 'Peanut Butter', ingredients: 'Peanuts, Salt', compliance: 'Non-Compliant' },
    { name: 'Cauliflower Rice', ingredients: 'Cauliflower', compliance: 'Compliant' },
    { name: 'Oat Milk', ingredients: 'Oats, Water', compliance: 'Non-Compliant' },
    { name: 'Sparkling Water', ingredients: 'Carbonated Water', compliance: 'Compliant' },
];

function checkProduct() {
  const input = document.getElementById("productInput").value.toLowerCase();
  const result = products.find(product => product.name.toLowerCase() === input);
  const output = document.getElementById("result");
  if (result) {
    output.innerText = `${result.name} is ${result.compliance}.`;
    output.className = result.compliance === "Compliant" ? "compliant" : "non-compliant";
  } else {
    output.innerText = "Product not found. Try another or check the ingredients manually!";
    output.className = "unknown";
  }
}

// New Code: Fetch and Display Whole30 Rules
document.addEventListener("DOMContentLoaded", () => {
  // Fetch Whole30 rules from the JSON file
  fetch("whole30_rules.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayRules(data); // Call a function to display the rules
    })
    .catch(error => {
      console.error("Error loading rules:", error);
    });
});

// Function to display rules on the page
function displayRules(rules) {
  const rulesContainer = document.getElementById("rules-list");

  rules.forEach(rule => {
    const listItem = document.createElement("li");
    listItem.innerText = `Rule ${rule.rule_number}: ${rule.rule_text}`;
    rulesContainer.appendChild(listItem);
  });
}
// Fetch the extracted data from the JSON file
fetch("extracted_data.json") // Update path if JSON is in a subfolder, e.g., "./data/extracted_data.json"
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Extracted data loaded:", data);
    integrateData(data); // Function to handle and display the data
  })
  .catch(error => {
    console.error("Error loading JSON file:", error);
  });

// Function to integrate and display the extracted data
function integrateData(data) {
  const textContainer = document.getElementById("rules-list"); // Adjust ID to your HTML structure
  const tableContainer = document.getElementById("table-container"); // Add this in your HTML if needed

  // Iterate through pages in the JSON data
  data.pages.forEach(page => {
    // Add text content
    if (page.text && page.text.length > 0) {
      const textTitle = document.createElement("h3");
      textTitle.innerText = `Page ${page.page_number}`;
      textContainer.appendChild(textTitle);

      page.text.forEach(line => {
        const lineItem = document.createElement("p");
        lineItem.innerText = line;
        textContainer.appendChild(lineItem);
      });
    }

    // Add table content (if any)
    if (page.tables && page.tables.length > 0) {
      const tableTitle = document.createElement("h3");
      tableTitle.innerText = `Tables from Page ${page.page_number}`;
      tableContainer.appendChild(tableTitle);

      page.tables.forEach(table => {
        const tableElement = document.createElement("table");
        tableElement.border = "1";
        table.forEach(row => {
          const rowElement = document.createElement("tr");
          row.forEach(cell => {
            const cellElement = document.createElement("td");
            cellElement.innerText = cell;
            rowElement.appendChild(cellElement);
          });
          tableElement.appendChild(rowElement);
        });
        tableContainer.appendChild(tableElement);
      });
    }
  });
}
function showSuggestions() {
  const input = document.getElementById("productInput").value.toLowerCase();
  const suggestionsBox = document.getElementById("suggestions");
  suggestionsBox.innerHTML = '';

  if (input.length === 0) return;

  const matches = products.filter(product =>
    product.name.toLowerCase().includes(input)
  );

  matches.forEach(match => {
    const suggestion = document.createElement("li");
    suggestion.innerText = match.name;
    suggestion.onclick = () => {
      document.getElementById("productInput").value = match.name;
      suggestionsBox.innerHTML = '';
    };
    suggestionsBox.appendChild(suggestion);
  });
}
function startBarcodeScanner() {
  console.log("Barcode scanner started...");

  const video = document.getElementById("scanner-preview");

  // Access the device camera
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream; // Stream the camera feed to the video element
      video.play();

      // Example using Quagga.js (or adjust based on your library)
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: video, // Use the video element for scanning
          },
          decoder: {
            readers: ["code_128_reader", "ean_reader"], // Add barcode formats you want to support
          },
        },
        err => {
          if (err) {
            console.error(err);
            return;
          }
          Quagga.start();
        }
      );

      // Listen for detected barcodes
      Quagga.onDetected(result => {
        console.log("Barcode detected:", result.codeResult.code);
        alert("Barcode detected: " + result.codeResult.code);

        // Stop the scanner after detection
        Quagga.stop();
        stream.getTracks().forEach(track => track.stop());
      });
    })
    .catch(error => {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera. Please check your permissions.");
    });
}

