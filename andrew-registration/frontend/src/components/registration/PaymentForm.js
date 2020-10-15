import React, { useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import "react-credit-cards/es/styles-compiled.css";
import { Button } from 'reactstrap';

export default function PaymentForm() {
    const { schoolYear, status, setStatus } = useAppContext(); 

    const [cardInfo, setCardInfo] = useState({
        cvc: '',
        expiryMonth: '',
        expiryYear: '',
        number: ''
    });

    const handleInputChange = (e) => {
        setCardInfo({
            ...cardInfo,
            [e.target.name]: e.target.value
        });
    };

    function createSelectItems() {
        var items = [];
        var year = schoolYear.start_date.split('-')[0];
        var i = 0;
        items.push(<option key={i++} value={""}></option>)
        for(; i < 11; i++) {
            items.push(<option key={i} value={year+i}>{year+i}</option>);
        }      
        return items;
    };

    function handleSubmit(e) {
        e.preventDefault();
        if(cardInfo.number[0].localeCompare('5') === 0 || cardInfo.number[0].localeCompare('4') === 0) {
            setStatus('');
            console.log(cardInfo.cvc, cardInfo.expiryMonth, cardInfo.expiryYear, cardInfo.number);
        }
        else {
            setStatus('Only Visa and Mastercard are accepted.');
        }
    }

    return (
        <>
            <p id="status">{status}</p>
            <div id="PaymentForm">
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type='text'
                            name='number'
                            placeholder='Card Number'
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <select id="month" name="expiryMonth" onChange={handleInputChange}>
                            <option value=""></option>
                            <option value="01">1</option>
                            <option value="02">2</option>
                            <option value="03">3</option>
                            <option value="04">4</option>
                            <option value="05">5</option>
                            <option value="06">6</option>
                            <option value="07">7</option>
                            <option value="08">8</option>
                            <option value="09">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                        <select id="year" name="expiryYear" onChange={handleInputChange}>
                            {createSelectItems()}
                        </select>
                    </div>
                    <div>
                        <input type='text' name='cvc' placeholder='CVC' maxLength='3' size='4' onChange={handleInputChange}/>
                    </div>
                    <Button type='submit'>Submit Payment</Button>
                </form>
            </div>
        </>
    )
}