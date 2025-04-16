interface MKDFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className: string;
}

const MKDForm = ({ onSubmit, children, className }: MKDFormProps) => {
  return (
    <>
      <form className={`w-full max-w-lg ${className}`} onSubmit={onSubmit}>
        {children}
      </form>
    </>
  );
};

export default MKDForm;
