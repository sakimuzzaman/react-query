import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddProduct = () => {
    const queryClient = useQueryClient();

    const [state, setState] = useState({
        title: "",
        description: "",
        price: 0,
        rating: 5,
        thumbnail: "",
    });

    const mutation = useMutation({
        mutationFn: (newProduct) => axios.post("http://localhost:3000/products",newProduct),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["products"]);
            queryClient.setQueriesData(["random"], {value: "some random data"})
        },
        onMutate: (variables) => {
            return {greeting: 'Say hello'}
        }
    })

    const submitData = (event) => {
        event.preventDefault();
        console.log(state);
        const newData = { ...state, id: crypto.randomUUID().toString() };
        mutation.mutate(newData);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = 
            event.target.type === "number" ? event.target.valueAsNumber : event.target.value;

        setState({
            ...state,
            [name]: value
        })
    }

    if (mutation.isLoading) {
        return <span>Submitting...</span>
    }
    if (mutation.isError) {
        return <span>Error {mutation.error.message} </span>
    }

    return (
        <div className='m-2 p-2 bg-gray-100 w-1/5 h-1/2'>
           <h2 className='text-2xl my-2'>Add a Product</h2>

           <form 
            className='flex flex-col'
            onSubmit={submitData}
           >
            <input 
                type="text"
                value={state.title}
                name="title"
                onChange={handleChange}
                className='my-2 border p-2 rounded'
                placeholder='Enter a product title'
            />
            <textarea 
                type="text"
                value={state.description}
                name="description"
                onChange={handleChange}
                className='my-2 border p-2 rounded'
                placeholder='Enter a product description'
            />
            <input 
                type="number"
                value={state.price}
                name="price"
                onChange={handleChange}
                className='my-2 border p-2 rounded'
                placeholder='Enter a product price'
            />
            <input 
                type="text"
                value={state.thumbnail}
                name="thumbnail"
                onChange={handleChange}
                className='my-2 border p-2 rounded'
                placeholder='Enter a product thumbnail URL'
            />

            <button
                
                type="submit"
                className='bg-black m-auto text-white text-xl p-1 rounded-md'
            >
                Add
            </button>

           </form>
        </div>
    );
};

export default AddProduct;