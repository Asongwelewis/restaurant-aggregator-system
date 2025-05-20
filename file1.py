from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def Home():
    return "Home"

if __name__ == "__main__":
    app.run(debug=True)