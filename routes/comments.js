import express from 'express';
import Posts from '../schemas/post.js';
import Comments from '../schemas/comment.js';

const router = express.Router();

/** 댓글 목록 조회 API 
 * - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
    - 작성 날짜 기준으로 내림차순 정렬하기
*/
router.get('/posts/:_postId/comments', async (req, res, next) => {
  try {
    const { _postId } = req.params;
    const comments = await Comments.find({ postId: _postId })
      .sort('-createdAt')
      .exec();
    const commentsList = comments.map((comment) => {
      return {
        commentId: comment._id,
        user: comment.user,
        content: comment.content,
        createdAt: comment.createdAt,
      };
    });
    return res.status(200).json({ data: commentsList });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

//제일 처음에 보낼 때는 괜찮았는데 중복해서 보내니 MongoServerError: E11000 duplicate key error collection: node_level1.comments index: commentId_1 dup key: { commentId: null }
//오류 뜸, mongodb 컬렉션을 새로 만들어서 보내니까 해결됨
/** 댓글 작성 API 
 * - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
*/
router.post('/posts/:_postId/comments', async (req, res, next) => {
  try {
    const { _postId } = req.params;
    // console.log(_postId);
    const { user, password, content } = req.body;
    // 먼저 댓글 내용이 비워있는지 확인
    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    const createdComments = await Comments.create({
      user,
      password,
      content,
      createdAt: new Date(),
      postId: _postId, // postId값을 만들어야 위에 조회에서 인식이 가능함
    });

    await createdComments.save();

    return res.status(201).json({ message: '댓글을 생성하였습니다.' });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

/** 댓글 수정 API 
 * - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
*/
router.put('/posts/:_postId/comments/:_commentId', async (req, res, next) => {
  try {
    const { _postId, _commentId } = req.params;
    const { password, content } = req.body;

    // 댓글 내용이 없으면 에러처리
    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    // 게시글 조회
    const post = await Posts.findOne({ _id: _postId }).exec();

    //댓글 조회
    const comment = await Comments.findOne({ _id: _commentId }).exec();
    if (!comment) {
      return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
    }

    //비밀번호 확인
    if (password === post.password) {
      // 댓글 내용 수정
      comment.content = content;
      await comment.save();

      return res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } else {
      return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

// (postId , commentId )받아와서 찾는 거
/** 댓글 삭제 API
 * - 원하는 댓글을 삭제하기
 */
router.delete(
  '/posts/:_postId/comments/:_commentId',
  async (req, res, next) => {
    try {
      const { _postId, _commentId } = req.params;
      const { password } = req.body;

      const post = await Posts.findById(_postId).exec();
      const comment = await Comments.findById(_commentId).exec();

      if (!comment) {
        return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      }

      //댓글 비밀번호 확인
      if (password === comment.password) {
        await Comments.deleteOne({ _id: _commentId });
        return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
      } else {
        return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
  }
);

export default router;
