# dataset_to_db.py
import getpass
import pandas as pd
from mysql.connector import connect

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
	df = pd.read_csv("summary-residential-community-data.csv", sep = ";")
	# As discussed by the team we only want the latest data since the user is going to be entering their most recent bill
	# We remove postcode 3980 because its gas data is missing - almost all the cells are zeroes
	df = df[(df.year == 2022) & (df.postcode != 3980)]

	df_elec = df[df.emission_source == "Electricity"].sort_values(["postcode"], inplace = False).reset_index(drop = True)
	df_gas = df[df.emission_source == "Gas"].sort_values(["postcode"], inplace = False).reset_index(drop = True)

	# The total & average electricity + gas CO2 emissions are added as an extra column to the electricity table
	df_elec["total_elec_and_gas_co2_emissions"] = df_elec.total_emissions_kg_co2e + df_gas.total_emissions_kg_co2e
	df_elec["avg_elec_and_gas_co2_emissions"] = df_elec.average_emissions_per_customer_kg_co2e + df_gas.average_emissions_per_customer_kg_co2e

	with connection.cursor() as cursor:
		# Adding suburb data when looping through the electricity rows ensures we only do it once
		for _, row in df_elec.iterrows():
			cursor.execute("INSERT INTO suburbs VALUES (%s, %s)", (row.postcode, row.suburb))
			cursor.execute("INSERT INTO electricity VALUES (%s, %s, %s)", (row.total_electricity_kwh, row.average_intensity_kwh_per_customer_per_annum, row.postcode))
			cursor.execute("INSERT INTO emissions VALUES (%s, %s, %s)", (row.total_elec_and_gas_co2_emissions, row.avg_elec_and_gas_co2_emissions, row.postcode))

		for _, row in df_gas.iterrows():
			cursor.execute("INSERT INTO gas VALUES (%s, %s, %s)", (row.total_gas_gj, row.average_intensity_gj_per_customer_per_annum, row.postcode))

		connection.commit()

# mysql -h onboarding-ta21.mysql.database.azure.com -u lleyton -p
# ta21-caseyemissions
def main():
	with connect(host = "onboarding-ta21.mysql.database.azure.com", user = "lleyton", password = getpass.getpass()) as connection:
		print("Connected!")
		create_db_and_tables(connection)
		load_data_into_db(connection)

if __name__ == "__main__":
    main()
    

# 	SELECT * FROM emissions;
# +---------------------+-------------------------------------+----------+
# | total_co2_emissions | avg_emissions_per_customer_per_year | postcode |
# +---------------------+-------------------------------------+----------+
# |            13062677 |                                  29 | 3156     |
# |            37801674 |                                  16 | 3177     |
# |            63189513 |                                  19 | 3802     |
# |            72959492 |                                  17 | 3803     |
# |            56975288 |                                  26 | 3804     |
# |            74421495 |                                  17 | 3805     |
# |            87311243 |                                  18 | 3806     |
# |            16786510 |                                  22 | 3807     |
# |           107451247 |                                  21 | 3912     |
# |            26820742 |                                  20 | 3975     |
# |            85705644 |                                  17 | 3976     |
# |           155836905 |                                  17 | 3977     |
# |            52349680 |                                  16 | 3978     |
# +---------------------+-------------------------------------+----------+