import os
import pandas as pd
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder="static", template_folder="templates")

def get_path():
    return os.path.dirname(os.path.abspath(__file__))

def get_conformity(observed):
    expected = [.301,.176,.125,.097,.079,.067,.058,.051,.046]
    chi = sum((((o/100) - e) ** 2 / e) for o, e in zip(observed, expected))
    return round(chi,4)

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/getBenfordAnalysis', methods=['POST'])
def get_benford_analysis():
    data = request.get_json()
    df = pd.DataFrame(data)

    stats = {
        'numRows': 0,
        'dist': [0] * 9,
        'chisqr': -1
    }

    df['firstChar'] = df['params'].astype(str).str[0]
    df = df[df['params'].astype(str).str.match("^[1-9]")]

    stats['numRows'] = len(df.index)

    if stats['numRows'] > 0:
        s = pd.Series(df['firstChar'])
        vals = s.value_counts(normalize=True)
        vals = vals.round(decimals=3).tolist()
        curr_index = s.value_counts().index.tolist()

        for i in range(1, 10):
            if str(i) in curr_index:
                stats['dist'][i-1] = vals[curr_index.index(str(i))] * 100

        stats['chisqr'] = get_conformity(stats['dist'])

    return jsonify(stats)

if __name__ == '__main__' :
    app.run()