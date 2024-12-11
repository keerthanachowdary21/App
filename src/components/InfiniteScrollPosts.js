import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import { firestore } from '../firebase.utils'; // Adjust to your Firebase config file
import InfiniteScroll from 'react-infinite-scroll-component';
import heart from '../assets/icons/heart.png';
import share from '../assets/icons/share.png';

function InfiniteScrollPosts(props) {
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const videoRefs = useRef([]);

  // Auto-pause videos when not in view
  useEffect(() => {
    const videoElements = videoRefs.current; // Copy to stable reference

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Trigger when 50% of the video is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play(); // Play video when in view
        } else {
          video.pause(); // Pause video when out of view
        }
      });
    }, options);

    videoElements.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videoElements.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, []);

  // Fetch posts from Firestore
  const fetchPosts = useCallback(
    async (isInitial = false) => {
      try {
        const postsRef = collection(firestore, 'posts');
        const postsQuery = isInitial
          ? query(postsRef, orderBy('timestamp', 'desc'), limit(20))
          : query(postsRef, orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(20));

        const querySnapshot = await getDocs(postsQuery);

        if (querySnapshot.empty) {
          setHasMore(false);
          return;
        }

        const newPosts = [];

        for (const postDoc of querySnapshot.docs) {
          const postData = {
            id: postDoc.id,
            ...postDoc.data(),
          };

          // Fetch user details
          const userRef = doc(firestore, 'users', postData.user_id);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            postData.userDetails = userDoc.data();
          } else {
            console.warn(`User with ID ${postData.user_id} not found.`);
          }

          newPosts.push(postData);
        }

        setPosts((prevPosts) => (isInitial ? newPosts : [...prevPosts, ...newPosts]));
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    [lastVisible]
  );

  // Initial fetch
  useEffect(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const timeAgo = (timestamp) => {
    const current = Date.now();
    const diff = current - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => fetchPosts(false)}
      hasMore={hasMore}
      loader={<h1>...</h1>}
      endMessage={<p style={{ textAlign: 'center' }}>You have seen it all!</p>}
    >
      <div className="posts">
        {posts.map((post, postIndex) => (
          <div key={post.id} className="post my-2 p-3 rounded-[20px]">
            <div className="creator-info flex gap-x-[10px]">
              <img
                className="w-[40px] h-[40px] object-cover rounded-full"
                src={post.userDetails.profile}
                alt="Profile"
              />
              <div>
                <p>{post.userDetails.name}</p>
                <p className="text-[10px] text-gray-500">{timeAgo(post.timestamp)}</p>
              </div>
            </div>
            <h3 className="my-3">{post.content}</h3>
            <div className="post-image-container">
              {post.assets &&
                post.assets.map((url, index) => {
                  const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

                  return isVideo ? (
                    <video
                      key={index}
                      ref={(el) => (videoRefs.current[postIndex] = el)}
                      className="object-cover"
                      controls
                      autoPlay
                      muted
                      src={`${process.env.REACT_APP_IMAGE_PREFIX}${url}`}
                      alt={`Post ${post.id}`}
                    />
                  ) : (
                    <img
                      key={index}
                      className="object-cover"
                      src={`${process.env.REACT_APP_IMAGE_PREFIX}${url}`}
                      alt={`Post ${post.id}`}
                    />
                  );
                })}
            </div>
            <div className="mt-2 flex justify-between">
              <button className="flex gap-1 text-red-500 font-semibold mt-1">
                <img className="w-[20px] mt-[2px]" src={heart} alt="Heart" /> 67
              </button>
              <button
                onClick={() => props.sharePost(post.id)}
                className="bg-[#0000001A] h-[32px] w-[92px] rounded-[30px] font-bold flex justify-center items-center"
              >
                <img className="w-[17px]" src={share} alt="Share" />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default InfiniteScrollPosts;
