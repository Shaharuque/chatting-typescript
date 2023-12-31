import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

interface IProduct {
    name: string,
    id: number,
    price: number
}

const ProductDetails: React.FC = () => {
    const { id } = useParams()
    const [bid, setBid] = useState<any>(0);
    const [newBid2, setNewBid2] = useState<any>(0);
    const [canBid, setCanBid] = useState<boolean>(true);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // Tim
    console.log(bid)
    // const [socket, setSocket] = useState<any>(null);

    const socket = io('http://localhost:8080');  //io thekey socket newa hoisey


    useEffect(() => {
        if (socket) {
            socket.on('newBid', ({ pId, bAmount }: any) => {
                console.log('from server socket', pId, bAmount)
                if (pId === id) {
                    // Update bid amount when a new bid is received
                    setNewBid2(bAmount);
                }
            });

            socket.on('timerUpdate', ({ productId: updatedProductId, timeRemaining: updatedTimeRemaining }) => {
                if (updatedProductId === id) {
                    setTimeRemaining(updatedTimeRemaining);
                    if (updatedTimeRemaining === 0) {
                        setCanBid(false);
                    }
                }
            });

        }
    }, [socket, id]);

    console.log('newBid2', newBid2)

    useEffect(() => {
        if (socket) {
          socket.on('timerStart', ({ productId: updatedProductId }) => {
            if (updatedProductId === id) {
              setCanBid(true);
              setTimeRemaining(60); // Reset timer when started
            }
          });
        }
      }, [socket, id]);

      useEffect(() => {
        // ... (previous useEffect code)
    
        // Additional useEffect to update the timer display
        if (timeRemaining !== null && canBid) {
          const timer = setInterval(() => {
            setTimeRemaining((prevTime) => Math.max(0, prevTime - 1));
          }, 1000);
          return () => clearInterval(timer);
        }
      }, [timeRemaining, canBid]);  


    const products: IProduct[] = [
        { name: 'card1', id: 1, price: 100 },
        { name: 'card2', id: 2, price: 110 },
        { name: 'card3', id: 3, price: 109 },
        { name: 'card4', id: 4, price: 105 },
        { name: 'card5', id: 5, price: 102 },
    ]

    const bidSubmit = () => {
        if(canBid && socket){
          socket.emit('placeBid', { productId: id, bidAmount: bid });  
        }
        
    }

    const handleStartTimer = () => {
        if (socket) {
          socket.emit('startTimer', { id });
        }
      };
    


    return (
        <div>
            <h1>Product Details page:{id}</h1>
            <h1 className='border border-gray-200 bg-gray-400'>initial price:{
                products.map((p: any) => {
                    if (p.id == id && p.price > newBid2) {
                        return p.price
                    }
                    else if (p.id == id && p.price < newBid2) {
                        return newBid2
                    }
                })
            }
            </h1>
            <label>Bid price</label>
            <input className='border border-red-400' type="text" onChange={(e) => setBid(e.target.value)} />
            <button onClick={bidSubmit} disabled={!canBid}>Submit</button>

            {timeRemaining !== null ? (
                <p>Time Remaining: {timeRemaining} seconds</p>
            ) : (
                <button onClick={handleStartTimer}>Start Timer</button>
            )}
        </div>
    );
};

export default ProductDetails;