import { useState, useEffect } from 'react';
import backIcon from '../assets/icons/back.png';
import ProfileInfo from './ProfileInfo';
import EditIcon from '../assets/icons/edit.png';
import plus from '../assets/icons/plus.png';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebase.utils'; // Ensure you have your Firebase config set up
import { useNavigate } from 'react-router-dom';
import MyPosts from './MyPosts';
import LoaderComp from './LoaderComp';

function Profile() {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState(null);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const db = getFirestore(firebaseApp);

    const updateProfileDataPost = async () => {
        setLoader(true);
        try {
            const userRef = doc(db, 'users', userData.id); // 'users' is the collection, 'userId' is the document ID

            // Update the document with new data
            await updateDoc(userRef, userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setStep(1);
        } catch (error) {
            console.error('Error updating document:', error);
        }
        setLoader(false);
    }

    const getUserData = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUserData(storedUser);
    };

    useEffect(() => {
        getUserData();
    }, [])



    const handleFileChange = async (e) => {
        setLoader(true);
        const files = Array.from(e.target.files); // Convert FileList to Array
        const uploadedFileNames = [];
        const maxSize = 1.1 * 1024 * 1024; // 1 MB in bytes

        for (const file of files) {
            // Check if the file size exceeds 1 MB
            if (file.size >= maxSize) {
                alert(`The file "${file.name}" exceeds 1 MB. Select a file with a maximum size of 1 MB.`);
                setLoader(false);
                return; // Stop processing further files
            }
            
            const formData = new FormData();
            formData.append('mediaFile', file);

            try {
                const response = await fetch('https://51.68.207.190/testing_d/keerthana/the-alter-office/index.php', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data.status === 'success') {
                    uploadedFileNames.push(data.file_name); // Add file name to array
                } else {
                    console.error(`Failed to upload ${file.name}: ${data.message}`);
                }
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
            }
        }

        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFileNames));
        setLoader(false);
        navigate('/new-post')
    };

    const coverFileEdit = async (type, e) => {
        setLoader(true);

        const file = e.target.files[0];
        const maxSize = 1.1 * 1024 * 1024; // 1 MB in bytes

        if (file.size >= maxSize) {
            alert(`The file "${file.name}" exceeds 1 MB. Select a file with a maximum size of 1 MB.`);
            setLoader(false);
            return; // Stop processing further files
        }

        const formData = new FormData();
        formData.append('mediaFile', file);

        try {
            const response = await fetch('https://51.68.207.190/testing_d/keerthana/the-alter-office/index.php', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.status === 'success') {
                if(type === "profile"){
                    setUserData({...userData, profile : process.env.REACT_APP_IMAGE_PREFIX+data.file_name})
                }else{
                    setUserData({...userData, cover : data.file_name})
                }
            } else {
                console.error(`Failed to upload ${file.name}: ${data.message}`);
            }
        } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
        }
        setLoader(false);
    }



    const backBtnFunction = () => {
        if (step === 2) {
            setStep(1);
            return;
        }

        navigate('/');
    }
    return (
        userData && (
            <div className="container relative">
                <div>
                    <div className='absolute flex mt-[25px] ml-[16px]'>
                        <button onClick={backBtnFunction}><img className="w-[32px] " alt="BackIcon" src={backIcon} /></button>
                        {step === 2 &&
                            <p className='text-[20px] font-semibold text-white ml-[15px]'>Edit Profile</p>
                        }
                    </div>
                    <img
                        className="max-h-[189px] w-full object-cover rounded-b-[20px]"
                        src={`${process.env.REACT_APP_IMAGE_PREFIX}${userData.cover}`}
                        alt="Cover-alt"
                    />
                    
                    {/* cover image edit icon */}
                    {step === 2 &&
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                id="cover-image-upload"
                                className="hidden"
                                onChange={(event) => coverFileEdit('cover', event)}
                            />
                            <label htmlFor="cover-image-upload">
                                <img
                                    className="w-[25px] bg-[#c2c2c2] absolute right-[13px] -mt-[36px] p-[5px] rounded-[15px] z-10"
                                    src={EditIcon}
                                    alt="edit"
                                />
                            </label>
                        </>}
                </div>
                <div className='flex relative px-4 -mt-[60px] space-between justify-between'>
                    <img
                        className="h-[112px] w-[112px] object-cover rounded-full"
                        src={userData.profile}
                        alt="profile"
                    />
                    {/* profile image edit icon */}
                    {step === 2 &&
                        
                        <>
                        <input
                            type="file"
                            accept="image/*"
                            id="profile-image-upload"
                            className="hidden"
                            onChange={(event) => coverFileEdit('profile', event)}
                        />
                        <label htmlFor="profile-image-upload">
                            <img
                                className="w-[25px] bg-[#c2c2c2] absolute p-[5px] mt-[70px] rounded-[15px] left-[105px] z-10"
                                src={EditIcon}
                                alt="edit"
                            />
                        </label>
                    </>}
                    {step === 1 &&
                        <button onClick={() => setStep(2)} className='edit-profile mt-[auto]'>Edit Profile</button>
                    }
                </div>

                {step === 1 ? 
                    <>
                        <ProfileInfo name={userData.name} bio={userData.bio} />
                        <MyPosts userData={userData}/>
                    </>
                    :
                    <>
                        <div className="p-4">
                            <label>Name</label>
                            <br></br>
                            <input onChange={e => setUserData({ ...userData, name: e.target.value })} value={userData.name} type="text" />
                            <label >Bio</label>
                            <br></br>
                            <textarea onChange={e => setUserData({ ...userData, bio: e.target.value })} value={userData.bio} type="text" />
                        </div>
                    </>}

                {step === 2 ?
                    <div className='w-full absolute bottom-[40px] px-4'>
                        <button onClick={updateProfileDataPost} className="w-full bg-black text-white h-[48px] rounded-[36px]">SAVE</button>
                    </div> :
                    (
                        <>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                multiple
                                onChange={handleFileChange}
                            />

                            {/* Image as label */}
                            <label htmlFor="file-upload">
                                <img
                                    className="bg-black p-[9px] rounded-full fixed bottom-[40px] right-[25px] cursor-pointer"
                                    src={plus}
                                    alt="Upload"
                                />
                            </label>
                        </>
                    )
                }
                {loader && <LoaderComp />}

            </div>
        )
    )
}

export default Profile;