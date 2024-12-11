function ProfileInfo(props){
    return (
        <div className="p-4">
            <h1 className="text-[24px] font-extrabold">{props.name}</h1>
            <p>{props.bio}</p>
        </div>
    )
}

export default ProfileInfo;