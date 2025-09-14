import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Product from '../components/Product'
import { getProduct, removeErrors } from '../features/products/productSlice'
import '../pageStyles/Products.css'
import NoProducts from '../components/NoProducts'

function Products() {
    const { loading, error, products } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');
    console.log(keyword);

    React.useEffect(() => {
        dispatch(getProduct({ keyword }));
    }, [dispatch, keyword])
    React.useEffect(() => {
        if (error) {
            const msg = typeof error === "string" ? error : error.error || error.message || "Something went wrong";
            toast.error(msg, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors())
        }
    }, [dispatch, error])
    return (
        <>
            {loading ? (<Loader />) : (<>
                <PageTitle title="All Products" />
                <Navbar />
                <div className="products-layout">
                    <div className="filter-section">
                        <h3 className="filter-heading">CATEGORIES</h3>
                        {/* Rnnder category filters here */}
                    </div>
                    <div className="products-section">
                        {products.length > 0 ? (<div className="products-product-container">
                            {products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))}
                        </div>) : (<NoProducts keyword={keyword} />)}
                    </div>
                </div>
                <Footer />
            </>)}
        </>
    )
}

export default Products
