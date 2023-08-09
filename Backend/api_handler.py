# api_handler.py
from flask import Flask, jsonify
from database_manager import DatabaseManager

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

    # Transforming result into json format
    data = {}
    for row in result:
        postcode = row['postcode']
        data[postcode] = {
            'name': row['name'],
            'emissions': row['avg_emissions_per_customer_per_year']
        }

    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run()