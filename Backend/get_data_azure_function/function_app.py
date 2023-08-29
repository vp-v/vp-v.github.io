import azure.functions as func
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
import mysql.connector, json

class DatabaseManager:
    def __init__(self, host, user, password, database):
        self.connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.connection.cursor()

    def execute_query(self, query):
        self.cursor.execute(query)
        result = self.cursor.fetchall()
        return result

    def close(self):
        self.cursor.close()
        self.connection.close()

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="get_data")
def get_data(req: func.HttpRequest) -> func.HttpResponse:
    # Assuming you have set up environment variables for your Key Vault URL
    KEY_VAULT_URL = "https://ta21-fit5120.vault.azure.net/"

    # Initialize the managed identity credentials
    credential = DefaultAzureCredential()
    # Initialize the Secret Client
    secret_client = SecretClient(vault_url=KEY_VAULT_URL, credential=credential)

    # Get the connection string from Azure Key Vault
    db_secret = secret_client.get_secret("mysql-database")
    db_password = db_secret.value

    db_manager = DatabaseManager(
    host="ta21-2023s2.mysql.database.azure.com",
    user="TA21",
    password=db_password,
    database="onboarding"
    )
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

    db_manager.close()
    result_json = json.dumps(data)
    return func.HttpResponse(
      result_json,
      mimetype="application/json"
    )