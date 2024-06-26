import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Make sure to include a fallback for the database URL in case it's not set in the .env file
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://jessesillman:@localhost:5432/fullstack', {
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed'),
    allowNull: false,
    defaultValue: 'in_progress',
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },


}, {
  // Other model options go here
});

// Define your Task model
const Task = sequelize.define('Task', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
  status: {
    type: DataTypes.ENUM('in_progress', 'completed'),
    allowNull: false,
    defaultValue: 'in_progress',
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  // Other model options go here
  
});

const Tag = sequelize.define('Tag', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const TaskTag = sequelize.define('TaskTag', {
  taskId: {
    type: DataTypes.INTEGER,
    references: {
      model: Task,
      key: 'id',
    },
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: 'id',
    },
  },
});

Task.belongsToMany(Tag, { through: TaskTag, as: 'Tags' });
Tag.belongsToMany(Task, { through: TaskTag, as: 'Tags' });


// Function to establish database connection and synchronize models
const connectAndSyncDb = async () => {
  try {
    await sequelize.authenticate(); // Try to authenticate with the database
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync({ alter: true }); // Synchronize all models with the database
    console.log('Database & tables created!');
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const getStats = async () => {
  try {
    const activitiesCount = await Activity.count();
    const tasksCount = await Task.count();
    const completedTasksCount = await Task.count({ where: { status: 'completed' } });

    return {
      activities: activitiesCount,
      tasks: tasksCount,
      completedTasks: completedTasksCount,
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

export { sequelize, Activity, Task, Tag, TaskTag, getStats, connectAndSyncDb };
