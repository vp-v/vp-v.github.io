# api_handler.py
from flask import Flask, jsonify
from database_manager import DatabaseManager
import json

app = Flask(__name__)

db_manager = DatabaseManager(
    host="onboarding-ta21.mysql.database.azure.com",
    user="lleyton",
    password="ta21-caseyemissions",
    database="onboarding"
)

@app.route('/api/get_data', methods=['GET'])
def get_data():
    query = "SELECT s.postcode, s.name, e.avg_emissions_per_customer_per_year FROM suburbs s LEFT JOIN emissions e ON s.postcode = e.postcode"

    result = db_manager.execute_query(query)

    data = []
    for row in result:
        postcode = row[0]
        name = row[1]
        emissions = round(row[2]/12)

        data.append({
            'postcode': postcode,
            'name': name,
            'emissions': emissions
        })

    result_json = json.dumps(data)
    print(result_json)
    return result_json

if __name__ == '__main__':
    app.run()