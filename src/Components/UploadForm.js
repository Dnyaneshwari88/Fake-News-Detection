import React, { useState } from 'react';
import axios from 'axios';
import './upload.css';

function UploadForm() {
    const [newsText, setNewsText] = useState('');
    const [prediction, setPrediction] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmitText = async (e) => {
        e.preventDefault();
        if (!newsText.trim()) {
            setError('Please enter news text.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/predict', { text: newsText });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error in prediction:', error.response ? error.response.data : error.message);
            setError('Error in prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setError('');
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error in file upload:', error.response ? error.response.data : error.message);
            setError('Error in file upload. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Fake News Detection System</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmitText}>
                <textarea
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder="Enter news text here"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Predict from Text'}
                </button>
            </form>
            <form onSubmit={handleFileUpload}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Predict from File'}
                </button>
            </form>
            {prediction && <h2>Prediction: {prediction}</h2>}
        </div>
    );
}

export default UploadForm;
