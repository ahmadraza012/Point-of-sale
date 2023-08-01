import React from 'react'
import { Card } from 'antd';
import { useDispatch } from 'react-redux';

const ItemsList = ({ item }) => {
  const dispatch = useDispatch()
  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...item, singleQuantity: 1, cartoonsQuantity: 1, },
    })
  }
  const { Meta } = Card;
  return (
    <div> <Card
      hoverable
      className='mb-4'
      cover={<img alt="example" src={item.image} height="200px" />}
    >
      <Meta title={item.name} />
      <button className='btn btn-success w-100 mt-3' onClick={() => handleAddToCart()}>Add to cart</button>
    </Card>

    </div>
  )
}

export default ItemsList