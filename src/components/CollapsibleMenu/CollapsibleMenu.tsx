import React from "react";

interface CollapsibleMenuProps {
  label: string;
  children: React.ReactNode;
}

const CollapsibleMenu = ({ label, children }: CollapsibleMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <li className="list-none block w-full">
      <a className="cursor-pointer" onClick={toggle}>
        {label}
      </a>
      {open && <div className="ml-2 bg-gray-800">{children}</div>}
    </li>
  );
};

export default CollapsibleMenu;
