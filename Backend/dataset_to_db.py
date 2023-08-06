import pandas as pd
from mysql.connector import connect

import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

def create_db_and_tables(connection):
	with connection.cursor() as cursor:
		cursor.execute("CREATE DATABASE IF NOT EXISTS onboarding")
		cursor.execute("USE onboarding")
		cursor.execute("""CREATE TABLE suburbs (
					postcode CHAR(4) PRIMARY KEY,
					name VARCHAR(150)
		)""")
		cursor.execute("""CREATE TABLE electricity (
			total_electricity_usage INT,
			avg_usage_per_customer_per_year INT,
			postcode CHAR(4),
			FOREIGN KEY (postcode)
				REFERENCES suburbs(postcode)
		)""")
		cursor.execute("""CREATE TABLE gas (
			total_gas_usage INT,
			avg_usage_per_customer_per_year INT,
			postcode CHAR(4),
			FOREIGN KEY (postcode)
				REFERENCES suburbs(postcode)
		)""")
		cursor.execute("""CREATE TABLE emissions (
			total_co2_emissions INT,
			avg_emissions_per_customer_per_year INT,
			postcode CHAR(4),
			FOREIGN KEY (postcode)
				REFERENCES suburbs(postcode)
		)""")
		connection.commit()

def load_data_into_db(connection):
	df = pd.read_csv("Onboarding/summary-residential-community-data.csv", sep = ";")
	# As discussed by the team we only want the latest data since the user is going to be entering their most recent bill
	df = df[df.year == 2022]

	df_elec = df[df.emission_source == "Electricity"].reset_index(drop = True).sort_values(["postcode"], inplace = False)
	df_gas = df[df.emission_source == "Gas"].reset_index(drop = True).sort_values(["postcode"], inplace = False)

	# The total & average electricity + gas CO2 emissions are added as an extra column to the electricity table
	df_elec["total_elec_and_gas_co2_emissions"] = df_elec.total_emissions_kg_co2e + df_gas.total_emissions_kg_co2e
	df_elec["avg_elec_and_gas_co2_emissions"] = df_elec.average_emissions_energy_per_customer_kg_co2e_per_day + df_gas.average_emissions_energy_per_customer_kg_co2e_per_day

	with connection.cursor() as cursor:
		# Adding suburb data when looping through the electricity rows ensures we only do it once
		for _, row in df_elec.iterrows():
			cursor.execute("INSERT INTO suburbs VALUES (%s, %s)", (row.postcode, row.suburb))
			cursor.execute("INSERT INTO electricity VALUES (%s, %s, %s)", (row.total_electricity_kwh, row.average_intensity_kwh_per_customer_per_annum, row.postcode))
			cursor.execute("INSERT INTO emissions VALUES (%s, %s, %s)", (row.total_elec_and_gas_co2_emissions, row.avg_elec_and_gas_co2_emissions, row.postcode))

		for _, row in df_gas.iterrows():
			# TODO: Figure out what to do with postcode 3980's empty/zero gas data
			if not pd.isna(row.total_gas_gj):
				cursor.execute("INSERT INTO gas VALUES (%s, %s, %s)", (row.total_gas_gj, row.average_intensity_gj_per_customer_per_annum, row.postcode))

		connection.commit()

# def main():
# 	with connect(host = "localhost", user = "root") as connection:
# 		create_db_and_tables(connection)
# 		load_data_into_db(connection)

def main():
    # Get database credentials from environment variables
    azure_server_name = os.getenv("DB_HOST")
    azure_user_name = os.getenv("DB_USER")
    azure_password = os.getenv("DB_PASS")
    azure_database_name = os.getenv("DB_NAME")
    azure_db_port = int(os.getenv("DB_PORT"))

    # Establish connection to Azure Database
    with connect(
        host=azure_server_name,
        user=azure_user_name,
        password=azure_password,
        database=azure_database_name,
		port=azure_db_port,
    ) as connection:
        create_db_and_tables(connection)
        load_data_into_db(connection)


main()