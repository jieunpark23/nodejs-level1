// /schemas/post.js

import mongoose from 'mongoose';

// 게시글(post)에 대한 정보를 나타내는 스키마를 정의합니다.
const postSchema = new mongoose.Schema({
  user: {
    type: String, // 게시글 user 의 타입을 나타냅니다.
    required: true, // 필수 항목입니다.
  },
  password: {
    type: String, // 비밀번호를 나타냅니다.
    required: true, // 필수 항목입니다.
  },
  title: {
    type: String, // 게시글의 제목을 나타냅니다.
    required: true, // 필수 항목입니다.
  },
  content: {
    type: String, // 게시글의 내용을 나타냅니다.
    required: true, // 필수 항목입니다.
  },
  createdAt: {
    type: Date, // createdAt 필드는 Date 타입을 가집니다.
    required: false,
    default: Date.now,
  },
});

// 위에서 정의한 스키마를 이용하여 'Posts'라는 이름의 모델을 생성합니다.
export default mongoose.model('Posts', postSchema);
