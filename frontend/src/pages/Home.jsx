import React from 'react'
import '../pageStyles/Home.css'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'
import PageTitle from '../components/PageTitle'
import { useSelector, useDispatch } from 'react-redux'
import { getProduct } from '../features/products/productSlice'

function Home() {
    const { loading, error, products, productCount } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getProduct());
    },[dispatch])
    return (
        <>
            <PageTitle title="Home - Shopify" />
            <Navbar />
            <ImageSlider />
            <div className="home-container">
                <h2 className="home-heading">Trending Now</h2>
                <div className="home-product-container">
                    {products.map((product, index)=>(<Product product={product} key={index}/>))}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home
