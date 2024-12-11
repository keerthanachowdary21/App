import Loader from '../assets/Iphone-spinner-2.gif';

function LoaderComp(){
    return (
        <div className="fixed top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%]">
            <img src={Loader} alt="Loading..."/>
        </div>
    )
}

export default LoaderComp;