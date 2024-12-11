import blackBack from '../assets/icons/back-black.png';
import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase.utils"; 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPost(){
    const [inputValue, setInputValue] = useState(null);
    const [uploadedFile, SetUploadedFiles] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
      SetUploadedFiles(JSON.parse(localStorage.getItem('uploadedFiles')));
    }, []);


    const handleAddPost = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
      
        if (!currentUser) {
          console.error("No user is logged in");
          return;
        }
      
        const user_id = currentUser.uid; // Get the logged-in user's UID
      
        const postData = {
          content: inputValue,
          assets: uploadedFile,
          timestamp: Date.now(),
          user_id: user_id,
        };
      
        try {
          const docRef = await addDoc(collection(firestore, "posts"), postData);
          localStorage.removeItem('uploadedFiles');
          navigate('/');
        } catch (error) {
          console.error("Error adding post: ", error);
        }
      };

    return (
        <div className="container relative">
            <div className="px-4">
                {/* top */}
                <div className='flex pt-[25px]'>
                    <button onClick={() => navigate('/')}><img className="w-[32px] " src={blackBack} alt="BlackBack"/></button>
                    <p className='text-[20px] font-semibold ml-[15px] text-black'>New Post</p>
                </div>

                {/* Image/video preview */}
                <div className='flex w-[280px] h-[285px] mx-auto overflow-x-scroll scrollbar-hidden mt-6 mb-4 hide-scrollbar'>

                {uploadedFile &&
                  uploadedFile.map((element, index) => (
                    <>
                    <div key={index} className='relative w-[280px] h-[285px] flex-shrink-0 mx-1'>
                      <p className='absolute right-0 w-[31px] h-[20px] bg-white rounded-[10px] text-[12px] leading-[19px] text-center font-semibold m-[10px]'>
                        {index + 1}/{uploadedFile.length}
                      </p>
                      {element.match(/\.(jpeg|jpg|png|gif)$/) ? (
                        <img
                          className='w-[280px] h-[285px] object-cover mx-auto rounded-[12px] flex-shrink-0'
                          src={process.env.REACT_APP_IMAGE_PREFIX + element}
                          alt={`Uploaded file ${index + 1}`}
                        />
                      ) : element.match(/\.(mp4|webm|ogg)$/) ? (
                        <video
                          className='w-[280px] h-[285px] object-cover mx-auto rounded-[12px] flex-shrink-0'
                          controls
                          autoPlay
                          muted
                        >
                          <source src={process.env.REACT_APP_IMAGE_PREFIX + element} type={`video/${element.split('.').pop()}`} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className='w-[280px] h-[285px] bg-gray-200 flex items-center justify-center rounded-[12px]'>
                          <p className='text-center text-gray-500'>Unsupported file type</p>
                        </div>
                      )}
                    </div>
                    </>
                  ))
                }
                </div>

                {/* textarea */}
                <textarea onChange={(e) => setInputValue(e.target.value)} className="min-h-[200px] border-0" placeholder='Write something about post here...'></textarea>
            </div>
            {/* create button */}
            <div className='w-full absolute bottom-[40px] px-4'>
                <button onClick={() => handleAddPost()} className="w-full bg-black text-white h-[48px] rounded-[36px]">CREATE</button>
            </div>
        </div>
    )
}

export default NewPost;