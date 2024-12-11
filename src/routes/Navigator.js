import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import InfiniteScrollPosts from "../components/InfiniteScrollPosts";
import Profile from "../components/Profile";
import NewPost from "../components/Newpost";
import RouteGuard from "./RouteGuard";
import Logout from "../components/Logout";

const Navigator = () => {

    // Route component
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RouteGuard> <Home /> </RouteGuard>}/>
                <Route path="/login" element={ <Login /> }/>
                <Route path="/logout" element={ <Logout /> }/>
                <Route path="/posts" element={ <RouteGuard> <InfiniteScrollPosts /> </RouteGuard> }/>
                <Route path="/profile" element={ <RouteGuard> <Profile /> </RouteGuard> }/>
                <Route path="/new-post" element={ <RouteGuard> <NewPost /> </RouteGuard> }/>
            </Routes>
        </BrowserRouter>
    )
}

export default Navigator;