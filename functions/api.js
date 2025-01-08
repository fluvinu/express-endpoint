const express = require('express');
const serverless = require('serverless-http'); // Import serverless-http
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file where content will be stored
const contentFilePath = path.join('/tmp', 'content.json'); // Now in the /functions directory

// Read content from the JSON file
const readContentFromFile = () => {
    try {
        const rawData = fs.readFileSync(contentFilePath);
        console.log('File read successfully');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading content from file", error);
        return {
            "header": {
                "title": "ERROR CONTACT TO DEVLOPER",
                "image": "https://via.placeholder.com/1920x600/007bff/ffffff?text=Slide+1"
            },
            "main": {
                "title": "ERROR CONTACT TO DEVLOPER",
                "text": "Welcome to our website. We specialize in creating beautiful websites for our clients.",
                "videoUrl": "https://www.youtube.com/embed/y_0Orh7YI4I?si=ehuqrtrAhoLNTncz"
            },
            "about": {
                "title": "About Us ERROR CONTACT TO DEVLOPER api failwr",
                "text": "Learn more about our services and what we do."
            },
            "gallery": [
                {
                    "src": "https://via.placeholder.com/1920x600/007bff/ffffff?text=Slide+1",
                    "alt": "Image 1"
                },
                {
                    "src": "https://via.placeholder.com/1920x600/007bff/ffffff?text=Slide+2",
                    "alt": "Image 2"
                },
                {
                    "src": "https://via.placeholder.com/1920x600/007bff/ffffff?text=Slide+3",
                    "alt": "Image 3"
                }
            ]
        };
    }
};

// Write updated content to the JSON file
const writeContentToFile = (updatedContent) => {
    try {
        fs.writeFileSync(contentFilePath, JSON.stringify(updatedContent, null, 2));
        console.log('File written successfully');
    } catch (error) {
        console.error("Error writing content to file", error);
    }
};

// Define endpoints
app.get('/api/content', (req, res) => {
    const content = readContentFromFile();
    res.json(content);
});

app.put('/api/content', (req, res) => {
    const updatedContent = req.body;
    writeContentToFile(updatedContent);
    res.json({ message: "Content updated successfully", content: updatedContent });
});

// Export the handler for Lambda
module.exports.handler = serverless(app);
