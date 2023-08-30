// 작성은 했지만 시간상 사용 못 함.
// 에러 핸들링 미들웨어
export default (err, req, res, next) => {
  // console.log("에러처리 미들웨어가 실행되었습니다."); // 잘 작동하는지 확인하려고 적음
  console.error(err);

  // joi에서 발생된 에러라면 status 400, 게시글이 존재하지 않을 때 발생하는 에러라면 status 404
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  return res.status(500).json({ message: '서버에서 에러가 발생했습니다.' });
};
