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

const CardTitle = ({ children, hSize, clazz }) => hSize === '4' ?
    <h4 className={`card-title ${clazz}`}>{children}</h4>
  : <h5 className={`card-title ${clazz}`}>{children}</h5>;

export { Card, CardBody, CardFooter, CardTitle };
