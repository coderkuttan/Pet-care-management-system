const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;

// Read pets.json file
const getPetsData = () => {
    try {
        const data = fs.readFileSync('pets.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return { lostPets: [], foundPets: [] };
    }
};

// Write data to pets.json
const updatePetsData = (newData) => {
    try {
        fs.writeFileSync('pets.json', JSON.stringify(newData, null, 2));
    } catch (err) {
        console.error('Error writing file:', err);
    }
};

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Serve the HTML page
    if (req.url === '/' || req.url === '/lost.html') {
        fs.readFile('lost.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    // Serve JSON data
    else if (req.url === '/pets') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getPetsData()));
    }
    // Handle adding a lost pet (POST request)
    else if (req.url === '/add-lost-pet' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newPet = JSON.parse(body);
            let data = getPetsData();
            newPet.id = data.lostPets.length + 1;
            data.lostPets.push(newPet);
            updatePetsData(data);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Lost pet added successfully' }));
        });
    }
    // Handle adding a found pet (POST request)
    else if (req.url === '/add-found-pet' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newPet = JSON.parse(body);
            let data = getPetsData();
            newPet.id = data.foundPets.length + 1;
            data.foundPets.push(newPet);
            updatePetsData(data);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Found pet added successfully' }));
        });
    }
    // Serve 404 for unknown routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
