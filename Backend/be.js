const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sql = require('mssql');

// Configuration for the database connection
const config = {
  server: "carbon21.database.windows.net",
  database: "carbon21",
  user: "sama0003",
  password: "Amandas123",
  port: 1433,
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: true, // Set to true for secure connections
  },
};

async function createDbAndTables() {
  try {
    await sql.connect(config);
    console.log('Connected to the database.');

    // Create the database if it doesn't exist
    await sql.query('CREATE DATABASE IF NOT EXISTS TA21');

    // Change to the newly created database
    await sql.query('USE TA21');

    // Create the suburbs table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS suburbs (
        postcode CHAR(4) PRIMARY KEY,
        name VARCHAR(150)
      )
    `);

    // Create the electricity table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS electricity (
        total_electricity_usage INT,
        avg_usage_per_customer_per_year INT,
        postcode CHAR(4),
        FOREIGN KEY (postcode) REFERENCES suburbs(postcode)
      )
    `);

    // Create the gas table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS gas (
        total_gas_usage INT,
        avg_usage_per_customer_per_year INT,
        postcode CHAR(4),
        FOREIGN KEY (postcode) REFERENCES suburbs(postcode)
      )
    `);

    // Create the emissions table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS emissions (
        total_co2_emissions INT,
        avg_emissions_per_customer_per_year INT,
        postcode CHAR(4),
        FOREIGN KEY (postcode) REFERENCES suburbs(postcode)
      )
    `);

    console.log('Database and tables created successfully.');
  } catch (err) {
    console.error('Error creating database and tables:', err.message);
  } finally {
    // Close the connection
    sql.close();
  }
}

async function loadCsvData() {
  try {
    await sql.connect(config);
    console.log('Connected to the database.');

    const data = [];

    fs.createReadStream('Onboarding/summary-residential-community-data.csv')
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', async () => {
        const filteredData = data.filter((row) => row.year === '2022');
        const electricityData = filteredData.filter((row) => row.emission_source === 'Electricity');
        const gasData = filteredData.filter((row) => row.emission_source === 'Gas');

        // Perform data insertion into tables
        await insertDataIntoSuburbsTable(filteredData);
        await insertDataIntoElectricityTable(electricityData);
        await insertDataIntoGasTable(gasData);
        await insertDataIntoEmissionsTable(electricityData);

        console.log('Data inserted successfully.');
      });
  } catch (err) {
    console.error('Error loading CSV data:', err.message);
  } finally {
    // Close the connection
    sql.close();
  }
}

async function insertDataIntoSuburbsTable(data) {
  const pool = await sql.connect(config);
  const insertSuburbsQuery = 'INSERT INTO suburbs (postcode, name) VALUES (@postcode, @name)';

  try {
    const request = pool.request();
    for (const row of data) {
      await request.input('postcode', sql.Char(4), row.postcode)
                   .input('name', sql.VarChar(150), row.suburb)
                   .query(insertSuburbsQuery);
    }
  } catch (err) {
    console.error('Error inserting data into suburbs table:', err.message);
  }
}

async function insertDataIntoElectricityTable(data) {
  const pool = await sql.connect(config);
  const insertElectricityQuery = 'INSERT INTO electricity (total_electricity_usage, avg_usage_per_customer_per_year, postcode) VALUES (@usage, @avg_usage, @postcode)';

  try {
    const request = pool.request();
    for (const row of data) {
      await request.input('usage', sql.Int, row.total_electricity_kwh)
                   .input('avg_usage', sql.Int, row.average_intensity_kwh_per_customer_per_annum)
                   .input('postcode', sql.Char(4), row.postcode)
                   .query(insertElectricityQuery);
    }
  } catch (err) {
    console.error('Error inserting data into electricity table:', err.message);
  }
}

async function insertDataIntoGasTable(data) {
  const pool = await sql.connect(config);
  const insertGasQuery = 'INSERT INTO gas (total_gas_usage, avg_usage_per_customer_per_year, postcode) VALUES (@usage, @avg_usage, @postcode)';

  try {
    const request = pool.request();
    for (const row of data) {
      await request.input('usage', sql.Int, row.total_gas_gj)
                   .input('avg_usage', sql.Int, row.average_intensity_gj_per_customer_per_annum)
                   .input('postcode', sql.Char(4), row.postcode)
                   .query(insertGasQuery);
    }
  } catch (err) {
    console.error('Error inserting data into gas table:', err.message);
  }
}

async function insertDataIntoEmissionsTable(data) {
  const pool = await sql.connect(config);
  const insertEmissionsQuery = 'INSERT INTO emissions (total_co2_emissions, avg_emissions_per_customer_per_year, postcode) VALUES (@emissions, @avg_emissions, @postcode)';

  try {
    const request = pool.request();
    for (const row of data) {
      await request.input('emissions', sql.Int, row.total_emissions_kg_co2e)
                   .input('avg_emissions', sql.Int, row.average_emissions_energy_per_customer_kg_co2e_per_day)
                   .input('postcode', sql.Char(4), row.postcode)
                   .query(insertEmissionsQuery);
    }
  } catch (err) {
    console.error('Error inserting data into emissions table:', err.message);
  }
}

async function main() {
  await createDbAndTables();
  await loadCsvData();
}

main();
