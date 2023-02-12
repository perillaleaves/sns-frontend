import { useEffect, useLayoutEffect, useRef, useState } from "react";
import EllipsisSvg from "../../Assets/SVG/EllipsisSvg";
import UserNickName from "../../sass/styled-components/UserNickName";
import UserPhoto from "../../sass/styled-components/UserPhoto";
import { timeFormat } from "../../utills/function/function";
import InteractionBar from "../../Components/InteractionBar/InteractionBar";
import "./PostModal.scss";
import API from "../../API/API";
import PostComments from "../../Views/PostComments/PostComments";
import { useRecoilState, useSetRecoilState } from "recoil";
import { commentsType } from "../../types/APIType";
import { commentState } from "../../recoil/snsState";

interface PostModalProps {
  toggleModal: (e: any) => void;
  postId: number;
}
export const useIsOverflow = (ref: any, callback: any) => {
  const [isOverflow, setIsOverflow] = useState<any>(undefined);

  useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current.scrollHeight > current.clientHeight;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};
const PostModal = ({ toggleModal, postId }: PostModalProps) => {
  const [likes, setLikes] = useState<number>(0);
  const [postItem, setPostItem] = useState<any>();
  const [viewComments, setViewComments] = useState(false);
  const [comments, setComments] = useRecoilState<any>(commentState);
  const ref = useRef();
  const isOverflow = useIsOverflow(ref, (isOverflowFromCallback: any) => {
    console.log(isOverflowFromCallback);
  });
  const [more, setMore] = useState(isOverflow);
  const getPost = async () => {
    const response = await API.getPost({ postId });
    setPostItem(response?.data.data.postDetailResponse);
    setLikes(response?.data.data.postDetailResponse.postLikeSize);
  };
  const deletePost = async () => {
    try {
      const response = await API.deletePost({ postId });
    } catch (error: any) {
      alert(error?.message);
    }
  };
  const onClickComments = async () => {
    const response = await API.getComments({ postId });
    setViewComments(!viewComments);
    setComments(response.data.data.postAndCommentsResponse.commentResponses);
  };
  useEffect(() => {
    console.log("modal");
    getPost();
    document.body.style.cssText = `overflow-y: hidden`;
    console.log(comments);
    return () => {
      document.body.style.cssText = `overflow-y: auto`;
      setComments([]);
      console.log("화면에 사라짐", open);
    };
  }, [open]);
  return (
    <>
      {postItem && (
        <div className="background" onClick={toggleModal}>
          <section className="PostModal">
            <div className="PostModal__top">
              <span className="PostModal__top--left">
                <UserPhoto
                  size="44px"
                  userProfileImage={postItem.userProfileImageURL}
                />
                <UserNickName nickName={postItem.nickName} />
              </span>
              <span className="PostModal__top--right">
                <EllipsisSvg deletePost={deletePost} />
              </span>
            </div>
            <div className="PostModal__main">
              <img src={postItem.postImageUrl1} alt="sample" />
            </div>
            <div className="PostModal__bottom">
              <InteractionBar
                likes={likes}
                setLikes={setLikes}
                postId={postItem.postId}
                isLike={postItem.like}
              />
              <div className="PostModal__bottom--likes">{likes} likes</div>
              <div className="PostModal__bottom--content">
                <span
                  style={
                    more ? { display: "inline" } : { display: "-webkit-box" }
                  }
                  ref={ref as any}
                >
                  <b>{postItem.nickName}</b> {postItem.content}
                </span>
                {isOverflow && (
                  <span onClick={() => setMore(!more)}>더보기</span>
                )}
              </div>
              <div className="PostModal__bottom--comments">
                <span onClick={onClickComments}>
                  View all {postItem.commentSize} comments
                </span>
                {viewComments && <PostComments />}
              </div>
              <div className="PostModal__bottom--posted-at">
                {timeFormat(postItem?.updatedAt)}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default PostModal;
