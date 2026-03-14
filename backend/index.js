import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js'; //4.1 Импортировать sequelize из db.js
import "./models/User.js";

dotenv.config();

const app = express();          //2.1 создать объект приложения app          

app.use(cors());                //2.2 настроить middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;      //2.3 определить порт, на котором будет работать сервер

app.get('/', (req, res) => {                //2.4 добавить тестовый маршрут GET /, который возвращает JSON с сообщением "Hello, World!"
  res.json({ message: 'Hello, World!' });   
});

sequelize.authenticate()  //4.1	вызвать sequelize.authenticate(), чтобы убедиться, что соединение установлено
  .then(() => {
    console.log('Database connection has been established successfully.');  // 4.1 вывести сообщение в консоль при успешном подключении
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  sequelize.sync({ alter: true })   // 6.3 синхронизировать модель с базой данных 
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
  }
);

app.listen(PORT, () => {                              //3.1 настроить прослушивание сервера на указанном порту
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {                    //3.2 добавить обработку ошибок при запуске
    console.error(`Port ${PORT} is already in use. Please choose a different port.`);
  } else {
    console.error('Server error:', err);
  }
});