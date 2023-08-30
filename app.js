import express from 'express';
import commentsRouter from './routes/comments.js';
import postsRouter from './routes/posts.js';
import connect from './schemas/index.js';
import ErrorHandlerMiddleware from './middlewares/error-handler.js';

const app = express();
const PORT = 3001;

connect();

//  Express에서 req.body에 접근하여, body 데이터를 사용할 수 있도록 설정하는 미들웨어 , post 메서드는 클라이언트가 전달하는 데이터를 수신, 이 때, Express.js에서 req.body에 접근하여 사용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

// 미들웨어를 사용하게 해주는 코드 -> / 경로로 거치는 경우에만 json 미들웨어를 거친뒤 router로 연결
app.use('/', [commentsRouter, postsRouter]);

// 에러 핸들링 미들웨어를 등록합니다.
app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
