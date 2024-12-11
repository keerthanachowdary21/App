import googleLogo from '../assets/icons/google-logo.png';
import { signInWithGooglePopup } from '../firebase.utils';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../Redux/action';
import logo from '../assets/logo/logo.png';
import Photo1 from '../assets/images/photo1.jpg';
import Photo2 from '../assets/images/photo2.jpg';
import Photo3 from '../assets/images/photo3.jpg';
import Photo4 from '../assets/images/photo4.jpg';
import Photo5 from '../assets/images/photo5.jpg';
import Photo6 from '../assets/images/photo6.jpg';
import Photo7 from '../assets/images/photo7.jpg';
import Photo8 from '../assets/images/photo8.jpg';
import Photo9 from '../assets/images/photo9.jpg';



function Login(){
    const firestore = getFirestore();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logGoogleUser = async () => {
        const result = await signInWithGooglePopup();
        console.log(result);
        const user = result.user;
        const additionalUserInfo = result._tokenResponse; // Use this to check additional details

        let newUserData = {
            name: user.displayName,
            bio: "Hello there",
            profile: user.photoURL,
            cover: "keerthana_6755f4741c9299.44817232.jpg",
            timestamp: Date.now()
        }
        // Check if the response is new or returning user
        if (additionalUserInfo && additionalUserInfo.isNewUser) {
            console.log('Welcome, new user!');
            const userRef = doc(firestore, 'users', user.uid);
            await setDoc(userRef, newUserData);
            console.log('New user data inserted successfully.');
        // Additional logic for new users
        } else {
            console.log('Welcome back, returning user!');
        }
        dispatch(addUser(newUserData));
        newUserData.id = user.uid;
        localStorage.setItem('user', JSON.stringify(newUserData));
        console.log('User Info:', user);
        navigate('/');
    }

    return (
        <div className="container relative overflow-hidden h-[100vh]">
            <div className="row"> 
                <div class="column">
                    <img src={Photo1} style={{width: "100%"}} alt="social media"/>
                    <img src={Photo2} style={{width: "100%"}} alt="social media"/>
                    <img src={Photo3} style={{width: "100%"}} alt="social media"/>
                </div>
                <div class="column">
                    <img src={Photo4} style={{width: "100%"}} alt="social media"/>
                    <img src={Photo5} style={{width: "100%"}} alt="social media"/>
                    <img src={Photo6} style={{width: "100%"}} alt="social media"/>
                </div>  
                <div class="column">
                    <img src={Photo7} style={{width: "100%"}} alt="social media"/>
                    <img src={Photo8} style={{width: "100%"}} alt="social media"/>
                    <img src={Photo9} style={{width: "100%"}} alt="social media"/>
                </div>
            </div>
            <div className="bg-white h-[350px] pt-[50px] rounded-t-[50px] fixed md:absolute bottom-0 left-0 right-0 justify-items-center">
                <h3 className='text-[28px] flex font-semibold'><img src={logo} className='w-[50px]'alt="Logo"/> Vibesnap</h3>
                <h5 className="text-[16px] font-normal mb-[30px]">Moments That Matter, Shared Forever.</h5>
                <button onClick={logGoogleUser} className="bg-black text-white px-6 py-3 rounded-full flex gap-x-2">
                    <img src={googleLogo} className="h-6" alt="Google Logo"/>Continue with Google
                </button>
            </div>
        </div>

    )
}

export default Login;