// /schemas/index.js

// mongoose 사용해서 mongoDB 연결
import mongoose from 'mongoose';

const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://<ID>:<비밀번호>@express-mongo.uy7ttg7.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'nodejs_level1', // node_level1 데이터베이스명을 사용합니다.
      }
    )
    .catch((err) => console.log(err))
    .then(() => console.log('몽고디비 연결 성공'));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

export default connect;
