# chatbot_service.py
from flask import Flask, request, jsonify
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask(__name__)

# Download necessary NLTK data
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

@app.route('/analyze', methods=['POST'])
def analyze_message():
    data = request.json
    message = data.get('message', '')

    # Perform sentiment analysis
    sentiment = sia.polarity_scores(message)

    # Add your chatbot logic here
    # For now, we'll just echo the message and sentiment
    response = {
        'message': f"Received: {message}",
        'sentiment': sentiment
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000)
