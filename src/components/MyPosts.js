import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase.utils';
import { useEffect, useState } from 'react';

function MyPosts(props){
    const [myPosts, setMyPosts] = useState(null);

    async function getPostsByUserId(userId) {
        try {
          const postsRef = collection(firestore, 'posts');
          const q = query(postsRef, where('user_id', '==', userId));
      
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
      
          if (posts.length > 0) {
            console.log(posts);
            setMyPosts(posts);
          } else {
            return [];
          }
        } catch (error) {
          console.error('Error getting documents:', error);
        }
    }

    useEffect(() => {
        getPostsByUserId(props.userData.id);
    }, [])

    return (
        myPosts && (
            <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Posts</h2>
            <div className="columns-2 md:columns-3 gap-3">
              {myPosts.map(post => (
                <>
                  <div className='relative my-3'>
                    <div key={post.id} className="break-inside-avoid flex overflow-x-auto hide-scrollbar">
                      {post.assets.map((postImg, index) => (
                        <img
                          key={index}
                          src={`${process.env.REACT_APP_IMAGE_PREFIX}${postImg}`}
                          alt="Post"
                          className="w-full h-auto object-cover rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                    <div className='absolute bottom-0 p-1.5'>
                      <p className='w-[17ch] whitespace-nowrap overflow-hidden text-ellipsis text-white font-semibold'>{post.content}</p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>)
    )
}

export default MyPosts;