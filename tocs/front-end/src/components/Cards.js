const Card = ({ children, size, plain }) => {
    const card = (<div className={`card card-container${size ? ('--' + size) : ''}`}>
        {children}
    </div>);
    return plain ? card : (
        <div className="col-md-12">
            {card}
        </div>
    );
};

const CardBody = ({ children }) => (
    <div className="card-body">
        {children}
    </div>
);

const CardFooter = ({ children }) => (
    <div className="card-footer">
        {children}
    </div>
);

export { Card, CardBody, CardFooter };
