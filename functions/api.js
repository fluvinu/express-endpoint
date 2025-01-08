const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use /tmp directory for reading and writing files in Lambda/Netlify
const tmpPath = path.join('/tmp', 'content.json');
const contentFilePath = tmpPath;

// Function to create default content if the file doesn't exist
const createDefaultContent = () => {
    const defaultContent = {
        "header": {
            "title": "Welcome to my site",
            "image": "https://via.placeholder.com/1920x600/007bff/ffffff?text=Slide+1"
        },
        "main": {
            "title": "Welcome to our site",
            "text": "Welcome to our website. We specialize in creating beautiful websites for our clients.",
            "videoUrl": "https://www.youtube.com/embed/y_0Orh7YI4I?si=ehuqrtrAhoLNTncz"
        },
        "about": {
            "title": "About Us",
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
    fs.writeFileSync(contentFilePath, JSON.stringify(defaultContent, null, 2));
    console.log('Created default content file at:', contentFilePath);
};

// Read content from the file
const readContentFromFile = () => {
    try {
        // Check if the file exists
        if (!fs.existsSync(contentFilePath)) {
            console.log('File does not exist. Creating default content...');
            createDefaultContent();
        }

        const rawData = fs.readFileSync(contentFilePath);
        console.log('File read successfully from', contentFilePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading content from file:", error.message);
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
                "title": "About Us ERROR CONTACT TO DEVLOPER api failure",
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

// Write updated content to the file
const writeContentToFile = (updatedContent) => {
    try {
        fs.writeFileSync(contentFilePath, JSON.stringify(updatedContent, null, 2));
        console.log('File written successfully to', contentFilePath);
    } catch (error) {
        console.error("Error writing content to file:", error.message);
    }
};

// Define endpoints
app.get('/api/content', (req, res) => {
    const content = readContentFromFile();
    res.json(content);
});

app.put('/api/content', (req, res) => {
    const updatedContent = req.body;
    console.log('Received updated content:', updatedContent);
    writeContentToFile(updatedContent);
    res.json({ message: "Content updated successfully", content: updatedContent });
});

// Export the handler for Lambda
module.exports.handler = serverless(app);
