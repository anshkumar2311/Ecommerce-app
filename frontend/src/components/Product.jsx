import React from 'react'
import '../componentStyles/Product.css'
import { Link } from 'react-router-dom'
import Rating from './Rating'

function Product({ product }) {
    const [rating, setRating] = React.useState(0);
    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(`New rating: ${newRating}`);
    }
    return (
        <Link to={product._id} className="product_id">
            <div className="product-card">
                <img src={product.image[0].url} alt={product.name} className='product-image-card'/>
                <div className="product-details">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price"><strong>Price </strong>{product.price}/-</p>
                    <div className="rating_container">
                        <Rating
                            value={product.ratings}
                            onRatingChange={handleRatingChange}
                            disabled={true}
                        />
                    </div>
                    <span className="productCardSpan">({product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"})</span>
                    <button className="add-to-cart">View Details</button>
                </div>
            </div>
        </Link>
    )
}

export default Product
