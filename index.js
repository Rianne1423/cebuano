const express = require('express');
 const fs = require('fs');
 const cors = require('cors');
 const app = express();
 const PORT = 3000;
 
 // Use CORS middleware
 app.use(cors());
 
 // Allow serving frontend files from "public" folder
 app.use(express.static('public'));
 
 // Load JSON data
 let jsonData;
 fs.readFile('data.json', 'utf8', (err, data) => {
     if (err) {
         console.error("Error loading JSON:", err);
         return;
     }
     jsonData = JSON.parse(data);
     console.log("Data loaded successfully.");
 });
 
 // API Endpoint for Searching a Word
 app.get('/search', (req, res) => {
     const query = req.query.word?.toLowerCase();
     console.log("Search query:", query); // Debugging log
 
     if (!query) {
         return res.json({ error: "Please enter a word to search." });
     }
 
     const result = jsonData.find(entry =>
         entry.english.toLowerCase() === query ||
         entry.tagalog.toLowerCase() === query ||
         entry.cebuano.toLowerCase() === query ||
         entry.hiligaynon.toLowerCase() === query
     );
 
     if (result) {
         console.log("Found result:", result); // Debugging log
         res.json(result);
     } else {
         console.log("No result found for:", query); // Debugging log
         res.json({ message: "Word not found." });
     }
 });
 
 // Start the server
 app.listen(PORT, () => {
     console.log(`Server is running at http://localhost:${PORT}`);
 });