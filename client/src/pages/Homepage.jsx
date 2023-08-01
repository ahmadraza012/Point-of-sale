
import React, { useEffect, useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import axios from "axios"
import ItemsList from '../components/ItemsList'
import { useDispatch } from 'react-redux'

const Homepage = () => {
  const [itemsData, setItemsData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('lunch-box')
  const categories = [
    {
      name: 'lunch-box',
      image: 'https://unsplash.com/photos/TgQkxQc-t_U'
    },
    {
      name: 'bowls',
      image: 'https://unsplash.com/photos/oT7_v-I0hHg'
    },
    {
      name: 'bottles',
      image: 'https://unsplash.com/photos/pbc2wXbQYpI'
    },

  ]
  const dispatch = useDispatch()
  useEffect(() => {
    const getAllItems = async () => {
      try{
        dispatch({
          type: "SHOW_LOADING"
        })
        const {data} = await axios.get('http://localhost:8080/api/items/get-item')
        setItemsData(data)
        dispatch({
          type: "HIDE_LOADING"
        })
        console.log(data)
      }catch (error){
         console.log(error)
      }
    }
    getAllItems()
  }, [dispatch])
  return (
    <DefaultLayout>
      <div className='d-flex align-items-center gap-4 mb-4'>
        {
          categories.map(category => (
            <div key={category.name} className={ `category px-4 ${selectedCategory === category.name &&"active"}`} onClick={() => setSelectedCategory(category.name)}>
                <img src={category.image} alt="" className='mb-3' />
                <h3>
                  {category.name}
                </h3>
            </div>
          ))
        }
      </div>
      <div className="row">
        {itemsData.filter((i) => i.category === selectedCategory).map(item => (
           <div className="col-lg-3">
            <ItemsList key={item.id} item={item} />
           </div>
        ))}
      </div>
    </DefaultLayout>
  )
}

export default Homepage