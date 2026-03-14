import { Sequelize } from "sequelize";  //3.2 импортировать Sequelize из пакета sequelize
import dotenv from "dotenv";    //3.3 импортировать dotenv для загрузки переменных окружения из файла .env

dotenv.config();

const sequelize = new Sequelize(    //3.4 создать объект sequelize с параметрами подключения
  process.env.DB_NAME,       // Имя базы данных
  process.env.DB_USER,       // Имя пользователя
    process.env.DB_PASSWORD,   // Пароль
    {
        host: process.env.DB_HOST,   // Хост базы данных
        port: process.env.DB_PORT,   // Порт базы данных
        dialect: 'postgres',         // Диалект базы данных
        logging: false,              // Отключить логирование SQL-запросов
    }
);

export const authenticate = async () => {   //3.5 создать функцию authenticate для проверки подключения к базе данных
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default sequelize;