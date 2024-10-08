from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key='pk-ndzVnsfXVrbEvzPmrpzxaTtmPrAkSpbAyLQbtiSLYOcFbvDE',
    base_url="https://api.pawan.krd/cosmosrp/v1"
)

@app.route('/generate-code', methods=['POST'])
def generate_code():
    data = request.get_json()
    description = data.get('description')
    language = data.get('language')
    
    system_message = """
    You are an expert programmer assistant. Your task is to generate high-quality, efficient, and well-commented code based on the user's description. Follow these guidelines:
    1. Write code that is correct, efficient, and follows best practices for the specified language.
    2. Include clear and concise comments explaining the logic and any important steps.
    3. If applicable, add a simple test case or usage example to demonstrate the code's functionality.
    4. Ensure the code is properly formatted and easy to read.
    5. If the task is unclear or could be interpreted in multiple ways, choose the most likely interpretation and explain your choice in a comment.
    """

    user_message = f"Write {language} code for the following task: {description}"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ],
        temperature=0.7,
        max_tokens=1500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    generated_code = response.choices[0].message.content
    return jsonify({'code': generated_code})

if __name__ == '__main__':
    app.run(debug=True)