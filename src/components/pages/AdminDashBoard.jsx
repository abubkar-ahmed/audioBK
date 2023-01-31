import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import useProducts from '../../hooks/useProducts';
import ImgPreviewer from '../assestsComponents/productPageComponents/ImgPreviewer';
import {nanoid} from 'nanoid'
import ReactPaginate from 'react-paginate';
import { useRef } from 'react';
import upleadImg from '../../assets/icons8-upload-to-the-cloud-80.png'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import {useNavigate, useParams , useLocation, NavLink} from 'react-router-dom';
import Loading from '../assestsComponents/Loading';
import defualtImg from '../../assets/defualt.png';
import moment from 'moment'

function AdminDashBoard() {
    const {navheader , productStaus} = useParams();
    const [users , setUsers] = useState([]);
    const [purchases , setPurchases] = useState([]);
    const {auth} = useAuth();


    useEffect(() => {
        if(auth.accessToken){
            const axiosPrivate = axios.create({
                headers : {
                    'Authorization' : `Bearer ${auth?.accessToken}`
                },
                withCredentials: true
            });

            axiosPrivate.get('/purchase/getAll').then(res => {
                setUsers(res.data.users);
                setPurchases(res.data.purchases.reverse());
            }).catch(err => {
                console.log(err)
            })
        }
    },[auth])

  return (
    <main className="dashboard account">
        <div className="account-container">
            <nav>
            <ul>
                <li>
                <button >
                    <NavLink to='/dashboard/products'>
                        products
                    </NavLink>
                </button>
                </li>
                <li>
                <button >
                <NavLink to='/dashboard/purchases'>
                    purchases
                </NavLink>
                
                </button>
                </li>
                <li>
                <button >
                <NavLink to='/dashboard/users'>
                    users
                </NavLink>
                </button>
                </li>
            </ul>
            </nav>
            {navheader === 'products'? (
                <Products />
            ): navheader === 'purchases' ? (
                <Purchases purchases={purchases} users={users}/>
            ) : (
                <Users users={users}/> 
            )}
            
        </div>

    </main>
  )
}

export default AdminDashBoard ;



function Purchases({purchases , users}){
    const [usrsList , setUserList] = useState();
    return(
        <div className='content purchase'>
            <h2 className='purchase-main-header'>Purchase</h2>
            <div className="cards-container">
                {purchases.map(e => {
                    return (
                        <PurchaseCard e={e} purchases={purchases} users={users} key={e._id}/>
                    )
                })}
            </div>
        </div>
    )
}

function PurchaseCard({purchases , users , e}){
    const [list , setList] = useState([]);
    const {allProducts} = useProducts();
    useEffect(() => {   
        if(purchases.length && users.length && allProducts.length){
            const productsFilterd = e.products.map(i => {
                const prod = allProducts.filter(h => {
                    return h.id === i.productId
                })
                const product = prod[0]
                return {
                    quantity : i.quantity,
                    id : i.productId,
                    productName : product.productName,
                    image : product.images[0],
                    price : product.price,
                }
            })

            const u = users.filter(h => {
                return h.id === e.userId
            })
            const user = u[0]
            
            let filterdPurchase = purchases.filter(h => {
                return h._id === e._id
            });
            filterdPurchase = filterdPurchase[0];
            setList({
                date : filterdPurchase.Date,
                purchaseInfo : filterdPurchase.purchasesInfo,
                products : productsFilterd,
                user : user,
                total : filterdPurchase.total
            })
        }
    },[purchases , users , allProducts]);

    return (
        <div className="purchases-card">
            <Card list={list} />
        </div>
    )
}

