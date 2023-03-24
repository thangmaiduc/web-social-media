import './WrapperPopper.css'

function WrapperPopper({ children }) {
    return (<div className="wrapperPopper">
        {children}
    </div>);
}

export default WrapperPopper;