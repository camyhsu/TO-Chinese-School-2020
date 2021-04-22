import React, { useEffect } from "react";
import { Card, CardBody, CardTitle } from "./Cards";

const Waiver = () => {
    useEffect(() => { document.title = "TOCS - Waiver"; }, []);

    return (
        <Card size="large">
            <CardBody>
                    <CardTitle>Consent, Release, Indemnification and Assumption of Risk</CardTitle>

                    <p>
                        I(we), the parent(s) of xxx request that our child/children,
                        xxx, be permitted to participate in all activities of the Thousand
                        Oaks Chinese School (“TOCS”) (“Activities”).
                    </p>

                    <p>
                        We fully understand that participation in Activities presents an inherent risk of injury,
                        serious bodily harm, or death to our child/children and to the undersigned.
                        We have investigated the Activities to our full satisfaction and expressly assume
                        all risks, including but not limited to injury, harm, or death.
                    </p>

                    <p>
                        We represent that our child/children have no physical or mental conditions which
                        would or should prevent them from participating in Activities, or that would increase
                        the risk of possible injury, harm or death by participating in Activities.
                    </p>

                    <p>
                        We agree that should the physical or mental condition of our child/children change
                        resulting in an increased risk of injury, harm or death, we will immediately withdraw
                        our child/children from school.
                    </p>

                    <p>
                        We agree that should anyone, including our child/children (including any representative
                        or guardian) make a claim against TOCS (including any shareholder, subsidiary or affiliate,
                        or any person acting in his/her capacity as an officer, director, employee, agent,
                        contractor, or representative of TOCS) that the undersigned agree to fully indemnify,
                        defend and hold TOCS (including its affiliates, officers, directors, shareholders,
                        agents, employees and representatives) (“Released Parties”) completely harmless from any
                        and all costs, expenses, attorney’s fees, suits, liabilities, damages or claim for damages,
                        including but not limited to those arising out of any injury or death to any person or
                        persons or damage to any property of any kind whatsoever and to whomsoever belonging,
                        including TOCS, in any way relating to the Activities or the performance or exercise of
                        any of the duties, obligations, powers or authorities herein or hereafter granted to TOCS
                        and any Released Parties as defined herein.
                    </p>

                    <p>
                        In consideration of the benefits we will receive from our child/children participating
                        in Activities, we hereby agree that we (including any assignees, heirs, next of kin,
                        guardians, and legal or personal representatives) will not make a claim against, sue, or
                        attach the property of any subsidiary or affiliate, or any person acting in his/her capacity
                        as an officer, director, employee, agent, contractor, or representative of TOCS for injury,
                        death, damage, or loss caused in whole or in part by the negligence or other acts or omissions
                        of the Released Parties as a result of my child’s/children’s participation in Activities.
                        We hereby release and discharge the Released Parties from all actions, claims, or demands
                        that we, our assignees, heirs, next of kin, guardians, and legal or personal representatives
                        may have for injury, death, damage, or loss resulting in any way from our child’s/children’s
                        participation in Activities, whether it results from the negligence, gross negligence,
                        or reckless conduct of TOCS and/or any other Released Parties, or from any other cause.
                    </p>

                    <p>
                        We understand and agree that if a claim, suit, or attachment is brought or sought against
                        us as a result in any way of my child’s/children’s participation in Activities, that we
                        shall not be entitled to any defense or indemnification by TOCS or any Released Parties
                        in connection with such claim, suit, or attachment.
                    </p>
                    <hr />
                    <p className="font-weight-bold">
                        WE HAVE CAREFULLY READ THIS AGREEMENT AND FULLY UNDERSTAND ITS CONTENTS. WE ARE AWARE THAT
                        THIS IS A CONSENT, RELEASE OF LIABILITY, ASSUMPTION OF RISK, INDEMNIFICATION, AND PROMISE
                        NOT TO SUE OR MAKE A CLAIM, AND WE AGREE TO THIS OF OUR OWN FREE WILL.
                    </p>

                    <p className="font-weight-bold">
                        By clicking on the "Agree" button below, I, xxx, agree to
                        the legal terms outlined above.
                    </p>
            </CardBody>
        </Card>
    );
};

export default Waiver;