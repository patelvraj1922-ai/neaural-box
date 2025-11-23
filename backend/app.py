import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env file")

genai.configure(api_key=API_KEY)

# Use the specified model
model = genai.GenerativeModel('gemini-2.5-flash-preview-09-2025')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Create a chat session
        chat_session = model.start_chat(history=[]) 
        
        # Send message to Gemini
        response = chat_session.send_message(user_message)
        
        return jsonify({
            "response": response.text
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
