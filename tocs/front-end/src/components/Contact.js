import React, { useEffect } from "react";
import { Card, CardBody } from "./Cards";

const Contact = () => {
    useEffect(() => { document.title = "TOCS - Contact Us"; }, []);

    return (
        <Card size="large">
                <CardBody>
                <h5 className="card-title">Thousand Oaks Chinese School could be contacted through the following ways:</h5>
                <ul>
                    <li>Web Site: <a href="http://www.to-cs.org">http://www.to-cs.org</a></li>
                    <li>By Mail: P.O. Box 6775, Thousand Oaks, CA 91362</li>
                    <li>Email:
                        <ul>
                            <li>
                                Principal: <a href="mailto:tocs-principal@to-cs.org">tocs-principal@to-cs.org</a>
                            </li>
                            <li>
                                Registration questions: <a href="mailto:registration@to-cs.org">registration@to-cs.org</a>
                            </li>
                            <li>
                                Technical issues with web site: <a href="mailto:engineering@to-cs.org">engineering@to-cs.org</a>
                            </li>
                            <li>
                                Privacy policy and concerns: <a href="mailto:privacy@to-cs.org">privacy@to-cs.org</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                </CardBody>
        </Card>
    );
};

export default Contact;