function Card({list}){
    const [details , setDetails] = useState(false);
    const newDate = new Date();
    const date = new Date(list.date);    
    const result = moment(newDate).diff(moment(date));
    const time = moment.duration(result).humanize();

    const topRef = React.useRef(null);
    React.useEffect(() => {
        topRef.current?.scrollIntoView({behavior: 'auto'});
    },[details]);

    return(
        <>
        <div className="user-img-username-container" ref={topRef}>
            <img src={list?.user?.image ? list.user.image : defualtImg} alt="user-img" />
            <h3 className="username">
                @{list?.user?.username}
            </h3>
            <h4 className='date'>{time} ago</h4>
        </div>
        
        {details ? (
            <>
                <div className="info">
                    <h3>Name</h3>
                    <h4>{list?.purchaseInfo?.name}</h4>
                </div>            
                <div className="info email">
                    <h3>Email</h3>
                    <h4>{list?.purchaseInfo?.email}</h4>
                </div>            
                <div className="info phone">
                    <h3>Phone</h3>
                    <h4>{list?.purchaseInfo?.phone}</h4>
                </div>            
                <div className="info phone">
                    <h3>Phone</h3>
                    <h4>{list?.purchaseInfo?.phone}</h4>
                </div>            
                <div className="info address">
                    <h3>address</h3>
                    <h4>{list?.purchaseInfo?.address}</h4>
                </div>            
                <div className="info city">
                    <h3>city</h3>
                    <h4>{list?.purchaseInfo?.city}</h4>
                </div>            
                <div className="info country">
                    <h3>country</h3>
                    <h4>{list?.purchaseInfo?.country}</h4>
                </div>            
                <div className="info">
                    <h3>ZIP code</h3>
                    <h4>{list?.purchaseInfo?.zipCode}</h4>
                </div>            
                <div className="info payment">
                    <h3>payment methode</h3>
                    <h4>{list?.purchaseInfo?.paymentMethode}</h4>
                </div>
                <div className="purchased-products-container">
                    {list?.products.map(e => {
                        return (
                            <div className="p-card" key={e.id}>
                                <img src={e?.image} alt="product-img" />
                                <div className="p-info">
                                    <h3>{e.productName}</h3>
                                    <h4>${e.price}</h4>
                                </div>
                                <div className="p-quantity">
                                    x{e.quantity}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="p-price">
                    <div className="p-price-info">
                        <h3>Total Price</h3>
                        <h4>${list.total.totalPrice}</h4>
                    </div>
                    <div className="p-price-info">
                        <h3>Shipping Cost</h3>
                        <h4>${list.total.shippingCost}</h4>
                    </div>
                    <div className="p-price-info">
                        <h3>VAT</h3>
                        <h4>${list.total.totalVat}</h4>
                    </div>
                    <div className="p-price-info">
                        <h3>grand total</h3>
                        <h4>${list.total.grandTotal}</h4>
                    </div>
                </div>          
            
            </>
        ): (
            <>
                <div className="info">
                    <h3>Name</h3>
                    <h4>{list?.purchaseInfo?.name}</h4>
                </div>
                <div className="info">
                    <h3>Payment Methode</h3>
                    <h4>{list?.purchaseInfo?.paymentMethode}</h4>
                </div>
                <div className="info">
                    <h3>Address</h3>
                    <h4>{list?.purchaseInfo?.city},{list?.purchaseInfo?.country}</h4>
                </div>
                <div className="info">
                    <h3>Grand Total</h3>
                    <h4>${list?.total?.grandTotal}</h4>
                </div>
            </>
        )}
        <button className="see-product" onClick={() => setDetails(e => !e)}>
            {details ? 'Hide Details' : 'View Deatails'}
        </button>
        </>
    )
}




function Users({users}) {
    return (
        <div className='content users'>
            <h2 className='users-main-header'>Users</h2>
            <div className="user-container">
                {users.length > 0 && users.map(e => {
                    return (
                        <div className='user-card' key={e.id}>
                            <div className="img-container">
                                <img src={e.image ? e.image : defualtImg} alt="user-img" />
                            </div>
                            <div className="main-info">
                                <div className="username info">
                                    <h3>User name</h3>
                                    <h4>{e.username}</h4>
                                </div>
                                <div className="email info">
                                    <h3 >Email</h3>
                                    <h4 className={(e.roles.Admin || e.roles.MainAdmin) && 'hide'}>{e.email}</h4>
                                </div>
                                <div className="roles info">
                                    <h3>User Role</h3>
                                    <h4>
                                        {e.roles.MainAdmin ? 'Main Admin' : e.roles.Admin ? 'Admin' : 'User'}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}




function Products() {
    const {allProducts} = useProducts();
    // const [previewProduct , setPreviewProduct] = useState('none');
    const [search , setSearch] = useState('');
    const [filtredProducts , setFilterdProducts] = useState();

    const {productStaus} = useParams();
    const navigate = useNavigate();

    const [itemsPerPage , setItemsPerPage] = useState(3);
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;

    const currentItems = allProducts.slice(itemOffset, endOffset);

    const pageCount = Math.ceil(allProducts.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % allProducts.length;
        setItemOffset(newOffset);
    };

    const topRef = React.useRef(null);
    React.useEffect(() => {
      topRef.current?.scrollIntoView({behavior: 'auto'});
    },[productStaus , itemOffset]);

    useEffect(() => {
        if(productStaus){
            if(productStaus !== 'new-product' && productStaus.split('-')[0] !== 'veiw' && productStaus.split('-')[0] !== 'update'){
                navigate('/404')
            }
        }
    },[productStaus])



    

    useEffect(() => {
        if(search){
            setFilterdProducts(allProducts.filter(e => {
                return e.productName.toLowerCase().includes(search.toLowerCase());
            }))
        }
    },[search])


    return (
        <div className="content products" ref={topRef}>
            <h2 className='products-main-header'>Products</h2>
            {!productStaus ? (
                <>
                <form className="search">
                    <input type="text" name='search' placeholder='Search For A Product By Name' value={search} onChange={(e) => setSearch(e.target.value)}/>
                </form>
                <button 
                className='add-new-product-btn see-product'
                onClick={() => navigate('/dashboard/products/new-product')}
                >
                    Add New Product
                </button>
                { search && filtredProducts?.length ?
                    filtredProducts.map((e) => {
                        return (
                            <ProductCard 
                            key={e.id}
                            e={e} 
                            
                            />
                        )
                    })
                    :
                    currentItems.map((e) => {
                        return (
                            <ProductCard 
                            key={e.id}
                            e={e} 
                            />
                        )
                    })
                }
                {!search && (
                    <ReactPaginate 
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={1}
                    className='pagination-list'
                    />
                )}

                </>
            )
            : productStaus === 'new-product' ? (
                <NewProduct update={false}/>
            ) : productStaus?.split('-')[0] === 'update' ? (
                <NewProduct update={true}/>
            ):(
                <PrevProduct />
            )
            }
        </div>
    )
}

function ProductCard({e}) {
    const navigate = useNavigate();
    return (
        <div className="products-card">
            <div className="img-container">
                <img src={e.images[0]} alt="product-img" />
            </div>
            <div className="product-name info">
                <h3>Product Name</h3>
                <h4>{e.productName}</h4>
            </div>
            <div className="category info">
                <h3>Product Category</h3>
                <h4>{e.category}</h4>
            </div>
            <div className="price info">
                <h3>Product Price</h3>
                <h4>${e.price}</h4>
            </div>
            <div className="preview">
                <button onClick={() => navigate(`/dashboard/products/veiw-${e.id}`)} className='see-product'>
                    preview product
                </button>
            </div>
        </div>
    )
}

function PrevProduct({}){
    const {allProducts , setAllProducts} = useProducts();
    const [product , setProduct] = useState({});
    const {productStaus} = useParams();
    const [showDelete , setShowDelete] = useState(false);
    const {auth} = useAuth();
    const [loading , setLoading] = useState(false);
    const [errMsg , setErrMsg] = useState('');
     
    useEffect(() => {
        if(allProducts.length){
            const productId = productStaus.split('-')[1]

            const productArr = allProducts.filter(e => {
                return e.id === productId ;
            })

            setProduct(...productArr)
        }
    },[allProducts])



    const navigate = useNavigate();

    const deleteHandler = async () => {
        const axiosPrivate = axios.create({
            headers : {
                'Authorization' : `Bearer ${auth?.accessToken}`
            },
            withCredentials: true
        });
        setLoading(true);

        try{
            const response = await axiosPrivate.delete(`/products/${product.id}`);
            setAllProducts(response.data.result);
            navigate('/dashboard/products');
            setLoading(false);
        }catch(err){
            console.log(err)
            if(err.response.status === 401 && err.response.data.message === 'You Are Not Authorized.'){
                setErrMsg('Unauthorized Only The Main Admin Have Access To Delete Products')
            }else{
                setErrMsg('Somthing Went Wrong Please Try Again Later')
            }
            setLoading(false);
            setShowDelete(false)
        }
    }
    

    return (
        <>
        {product?.id && 
        <div className="prev">
            <button onClick={() => navigate(-1)} className='bo-back' >
                Go Back
            </button>
            <div className="img-prev-container">
                <ImgPreviewer currentProduct={product}/>
            </div>
            <div className="info">
                <h3>Product Name</h3>
                <h4>{product.productName}</h4>
            </div>
            <div className="info about">
                <h3>about</h3>
                <p>{product.about}</p>
            </div>
            <div className="info">
                <h3>feature</h3>
                <ul>
                    {product.features.map(e => {
                        return (
                            <li key={nanoid()} >{e}</li>
                        )
                    })}
                </ul>
            </div>
            <div className="last-info">
                <div className="info category">
                    <h3>Category</h3>
                    <h4>{product.category}</h4>
                </div>
                <div className="info price">
                    <h3>price</h3>
                    <h4>${product.price}</h4>
                </div>
                <div className="info purchased">
                    <h3>purchased</h3>
                    <h4>{product.purchased} Times</h4>
                </div>
                <div className="info quantity">
                    <h3>quantity in stock</h3>
                    <h4>x{product.quantity}</h4>
                </div>
            </div>
            <div className="product-controls">
                    <button 
                    onClick={() => navigate(`/dashboard/products/update-${product.id}`)}
                    className='edit see-product'>
                        edit Product
                    </button>                
                    <button className='delete see-product' onClick={() => setShowDelete(e => !e)}>
                        Delete Product
                    </button>
                    
            </div>
            {showDelete && (
            <div className="pop-up" >
                <h2>DELETE Product</h2>
                <p>Are You Sure You Want To Delete This Product? This Will Remove The Product And Can't Be Undone.</p>
                <div className="controls">
                    <button className='see-product cancel' onClick={() => setShowDelete(false)}>
                        No, CANCEL
                    </button>
                    {loading ? <Loading/> : (
                        <button className='see-product delete' onClick={deleteHandler}>Yes, Delete</button>
                    )}
                </div>
            </div>
            )}
            {errMsg && (
                <div className="msg">
                    <span>{errMsg}</span>
                    <span onClick={() => setErrMsg('')} className='close'>X</span>
                </div>
            )}           
        </div>
        }

        </>
    )
}

function NewProduct({update}) {
    const {auth} = useAuth();
    const catArrowRef = useRef(null);
    const catRef = useRef(null);
    const [showCategory , setShowCategory] = useState(false);
    const [img1 , setImg1] = useState('');
    const [img1Prev, setImg1Prev] = useState(upleadImg);
    const [img2 , setImg2] = useState('');
    const [img2Prev, setImg2Prev] = useState(upleadImg);
    const [img3 , setImg3] = useState('');
    const [img3Prev, setImg3Prev] = useState(upleadImg);
    const [ feature , setFeature] = useState('');
    const [featureArr , setFeatureArr] = useState([]);
    const [category , setCategory] = useState('headphones');
    const [productName , setProductName ] = useState('');
    const [price , setPrice] = useState('');
    const [quantity , setQuantity] = useState('');
    const [about , setAbout] = useState('');
    const [errMsg , setErrMsg] = useState('');
    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const quantityRef = useRef(null);
    const aboutRef = useRef(null);
    const imagesRef = useRef(null);
    const featuresRef = useRef(null);
    const topRef = useRef(null);
    const [loading , setLoading] = useState(false);

    const {allProducts , setAllProducts} = useProducts();
    const {productStaus} = useParams();
    const productId = productStaus.split('-')[1];

    const navigate = useNavigate();

    const [updateProduct , setUpdateProduct] = useState({});

    const filterUpdateProduct = async () => {
        if(allProducts.length > 0){

        }
    }
    useEffect(() => {
        if(update && allProducts.length){
            const filterdProduct = allProducts.filter(e => {
                return e.id === productId;
            })
            if(filterdProduct.length === 0){
                navigate('/404');
            }else{
                setUpdateProduct(...filterdProduct) 
            }
        }
    },[update , allProducts])

    useEffect(() => {
        if(update && updateProduct?.productName){
            setProductName(updateProduct.productName);
            setCategory(updateProduct.category);
            setPrice(updateProduct.price);
            setQuantity(updateProduct.quantity);
            setAbout(updateProduct.about);
            setFeatureArr(updateProduct.features.map(e => {
                return {
                    id : nanoid(),
                    feature : e
                }
            }));
            if(updateProduct.images[0]){
                setImg1Prev(updateProduct.images[0]);
            }
            if(updateProduct.images[1]){
                setImg2Prev(updateProduct.images[1]);
            }
            if(updateProduct.images[2]){
                setImg3Prev(updateProduct.images[2]);
            }
        }
    },[updateProduct])

    const showCategoryHandler = () => {
        if(!showCategory){
            catArrowRef.current.classList.add('rotate-180')
            setShowCategory(true);
        }else{
            catArrowRef.current.classList.remove('rotate-180');
            catRef.current.classList.add('remove-from-top')
            setTimeout(() => {
                setShowCategory(false)
            }, 300);
        }
    }

    const fileHandle1 = (e) => {
        setImg1(e.target.files[0])
        setImg1Prev(URL.createObjectURL(e.target.files[0]));
    }
    const fileHandle2 = (e) => {
        setImg2(e.target.files[0])
        setImg2Prev(URL.createObjectURL(e.target.files[0]));
    }
    const fileHandle3 = (e) => {
        setImg3(e.target.files[0])
        setImg3Prev(URL.createObjectURL(e.target.files[0]));
    }

    const removeHandler = () => {
        setImg1('')
        setImg2('')
        setImg3('')
        setImg1Prev(upleadImg)
        setImg2Prev(upleadImg)
        setImg3Prev(upleadImg)
    }

    const addNewFeatureHandler = () => {
        if(feature){
            setFeatureArr(prev => {
                if(prev){
                    prev.push({id : prev.length , feature : feature})
                }else{
                    prev = [{id : prev.length , feature : feature}]
                }
                return prev
            });
            setFeature('');
        }
    }

    const deleteFeatureHandler = (id) => {
        setFeatureArr(prev => {
            return prev.filter(e => {
                return e.id !== id
            })
        })
    }

    const changeCategoryHandler = (cat) => {
        setCategory(cat);
        catArrowRef.current.classList.remove('rotate-180');
        catRef.current.classList.add('remove-from-top')
        setTimeout(() => {
            setShowCategory(false)
        }, 300);
        

    }

    const validating = async () => {
        if(productName && category && price && quantity && about && (update ? true : img1 || img2 || img3) && (featureArr.length > 0)){
            return true
        }else{
            if(!productName){
                setErrMsg('Please Add Product Name');
                nameRef.current.classList.add('err');
                topRef.current.scrollIntoView({behavior: 'smooth'});
                return false ;
            } else if(!category){
                setErrMsg('Please Add Category');
                return false ;
            } else if(!price){
                setErrMsg('Please Add Price');
                priceRef.current.classList.add('err');
                topRef.current.scrollIntoView({behavior: 'smooth'});
                return false ;
            } else if (!quantity){
                setErrMsg('Please Add The Quantity In Stock');
                quantityRef.current.classList.add('err');
                topRef.current.scrollIntoView({behavior: 'smooth'});
                return false ;
            } else if (!about){
                setErrMsg('Please Write A Note About The Product');
                aboutRef.current.classList.add('err');
                topRef.current.scrollIntoView({behavior: 'smooth'});
                return false ;
            } else if (!update){
                if(!img1 && !img2 && !img3){
                    setErrMsg('Please Add Some Images');
                    imagesRef.current.classList.add('err');
                    return false ;
                }
            } else if(featureArr.length <= 0){
                setErrMsg('Please Add Some Features');
                featuresRef.current.classList.add('err');
                return false ;
            }
        }
    }
    useEffect(() => {
        if(nameRef.current.classList.contains('err')){
            nameRef.current.classList.remove('err');
            setErrMsg('')
        }
    }, [productName])

    useEffect(() => {
        if(priceRef.current.classList.contains('err')){
            priceRef.current.classList.remove('err');
            setErrMsg('')
        }
    }, [price])

    useEffect(() => {
        if(quantityRef.current.classList.contains('err')){
            quantityRef.current.classList.remove('err');
            setErrMsg('')
        }
    }, [quantity])

    useEffect(() => {
        if(aboutRef.current.classList.contains('err')){
            aboutRef.current.classList.remove('err');
            setErrMsg('')
        }
    }, [about])

    useEffect(() => {
        if(imagesRef.current.classList.contains('err')){
            imagesRef.current.classList.remove('err');
            setErrMsg('')
        }
    }, [img1 , img2 , img3])

    useEffect(() => {
        if(featuresRef.current.classList.contains('err')){
            featuresRef.current.classList.remove('err');
            setErrMsg('')
        }
    }, [feature])

    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${auth?.accessToken}`,
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
    
    

    const submitHandler = async (e) => {
        e.preventDefault();
        const validate = await validating();

        if(validate){
            setLoading(true);
            let formData = new FormData();

            formData.append('productName' , productName);
            formData.append('category' , category);
            formData.append('price' , price);
            formData.append('quantity' , quantity);
            formData.append('about' , about);
            const feat = featureArr.map(e => {
                return e.feature
            })
            formData.append('features' , JSON.stringify(feat));
    
            if(img1){
                formData.append('img1' , img1);
            }
            if(img2){
                formData.append('img2' , img2);
            }
            if(img3){
                formData.append('img3' , img3);
            }
    
            if(update){
                formData.append('productId' , productId);
                try{
                    const response = await axiosPrivate.put('/products' , formData);
                    setAllProducts(response.data.result.reverse());
                    navigate(`/dashboard/products/veiw-${productId}`);
                    setLoading(false)
                }
                catch(err){
                    if(err.response.status === 400 || err.response.status === 409){
                        setErrMsg(err.response.data.message);
                    }else{
                        setErrMsg('Somthing Wen Wrong Please Try Again Later')
                    }
                    setLoading(false)
                }
            }else{
                try{
                    const response = await axiosPrivate.post('/products' , formData);
                    console.log(response)
                    setAllProducts(response.data.result.reverse());
                    navigate('/dashboard/products')
                    setLoading(false)
                }catch(err){
                    console.log(err)
                    if(err.response.status === 400 || err.response.status === 409){
                        setErrMsg(err.response.data.message);
                    }else{
                        setErrMsg('Somthing Wen Wrong Please Try Again Later')
                    }
                    setLoading(false)
                } 
            }
        }

        



    }

    return (
        <div className="new-product">
            <button onClick={() => navigate(-1)} className='bo-back' ref={topRef}>
                Go Back
            </button>
            <h3>New Product</h3>
            <form onSubmit={submitHandler}>
                <div className="inputs name">
                    <label htmlFor="productName">product name</label>
                    <input type="text" name='productName' id='productName' placeholder='Enter Product Name' onChange={(e) => setProductName(e.target.value)} value={productName} ref={nameRef}/>
                </div>
                <div className="inputs category">
                    <label >category</label>
                    <div className='show-category' onClick={showCategoryHandler}>
                        <span className='span-category-name'>
                            {category}
                        </span>
                        <span className="material-symbols-outlined " ref={catArrowRef}>
                        keyboard_arrow_down
                    </span>
                    </div>
                    {showCategory && (
                    <ul className='category-list' ref={catRef}>
                        <li onClick={() => changeCategoryHandler('headphones')}>
                            headphones
                        </li>
                        <li onClick={() => changeCategoryHandler('speakers')}>
                            speakers
                        </li>
                        <li onClick={() => changeCategoryHandler('earphones')}>
                            earphones
                        </li>
                    </ul>
                    )}
                </div>
                <div className="inputs">
                    <label htmlFor="price">price</label>
                    <input type="number" name='price' placeholder='Enter Product Price' id='price' onChange={(e) => setPrice(e.target.value)} value={price} ref={priceRef}/>
                </div>
                <div className="inputs">
                    <label htmlFor="quantity">Quantity in stock</label>
                    <input type="number" name='quantity' placeholder='Enter Product Quantity In Stock' id='quantity' onChange={(e) => setQuantity(e.target.value)} value={quantity} ref={quantityRef}/>
                </div>
                <div className="inputs about">
                    <label htmlFor="aboyt">About Product</label>
                    <textarea name="about" id="about" placeholder='Write A Short Note About The Product' onChange={(e) => setAbout(e.target.value)} value={about} ref={aboutRef}></textarea>
                </div>
                <div className="inputs images" ref={imagesRef}>
                    <h4 >Images</h4>
                    <p>Add 1 To 3 Images Of Your Product</p>
                        <label htmlFor="img1" ref={imagesRef}>
                           <img src={img1Prev} alt="upload-img" />
                            {update ? (
                                <div className='change'>
                                    Change Image
                                </div>
                            ) : img1 ? (
                            <div className='change'>
                                Change Image
                            </div>
                            ): (
                                <div className="add">
                                    Add Image
                                </div>                                
                            )}
                        </label>
                        <input type="file" name='img1' id='img1' onChange={fileHandle1} accept=".webp,.jpg,.jpeg,.png"/>

                        <label htmlFor="img2">
                           <img src={img2Prev} alt="upload-img" />
                           {update ? (
                                <div className='change'>
                                    Change Image
                                </div>
                            ) : img2 ? (
                            <div className='change'>
                                Change Image
                            </div>
                            ): (
                                <div className="add">
                                    Add Image
                                </div>                                
                            )} 
                        </label>
                        <input type="file" name='img2' id='img2' onChange={fileHandle2} accept=".webp,.jpg,.jpeg,.png"/>

                        <label htmlFor="img3">
                           <img src={img3Prev} alt="upload-img" />
                           {update ? (
                                <div className='change'>
                                    Change Image
                                </div>
                            ) : img3 ? (
                            <div className='change'>
                                Change Image
                            </div>
                            ): (
                                <div className="add">
                                    Add Image
                                </div>                                
                            )}
                        </label>
                        <input type="file" name='img3' id='img3' onChange={fileHandle3} accept=".webp,.jpg,.jpeg,.png"/>
                        {(img1 || img2 || img3) && (
                            <div className="remove-all see-product" onClick={removeHandler}>
                                Remove All Images
                            </div>
                        )}

                </div>
                <div className="inputs features">
                    <label htmlFor="features">
                        features
                    </label>
                    <div className="adding">
                        <input type='text' name='feature' placeholder='Enter Product Feature' onChange={(e) => setFeature(e.target.value)} value={feature} ref={featuresRef}/>
                        <div className="see-product add" onClick={addNewFeatureHandler} >
                            Add
                        </div>
                    </div>

                    {featureArr.length > 0 && (
                        <ul className="feature-arr-container">
                            {featureArr.map(e => {
                                return (
                                    <li className='feature-card' key={e.id}>
                                        <div className="feature-info">
                                            <span>{e.feature}</span>
                                        </div>
                                        <div className="feature-controls see-product" onClick={() => deleteFeatureHandler(e.id)}>
                                            Delete
                                        </div>
    
                                    </li>
                                )
                            })}
                        </ul>

                    )}
                </div>
                {loading ? (
                    <Loading/>
                ):(
                    <button className='see-product submit'>
                        {update ? 'Save Changes' : 'Submit'}
                    </button>
                )}
            </form>
            {errMsg && (
            <div className="msg">
                <span>{errMsg}</span>
                <span onClick={() => setErrMsg('')} className='close'>X</span>
            </div>
            )}

        </div>
    )
}