import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder } from "../store/order/order";

let tempUserId = 1;

//test payment using this card number: 4242 4242 4242 4242

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
};

export default function PaymentForm() {
    const [userId, setUserId ] = useState(tempUserId);
    const [ formData, setFormData ] = useState({
        shippingAddress: '',
        billingAddress: '',
    });

    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    function handleChange(ev) {
        const { name, value } = ev.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [ name ] : value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });

    if(!error) {
        try {
            const { id } = paymentMethod;
            const orderData = {
                amount: 1000,
                id,
                userId,
                shippingAddress: formData.shippingAddress,
                billingAddress: formData.billingAddress
            };
            console.log(orderData);

            dispatch(addOrder(orderData));

        } catch (error) {
            console.log("Error", error)
        };
    } else {
        console.log(error.message)
    };
};

    return (
        <>
        <form onSubmit={handleSubmit}>
            <fieldset className="FormGroup">
                <div className="FormRow">
                    <CardElement options={CARD_OPTIONS}/>
                </div>
            </fieldset>
            <input
            type='text'
            name="shippingAddress"
            placeholder="Shipping Address"
            onChange={handleChange}
          ></input>
          <input
            name="billingAddress"
            placeholder="Billing Address"
            onChange={handleChange}
          ></input>
            <button className='button-37'>Place Order</button>
        </form>
        </>
    );
};
