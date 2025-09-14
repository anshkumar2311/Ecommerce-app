import React from 'react'
import '../pageStyles/ProductDetails.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import { useSelector, useDispatch } from 'react-redux'
import { getProductDetails, removeErrors } from '../features/products/productSlice'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

function ProductDetails() {
    const [userRating, setUserRating] = React.useState(0);
    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }
    const { loading, error, product } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const { id } = useParams();
    React.useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }
        return () => {
            dispatch(removeErrors())
        }
    }, [dispatch, id])
    React.useEffect(() => {
        if (error) {
            const msg = typeof error === "string" ? error : error.error || error.message || "Something went wrong";
            toast.error(msg, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors())
        }
    }, [dispatch, error])
    if (loading) {
        return (
            <>
                <Navbar />
                <Loader />
                <Footer />
            </>
        )
    }
    if (error || !product) {
        return (
            <>
                <PageTitle title="Product Details" />
                <Navbar />
                <Footer />
            </>
        )
    }
    return (
        <>
            <PageTitle title={`${product.name} - Details`} />
            <Navbar />
            <div className="product-details-container">
                <div className="product-detail-container">
                    <div className="product-image-container">
                        <img src={product.image[0].url.replace('./', '/')} alt={product.name} className='product-detail-image' />
                    </div>
                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">{`Price : ${product.price}/-`}</p>
                        <div className="product-rating">
                            <Rating
                                value={product.ratings}
                                disabled={true}
                            />
                            <span className="productCardSpan">({product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"})</span>
                        </div>
                        <div className="stock-status">
                            <span className={product.stock > 0 ? `in-stock` : `out-of-stock`}>{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}</span>
                        </div>
                        {product.stock > 0 && (<>
                            <div className="quantity-controls">
                                <span className="quantity-label">Quantity :</span>
                                <button className="quantity-button">-</button>
                                <input type="text" value={1} className="quantity-value" readOnly />
                                <button className="quantity-button">+</button>
                            </div>
                            <button className="add-to-cart-btn">Add To Cart</button>
                        </>)}
                        <form className="review-form">
                            <h3>Write a Review</h3>
                            <Rating
                                value={0}
                                disabled={false}
                                onRatingChange={handleRatingChange}
                            />
                            <textarea placeholder="Write your review here..." className="review-input"></textarea>
                            <button className="submit-review-btn">Submit Review</button>
                        </form>
                    </div>
                </div>
                <div className="reviews-container">
                    <h3>Customer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (<div className="reviews-section">
                        {product.reviews.map((review,index) => (
                            <div className="review-item" key={index}>
                                <div className="review-header">
                                    <Rating
                                        value={review.rating}
                                        disabled={true}
                                    />
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                <span className="review-name">-By : {review.name}</span>
                            </div>
                        ))}
                    </div>) : (<p className="no-reviews">No reviews yet.Be the first reviewer of this product</p>)}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetails
