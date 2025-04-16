import React from 'react';

const FolderIcon = ({ className = "", fill = "#A8A8A8", onClick = () => { } }) => {
    return (
        <svg onClick={onClick} className={`${className}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.12502 2.5C2.31961 2.5 1.66669 3.15292 1.66669 3.95833V15.2083C1.66669 16.0137 2.31961 16.6667 3.12502 16.6667H16.875C17.6804 16.6667 18.3334 16.0137 18.3334 15.2083V6.45833C18.3334 5.65292 17.6804 5 16.875 5H10.446C10.3764 5 10.3113 4.96519 10.2727 4.90723L9.10077 3.1494C8.8303 2.74369 8.37497 2.5 7.88737 2.5H3.12502Z" fill={fill} />
        </svg>
    );
};

export default FolderIcon;