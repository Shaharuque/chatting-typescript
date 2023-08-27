import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

interface ProductListProps {
    product: {
        name: string;
        id: number;
        price: number;
    }
}

const Product: React.FC<ProductListProps> = ({ product }) => {
    const navigate = useNavigate()
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        setSocket(io('http://localhost:8080'));  //io thekey socket newa hoisey
    }, [])

    const cardClick = (id: any) => {
        if (!socket) {
            const newSocket = io('http://localhost:8080');
            setSocket(newSocket);
        }

        socket.emit('joinRoom', { productId:id });
        navigate(`/productDetails/${id}`)
    }
    return (
        <div className='flex gap-2 mt-4'>
            <h1>{product.name}</h1>
            <button onClick={() => cardClick(product?.id)} className='bg-red-400 p-2 '>Click</button>
        </div>
    );
};

export default Product;