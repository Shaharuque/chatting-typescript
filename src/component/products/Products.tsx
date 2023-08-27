import React from 'react';
import Product from './Product';

interface IProduct {
    name:string,
    id:number,
    price:number
}

const Products: React.FC = () => {
    const products:IProduct[] = [
        {name:'card1',id:1,price:100},
        {name:'card2',id:2,price:110},
        {name:'card3',id:3,price:109},
        {name:'card4',id:4,price:105},
        {name:'card5',id:5,price:102},   
    ]
    return (
        <div>
            {
                products.map((p) => {
                    return (
                      <Product product={p} key={p.id} ></Product>
                    )
                  })
            }
        </div>
    );
};

export default Products;