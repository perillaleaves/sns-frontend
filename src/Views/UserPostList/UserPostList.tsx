import React from "react";
import IsLoding from "../../Components/IsLoding/IsLoding";
import { GreetingPropTypes, post } from "../../Pages/UserPage/UserPage";
import "./UserPostList.scss";

const UserPostList = ({ posts, isLoding }: GreetingPropTypes) => {
  return (
    <ul className="UserPostList">
      {posts &&
        posts.map((post: post) => {
          return (
            <li className="UserPostList__item" key={post.postId}>
              <span className="UserPostList__item--img">
                <img
                  // src={require(`/Users/blanc/Documents/Project/sns/src/Assets/cat${item.id}.png`)}
                  src={post.postImageUrl}
                  alt="post"
                />
              </span>
            </li>
          );
        })}
      {isLoding && <IsLoding height="20" />}
    </ul>
  );
};

export default React.memo(UserPostList);
