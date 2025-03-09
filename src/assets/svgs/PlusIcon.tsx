import React from 'react';

const PlusIcon = ({ className = "", fill = "#A8A8A8", onClick = () => { } }) => {
    return (
        <svg onClick={onClick} className={`${className}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.9999 2.3999C8.44173 2.3999 8.7999 2.75807 8.7999 3.1999V7.1999H12.7999C13.2417 7.1999 13.5999 7.55807 13.5999 7.9999C13.5999 8.44173 13.2417 8.7999 12.7999 8.7999H8.7999V12.7999C8.7999 13.2417 8.44173 13.5999 7.9999 13.5999C7.55807 13.5999 7.1999 13.2417 7.1999 12.7999V8.7999H3.1999C2.75807 8.7999 2.3999 8.44173 2.3999 7.9999C2.3999 7.55807 2.75807 7.1999 3.1999 7.1999H7.1999V3.1999C7.1999 2.75807 7.55807 2.3999 7.9999 2.3999Z" fill={fill} />
        </svg>
    );
};

export default PlusIcon;