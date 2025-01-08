const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http'); // Serverless HTTP for AWS Lambda

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file where content will be stored
const contentFilePath = path.join(__dirname, 'content.json');

// Read content from the JSON file
const readContentFromFile = () => {
  try {
    const rawData = fs.readFileSync(contentFilePath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading content from file", error);
    return {
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
  }
};

// Write updated content to the JSON file
const writeContentToFile = (updatedContent) => {
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(updatedContent, null, 2));
  } catch (error) {
    console.error("Error writing content to file", error);
  }
};

// Endpoint to fetch content
app.get('/api/content', (req, res) => {
  const content = readContentFromFile();
  res.json(content);
});

// Endpoint to update content
app.put('/api/content', (req, res) => {
  const updatedContent = req.body;
  writeContentToFile(updatedContent);  // Save the updated content to the file
  res.json({ message: "Content updated successfully", content: updatedContent });
});

// Create the handler for Lambda
module.exports.handler = serverless(app);
