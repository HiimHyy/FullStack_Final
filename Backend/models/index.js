import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Make sure to include a fallback for the database URL in case it's not set in the .env file
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://lawunn:@localhost:5432/activities', {
  dialect: 'postgres',
  logging: false, // Turn off logging or customize it as needed
});

// Define your Activity model
const Activity = sequelize.define('Activity', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true, // Allows the URL to be optional
  },
}, {
  // Other model options go here
});

// Function to establish database connection and synchronize models
const connectAndSyncDb = async () => {
  try {
    await sequelize.authenticate(); // Try to authenticate with the database
    console.log('Connection has been established successfully.');
    await sequelize.sync(); // Synchronize all models with the database
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Execute the function to ensure the database is ready to be used
connectAndSyncDb();

export { sequelize, Activity };
