import InfiniteScrollPosts from './InfiniteScrollPosts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SharePost from './SharePost';

function Home() {
  const [userData, setUserData] = useState(null);
  const [sharePostId, setSharePostId] = useState(null);
  const navigate = useNavigate();

  const getUserData = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserData(storedUser);
  };

  const sharePost = (postId) => {
    setSharePostId(postId);
  }

  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {
    if (sharePostId) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling
    }
  }, [sharePostId]);

  return (
    <>
    <div className={`container p-4 ${sharePostId ? 'opacity-50' : ''}`}>
      {userData &&
      <div className='flex' onClick={() => navigate('/profile')}>
        <img class="w-[50px] h-[50px] object-cover rounded-full" 
        src={userData.profile}
        alt="Profile"
        />
        <div className='ml-3 mt-1'>
          <p className='text-[12.4px] text-gray-500'>Welcome Back,</p>
          <h4>{userData.name}</h4>
        </div>
      </div>}

      <h1 className='font-extrabold text-[24px] leading-[28.06px] mt-6 mb-4'>Feeds</h1>
      <div>
        <InfiniteScrollPosts sharePost={sharePost}/>
      </div>
    </div>
    {sharePostId && <SharePost sharePost={sharePost}/>
      }
    </>
  );
}

export default Home;