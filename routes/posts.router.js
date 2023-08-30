// 1. 라우터를 만드려고 express에서 라우터를 받아옴.
import express from 'express';
import Posts from '../schemas/post.js';

// 2. router 생성
const router = express.Router();

/** 전체 게시글 목록 조회 API 
 *  - 제목, 작성자명, 작성 날짜를 조회하기
    - 작성 날짜 기준으로 내림차순 정렬하기
*/
router.get('/posts', async (req, res, next) => {
  const posts = await Posts.find().sort('-createdAt').exec();
  const postsList = posts.map((post) => ({
    postId: post._id,
    user: post.user,
    title: post.title,
    createdAt: post.createdAt,
  }));

  return res.status(200).json({ data: postsList });
});

/** 게시글 작성 API
 *  - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
 */
router.post('/posts', async (req, res, next) => {
  const { user, password, title, content, createdAt } = req.body;

  const posts = await Posts.find({ user }).exec();
  if (posts.length) {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  const createdPosts = await Posts.create({
    user,
    password,
    title,
    content,
    createdAt,
  });

  await createdPosts.save();

  return res.status(201).json({ message: '게시글을 생성하였습니다.' });
});

/** 게시글 상세 조회 API 
 * - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기 
    (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
*/
router.get('/posts/:_postId', async (req, res, next) => {
  try {
    // 게시글의 id 값을 가져옵니다.
    const { _postId } = req.params;
    const post = await Posts.findOne({ _id: _postId }).exec();

    const formattedPost = {
      postId: post._id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };

    return res.status(200).json({ data: formattedPost });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

/** 게시글 수정 API
 * - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
 */
router.put('/posts/:_postId', async (req, res, next) => {
  try {
    const { _postId } = req.params;
    const { password, title, content } = req.body;

    const currentPost = await Posts.findById(_postId).exec();
    if (!currentPost) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    }
    // 클라이언트가 전달한 비밀번호와 저장된 게시글의 비밀번호를 비교
    if (password === currentPost.password) {
      currentPost.title = title;
      currentPost.content = content;
      await currentPost.save();

      return res.status(200).json({ message: '게시글을 수정하였습니다.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
  }
});

/** 게시글 삭제 API
 * - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
 */
router.delete('/posts/:_postId', async (req, res) => {
  try {
    const { _postId } = req.params;
    const { password } = req.body;

    const currentPost = await Posts.findById(_postId).exec();
    if (!currentPost) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    }
    // 클라이언트가 전달한 비밀번호와 저장된 게시글의 비밀번호를 비교
    if (password === currentPost.password) {
      await Posts.deleteOne({ _id: _postId });
      return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

// app.js에서 사용하기 위해 내보내는 코드
export default router;
