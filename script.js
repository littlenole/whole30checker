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
    const input = document.getElementById('productInput').value.toLowerCase();
    console.log('Input:', input); // Debugging
    
    const result = products.find(product => product.name.toLowerCase() === input);
    console.log('Result:', result); // Debugging

    const output = document.getElementById('result');
    if (result) {
        output.innerText = `${result.name} is ${result.compliance}.`;
        output.className = result.compliance === 'Compliant' ? 'compliant' : 'non-compliant';
    } else {
        output.innerText = 'Product not found. Try another or check the ingredients manually!';
        output.className = 'unknown';
    }
}

function showSuggestions() {
    const input = document.getElementById('productInput').value.toLowerCase();
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';

    if (input.length === 0) return;

    const matches = products.filter(product =>
        product.name.toLowerCase().includes(input)
    );

    matches.forEach(match => {
        const suggestion = document.createElement('li');
        suggestion.innerText = match.name;
        suggestion.onclick = () => {
            document.getElementById('productInput').value = match.name;
            suggestionsBox.innerHTML = '';
        };
        suggestionsBox.appendChild(suggestion);
    });
}
function startScanner() {
    const scanner = document.getElementById('scanner');
    scanner.style.display = 'block';

    Quagga.init({
        inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scanner
        },
        decoder: {
            readers: ['upc_reader']
        }
    }, err => {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(data => {
        console.log('Barcode detected:', data.codeResult.code);
        Quagga.stop();
        scanner.style.display = 'none';
    });
}
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

