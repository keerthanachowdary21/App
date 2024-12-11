import React from 'react';
import Twitter from '../assets/icons/twitter.png';
import Facebook from '../assets/icons/facebook.png';
import Reddit from '../assets/icons/reddit.png';
import Discord from '../assets/icons/discord.png';
import WhatsApp from '../assets/icons/whatsapp.png';
import Telegram from '../assets/icons/telegram.png';
import Instagram from '../assets/icons/instagram.png';
import Messenger from '../assets/icons/messenger.png';

const SharePost = (props) => {
  const socialMedia = [
    { name: 'Twitter', icon: Twitter},
    { name: 'Facebook', icon: Facebook},
    { name: 'Reddit', icon: Reddit},
    { name: 'Discord', icon: Discord},
    { name: 'WhatsApp', icon: WhatsApp},
    { name: 'Messenger', icon: Messenger},
    { name: 'Telegram', icon: Telegram},
    { name: 'Instagram', icon: Instagram},
  ];

  const pageLink = 'https://www.arnav/feed';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageLink);
    alert('Page link copied to clipboard!');
  };

  return (
    <div className='fixed inset-0 h-[100vh] w-[100vw] flex items-center justify-center'>
    <div className="w-80 p-4 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Share post</h2>
        <button onClick={() => props.sharePost(null)} className="text-gray-500 hover:text-gray-700 font-bold">✖</button>
      </div>

      {/* Social Media Icons */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {socialMedia.map((platform) => (
          <div
            key={platform.name}
            className="flex flex-col items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            <img className='w-[24px] h-[24px]' src={platform.icon} alt="Icon"/>
            <span className="text-xs font-medium text-gray-700 mt-1">{platform.name}</span>
          </div>
        ))}
      </div>

      {/* Page Link */}
      <h3 className="text-md font-semibold">Page Link</h3>
      <div className="flex items-center bg-[#D9D9D9]  rounded-lg p-2 mt-2">
        <input
          type="text"
          value={pageLink}
          readOnly
          className="flex-grow text-sm text-gray-600 border-none bg-transparent focus:outline-none m-0"
        />
        <button
          onClick={copyToClipboard}
          className="ml-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          📋
        </button>
      </div>
    </div>
    </div>
  );
};

export default SharePost;
