const Button = ({label, onClick, isLoading }: {label: string, onClick: Function, isLoading: boolean}) => {    
    return (
        <button type="button" className={`mprimary-btn ${isLoading? '!bg-disabledColor cursor-not-allowed' : ''}`} onClick={() => {
            if(!isLoading) onClick() 
        }}>
            { isLoading ? 
                <div className="flex justify-center"> 
                    <div className="spinner !w-6 !h-6" /> 
                </div> 
                :
                label
            }
        </button>
    )  
  };
  
  export default Button;